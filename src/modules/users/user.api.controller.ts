import { Controller, UseGuards, Version, HttpCode, Body, UploadedFiles, UseInterceptors, Patch, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { LoginUser } from '@common/decorator/login-user.decorator';
import { UserDocument } from './schemas/user.schema';
import { SingleFileInterceptor } from '@common/interceptors/files.interceptor';
import { UpdateFrontendUserDto } from './dto/user.dto';


@ApiTags('Frontend User')
@Controller('user')
export class UserApiController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Version('1')
    @Patch('profile-update')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(SingleFileInterceptor('users', 'profileImage'))
    async updateFrontendUser(@LoginUser() user: Partial<UserDocument>, @Body(new ValidationPipe({ transform: true })) dto: UpdateFrontendUserDto, @UploadedFiles() files: Express.Multer.File[]) {
        return this.userService.updateFrontendUser(user, dto, files);
    }

}
