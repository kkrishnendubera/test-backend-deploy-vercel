# Custom Exception Filter

This file (`exception.filter.ts`) defines a custom exception filter for handling exceptions in the NestJS application. It intercepts exceptions, formats them consistently, and logs them using Winston.

## Description

The `CustomExceptionFilter` implements the `ExceptionFilter` interface from NestJS. It's responsible for catching all uncaught exceptions within the application and transforming them into a user-friendly and consistent error response.  It also handles logging the exceptions using the `WinstonLoggerService`.

## Features

*   **Global Exception Handling:** Catches all uncaught exceptions.
*   **Consistent Error Format:** Returns errors in a standardized JSON format: `{ statusCode, message, stack (in development) }`.
*   **HTTP Status Code Handling:** Extracts the HTTP status code from the exception or defaults to 500 (Internal Server Error).
*   **Specific Status Code Handling:** Provides more specific message handling for common status codes like 400 (Bad Request), 401 (Unauthorized), and 429 (Too Many Requests).
*   **Error Logging:** Logs exceptions using the `WinstonLoggerService`.  The stack trace is only included in development environments.

## Implementation

The `CustomExceptionFilter` is implemented as follows:

1.  **Constructor:**
    *   Initializes the `WinstonLoggerService` and `ConfigService`.

    ```typescript
    constructor() {
        this.winston = new WinstonLoggerService();
        this.configService = new ConfigService();
    }
    ```

2.  **`catch` Method:**
    *   This method is called when an exception is thrown.
    *   It receives the exception object and the `ArgumentsHost` object.
    *   It retrieves the HTTP context and the Express `Response` object.
    *   It determines the HTTP status code from the exception or defaults to 500.
    *   It constructs the error response object with `statusCode`, `message`, and optionally the `stack` trace (only in development).
    *   It handles specific HTTP status codes (400, 401, 429) to customize the error message.  For 400 errors, it attempts to extract a more specific message from the exception response.
    *   It sends the error response as JSON with the appropriate HTTP status code.

    ```typescript
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const exceptionStatus = (exception.getStatus && exception.getStatus()) || HttpStatus.INTERNAL_SERVER_ERROR;

        let data: any = {
            statusCode: exceptionStatus,
            message: exception?.message || exception,
            stack: this.configService.get('NODE_ENV') == 'development' ? exception.stack : null
        };

        switch (exceptionStatus) {
            case HttpStatus.BAD_REQUEST:
                const exceptionResponse = exception.getResponse();
                if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
                    const messages = Array.isArray(exceptionResponse['message']) ? exceptionResponse['message'] : [exceptionResponse['message']];
                    data.message = messages[0];
                }
                break;
            case HttpStatus.UNAUTHORIZED:
                data.message = `Unauthorized`;
                break;
            case HttpStatus.TOO_MANY_REQUESTS:
                data.message = `Too Many Requests`;
                break;
            default:
                break;
        }

        return response.status(exceptionStatus).json(data);
    }
    ```

## Usage

To use the `CustomExceptionFilter`, you need to apply it globally in your NestJS application.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomExceptionFilter()); // Apply the filter globally
  await app.listen(3000);
}
bootstrap();