import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Employee } from "./employee";

export type Gender = "Laki-Laki" | "Perempuan";

@Table({ tableName: "employee_profile" })
export class EmployeeProfile extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id: number;

    @ForeignKey(() => Employee)
    @Column({ field: "employee_id", type: DataType.INTEGER })
    employeeId: number;

    @Column({ field: "place_of_birth", type: DataType.STRING(100) })
    placeOfBirth: string;

    @Column({ field: "date_of_birth", type: DataType.DATE })
    dateOfBirth: Date;

    @Column({ type: DataType.ENUM("Laki-Laki", "Perempuan") })
    gender: Gender;

    @Column({ field: "is_married", type: DataType.BOOLEAN })
    isMarried: boolean;

    @Column({ field: "prof_pict", type: DataType.STRING(255) })
    profPict: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW, field: "created_at" })
    createdAt: Date;
    
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW, field: "updated_at" })
    updatedAt: Date;
    
    @Column({ field: "created_by", type: DataType.STRING(255) })
    createdBy: string;
    
    @Column({ field: "updated_by", type: DataType.STRING(255) })
    updatedBy: string;

    @BelongsTo(() => Employee, { foreignKey: "employee_id" })
    employee: Employee;
}
