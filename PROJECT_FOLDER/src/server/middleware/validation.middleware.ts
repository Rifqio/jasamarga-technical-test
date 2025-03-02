import { NextFunction, Request, Response } from 'express';
import qs from 'qs';
import { AnyZodObject, z, ZodError } from 'zod';

interface ValidationErrorResponse {
    status: number;
    message: string;
    errors: Array<{
        path: string;
        message: string;
    }>;
}

export const ValidationRequestMiddleware = <T extends AnyZodObject>(schema: T) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = qs.parse(req.body, { allowDots: true });
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            // @ts-ignore
            req.zod = {
                query: validatedData.query as z.infer<T>['query'],
                params: validatedData.params
            };
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const response: ValidationErrorResponse = {
                    status: 400,
                    message: 'Validation error',
                    errors: err.errors.map((error) => ({
                        path: error.path.join('.'),
                        message: error.message
                    }))
                };
                res.status(400).json(response);
            } else {
                next(err);
            }
        }
    };
};
