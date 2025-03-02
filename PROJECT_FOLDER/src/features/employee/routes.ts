import express from 'express';
import { ValidationRequestMiddleware } from '../../server/middleware';
import * as EmployeeController from './controller';
import { CreateEmployeeSchema, FindAllEmployees, FindOneEmployee, UpdateEmployeeSchema } from './dto/request.dto';

const route = express.Router();

route.get('/', ValidationRequestMiddleware(FindAllEmployees), EmployeeController.FindAllEmployees);
route.get("/report", EmployeeController.GetEmployeeReport);
route.post("/", ValidationRequestMiddleware(CreateEmployeeSchema), EmployeeController.CreateEmployee);
route.get('/:employeeId', ValidationRequestMiddleware(FindOneEmployee), EmployeeController.FindOneEmployee);
route.delete('/:employeeId', ValidationRequestMiddleware(FindOneEmployee), EmployeeController.DeleteEmployee);
route.patch("/:employeeId", ValidationRequestMiddleware(UpdateEmployeeSchema), EmployeeController.UpdateEmployee);

export default route;