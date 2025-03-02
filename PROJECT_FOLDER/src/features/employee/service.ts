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
import { CreateEmployeeDTO, FindAllEmployeesDTO } from "./dto/request.dto";

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
}

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
                families: data.families?.map((family) => ({
                    name: family.name,
                    relation: family.relation,
                    job: family.job,
                    identifier: Date.now().toString() + Math.random().toString(36).substring(7),
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
                    { model: EmployeeFamily }
                ],
                transaction
            }
        );
        await transaction.commit();
        return employee
    } catch (error) {
        await transaction.rollback();
        Logger.error(Context, "CreateEmployee", error);
        throw error;
    }
}

const _validateNIK = async (nik: string) => {
    return Employee.findOne({
        where: {
            nik,
        }
    })
}