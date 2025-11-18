// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CloseInMongodConnection, RootMongooseTestModule } from '@common/unit-test-config/mongoose-test-module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HydratedDocument, Model } from 'mongoose';
import { UserRepositoryModule } from '@modules/users/repositories/user-repository.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User } from '@modules/users/schemas/user.schema';
import { Role, RoleDocument } from '@modules/role/schemas/role.schema';
import { ThrottlerModule } from '@nestjs/throttler';
import { RefreshTokenModule } from '@modules/refresh-token/refresh-token.module';
import { RoleRepositoryModule } from '@modules/role/repositories/role.repository.module';
import { UserDeviceRepositoryModule } from '@modules/user-devices/repository/user-device-repository.module';
import { HelpersModule } from '@helpers/helpers.module';
import { UserService } from './user.service';
import { UsersModule } from './users.module';
import { AuthModule } from '@auth/auth.module';
import { createReadStream } from 'fs';
import { resolve } from 'path';

describe('UserApiController (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;
    let configService: ConfigService;
    let jwtService: JwtService;
    let userModel: Model<User>;
    let roleModel: Model<Role>;

    let createUser: HydratedDocument<User>;
    let createUserTwo: HydratedDocument<User>;
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
                UsersModule,
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

        userService = moduleFixture.get(UserService);
        configService = moduleFixture.get(ConfigService);
        jwtService = moduleFixture.get(JwtService);
        userModel = app.get(getModelToken(User.name));
        roleModel = app.get(getModelToken(Role.name));

        // Insert test role
        createRoleUser = await roleModel.create({ role: 'user', roleDisplayName: 'User', roleGroup: 'frontend' });
        // Insert test user
        createUser = await userModel.create({
            email: 'test.user@yopmail.com',
            password: 'user123@',
            fullName: 'Test User',
            userName: 'test_user',
            role: createRoleUser?._id,
        });
        createUserTwo = await userModel.create({
            email: 'test.user.two@yopmail.com',
            password: 'user123@',
            fullName: 'Test User',
            userName: 'test_user',
            role: createRoleUser?._id,
        });
    })

    afterAll(async () => {
        await CloseInMongodConnection();
        await app.close();
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe('/user/profile-details (GET)', function () {
        it('Unauthorized access', () => {
            return request(app.getHttpServer())
                .get('/user/profile-details')
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe('Unauthorized');
                });
        });

        it('Successful profile retrieval', () => {
            const payload = { id: createUser._id };
            const token = jwtService.sign(payload);

            return request(app.getHttpServer())
                .get('/user/profile-details')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe('Profile details retrieved successfully.');
                    expect(res.body.data).toBeDefined();
                });
        });
    });


    describe('/user/:id (PATCH)', function () {
        it('Unauthorized access', () => {
            return request(app.getHttpServer())
                .patch(`/user/${createUser._id}`)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe('Unauthorized');
                });
        });

        it('Successful user update', () => {
            const payload = { id: createUser._id };
            const token = jwtService.sign(payload);
            const updateData = {
                fullName: 'Updated Name',
                userName: 'updatedUsername',
            };

            return request(app.getHttpServer())
                .patch(`/user/${createUser._id}`)
                .set('Authorization', `Bearer ${token}`)
                .field('fullName', updateData.fullName)
                .field('userName', updateData.userName)
                .attach('profileImage', createReadStream(resolve('./assets/nest.jpg')))
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe('Profile updated successfully');
                    expect(res.body.data).toBeDefined();
                });
        });

        it('Duplicate email error', () => {
            const payload = { id: createUser._id };
            const token = jwtService.sign(payload);
            const duplicateEmailData = {
                email: createUserTwo.email,
                fullName: 'Another Name',
            };

            return request(app.getHttpServer())
                .patch(`/user/${createUser._id}`)
                .set('Authorization', `Bearer ${token}`)
                .field('email', duplicateEmailData.email)
                .field('fullName', duplicateEmailData.fullName)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toContain('User already exists');
                });
        });
    });
})