import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { hash, genSalt } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from '@common/types/api-response.type';
import { RefreshToken } from '@modules/refresh-token/schemas/refresh-token.schema';
import { RoleRepository } from '@modules/role/repositories/role.repository';
import {
    ForgotPasswordDTO,
    ResetPasswordDTO,
    UserSignInDTO,
    UserSignupDTO,
} from '@modules/users/dto/user.dto';
import { UserRepository } from '@modules/users/repositories/user.repository';
import { Types } from 'mongoose';
import { RefreshJwtDto } from './dto/auth.dto';
import { RefreshTokenRepository } from '@modules/refresh-token/repository/refresh-token.repository';
import { JwtPayloadType } from '@common/types/jwt.type';
import { MailerService } from '@helpers/mailer.helper';
import { Messages } from '@common/constants/messages';
import { UserDocument } from '@modules/users/schemas/user.schema';
import { UserDevice } from '@modules/user-devices/schemas/user-device.schema';
import { getClientIp } from 'request-ip';
import { lookup } from 'geoip-lite';
import { Request } from 'express';
import { UserDeviceRepository } from '@modules/user-devices/repository/user-device.repository';
import { WinstonLoggerService } from '@common/logger/winston.logger';
import { createCipheriv, createDecipheriv } from 'node:crypto';

