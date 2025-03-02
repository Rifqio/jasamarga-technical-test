import cors from "cors";
import 'dotenv/config';
import express from "express";
import rateLimit from 'express-rate-limit';
import { InitDatabaseConnection } from "./database";
import { Logger } from "./helpers/logger";
import route from "./routes";
import { HttpRequestLogger, ResponseMiddleware, RouterLoggerMiddleware, TransactionIdMiddleware } from "./server/middleware";

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

const { PORT } = process.env;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(TransactionIdMiddleware);
app.use(ResponseMiddleware);
app.use(HttpRequestLogger);
app.use(limiter);
app.use('/api', route);

app.listen(PORT, async () => {
    await InitDatabaseConnection();
    Logger.info('Server', null, `Server started on port ${PORT}`);
    RouterLoggerMiddleware(app);
})
