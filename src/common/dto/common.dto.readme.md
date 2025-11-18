# NestJS DTO Definitions

This document provides structured DTOs (Data Transfer Objects) for handling common API request parameters in a NestJS application.

## DTO Implementations

### DateRangeDto
Used for filtering data based on a date range.

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class DateRangeDto {
    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'Start date', default: 'YYYY-MM-DD' })
    start_date: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'End date', default: 'YYYY-MM-DD' })
    end_date: string;
}
```

### MaxMinDto
Used for filtering data based on numerical min/max values.

```typescript
export class MaxMinDto {
    @IsOptional()
    @ApiProperty({ required: false, type: 'number', description: 'Max' })
    max: number;

    @IsOptional()
    @ApiProperty({ required: false, type: 'number', description: 'Min' })
    min: number;
}
```

### SortDto
Used for sorting data based on specified fields and order.

```typescript
export class SortDto {
    @IsOptional()
    @ApiProperty({ required: false, type: 'string', enum: ['createdAt', 'updatedAt'], default: 'createdAt' })
    field: 'createdAt' | 'updatedAt';

    @IsOptional()
    @ApiProperty({ required: false, type: 'string', enum: ['asc', 'desc'] })
    order: 'asc' | 'desc';
}
```

## Usage

These DTOs can be used in controllers to validate and structure incoming requests:

```typescript
import { Query } from '@nestjs/common';
import { DateRangeDto, MaxMinDto, SortDto } from './dto/request.dto';

@Get('data')
async getData(
    @Query() dateRange: DateRangeDto,
    @Query() maxMin: MaxMinDto,
    @Query() sort: SortDto
) {
    return { dateRange, maxMin, sort };
}
```

## Features
- **Validation & Type Safety**: Ensures valid input parameters.
- **Automatic API Documentation**: Swagger integration using `@nestjs/swagger`.
- **Modular & Reusable**: DTOs can be reused across different endpoints.

## References
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)

