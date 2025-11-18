# NestJS MongoId Validation Pipe

The `MongoIdPipe` is a custom validation pipe for NestJS that ensures incoming request parameters are valid MongoDB ObjectIds before processing them.

### MongoIdPipe

```typescript
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class MongoIdPipe implements PipeTransform {
    transform(value: any) {
        if (!isValidObjectId(value)) {
            throw new BadRequestException('The provided id is not a valid MongoDB ObjectId.');
        }
        return value;
    }
}
```

## Usage

### Applying to Route Parameters
Use the pipe in a controller to validate MongoDB ObjectId parameters:

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { MongoIdPipe } from './pipes/mongo-id.pipe';

@Controller('users')
export class UsersController {
    @Get(':id')
    getUser(@Param('id', MongoIdPipe) id: string) {
        return { message: 'Valid ObjectId', id };
    }
}
```

## Features
- **Ensures ObjectId validity**: Prevents invalid MongoDB ObjectId values from being processed.
- **Enhances API security**: Protects endpoints from malformed ID values.
- **Simple and reusable**: Can be applied to any route parameter requiring ObjectId validation.

## Benefits
- Reduces database errors caused by invalid ObjectId values.
- Provides clear error messages for incorrect ID formats.
- Improves data integrity in MongoDB-based applications.

## References
- [NestJS Pipes](https://docs.nestjs.com/pipes)
- [Mongoose isValidObjectId Documentation](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-isValidObjectId)

