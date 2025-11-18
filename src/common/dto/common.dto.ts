import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsOptional } from "class-validator"

export class DateRangeDto {
    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'Start date', default: 'YYYY-MM-DD' })
    start_date: string

    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'End date', default: 'YYYY-MM-DD' })
    end_date: string
}

export class MaxMinDto {
    @IsOptional()
    @ApiProperty({ required: false, type: 'number', description: 'Max' })
    max: number

    @IsOptional()
    @ApiProperty({ required: false, type: 'number', description: 'Min' })
    min: number
}

export class SortDto {
    @IsOptional()
    @ApiProperty({ required: false, type: 'string', enum: ['createdAt', 'updatedAt'], default: 'createdAt' })
    field: 'createdAt' | 'updatedAt';

    @IsOptional()
    @ApiProperty({ required: false, type: 'string', enum: ["asc", "desc"] })
    order: "asc" | "desc";
}