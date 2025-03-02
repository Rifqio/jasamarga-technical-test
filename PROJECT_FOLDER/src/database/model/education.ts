import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import { Employee } from "./employee";

export type EducationLevel =
    | "Tk"
    | "Sd"
    | "Smp"
    | "Sma"
    | "Strata 1"
    | "Strata 2"
    | "Doktor"
    | "Profesor";

@Table({ tableName: "education" })
export class Education extends Model {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number;

    @ForeignKey(() => Employee)
    @Column({ type: DataType.INTEGER, allowNull: false, field: "employee_id" })
    employeeId: number;

    @Column({ type: DataType.STRING(255) })
    name: string;

    @Column({
        type: DataType.ENUM(
            "Tk",
            "Sd",
            "Smp",
            "Sma",
            "Strata 1",
            "Strata 2",
            "Doktor",
            "Profesor"
        ),
    })
    level: EducationLevel;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    description: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        field: "created_by",
    })
    createdBy: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        field: "updated_by",
    })
    updatedBy: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: "created_at",
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: "updated_at",
    })
    updatedAt: Date;

    @BelongsTo(() => Employee, { foreignKey: "employee_id" })
    employee: Employee;
}
