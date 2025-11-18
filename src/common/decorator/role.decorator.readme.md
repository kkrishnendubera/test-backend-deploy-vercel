# Roles Decorator

This file (`roles.decorator.ts`) defines a custom decorator called `Roles` for setting metadata about allowed user roles for specific routes or controllers in a NestJS application.  This metadata can then be used by a role-based authorization guard.

## Description

The `Roles` decorator simplifies the process of defining which user roles are permitted to access a particular route or controller. It uses NestJS's `SetMetadata` function to attach role information to the route handler's metadata. This metadata can then be accessed by a custom guard to perform role-based authorization.

## Usage

The `Roles` decorator can be used on controller methods or entire controllers to specify the allowed roles.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator'; // Path to your decorator file
import { UserRole } from './user-role.enum'; // Path to your enum
import { RolesGuard } from './roles.guard'; // Path to your guard

@Controller('admin')
@UseGuards(RolesGuard) // Apply the RolesGuard to this controller
export class AdminController {
  @Get('users')
  @Roles(UserRole.Admin) // Only Admin role can access this route
  getUsers() {
    return { message: 'Admin users' };
  }

  @Get('products')
  @Roles(UserRole.Admin, UserRole.Manager) // Admin and Manager roles can access this
  getProducts() {
    return { message: 'Admin and Manager products' };
  }

  @Get('dashboard') // No Roles decorator, access will be determined by RolesGuard or other guards
  getDashboard() {
    return { message: 'Admin dashboard' };
  }
}