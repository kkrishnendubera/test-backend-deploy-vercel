import { Global, Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepositoryModule } from './repositories/role.repository.module';

@Global()
@Module({
    imports: [RoleRepositoryModule],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule { }