import 'dotenv/config';
import { Sequelize } from "sequelize-typescript";
import { Logger } from "../helpers/logger";
import { Education, Employee, EmployeeFamily, EmployeeProfile } from "./model";

const { DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = process.env;
export const sequelize = new Sequelize({
    models: [EmployeeFamily, Education, Employee, EmployeeProfile],
    database: DB_NAME,
    logging: true,
    password: DB_PASSWORD,
    host: DB_HOST,
    username: DB_USER,
    port: Number(DB_PORT),
    dialect: "postgres",
});

export const InitDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        Logger.info("Database", "InitDatabaseConnection", "Database connected");
    } catch (error) {
        Logger.error("Database", "InitDatabaseConnection", error);
        process.exit(1);
    }
};
