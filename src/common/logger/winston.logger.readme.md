# NestJS Winston Logger Service

This service provides centralized logging functionality using `winston`, enabling structured logging and daily log rotation for error and debug logs.

### Winston Logger Service

```typescript
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

        this.logger = createLogger({
            level: 'error',
            format: defaultFormat,
            transports: [
                new transports.DailyRotateFile({
                    filename: join('./logs', 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxSize: '10m',
                    maxFiles: '7d',
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
```

## Usage

### Injecting the Logger Service
```typescript
import { Controller, Get } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';

@Controller('logs')
export class LogController {
    constructor(private readonly logger: WinstonLoggerService) {}

    @Get('error')
    logError() {
        this.logger.error('This is an error message', 'ErrorTrace');
        return { message: 'Error logged' };
    }

    @Get('debug')
    logDebug() {
        this.logger.debug('This is a debug message', 'DebugTrace');
        return { message: 'Debug log recorded' };
    }
}
```

## Features
- **Structured Logging**: Uses JSON format with timestamps.
- **Daily Log Rotation**: Automatically rotates logs daily.
- **Error & Debug Logging**: Supports logging different levels.
- **File Size & Retention Management**: Configurable max size and retention period.

## Benefits
- Simplifies debugging and error tracking.
- Provides persistent log storage with rotation.
- Enhances observability in production environments.

## References
- [Winston Documentation](https://github.com/winstonjs/winston)
- [NestJS Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)