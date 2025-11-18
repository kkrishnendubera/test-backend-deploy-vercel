# NestJS Response Interceptor

### Response Interceptor

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse<Response>();
                return { statusCode: response.statusCode, ...data };
            }),
        );
    }
}
```

## Usage

Apply the interceptor globally or at the controller level.

### Global Application
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.listen(3000);
}
bootstrap();
```

### Controller-Level Application
```typescript
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Controller('example')
@UseInterceptors(ResponseInterceptor)
export class ExampleController {
    @Get()
    getData() {
        return { message: 'Hello World' };
    }
}
```

## Features
- Automatically attaches the HTTP status code to responses.
- Ensures consistent response structure across all endpoints.
- Simple and lightweight implementation.

## Benefits
- Improves API response readability.
- Reduces boilerplate code for setting HTTP status codes in responses.
- Enhances maintainability and debugging.

## References
- [NestJS Interceptors](https://docs.nestjs.com/interceptors)

****