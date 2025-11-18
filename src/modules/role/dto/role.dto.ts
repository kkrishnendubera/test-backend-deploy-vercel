import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Matches } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform, TransformFnParams } from "class-transformer"
import { StatusEnum } from "@common/enum/status.enum";
import { SortOrderEnum } from "@common/enum/sort-order.enum";

export enum RoleGroupEnum {
    BACKEND = 'backend',
    FRONTEND = 'frontend'
}

export class RoleListingDto {

    @ApiPropertyOptional({ description: 'Role Group', enum: RoleGroupEnum })
    @IsEnum(RoleGroupEnum, { message: 'Role Group must be either backend or frontend' })
    @IsNotEmpty({ message: "Role Group is required!" })
    @IsOptional()
    roleGroup?: string;


    @ApiPropertyOptional({ default: 1 })
    @IsNumber()
    @Transform(({ value }) => (value ? Number(value) : 1))
    page?: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsNumber()
    @Transform(({ value }) => (value ? Number(value) : 10))
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Search...' })
    @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
    @IsNotEmpty({ message: "Search is required!" })
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: "Status Filter", enum: StatusEnum })
    @IsEnum(StatusEnum, { message: 'Status must be either Active or Inactive' })
    @IsOptional()
    status?: string;

    @ApiPropertyOptional({ description: "Sort Field" })
    @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
    @IsNotEmpty({ message: "Sort Field is required!" })
    @IsOptional()
    sortField?: string;


    @ApiPropertyOptional({
        description: "Sort Order",
        enum: SortOrderEnum,
    })
    @IsEnum(SortOrderEnum, { message: 'Sort order must be either asc or desc' })
    @IsOptional()
    sortOrder?: string;

}


export class SaveRoleDto {
    @ApiProperty({ description: 'Role', required: true })
    @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
    @IsNotEmpty({ message: 'Role is required' })
    @Matches(/^(?![0-9]+$).*/, { message: 'The field cannot be a number' })
    role: string;

    @ApiProperty({ description: 'Role Group', required: true, enum: RoleGroupEnum })
    @IsNotEmpty({ message: 'Role Group is required' })
    @IsEnum(RoleGroupEnum, { message: 'Role Group must be either backend or frontend' })
    roleGroup: string;

    @ApiProperty({ description: 'Role Display Name', required: true })
    @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
    @IsNotEmpty({ message: 'Role Display Name is required' })
    roleDisplayName: string;

}

export class UpdateRoleDto {
    @ApiPropertyOptional({ description: 'Role' })
    @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
    @IsNotEmpty({ message: 'Role is required' })
    @IsOptional()
    role: string;

    @ApiPropertyOptional({ description: 'Role Group', enum: RoleGroupEnum })
    @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
    @IsNotEmpty({ message: 'Role Group is required' })
    @IsOptional()
    roleGroup: string;

    @ApiPropertyOptional({ description: 'Role Display Name' })
    @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
    @IsNotEmpty({ message: 'Role Display Name is required' })
    @IsOptional()
    roleDisplayName: string;
}


export class StatusRoleDto {
    @ApiProperty({ description: 'Status', required: true, enum: StatusEnum })
    @IsEnum(StatusEnum, { message: 'Status must be either Active or Inactive' })
    @IsNotEmpty({ message: 'Status is required' })
    status: string;
}