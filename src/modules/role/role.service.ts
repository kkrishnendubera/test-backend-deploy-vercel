import { BadRequestException, Body, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApiResponse } from '@common/types/api-response.type';
import { RoleRepository } from './repositories/role.repository';
import { RoleListingDto, SaveRoleDto, StatusRoleDto, UpdateRoleDto } from './dto/role.dto';
import { Messages } from '@common/constants/messages';


@Injectable()
export class RoleService {
    constructor(
        private readonly roleRepository: RoleRepository
    ) { }

    async getAll(@Body() body: RoleListingDto): Promise<ApiResponse> {
        const roles = await this.roleRepository.getAllPaginate(body);
        return { message: 'Roles fetched successfully.', data: roles };
    }

    async save(body: SaveRoleDto): Promise<ApiResponse> {
        const existingRole = await this.roleRepository.getByField({ role: body.role, isDeleted: false });
        if (existingRole) throw new ConflictException('This role already exists!');

        const saveRole = await this.roleRepository.save(body);
        if (!saveRole) throw new BadRequestException(saveRole);

        return { message: 'role saved successfully.' };
    }


    async get(id: string): Promise<ApiResponse> {
        const role = await this.roleRepository.getByField({ _id: new Types.ObjectId(id), role: { $ne: 'admin' }, isDeleted: false });
        if (!role) throw new NotFoundException('Role not found!')

        return { message: 'role retrieved successfully.', data: role };
    }


    async update(id: string, body: UpdateRoleDto): Promise<ApiResponse> {

        const roleData = await this.roleRepository.getByField({ isDeleted: false, _id: new Types.ObjectId(id) });
        if (!roleData) throw new BadRequestException('Role not found!');

        if (roleData?._id && roleData.role == 'admin') throw new BadRequestException('Modifying admin role is restricted!');

        if (body.role) {
            const existingRole = await this.roleRepository.getByField({ role: body.role, isDeleted: false, _id: { $ne: new Types.ObjectId(id) } });
            if (existingRole) throw new ConflictException('This role already exists!');
        }

        const updatedValue = {
            role: body.role ?? roleData.role,
            roleGroup: body.roleGroup ?? roleData.roleGroup,
            roleDisplayName: body.roleDisplayName ?? roleData.roleDisplayName,
        }

        const update = await this.roleRepository.updateById(updatedValue, new Types.ObjectId(id));
        if (!update) throw new BadRequestException(update instanceof Error ? update : Messages.SOMETHING_WENT_WRONG);

        return { message: 'role updated successfully.', data: update };
    }


    async delete(id: string): Promise<ApiResponse> {

        const roleData = await this.roleRepository.getByField({ isDeleted: false, _id: new Types.ObjectId(id) });
        if (!roleData) throw new BadRequestException('Role not found!');

        if (roleData?._id && roleData.role == 'admin') throw new BadRequestException('Modifying admin role is restricted!');

        const delData = await this.roleRepository.updateById({ isDeleted: true }, id);
        if (!delData) throw new BadRequestException(delData instanceof Error ? delData : Messages.SOMETHING_WENT_WRONG);

        return { message: 'role deleted successfully.' };
    }

    async statusUpdate(id: string, body: StatusRoleDto): Promise<ApiResponse> {

        const roleData = await this.roleRepository.getByField({ isDeleted: false, _id: new Types.ObjectId(id) });
        if (!roleData) throw new BadRequestException('Role not found!');

        if (roleData?._id && roleData.role == 'admin') throw new BadRequestException('Modifying admin role is restricted!');

        const update = await this.roleRepository.updateById({ status: body.status }, new Types.ObjectId(id));
        if (!update) throw new BadRequestException(update instanceof Error ? update : Messages.SOMETHING_WENT_WRONG);

        return { message: 'Status updated successfully.', data: update };
    }
}
