# NestJS API Validation Pipe

The `ApiValidationPipe` is a custom extension of NestJS's built-in `ValidationPipe`, designed to enforce request validation rules by whitelisting valid properties and returning `400 Bad Request` status for validation failures.

### ApiValidationPipe

```typescript
import { HttpStatus, ValidationPipe } from '@nestjs/common';

export class ApiValidationPipe extends ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            errorHttpStatusCode: HttpStatus.BAD_REQUEST
        });
    }
}
```

## Usage

### Global Application
Apply the validation pipe globally in your main application bootstrap file:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiValidationPipe } from './pipes/api-validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ApiValidationPipe());
    await app.listen(3000);
}
bootstrap();
```

### Controller-Level Validation
Apply the validation pipe at the controller level:

```typescript
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ApiValidationPipe } from './pipes/api-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    @Post()
    @UsePipes(ApiValidationPipe)
    createUser(@Body() createUserDto: CreateUserDto) {
        return { message: 'User created successfully', data: createUserDto };
    }
}
```

## Features
- **Whitelist enforcement**: Removes unexpected properties from request payloads.
- **Automatic validation**: Ensures DTOs follow defined validation rules.
- **Consistent error handling**: Returns `400 Bad Request` for invalid requests.

## Benefits
- Improves API security by rejecting unrecognized properties.
- Reduces boilerplate code for validation.
- Enhances data consistency across API requests.

## References
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)

