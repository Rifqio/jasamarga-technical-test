import { isEmpty, isUndefined, merge, omitBy } from "lodash";
import { Op } from "sequelize";
import { sequelize } from "../../database";
import {
    Education,
    Employee,
    EmployeeFamily,
    EmployeeProfile,
} from "../../database/model";
import { Logger } from "../../helpers/logger";
import { NotFoundException } from "../../server/exception";
import {
    CreateEmployeeDTO,
    FindAllEmployeesDTO,
    UpdateEmployeeDTO,
} from "./dto/request.dto";
import { EmployeeReportView } from "./interfaces";

const Context = "EmployeeService";
export const FindAllEmployees = async (filter?: FindAllEmployeesDTO) => {
    try {
        const page = filter?.page || 1;
        const pageSize = filter?.pageSize || 10;
        const employeeName = filter?.employeeName || "";

        const whereClause = employeeName
            ? { name: { [Op.like]: `%${employeeName}%` } }
            : undefined;
        const employees = await Employee.findOne({
            attributes: ["name", "is_active", "start_date", "end_date"],
            where: whereClause,
            include: [
                {
                    model: Education,
                    attributes: [
                        ["name", "school"],
                        ["level", "education_level"],
                        ["description", "education_description"],
                    ],
                    required: true,
                },
                {
                    model: EmployeeProfile,
                    attributes: ["gender", "is_married", "prof_pict"],
                    required: true,
                },
                {
                    model: EmployeeFamily,
                    attributes: ["name", "relation"],
                    required: false,
                },
            ],
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });
        return employees;
    } catch (error) {
        Logger.error(Context, "FindAllEmployees", error);
        throw error;
    }
};

export const FindOneEmployee = async (id: number) => {
    try {
        const employee = await Employee.findAll({
            attributes: ["name", "is_active", "start_date", "end_date"],
            where: {
                id,
            },
            include: [
                {
                    model: Education,
                    attributes: [
                        ["name", "school"],
                        ["level", "education_level"],
                        ["description", "education_description"],
                    ],
                    required: true,
                },
                {
                    model: EmployeeProfile,
                    attributes: ["gender", "is_married", "prof_pict"],
                    required: true,
                },
                {
                    model: EmployeeFamily,
                    attributes: ["name", "relation"],
                    required: false,
                },
            ],
        });
        return employee[0] || null;
    } catch (error) {
        Logger.error(Context, "FindAllEmployees", error);
        throw error;
    }
};

export const DeleteEmployee = async (id: number) => {
    try {
        const employee = await Employee.findByPk(id);
        if (!employee) {
            throw new NotFoundException("Employee not found");
        }
        await employee.destroy();
    } catch (error) {
        Logger.error(Context, "DeleteEmployee", error);
        throw error;
    }
};

export const CreateEmployee = async (data: CreateEmployeeDTO) => {
    const transaction = await sequelize.transaction();
    try {
        const isNIKExist = await _validateNIK(data.nik);
        if (isNIKExist) {
            throw new Error("NIK already exist");
        }

        const startDate = new Date(Date.now());
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);

        const employee = await Employee.create(
            {
                nik: data.nik,
                name: data.name,
                isActive: true,
                startDate,
                endDate,
                createdBy: "user",
                updatedBy: "user",
                profile: {
                    placeOfBirth: data.profile.placeOfBirth,
                    dateOfBirth: data.profile.dateOfBirth,
                    gender: data.profile.gender,
                    isMarried: false,
                    profPict: data.profile.profileUrl || "",
                    createdBy: "user",
                    updatedBy: "user",
                },
                educations: data.educations.map((education) => ({
                    name: education.schoolName,
                    level: education.level,
                    description: education.description,
                    createdBy: "user",
                    updatedBy: "user",
                })),
                families:
                    data.families?.map((family) => ({
                        name: family.name,
                        relation: family.relation,
                        job: family.job,
                        identifier:
                            Date.now().toString() +
                            Math.random().toString(36).substring(7),
                        placeOfBirth: family.placeOfBirth,
                        dateOfBirth: family.dateOfBirth,
                        religion: family.religion,
                        isLife: family.isLife,
                        isDivorced: family.isDivorced,
                        createdBy: "user",
                        updatedBy: "user",
                    })) || [],
            },
            {
                include: [
                    { model: EmployeeProfile },
                    { model: Education },
                    { model: EmployeeFamily },
                ],
                transaction,
            }
        );
        await transaction.commit();
        return employee;
    } catch (error) {
        await transaction.rollback();
        Logger.error(Context, "CreateEmployee", error);
        throw error;
    }
};

export const UpdateEmployee = async (id: number, data: UpdateEmployeeDTO) => {
    const transaction = await sequelize.transaction();
    try {
        const employee = await Employee.findByPk(id, {
            include: [
                { model: EmployeeProfile },
                { model: Education },
                { model: EmployeeFamily },
            ],
            transaction,
        });

        if (!employee) {
            throw new NotFoundException("Employee not found");
        }

        if (data.nik && data.nik !== employee.nik) {
            const isNIKExist = await _validateNIK(data.nik);
            if (isNIKExist) {
                throw new Error("NIK already exists");
            }
        }

        const updatedEmployeeData = omitBy(
            {
                name: data.name,
                nik: data.nik,
                updatedBy: "user",
            },
            isUndefined
        );

        if (isEmpty(updatedEmployeeData)) {
            await employee.update(updatedEmployeeData, { transaction });
        }

        if (data.profile) {
            if (employee.profile) {
                await employee.profile.update(
                    merge({}, employee.profile.toJSON(), data.profile, { updatedBy: "user" }),
                    { transaction }
                );
            } else {
                await EmployeeProfile.create(
                    {
                        employeeId: id,
                        ...data.profile,
                        createdBy: "user",
                        updatedBy: "user",
                    },
                    { transaction }
                );
            }
        }

        if (data.educations) {
            await Education.destroy({ where: { employeeId: id }, transaction });
            const educations = data.educations.map((edu) =>
                merge({}, edu, { employeeId: id, createdBy: "user", updatedBy: "user" })
            );
            await Education.bulkCreate(educations, { transaction });
        }

        if (data.families) {
            await EmployeeFamily.destroy({ where: { employeeId: id }, transaction });
            const families = data.families.map((fam) =>
                merge({}, fam, { employeeId: id, createdBy: "user", updatedBy: "user" })
            );
            await EmployeeFamily.bulkCreate(families, { transaction });
        }

        await transaction.commit();
        return employee;
    } catch (error) {
        await transaction.rollback();
        Logger.error(Context, "UpdateEmployee", error);
        throw error;
    }
};

export const GetEmployeeReport = async () => {
    try {
        // Refresh before get the report
        await sequelize.query("REFRESH MATERIALIZED VIEW employee_summary");
        const report = await sequelize.query("SELECT * FROM employee_summary");
        if (isEmpty(report)) {
            return [];
        }
        const getReport = report[0] as EmployeeReportView[];
        const transformedReport = getReport.map((report: EmployeeReportView) => ({
            employeeID: report.employee_id,
            employeeName: report.name,
            nik: report.nik,
            isActive: report.is_active,
            gender: report.gender,
            age: Number(report.age),
            schoolName: report.school_name,
            level: report.level,
            familyData: report.family_data,
        }));
        return transformedReport;
    } catch (error) {
        Logger.error(Context, "GetEmployeeReport", error);
        throw error;
    }
}
const _validateNIK = async (nik: string) => {
    return Employee.findOne({
        where: {
            nik,
        },
    });
};
