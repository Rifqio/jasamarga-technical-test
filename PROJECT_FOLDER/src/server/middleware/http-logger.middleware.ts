import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../helpers/logger';

export const HttpRequestLogger = (req: Request, res: Response, next: NextFunction) => {
    const path = req.originalUrl;
    const { method } = req;
    const start = Date.now();

    const headers = { ...req.headers };
    if (headers.authorization) {
        headers.authorization = 'Bearer [*********]';
    }

    const body = { ...req.body };

    const requestMetadata = {
        url: path,
        method,
        headers,
        body,
        query: req.query
    };

    Logger.http('HttpLogger', 'Request', `Request Metadata: ${JSON.stringify(requestMetadata)}`);

    res.on('finish', () => {
        const { statusCode } = res;
        const transactionId = res.getHeader('x-transaction-id');
        const responseMetadata = {
            statusCode,
            'x-transaction-id': transactionId,
            timeElapsed: `${Date.now() - start}ms`
        };
        Logger.http('HttpLogger', 'Response', `Response Metadata: ${JSON.stringify(responseMetadata)}`);
    });

    next();
};
