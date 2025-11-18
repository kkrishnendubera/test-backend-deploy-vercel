import { HttpStatus, ValidationPipe } from '@nestjs/common';

export class ApiValidationPipe extends ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            forbidNonWhitelisted: true, // Throws error when unknown properties are present
            // transform: true, // Automatically transforms types
            errorHttpStatusCode: HttpStatus.BAD_REQUEST
        });
    }
}