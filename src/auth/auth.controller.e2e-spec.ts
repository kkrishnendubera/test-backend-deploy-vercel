// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CloseInMongodConnection, RootMongooseTestModule } from '@common/unit-test-config/mongoose-test-module';
import { AuthModule } from './auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HydratedDocument, Model, Types } from 'mongoose';
import { UserRepositoryModule } from '@modules/users/repositories/user-repository.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User } from '@modules/users/schemas/user.schema';
import { Role, RoleDocument } from '@modules/role/schemas/role.schema';
import { ThrottlerModule } from '@nestjs/throttler';
import { RefreshTokenModule } from '@modules/refresh-token/refresh-token.module';
import { RoleRepositoryModule } from '@modules/role/repositories/role.repository.module';
import { UserDeviceRepositoryModule } from '@modules/user-devices/repository/user-device-repository.module';
import { HelpersModule } from '@helpers/helpers.module';
import { AuthService } from './auth.service';
import { resolve } from 'node:path';
import { createReadStream } from 'node:fs';
import { createCipheriv } from 'node:crypto';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let authService: AuthService;
    let configService: ConfigService;
    // @ts-ignore
    let jwtService: JwtService;
    let userModel: Model<User>;
    let roleModel: Model<Role>;

    let createAdmin: HydratedDocument<User>;
    let createRoleAdmin: RoleDocument;
    // @ts-ignore
    let createRoleUser: RoleDocument;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                RootMongooseTestModule(),
                JwtModule.registerAsync({
                    useFactory: (configService: ConfigService) => ({
                        privateKey: configService.getOrThrow('JWT_SECRET'),
                        signOptions: {
                            expiresIn: configService.getOrThrow('JWT_ACCESS_EXPIRES_IN')
                        }
                    }),
                    inject: [ConfigService]
                }),
                ConfigModule.forRoot({
                    envFilePath: `.env.${process.env.NODE_ENV}`,
                    isGlobal: true,
                }),
                ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
                AuthModule,
                UserRepositoryModule,
                RefreshTokenModule,
                RoleRepositoryModule,
                UserDeviceRepositoryModule,
                HelpersModule
            ],
            providers: [
                ConfigService
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        authService = moduleFixture.get(AuthService);
        configService = moduleFixture.get(ConfigService);
        jwtService = moduleFixture.get(JwtService);
        userModel = app.get(getModelToken(User.name));
        roleModel = app.get(getModelToken(Role.name));

        // Insert test role
        createRoleAdmin = await roleModel.create({ role: 'admin', roleDisplayName: 'Admin', roleGroup: 'backend' });
        createRoleUser = await roleModel.create({ role: 'user', roleDisplayName: 'User', roleGroup: 'frontend' });
        // Insert test user
        createAdmin = await userModel.create({
            email: 'test.admin@yopmail.com',
            password: 'admin123@',
            fullName: 'Test Admin',
            userName: 'test_admin',
            role: createRoleAdmin?._id,
        });
    })

    afterAll(async () => {
        await CloseInMongodConnection();
        await app.close();
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe('/login (POST)', function () {
        it('Invalid credentials', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: createAdmin.email, password: 'wrongpassword' })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('Invalid credentials');
                });
        });

        it('User not found', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'na@yopmail.com', password: 'wrongpassword' })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('User not found');
                });
        });

        it('User logged in successfully', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: createAdmin.email, password: 'admin123@' })
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe('User logged in successfully');
                    expect(res.body.data.user._id).toBe(createAdmin._id.toString());
                    expect(res.body.data.accessToken).toBeDefined();
                    expect(res.body.data.refreshToken).toBeDefined();
                });
        });
    })

    describe('/register (POST)', function () {
        it('User already exists', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({ fullName: 'Test User', email: createAdmin.email, password: 'password123' })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('User already exists');
                });
        });

        it('Successful registration with profile image', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .field('fullName', 'Test User')
                .field('email', 'newuser@example.com')
                .field('password', 'password123')
                .attach('profileImage', createReadStream(resolve('./assets/nest.jpg')))
                .expect(201)
                .expect((res) => {
                    expect(res.body.message).toBe('User registered successfully');
                    expect(res.body.data.user.email).toBe('newuser@example.com');
                    expect(res.body.data.accessToken).toBeDefined();
                    expect(res.body.data.refreshToken).toBeDefined();
                });
        });

        it('Successful registration without profile image', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({ fullName: 'Test User', email: 'newuser2@example.com', password: 'password123' })
                .expect(201)
                .expect((res) => {
                    expect(res.body.message).toBe('User registered successfully');
                    expect(res.body.data.user.email).toBe('newuser2@example.com');
                    expect(res.body.data.accessToken).toBeDefined();
                    expect(res.body.data.refreshToken).toBeDefined();
                });
        });
    });

    describe('/forgot-password (POST)', function () {
        it('User not found', () => {
            return request(app.getHttpServer())
                .post('/auth/forgot-password')
                .send({ email: 'nonexistent@example.com', baseUrl: 'https://example.com' })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('User not found');
                });
        });

        it('Successful password reset request', () => {
            return request(app.getHttpServer())
                .post('/auth/forgot-password')
                .send({ email: createAdmin.email, baseUrl: 'https://example.com' })
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe('If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.');
                });
        });
    });

    describe('/reset-password (POST)', function () {
        it('Invalid or expired authToken', () => {
            return request(app.getHttpServer())
                .post('/auth/reset-password')
                .send({ newPassword: 'NewPass123!', authToken: 'invalid-token' })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('Invalid or expired token');
                });
        });

        it('User not found for valid token', () => {
            const key = Buffer.from(configService.get<string>('CRYPTO_AES_KEY'), 'hex');
            const iv = Buffer.from(configService.get<string>('CRYPTO_AES_IV'), 'hex');

            const cipher = createCipheriv(configService.get('CRYPTO_ALGORITHM'), key, iv);
            const payload = JSON.stringify({ id: new Types.ObjectId(), iat: Date.now() + 500 * 1000 });
            const token = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]).toString('hex');

            return request(app.getHttpServer())
                .post('/auth/reset-password')
                .send({ newPassword: 'NewPass123!', authToken: token })
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe('User not found');
                });
        });

        it('Successful password reset', () => {
            const key = Buffer.from(configService.get<string>('CRYPTO_AES_KEY'), 'hex');
            const iv = Buffer.from(configService.get<string>('CRYPTO_AES_IV'), 'hex');

            const cipher = createCipheriv(configService.get('CRYPTO_ALGORITHM'), key, iv);
            const payload = JSON.stringify({ id: createAdmin._id, iat: Date.now() + 500 * 1000 });
            const token = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]).toString('hex');

            return request(app.getHttpServer())
                .post('/auth/reset-password')
                .send({ newPassword: 'NewPass123!', authToken: token })
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe('Password updated successfully.');
                });
        });
    });

    describe('/refresh-token (POST)', function () {
        it('Successful token refresh', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: createAdmin.email, password: 'NewPass123!' })
                .expect(200)
                .expect((res) => {
                    return request(app.getHttpServer())
                        .post('/auth/refresh-token')
                        .set('Authorization', `Bearer ${res.body.data.accessToken}`)
                        .send({ accessToken: res.body.data.accessToken, refreshToken: res.body.data.refreshToken })
                        .expect(200)
                        .expect((res) => {
                            expect(res.body.message).toBe('Refresh token issued successfully');
                            expect(res.body.data.accessToken).toBeDefined();
                            expect(res.body.data.refreshToken).toBeDefined();
                        });
                });
        });
    });

})