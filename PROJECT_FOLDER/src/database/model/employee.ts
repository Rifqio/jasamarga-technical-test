import { Column, DataType, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Education } from "./education";
import { EmployeeFamily } from "./employee-family";
import { EmployeeProfile } from "./employee-profile";

@Table({ tableName: "employee" })
export class Employee extends Model {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING(16) })
    nik: string;

    @Column({ type: DataType.STRING(140) })
    name: string;

    @Column({ type: DataType.BOOLEAN, field: "is_active" })
    isActive: boolean;

    @Column({ type: DataType.DATE, allowNull: false, field: "start_date" })
    startDate: Date;

    @Column({ type: DataType.DATE, allowNull: false, field: "end_date" })
    endDate: Date;

    @Column({ type: DataType.STRING(255), field: "created_by" })
    createdBy: string;

    @Column({ type: DataType.STRING(255), field: "updated_by" })
    updatedBy: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW, field: "created_at" })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW, field: "updated_at" })
    updatedAt: Date;

    @HasOne(() => EmployeeProfile, { foreignKey: "employee_id" })
    profile: EmployeeProfile;

    @HasMany(() => Education, { foreignKey: "employee_id" })
    educations: Education[];

    @HasMany(() => EmployeeFamily, { foreignKey: "employee_id" })
    families: EmployeeFamily[];
}