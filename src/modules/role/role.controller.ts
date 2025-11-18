import { Controller, UseGuards, Version, Post, Body, Delete, Get, Param, HttpCode, Patch, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleListingDto, SaveRoleDto, StatusRoleDto, UpdateRoleDto } from './dto/role.dto';
import { MongoIdPipe } from '@common/pipes/mongoid.pipe';
import { RoleService } from './role.service';


@ApiTags('Role')
@Controller('admin/role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService
    ) { }


    @Version('1')
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async saveRole(@Body() dto: SaveRoleDto) {
        return this.roleService.save(dto);
    }


    @Version('1')
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @HttpCode(200)
    async getRole(@Param('id', new MongoIdPipe()) id: string) {
        return this.roleService.get(id);
    }


    @Version('1')
    @Patch('/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async updateRole(@Param('id', new MongoIdPipe()) id: string, @Body(new ValidationPipe({ transform: true })) dto: UpdateRoleDto) {
        return this.roleService.update(id, dto);
    }

    @Version('1')
    @Patch('status-change/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @HttpCode(200)
    async statusChange(@Param('id', new MongoIdPipe()) id: string, @Body() dto: StatusRoleDto) {
        return this.roleService.statusUpdate(id, dto);
    }


    @Version('1')
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @HttpCode(200)
    async deleteRole(@Param('id', new MongoIdPipe()) id: string) {
        return this.roleService.delete(id);
    }


    @Version('1')
    @Post('getall')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @HttpCode(200)
    async getAllRole(@Body(new ValidationPipe({ transform: true })) dto: RoleListingDto) {
        return this.roleService.getAll(dto);
    }

}
