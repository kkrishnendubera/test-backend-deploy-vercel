import { Module } from '@nestjs/common';
import { UserApiController } from './user.api.controller';
import { UserService } from './user.service';
import { AdminController, UserController } from './user.controller';

@Module({
    imports: [],
    controllers: [
        UserApiController,
        UserController,
        AdminController
    ],
    providers: [
        UserService
    ],
})
export class UsersModule { }