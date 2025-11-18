import { StatusEnum } from "@common/enum/status.enum";
import { SortOrderEnum } from "@common/enum/sort-order.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import { Types } from "mongoose";

export class UpdateAdminProfileDto {
  @ApiPropertyOptional({ description: "Email address" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value))
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ description: "Full Name" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "Full Name is required!" })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({ description: "User Name" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "User Name is required!" })
  @IsOptional()
  userName: string;

  @ApiPropertyOptional({
    description: "Profile image (jpg, png, jpeg)",
    type: "string",
    format: "binary"
  })
  @IsOptional()
  profileImage?: string;
}

export class ChangeAdminProfilePasswordDto {
  @ApiProperty({ description: "Current password", required: true })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "Current password is required" })
  currentPassword: string;

  @ApiProperty({ description: "New password must be at least 8 characters long and contain at least one letter and one number.", required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "New password is required" })
  password: string;
}

export class UserSignupDTO {
  @ApiProperty({ description: "Full name of user", required: true })
  @IsString({ message: "Value must be a string" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "Full name is required!" })
  fullName: string;

  @ApiProperty({ description: "Email address", required: true })
  @IsString({ message: "Value must be a string" })
  @Transform(
    ({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase()
  )
  @IsNotEmpty({ message: "Email address is required!" })
  @IsEmail({}, { message: "Please enter a valid email!" })
  email: string;

  @ApiProperty({ description: "Password must be at least 8 characters long and contain at least one letter and one number.", required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @IsString({ message: "Value must be a string" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "Password is required!" })
  password: string;

  @ApiPropertyOptional({ description: "Device Token" })
  @IsOptional()
  deviceToken?: string;

  @ApiPropertyOptional({
    description: "Profile image (jpg, png, jpeg)",
    type: "string",
    format: "binary"
  })
  @IsOptional()
  profileImage?: string;
}

export class UserSignInDTO {
  @ApiProperty({ description: "Email address", required: true })
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim().toLowerCase() : String(value))
  email: string;

  @ApiProperty({ description: "Password", required: true })
  @IsNotEmpty({ message: "Password is required!" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
  password: string;

  @ApiPropertyOptional({ description: "Device Token" })
  @IsOptional()
  @IsNotEmpty({ message: "Device token should not be empty!" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
  deviceToken?: string;
}

export class EmailVerificationDTO {
  @ApiPropertyOptional({ description: "Email address" })
  @Transform(
    ({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase()
  )
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  email: string;

  @ApiProperty({ description: "OTP", required: true })
  @IsString({ message: "OTP must be a string value!" })
  @IsNotEmpty({ message: "OTP is required!" })
  otp: string;
}

export class UserProfileUpdateDTO {
  @ApiPropertyOptional({ description: "Full name of user" })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "Full name is required" })
  fullName?: string;

  @ApiPropertyOptional({ description: "Email address" })
  @IsOptional()
  @Transform(
    ({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase()
  )
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  email?: string;

  @ApiPropertyOptional({ description: "Phone number" })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: "Country code for phone number"
  })
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({
    description: "Profile image (jpg, png, jpeg)",
    type: "string",
    format: "binary"
  })
  profileImage: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({ description: "Email address", required: true })
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim().toLowerCase() : String(value))
  email: string;

  @ApiProperty({ description: "Base URL", required: true })
  @IsNotEmpty({ message: "Base URL is required!" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim().toLowerCase() : String(value))
  baseUrl: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ description: "Authorization token", required: true })
  @IsNotEmpty({ message: "Authorization token is required!" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
  authToken: string;

  @ApiProperty({ description: "New password must be at least 8 characters long and contain at least one letter and one number.", required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @IsNotEmpty({ message: "New password is required!" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
  newPassword: string;
}

export class SaveUserDTO {
  @ApiProperty({ description: "Email address", required: true })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value))
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  email: string;

  @ApiProperty({ description: "Password must be at least 8 characters long and contain at least one letter and one number.", required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "Password is required!" })
  password: string;

  @ApiProperty({ description: "Full Name", required: true })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "Full Name is required!" })
  fullName: string;

  @ApiProperty({ description: "User Name", required: true })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "User Name is required!" })
  userName: string;

  @ApiProperty({ description: "User Role", required: true, type: "string" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : value instanceof Types.ObjectId ? value.toString() : String(value))
  @IsNotEmpty({ message: "User Role is required!" })
  @IsMongoId({ message: 'User Role is not a valid MongoDB ObjectId.!' })
  role: Types.ObjectId | string;

  @ApiPropertyOptional({
    description: "Profile image (jpg, png, jpeg)",
    type: "string",
    format: "binary",
  })
  @IsNotEmpty()
  @IsOptional()
  profileImage?: string;
}

export class SaveFrontendUserDTO {
  @ApiProperty({ description: "Email address", required: true })
  @Transform(
    ({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase()
  )
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  email: string;

  @ApiProperty({ description: "Password must be at least 8 characters long and contain at least one letter and one number.", required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "Password is required!" })
  password: string;

  @ApiProperty({ description: "Full Name", required: true })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "Full Name is required!" })
  fullName: string;

  @ApiProperty({ description: "User Name", required: true })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "User Name is required!" })
  userName: string;

  @ApiProperty({ description: "User Role", required: true, type: "string" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: "User Role is required!" })
  role: Types.ObjectId;

  @ApiPropertyOptional({
    description: "Profile image (jpg, png, jpeg)",
    type: "string",
    format: "binary"
  })
  @IsNotEmpty()
  @IsOptional()
  profileImage?: string; // File to be uploaded via form-data
}

export class ListingUserDto {
  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number = 10;

  @ApiPropertyOptional({ description: "Search..." })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: "Status Filter", enum: StatusEnum })
  @IsEnum(StatusEnum, { message: 'Status must be either Active or Inactive' })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: "Sort Field" })
  @IsString()
  @IsOptional()
  sortField?: string;

