import express from 'express';
import { ValidationRequestMiddleware } from '../../server/middleware';
import * as EmployeeController from './controller';
import { CreateEmployeeSchema, FindAllEmployees, FindOneEmployee } from './dto/request.dto';

const route = express.Router();

route.get('/', ValidationRequestMiddleware(FindAllEmployees), EmployeeController.FindAllEmployees);
route.get('/:employeeId', ValidationRequestMiddleware(FindOneEmployee), EmployeeController.FindOneEmployee);
route.delete('/:employeeId', ValidationRequestMiddleware(FindOneEmployee), EmployeeController.DeleteEmployee);
route.post("/", ValidationRequestMiddleware(CreateEmployeeSchema), EmployeeController.CreateEmployee);

export default route;