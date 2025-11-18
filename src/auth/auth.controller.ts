import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RefreshJwtDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
    ForgotPasswordDTO,
    ResetPasswordDTO,
    UserSignInDTO,
    UserSignupDTO,
} from '@modules/users/dto/user.dto';
import { SingleFileInterceptor } from '@common/interceptors/files.interceptor';
import { Request } from 'express';
import { LoginUser } from '@common/decorator/login-user.decorator';
import { UserDocument } from '@modules/users/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login-admin')
    @HttpCode(200)
    @UseGuards(ThrottlerGuard)
    async loginAdmin(@Body() dto: UserSignInDTO, @Req() req: Request) {
        return this.authService.userLogin(dto, req);
    }

    @Post('login-user')
    @HttpCode(200)
    async loginUser(@Body() dto: UserSignInDTO, @Req() req: Request) {
        return this.authService.userLogin(dto, req);
    }

    @Post('register')
    @UseGuards(ThrottlerGuard)
    @UseInterceptors(SingleFileInterceptor('users', 'profileImage'))
    @ApiConsumes('application/json', 'multipart/form-data')
    async signup(
        @Body() dto: UserSignupDTO,
        @Req() req: Request,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        return this.authService.userSignup(dto, files, req);
    }

    @Post('forgot-password')
    @HttpCode(200)
    @UseGuards(ThrottlerGuard)
    async forgotPassword(@Body() dto: ForgotPasswordDTO) {
        return this.authService.forgotPassword(dto);
    }

    @Post('reset-password')
    @HttpCode(200)
    @UseGuards(ThrottlerGuard)
    async resetPassword(@Body() dto: ResetPasswordDTO) {
        return this.authService.resetPassword(dto);
    }

    @Post('refresh-token')
    @HttpCode(200)
    // @UseGuards(AuthGuard('jwt'))
    @UseGuards(ThrottlerGuard)
    // @ApiBearerAuth()
    async refreshToken(@Body() dto: RefreshJwtDto) {
        return this.authService.refreshToken(dto);
    }

    @Get('profile-details')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @HttpCode(200)
    async profileDetails(@LoginUser() user: Partial<UserDocument>) {
        return this.authService.profileDetails(user);
    }

    @Get('logout-admin')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async logoutAdmin(@Req() req: Request) {
        return this.authService.userLogout(req);
    }

    @Get('logout-user')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async logoutUser(@Req() req: Request) {
        return this.authService.userLogout(req);
    }

}
