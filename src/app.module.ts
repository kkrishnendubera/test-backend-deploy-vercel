import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { HelpersModule } from '@helpers/helpers.module';
import { RefreshTokenModule } from '@modules/refresh-token/refresh-token.module';
import { RoleModule } from '@modules/role/role.module';
import { UserDeviceRepositoryModule } from '@modules/user-devices/repository/user-device-repository.module';
import { UserRepositoryModule } from '@modules/users/repositories/user-repository.module';
import { UsersModule } from '@modules/users/users.module';
import { ApiConfigModule } from './config.module';



@Module({
    imports: [
        ApiConfigModule,
        HelpersModule,
        AuthModule,
        RefreshTokenModule,
        RoleModule,
        UserDeviceRepositoryModule,
        UserRepositoryModule,
        UsersModule,
    ],
    providers: []
})

export class AppModule { }