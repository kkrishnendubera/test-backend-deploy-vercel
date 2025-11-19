import { Module } from '@nestjs/common';

// FIXED: no alias, use relative paths
import { AuthModule } from './auth/auth.module';
import { HelpersModule } from './helpers/helpers.module';

// refresh-token module
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';

// role module
import { RoleModule } from './modules/role/role.module';

// user devices repository module
import { UserDeviceRepositoryModule } from './modules/user-devices/repository/user-device-repository.module';

// user repository module
import { UserRepositoryModule } from './modules/users/repositories/user-repository.module';

// users module
import { UsersModule } from './modules/users/users.module';

// config module
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
    providers: [],
})
export class AppModule {}
