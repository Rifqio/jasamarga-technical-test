import { z, ZodType } from 'zod';

declare global {
    namespace Express {
        interface Request {
            zod: {
                query: z.infer<ZodType>;
                params: z.infer<ZodType>;
                body: z.infer<ZodType>;
            };
        }
        interface Response {
            success(data: any, message?: string): Response;
            paginated: (data: any, metadata: PaginationMetadata) => Response;
            created(message?: string, data?: any): Response;
            badRequest(message: string): Response;
            validationErrors(data: Array<{ key: string; message: string }>): Response;
            unauthorized(message?: string): Response;
            forbidden(message?: string): Response;
            notFound(message?: string): Response;
            error(message: string, status?: number): Response;
            internalServerError(message?: string): Response;
            buildErrorResponse(error: Error | unknown): Response;
        }
    }
}

export { };

