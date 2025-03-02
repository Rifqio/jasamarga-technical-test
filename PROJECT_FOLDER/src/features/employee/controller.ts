import { RequestHandler } from "express";
import { Logger } from "../../helpers/logger";
import {
    CreateEmployeeDTO,
    FindAllEmployeesDTO,
    FindOneEmployeeDTO,
    UpdateEmployeeDTO,
} from "./dto/request.dto";
import * as EmployeeService from "./service";

const Context = "EmployeeController";
export const FindAllEmployees: RequestHandler = async (req, res) => {
    try {
        const query = req.zod.query as FindAllEmployeesDTO;
        const data = await EmployeeService.FindAllEmployees(query);
        return res.success(data);
    } catch (error) {
        Logger.error(Context, "FindAllEmployees", error);
        return res.buildErrorResponse(error);
    }
};

export const FindOneEmployee: RequestHandler = async (req, res) => {
    const { employeeId } = req.zod.params as FindOneEmployeeDTO;
    try {
        const data = await EmployeeService.FindOneEmployee(employeeId);
        return res.success(data);
    } catch (error) {
        Logger.error(Context, "FindOneEmployee", error);
        return res.buildErrorResponse(error);
    }
};

export const DeleteEmployee: RequestHandler = async (req, res) => {
    const { employeeId } = req.zod.params as FindOneEmployeeDTO;
    try {
        await EmployeeService.DeleteEmployee(employeeId);
        return res.success(null);
    } catch (error) {
        Logger.error(Context, "DeleteEmployee", error);
        return res.buildErrorResponse(error);
    }
};

export const CreateEmployee: RequestHandler = async (req, res) => {
    const body = req.zod.body as CreateEmployeeDTO;
    try {
        const data = await EmployeeService.CreateEmployee(body);
        return res.created("Employee created", data);
    } catch (error) {
        Logger.error(Context, "CreateEmployee", error);
        return res.buildErrorResponse(error);
    }
};

export const UpdateEmployee: RequestHandler = async (req, res) => {
    const { employeeId } = req.zod.params as FindOneEmployeeDTO;
    const body = req.zod.body as UpdateEmployeeDTO;
    try {
        const data = await EmployeeService.UpdateEmployee(employeeId, body);
        return res.success(data);
    } catch (error) {
        Logger.error(Context, "UpdateEmployee", error);
        return res.buildErrorResponse(error);
    }
};

export const GetEmployeeReport: RequestHandler = async (req, res) => {
    try {
        const data = await EmployeeService.GetEmployeeReport();
        return res.success(data);
    } catch (error) {
        Logger.error(Context, "GetEmployeeReport", error);
        return res.buildErrorResponse(error);
    }
}
