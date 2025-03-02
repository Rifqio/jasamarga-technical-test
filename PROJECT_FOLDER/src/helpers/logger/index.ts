import { config, createLogger, format, transports } from "winston";
import { CustomLogger } from "./logger.class";

const { combine, timestamp, printf, colorize, errors } = format;
const customColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "cyan",
    debug: "blue",
};

config.addColors(customColors);
const logFormat = printf(({ level, message, timestamp, stack }) => {
    const baseMessage = `${timestamp} [${level}]: ${message}`;
    return stack ? `${baseMessage}\n${stack}` : baseMessage;
});

const contextFormat = format((info) => {
    if (info.context) {
        const method = info.method ? `::${info.method}` : "";
        info.message = `[${info.context}${method}] ${info.message}`;
    }
    return info;
});

const winstonLogger = createLogger({
    level: "debug",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        contextFormat(),
        logFormat
    ),
    transports: [
        new transports.Console({
            format: combine(colorize({ all: true }), logFormat),
        }),
    ],
});

export const Logger = new CustomLogger(winstonLogger);
