import { Injectable } from '@nestjs/common';
import { createLogger, transports, format, Logger } from 'winston';
import { join } from 'path';
import 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService {
    private readonly logger: Logger;

    constructor() {
        const defaultFormat = format.combine(
            format.timestamp(),
            format.json()
        );

        /* for handling all error and debug related logs */
        this.logger = createLogger({
            level: 'error',
            format: defaultFormat,
            transports: [
                new transports.DailyRotateFile({
                    filename: join('./logs', 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '10m', // Optional: Log file size before rotating
                    maxFiles: '7d', // Optional: Keep logs for the last 14 days
                    handleExceptions: true,
                }),
            ],
        });
    }

    error(message: string, trace: string) {
        this.logger.error(message, { trace });
    }

    debug(message: string, trace: string) {
        this.logger.debug(message, { trace });
    }
}
