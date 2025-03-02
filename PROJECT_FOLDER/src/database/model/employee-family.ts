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

export type Religion = "Islam" | "Protestan" | "Katolik" | "Buda" | "Konghucu";
export type RelationStatus = "Suami" | "Istri" | "Anak" | "Anak Sambung";

@Table({ tableName: "employee_family" })
export class EmployeeFamily extends Model {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number;

    @ForeignKey(() => Employee)
    @Column({ type: DataType.INTEGER, allowNull: false, field: "employee_id" })
    employeeId: number;

    @Column({ type: DataType.STRING(255) })
    name: string;

    @Column({ type: DataType.STRING(255) })
    identifier: string;

    @Column({ type: DataType.STRING(255) })
    job: string;

    @Column({ type: DataType.STRING(100), field: "place_of_birth" })
    placeOfBirth: string;

    @Column({ type: DataType.DATE, field: "date_of_birth" })
    dateOfBirth: Date;

    @Column({
        type: DataType.ENUM(
            "Islam",
            "Protestan",
            "Katolik",
            "Buda",
            "Konghucu"
        ),
    })
    religion: Religion;

    @Column({ type: DataType.BOOLEAN, field: "is_life" })
    isLife: boolean;

    @Column({ type: DataType.BOOLEAN, field: "is_divorced" })
    isDivorced: boolean;

    @Column({ type: DataType.ENUM("Suami", "Istri", "Anak", "Anak Sambung") })
    relation: RelationStatus;

    @Column({ type: DataType.STRING(255), field: "created_by" })
    createdBy: string;

    @Column({ type: DataType.STRING(255), field: "updated_by" })
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