@Injectable()
export class AuthService {
    winston: WinstonLoggerService;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly userDeviceRepository: UserDeviceRepository
    ) {
        this.winston = new WinstonLoggerService();
    }

    async generateRefreshToken(
        accessToken: string,
        user: string | Types.ObjectId
    ): Promise<string> {
        const salt = await genSalt(10);

        const refreshToken = new RefreshToken();
        refreshToken.userId = user;
        refreshToken.hash = await hash(accessToken.split('.')[2] + salt, salt);
        await this.refreshTokenRepository.save(refreshToken);
        return salt;
    }

    async invalidAccessToken(user: Types.ObjectId): Promise<boolean> {

        let tokenDatas = await this.userDeviceRepository.getAllByField({
            "user_id": user,
            "expired": false,
            "isDeleted": false,
        });

        tokenDatas.filter(async (tokenDoc) => {
            try {
                this.jwtService.verify(tokenDoc.accessToken, {
                    secret: this.configService.getOrThrow('JWT_SECRET'),
                });
            } catch (err) {
                await this.userDeviceRepository.updateById({
                    "expired": true,
                }, tokenDoc?._id);
                // return false; // expired or tampered
            }
        });

        return true;
    }

    async refreshToken(body: RefreshJwtDto): Promise<ApiResponse> {

        const authToken = body.accessToken;

        let tokenData = await this.userDeviceRepository.getByField({
            "accessToken": authToken,
            "isLoggedOut": false,
            // "expired": true,
            "isDeleted": false,
        });

        if (tokenData?._id) {
            const refreshTokenHash = await hash(
                body.accessToken.split('.')[2] + body.refreshToken,
                body.refreshToken
            );

            const refreshTokenData = await this.refreshTokenRepository.getByField({
                hash: refreshTokenHash,
            });
            if (!refreshTokenData) throw new BadRequestException(Messages.INVALID_TOKEN_ERROR);

            const user = await this.userRepository.getByField({ _id: new Types.ObjectId(refreshTokenData.userId), isDeleted: false, status: 'Active' });
            if (!user?._id) throw new BadRequestException(Messages.USER_MISSING_ERROR);

            const expiresDate = new Date(refreshTokenData.createdAt);
            expiresDate.setSeconds(
                expiresDate.getSeconds() +
                this.configService.getOrThrow<number>('JWT_REFRESH_EXPIRES_IN')
            );
            if (refreshTokenData.createdAt > expiresDate) {
                await this.refreshTokenRepository.delete(refreshTokenData._id);
                throw new UnauthorizedException(Messages.REFRESH_TOKEN_EXPIRED_ERROR);
            }

            const payload: JwtPayloadType = { id: refreshTokenData.userId.toString() };
            const token = this.jwtService.sign(payload);
            const salt = await genSalt(10);

            refreshTokenData.hash = await hash(token.split('.')[2] + salt, salt);

            if (refreshTokenData) {
                await this.refreshTokenRepository.save(refreshTokenData);
            }

            const existingDeviceData = await this.userDeviceRepository.getByField({ accessToken: body.accessToken });

            if (existingDeviceData?._id) {
                await this.userDeviceRepository.updateById({
                    accessToken: token
                }, existingDeviceData?._id);
            }

            return {
                message: Messages.REFRESH_TOKEN_ISSUED_SUCCESS,
                data: { accessToken: token, refreshToken: salt },
            };

        }
        else {
            throw new UnauthorizedException('Token has been invalidated. Please log in again.');
        }

    }

    async userSignup(
        body: UserSignupDTO,
        files: Express.Multer.File[],
        req: Request
    ): Promise<ApiResponse> {
        const userRole = await this.roleRepository.getByField({ role: 'user' });
        if (!userRole?._id)
            throw new BadRequestException(Messages.ROLE_NOT_FOUND_ERROR);

        const userExists = await this.userRepository.getByField({
            email: body.email,
            isDeleted: false,
        });
        if (userExists?._id)
            throw new BadRequestException(Messages.USER_EXIST_ERROR);

        if (files?.length) {
            for (const file of files) {
                body[file.fieldname] = file.filename;
            }
        }

        (body as Partial<UserDocument>).role = userRole._id;
        const saveUser = await this.userRepository.save(body);
        if (!saveUser?._id)
            throw new BadRequestException(
                saveUser instanceof Error
                    ? saveUser?.message
                    : Messages.SOMETHING_WENT_WRONG
            );

        const userDetails = await this.userRepository.getUserDetails({
            _id: saveUser._id,
        });
        if (!userDetails)
            throw new BadRequestException(Messages.USER_MISSING_ERROR);

        const payload = { id: userDetails._id };
        const token = this.jwtService.sign(payload);
        const refreshToken = await this.generateRefreshToken(
            token,
            userDetails._id
        );

        try {
            const ip = getClientIp(req);
            const geoIpInfo = ip ? lookup(ip) : null;
            if (ip) {
                const existingDeviceData = await this.userDeviceRepository.getByField({ accessToken: token });
                const { ll, region, country, city, timezone } = geoIpInfo ?? {};
                const deviceInfo: Partial<UserDevice> = {
                    ip,
                    ip_lat: ll?.[0]?.toString() || '',
                    ip_long: ll?.[1]?.toString() || '',
                    last_active: Date.now(),
                    state: region || '',
                    country: country || '',
                    city: city || '',
                    timezone: timezone || '',
                    user_id: userDetails._id,
                    accessToken: token,
                    deviceToken: body.deviceToken ?? ''
                }
                await this.userDeviceRepository.saveOrUpdate(deviceInfo, existingDeviceData?._id);
            }
        } catch (err) {
            const stackTrace = (err as Error)?.stack
                ?.split('\n')
                ?.reverse()
                ?.slice(0, -2)
                ?.reverse()
                ?.join('\n');
            this.winston.error(stackTrace, 'userLoginService');
        }

        this.invalidAccessToken(userDetails._id);
        return {
            message: Messages.USER_REGISTRATION_SUCCESS,
            data: {
                user: userDetails,
                accessToken: token,
                refreshToken: refreshToken,
            },
        };
    }

    async userLogin(body: UserSignInDTO, req: Request): Promise<ApiResponse> {

        const requestedRoute = req.originalUrl.split('/').pop();

        const checkIfExists = await this.userRepository.getByField({
            email: body.email,
            isDeleted: false,
        });

        if (!checkIfExists?._id)
            throw new BadRequestException(Messages.USER_MISSING_ERROR);

        if (!checkIfExists.validPassword(body.password)) {
            throw new BadRequestException(Messages.INVALID_CREDENTIALS_ERROR);
        }

        const userDetails = await this.userRepository.getUserDetails({
            _id: checkIfExists._id,
        });
        if (!userDetails)
            throw new BadRequestException(Messages.USER_MISSING_ERROR);

        if ((userDetails.role['role'] === 'admin') !== (requestedRoute === 'login-admin')) {
            throw new BadRequestException(Messages.INVALID_CREDENTIALS_ERROR);
        }

        if (userDetails.status === 'Inactive') {
            throw new BadRequestException(Messages.USER_INACTIVE_ERROR);
        }

        const payload = { id: checkIfExists._id };
        const token = this.jwtService.sign(payload);
        const refreshToken = await this.generateRefreshToken(
            token,
            checkIfExists._id
        );

        try {
            const ip = getClientIp(req);
            const geoIpInfo = ip ? lookup(ip) : null;
            if (ip) {
                const existingDeviceData = await this.userDeviceRepository.getByField({ accessToken: token });
                const { ll, region, country, city, timezone } = geoIpInfo ?? {};
                const deviceInfo: Partial<UserDevice> = {
                    ip,
                    ip_lat: ll?.[0]?.toString() || '',
                    ip_long: ll?.[1]?.toString() || '',
                    last_active: Date.now(),
                    state: region || '',
                    country: country || '',
                    city: city || '',
                    timezone: timezone || '',
                    user_id: userDetails._id,
                    accessToken: token,
                    deviceToken: body.deviceToken ?? ''
                }
                await this.userDeviceRepository.saveOrUpdate(deviceInfo, existingDeviceData?._id);
            }
        } catch (err) {
            const stackTrace = (err as Error)?.stack
                ?.split('\n')
                ?.reverse()
                ?.slice(0, -2)
                ?.reverse()
                ?.join('\n');
            this.winston.error(stackTrace, 'userLoginService');
        }

        this.invalidAccessToken(userDetails._id);

        return {
            message: Messages.USER_LOGIN_SUCCESS,
            data: {
                user: userDetails,
                accessToken: token,
                refreshToken: refreshToken,
            },
        };
    }

    async forgotPassword(body: ForgotPasswordDTO): Promise<ApiResponse> {
        const checkIfExists = await this.userRepository.getByField({
            email: body.email,
            isDeleted: false,
        });
        if (!checkIfExists?._id)
            throw new BadRequestException(Messages.USER_MISSING_ERROR);

        const key = Buffer.from(
            this.configService.get<string>('CRYPTO_AES_KEY'),
            'hex'
        );
        const iv = Buffer.from(
            this.configService.get<string>('CRYPTO_AES_IV'),
            'hex'
        );

        const cipher = createCipheriv(
            this.configService.get('CRYPTO_ALGORITHM'),
            key,
            iv
        );
        const payload = JSON.stringify({
            id: checkIfExists._id,
            iat: Date.now() + 500 * 1000,
        });
        const token = Buffer.concat([
            cipher.update(payload, 'utf8'),
            cipher.final(),
        ]).toString('hex');

        const sender = `${this.configService.get<string>('PROJECT_NAME')} Admin<${this.configService.get<string>('SITE_EMAIL')}>`;
        const locals = {
            project_name: this.configService.get<string>('PROJECT_NAME'),
            resetLink: `${body.baseUrl}/reset-password/${token}`,
        };

        try {
            await this.mailerService.sendMail(
                sender,
                checkIfExists.email,
                'Password Reset Link',
                'forgot-password',
                locals
            );
        } catch (error) {
            throw new BadRequestException(error);
        }

        await this.userRepository.saveOrUpdate(
            {
                resetPasswordToken: token,
            },
            checkIfExists._id
        );

        return { message: Messages.FORGOT_PASSWORD_SUCCESS };
    }

    async resetPassword(body: ResetPasswordDTO): Promise<ApiResponse> {
        let decoded: { id: string; iat: number };

        try {
            const key = Buffer.from(
                this.configService.get<string>('CRYPTO_AES_KEY'),
                'hex'
            );
            const iv = Buffer.from(
                this.configService.get<string>('CRYPTO_AES_IV'),
                'hex'
            );

            const decipher = createDecipheriv(
                this.configService.get('CRYPTO_ALGORITHM'),
                key,
                iv
            );
            const decryptedData = Buffer.concat([
                decipher.update(Buffer.from(body.authToken, 'hex')),
                decipher.final(),
            ]);
            decoded = JSON.parse(decryptedData.toString('utf-8'));

            if (decoded.iat <= Date.now())
                throw new BadRequestException(Messages.INVALID_TOKEN_ERROR);
        } catch (error) {
            throw new BadRequestException(Messages.INVALID_TOKEN_ERROR);
        }

        const checkIfExists = await this.userRepository.getByField({
            _id: Types.ObjectId.createFromHexString(decoded.id),
            isDeleted: false,
        });
        if (!checkIfExists?._id)
            throw new BadRequestException(Messages.USER_MISSING_ERROR);

        if (checkIfExists.resetPasswordToken !== body.authToken) {
            throw new BadRequestException(Messages.INVALID_TOKEN_ERROR);
        }
        const updatePassword = await this.userRepository.updateById(
            { password: body.newPassword, resetPasswordToken: '' },
            checkIfExists._id
        );
        if (!updatePassword)
            throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);
        return { message: Messages.PASSWORD_UPDATE_SUCCESS };
    }

    async profileDetails(user: Partial<UserDocument>): Promise<ApiResponse> {
        const userDetails = await this.userRepository.getUserDetails({ _id: new Types.ObjectId(user._id), isDeleted: false });

        return { message: 'Profile details retrieved successfully.', data: userDetails };
    }

    async userLogout(req: Request): Promise<ApiResponse> {

        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Removes "Bearer "

            await this.userDeviceRepository.updateByField({
                "isLoggedOut": true
            }, {
                accessToken: token
            });

            return { message: Messages.USER_LOGOUT_SUCCESS };
        } catch (error) {
            throw new BadRequestException(Messages.SOMETHING_WENT_WRONG);
        }

    }

}
