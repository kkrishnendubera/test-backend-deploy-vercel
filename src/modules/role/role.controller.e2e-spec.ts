// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CloseInMongodConnection, RootMongooseTestModule } from '@common/unit-test-config/mongoose-test-module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HydratedDocument, Model } from 'mongoose';
import { UserRepositoryModule } from '@modules/users/repositories/user-repository.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '@modules/users/schemas/user.schema';
import { Role, RoleDocument } from '@modules/role/schemas/role.schema';
import { ThrottlerModule } from '@nestjs/throttler';
import { RefreshTokenModule } from '@modules/refresh-token/refresh-token.module';
import { RoleRepositoryModule } from '@modules/role/repositories/role.repository.module';
import { UserDeviceRepositoryModule } from '@modules/user-devices/repository/user-device-repository.module';
import { HelpersModule } from '@helpers/helpers.module';
import { AuthModule } from '@auth/auth.module';
import { RoleModule } from './role.module';

describe('CategoryController (e2e)', () => {
    let app: INestApplication;
    let userModel: Model<User>;
    let roleModel: Model<Role>;

    let createAdmin: HydratedDocument<User>;
    let createRoleAdmin: RoleDocument;
    let accessToken: string;
    let roleId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: `.env.${process.env.NODE_ENV}`,
                    isGlobal: true,
                }),
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
                ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
                AuthModule,
                RoleModule,
                RoleRepositoryModule,
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

        userModel = app.get(getModelToken(User.name));
        roleModel = app.get(getModelToken(Role.name));

        // Insert test role
        createRoleAdmin = await roleModel.create({ role: 'admin', roleDisplayName: 'Admin', roleGroup: 'backend' });
        // Insert test user
        createAdmin = await userModel.create({
            email: 'test.admin@yopmail.com',
            password: 'admin123@',
            fullName: 'Test Admin',
            userName: 'test_admin',
            role: createRoleAdmin?._id,
        });

        // Login to get access token
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: createAdmin.email, password: 'admin123@' });
        accessToken = loginResponse.body.data.accessToken;
    });

    afterAll(async () => {
        await CloseInMongodConnection();
        await app.close();
        jest.clearAllMocks();
        jest.clearAllTimers();
    });


    it('POST /admin/role creates a new role', async () => {
        const roleData = {
            role: 'manager',
            roleDisplayName: 'Manager',
            roleGroup: 'backend'
        };

        const res = await request(app.getHttpServer())
            .post('/admin/role')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(roleData)
            .expect(201);

        expect(res.body.message).toEqual('role saved successfully.');
        expect(res.body.data).toHaveProperty('_id');
        roleId = res.body.data._id;
    });

    it('GET /admin/role/:id retrieves role details', async () => {
        const res = await request(app.getHttpServer())
            .get(`/admin/role/${roleId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.message).toEqual('role retrieved successfully.');
        expect(res.body.data).toHaveProperty('_id', roleId);
    });

    it('PATCH /admin/role/:id updates a role', async () => {
        const updateData = {
            role: 'manager-updated',
            roleDisplayName: 'Manager Updated',
            roleGroup: 'backend'
        };

        const res = await request(app.getHttpServer())
            .patch(`/admin/role/${roleId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updateData)
            .expect(200);

        expect(res.body.message).toEqual('role updated successfully.');
        expect(res.body.data).toHaveProperty('role', updateData.role);
    });

    it('PATCH /admin/role/status-change/:id updates role status', async () => {
        const statusData = { status: 'inactive' };

        const res = await request(app.getHttpServer())
            .patch(`/admin/role/status-change/${roleId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(statusData)
            .expect(200);

        expect(res.body.message).toEqual('Status updated successfully.');
        expect(res.body.data).toHaveProperty('status', statusData.status);
    });

    it('POST /admin/role/getall retrieves all roles', async () => {
        // Adjust payload as needed to match your RoleListingDto
        const requestBody = { page: 1, limit: 10 };

        const res = await request(app.getHttpServer())
            .post('/admin/role/getall')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(requestBody)
            .expect(200);

        expect(res.body.message).toEqual('Roles fetched successfully.');
        expect(res.body.data).toHaveProperty('docs'); // assuming pagination returns a docs array
    });

    it('DELETE /admin/role/:id deletes a role', async () => {
        const res = await request(app.getHttpServer())
            .delete(`/admin/role/${roleId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body.message).toEqual('role deleted successfully.');
    });
});