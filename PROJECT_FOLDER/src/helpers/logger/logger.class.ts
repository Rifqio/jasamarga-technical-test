export class CustomLogger {
    private logger: any;

    constructor(logger: any) {
        this.logger = logger;
    }

    private log(level: string, context: string, method: string | null, message: any, ...meta: any[]) {
        let logMessage: any = {
            context,
            method,
            message: '',
            ...meta
        };

        if (message instanceof Error) {
            const stack =
                message.stack
                    ?.split('\n')
                    .map((line) => line.trim())
                    .join(' → ') ?? '';

            logMessage.message = `${message.message} | Stack: ${stack}`;
        } else {
            logMessage.message = message;
        }

        this.logger.log(level, logMessage);
    }

    debug(context: string, method: string | null = null, message: any, ...meta: any[]) {
        this.log('debug', context, method, message, ...meta);
    }

    http(context: string, method: string | null = null, message: any, ...meta: any[]) {
        this.log('http', context, method, message, ...meta);
    }

    info(context: string, method: string | null = null, message: any, ...meta: any[]) {
        this.log('info', context, method, message, ...meta);
    }

    warn(context: string, method: string | null = null, message: any, ...meta: any[]) {
        this.log('warn', context, method, message, ...meta);
    }

    error(context: string, method: string | null = null, message: any, ...meta: any[]) {
        if (
            message instanceof Error &&
            (message.name === 'BusinessException' || message.name === 'NotFoundException')
        ) {
            return;
        }
        this.log('error', context, method, message, ...meta);
    }
}
