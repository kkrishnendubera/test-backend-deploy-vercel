import { UserRepository } from '@modules/users/repositories/user.repository';
import { RoleRepository } from '@modules/role/repositories/role.repository';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import roleData from '../src/assets/roles.json'
import userData from '../src/assets/users.json'

/**
 * Migration to seed roles and users in the database
 */
export const defaultUserCreate = async (app: NestExpressApplication, logger: Logger): Promise<void> => {
  const userRepo = app.get(UserRepository);
  const roleRepo = app.get(RoleRepository);

  const rolesCount = await roleRepo.getCountByParam({ status: 'Active', isDeleted: false });
  const usersCount = await userRepo.getCountByParam({ status: 'Active', isDeleted: false });

  if (rolesCount === 0) {
    await roleRepo.saveMany(roleData);
    logger.log('Default roles inserted');
  }

  if (usersCount === 0) {
    const adminRole = await roleRepo.getByField({ role: 'admin', isDeleted: false });
    if (adminRole) {
      const existingAdmin = await userRepo.getByField({ email: userData.email, isDeleted: false });
      if (!existingAdmin) {
        await userRepo.save({ ...userData, role: adminRole._id });
        logger.log('Default admin user created');
      }
    }
  }

  logger.log('Migration completed successfully');
  // ❌ remove await app.close() from here
};


