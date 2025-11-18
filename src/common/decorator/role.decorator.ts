import type { UserRole } from '@common/enum/user-role.enum';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRole[]): CustomDecorator<string> => {
    return SetMetadata('roles', roles);
}