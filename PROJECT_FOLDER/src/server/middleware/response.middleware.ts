import { RequestHandler } from 'express';
import { defaultResponse } from '../../helpers/response';
import { BusinessException, NotFoundException } from '../exception';

export const ResponseMiddleware: RequestHandler = (req, res, next) => {
    res.success = (data: any, message?: string) => {
        const responseBody = defaultResponse({ data, message: message || 'Success', code: 200 });
        return res.status(200).json(responseBody);
    };

    res.created = (message: string = 'Created', data: any = null) => {
        const responseBody = defaultResponse({ data, message, code: 201 });
        return res.status(201).json(responseBody);
    };

    res.badRequest = (message: string) => {
        const responseBody = defaultResponse({ data: null, message, code: 400 });
        return res.status(400).json(responseBody);
    };

    res.validationErrors = (data: Array<{ key: string; message: string }>) => {
        const jsonResponse = {
            code: 400,
            errors: data.map((error) => {
                return {
                    path: error.key,
                    message: error.message
                };
            }),
            message: 'Validation Error'
        };
        return res.status(400).json(jsonResponse);
    };

    res.unauthorized = (message: string = 'Unauthorized') => {
        const responseBody = defaultResponse({ data: null, message, code: 401 });
        return res.status(401).json(responseBody);
    };

    res.forbidden = (message: string = 'Forbidden') => {
        const responseBody = defaultResponse({ data: null, message, code: 403 });
        return res.status(403).json(responseBody);
    };

    res.error = (message: string, status: number = 500) => {
        const responseBody = defaultResponse({ data: null, message, code: status });
        return res.status(status).json(responseBody);
    };

    res.notFound = (message: string = 'Page or Resource Not found') => {
        const responseBody = defaultResponse({ data: null, message, code: 404 });
        return res.status(404).json(responseBody);
    };

    res.internalServerError = (message: string = 'Internal server error') => {
        const responseBody = defaultResponse({ data: null, message, code: 500 });
        return res.status(500).json(responseBody);
    };

    res.buildErrorResponse = (error: Error | unknown) => {
        if (error instanceof BusinessException || (error as Error).name === 'BusinessException') {
            const responseBody = defaultResponse({ data: null, message: (error as Error).message, code: 400 });
            return res.status(400).json(responseBody);
        } else if (error instanceof NotFoundException || (error as Error).name === 'NotFoundException') {
            const responseBody = defaultResponse({ data: null, message: (error as Error).message, code: 404 });
            return res.status(404).json(responseBody);
        } else {
            return res.internalServerError();
        }
    };

    next();
};
