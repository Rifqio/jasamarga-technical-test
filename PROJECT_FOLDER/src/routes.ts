import express from 'express';
import EmployeeRoutes from './features/employee/routes';

const route = express.Router();
route.use('/employee/v1', EmployeeRoutes);

export default route;