  @ApiPropertyOptional({
    description: "Sort Order",
    enum: SortOrderEnum,
  })
  @IsEnum(SortOrderEnum, { message: 'Sort order must be either asc or desc' })
  @IsOptional()
  sortOrder?: string;

  @ApiPropertyOptional({ description: "User Role", type: "string" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : value instanceof Types.ObjectId ? value.toString() : String(value))
  @IsNotEmpty({ message: "User Role is required!" })
  @IsMongoId({ message: 'User Role is not a valid MongoDB ObjectId.!' })
  @IsOptional()
  role?: Types.ObjectId | string;
}

export class StatusUserDto {
  @ApiProperty({ description: "Status", required: true, enum: StatusEnum })
  @IsEnum(StatusEnum, { message: 'Status must be either Active or Inactive' })
  @IsNotEmpty({ message: "Status is required" })
  status: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: "Email address" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value))
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ description: "Full Name" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "Full Name is required!" })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({ description: "User Name" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "User Name is required!" })
  @IsOptional()
  userName: string;

  @ApiPropertyOptional({ description: "User Role", type: "string" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : value instanceof Types.ObjectId ? value.toString() : String(value))
  @IsNotEmpty({ message: "User Role is required!" })
  @IsMongoId({ message: 'User Role is not a valid MongoDB ObjectId.!' })
  @IsOptional()
  role: Types.ObjectId | string;

  @ApiPropertyOptional({
    description: "Profile image (jpg, png, jpeg)",
    type: "string",
    format: "binary"
  })
  @IsOptional()
  profileImage?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: "New password must be at least 8 characters long and contain at least one letter and one number.", required: true })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number!',
  })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "Password is required!" })
  password: string;

  @ApiProperty({ description: "Confirm password", required: true })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value.trim() : String(value))
  @IsNotEmpty({ message: 'Confirm password is required!' })
  confirmPassword: string;
}

export class UpdateFrontendUserDto {
  @ApiPropertyOptional({ description: "Email address" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim()?.toLowerCase() : String(value))
  @IsEmail({}, { message: "Please enter a valid email!" })
  @IsNotEmpty({ message: "Email address is required!" })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ description: "Full Name" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "Full Name is required!" })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({ description: "User Name" })
  @Transform(({ value }: TransformFnParams) => typeof value === 'string' ? value?.trim() : String(value))
  @IsNotEmpty({ message: "User Name is required!" })
  @IsOptional()
  userName: string;

  @ApiPropertyOptional({
    description: "Profile image (jpg, png, jpeg)",
    type: "string",
    format: "binary"
  })
  @IsOptional()
  profileImage?: string;
}
