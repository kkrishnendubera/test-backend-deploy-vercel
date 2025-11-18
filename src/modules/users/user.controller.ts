import { Body, Controller, Post, UseGuards, Version, UseInterceptors, UploadedFiles, Param, Get, Delete, HttpCode, Patch, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChangeAdminProfilePasswordDto, ChangePasswordDto, ListingUserDto, SaveUserDTO, StatusUserDto, UpdateAdminProfileDto, UpdateUserDto } from '@modules/users/dto/user.dto';
import { SingleFileInterceptor } from '@common/interceptors/files.interceptor';
import { MongoIdPipe } from '@common/pipes/mongoid.pipe';
import { UserService } from './user.service';
import { Roles } from '@common/decorator/role.decorator';
import { UserRole } from '@common/enum/user-role.enum';
import { RBAcGuard } from '@common/guards/rbac.guard';
import { LoginUser } from '@common/decorator/login-user.decorator';
import { UserDocument } from './schemas/user.schema';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly userService: UserService) { }

    @Version('1')
    @Patch('profile-update')
    @Roles(UserRole.ADMIN)
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'), RBAcGuard)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(SingleFileInterceptor('users', 'profileImage'))
    async updateUser(@LoginUser() user: Partial<UserDocument>, @Body(new ValidationPipe({ transform: true })) dto: UpdateAdminProfileDto, @UploadedFiles() files: Express.Multer.File[]) {
        return this.userService.updateAdminProfile(user, dto, files);
    }

    @Version('1')
    @Patch('profile-change-password')
    @Roles(UserRole.ADMIN)
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'), RBAcGuard)
    @ApiBearerAuth()
    async changePasswordUser(@LoginUser() user: Partial<UserDocument>, @Body() dto: ChangeAdminProfilePasswordDto) {
        return this.userService.changeAdminPassword(user, dto);
    }

}

@ApiTags('Admin User')
@Controller('admin/user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Version('1')
    @Post('getall')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RBAcGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    async getAllUsers(@Body(new ValidationPipe({ transform: true })) dto: ListingUserDto) {
        return this.userService.getAllUsers(dto);
    }

    @Version('1')
    @Post()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(SingleFileInterceptor('users', 'profileImage'))
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RBAcGuard)
    @ApiBearerAuth()
    async saveUser(@Body() dto: SaveUserDTO, @UploadedFiles() files: Express.Multer.File[]) {
        return this.userService.saveUser(dto, files);
    }

    @Version('1')
    @Get(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RBAcGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    async getUser(@Param('id', new MongoIdPipe()) id: string) {
        return this.userService.getUser(id);
    }

    @Version('1')
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RBAcGuard)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(SingleFileInterceptor('users', 'profileImage'))
    async updateUser(@Param('id', new MongoIdPipe()) id: string, @Body(new ValidationPipe({ transform: true })) dto: UpdateUserDto, @UploadedFiles() files: Express.Multer.File[]) {
        return this.userService.updateUser(id, dto, files);
    }

    @Version('1')
    @Patch('status-change/:id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RBAcGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    async updateStatus(@Param('id', new MongoIdPipe()) id: string, @Body() dto: StatusUserDto) {
        return this.userService.updateUserStatus(id, dto);
    }

    @Version('1')
    @Patch('change-password/:id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RBAcGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    async changePassword(@Param('id', new MongoIdPipe()) id: string, @Body() dto: ChangePasswordDto) {
        return this.userService.changePassword(id, dto);
    }

    @Version('1')
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard('jwt'), RBAcGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    async delete(@Param('id', new MongoIdPipe()) id: string) {
        return this.userService.deleteUser(id);
    }

}
