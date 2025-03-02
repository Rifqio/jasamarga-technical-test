import { z } from "zod";

export const FindAllEmployees = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        pageSize: z.coerce.number().min(1).default(10),
        employeeName: z.string().optional(),
    }),
});

export const FindOneEmployee = z.object({
    params: z.object({
        employeeId: z.coerce.number().int().positive(),
    }),
});

export const CreateEmployeeSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(255),
        nik: z.string().min(16).max(16),
        profile: z.object({
            placeOfBirth: z
                .string({ required_error: "Place of birth is required" })
                .min(3)
                .max(255),
            dateOfBirth: z.date({
                required_error: "Date of birth is required",
            }),
            isMarried: z.boolean().default(false),
            profileUrl: z.string().url().optional(),
            gender: z.enum(["Laki-Laki", "Perempuan"]),
        }),
        educations: z
            .object({
                schoolName: z.string().min(3).max(255),
                level: z.enum([
                    "Tk",
                    "Sd",
                    "Smp",
                    "Sma",
                    "Strata 1",
                    "Strata 2",
                    "Doktor",
                    "Profesor",
                ]),
                description: z.string().min(3).max(255),
            })
            .array(),
        families: z
            .object({
                name: z.string().min(3).max(255),
                relation: z.enum(["Suami", "Istri", "Anak", "Anak Sambung"]),
                job: z.string().min(3).max(255),
                placeOfBirth: z.string().min(3).max(255),
                dateOfBirth: z.date(),
                religion: z.enum([
                    "Islam",
                    "Protestan",
                    "Katolik",
                    "Buda",
                    "Konghucu",
                ]),
                isLife: z.boolean().default(true),
                isDivorced: z.boolean().default(false),
            })
            .array()
            .optional(),
    }),
});

export const UpdateEmployeeSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(255).optional(),
        nik: z.string().min(16).max(16).optional(),
        profile: z
            .object({
                placeOfBirth: z.string().min(3).max(255).optional(),
                dateOfBirth: z.date().optional(),
                isMarried: z.boolean().optional(),
                profileUrl: z.string().url().optional(),
                gender: z.enum(["Laki-Laki", "Perempuan"]).optional(),
            })
            .optional(),
        educations: z
            .array(
                z.object({
                    schoolName: z.string().min(3).max(255),
                    level: z.enum([
                        "Tk",
                        "Sd",
                        "Smp",
                        "Sma",
                        "Strata 1",
                        "Strata 2",
                        "Doktor",
                        "Profesor",
                    ]),
                    description: z.string().min(3).max(255),
                })
            )
            .optional(),
        families: z
            .array(
                z.object({
                    name: z.string().min(3).max(255),
                    relation: z.enum(["Suami", "Istri", "Anak", "Anak Sambung"]),
                    job: z.string().min(3).max(255),
                    placeOfBirth: z.string().min(3).max(255),
                    dateOfBirth: z.date(),
                    religion: z.enum([
                        "Islam",
                        "Protestan",
                        "Katolik",
                        "Buda",
                        "Konghucu",
                    ]),
                    isLife: z.boolean().optional(),
                    isDivorced: z.boolean().optional(),
                })
            )
            .optional(),
    }),
});

export type FindAllEmployeesDTO = z.infer<typeof FindAllEmployees>["query"];
export type FindOneEmployeeDTO = z.infer<typeof FindOneEmployee>["params"];
export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>["body"];
export type UpdateEmployeeDTO = z.infer<typeof UpdateEmployeeSchema>["body"];
