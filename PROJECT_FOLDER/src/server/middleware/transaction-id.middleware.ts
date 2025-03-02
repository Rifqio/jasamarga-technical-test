import { RequestHandler } from 'express';

export const TransactionIdMiddleware: RequestHandler = (req, res, next) => {
    const transactionId = 'TRX-' + Date.now() + Math.floor(Math.random() * 1000);
    req.headers['x-transaction-id'] = transactionId;
    res.setHeader('X-Transaction-ID', transactionId);
    next();
};
