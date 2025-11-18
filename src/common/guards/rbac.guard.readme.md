# Role-Based Access Control (RBAC) Guard

This file (`rbac.guard.ts`) defines a guard called `RBAcGuard` for implementing role-based access control (RBAC) in a NestJS application.  It checks if the currently authenticated user has the necessary roles to access a protected resource.

## Description

The `RBAcGuard` implements the `CanActivate` interface from NestJS.  It's designed to be used with the `@Roles` decorator to enforce role-based authorization.  The guard retrieves the allowed roles from the route handler's metadata (set by the `@Roles` decorator) and compares them to the user's role.

## Implementation

The `RBAcGuard` is implemented as follows:

1.  **Constructor:**
    *   Injects the `Reflector` service, which is used to access metadata.

    ```typescript
    constructor(private reflector: Reflector) { }
    ```

2.  **`canActivate` Method:**
    *   This method is called by NestJS to determine if the current user can access the route.
    *   It retrieves the allowed roles from the route handler's metadata using `this.reflector.get<UserRole[]>('roles', context.getHandler())`.  If no roles are defined (no `@Roles` decorator is used), it allows access (returns `true`). This allows for default access behaviour if no roles are explicitly defined.
    *   It retrieves the Express `Request` object using `context.switchToHttp().getRequest()`.
    *   It accesses the user's role from the request object (`request?.user?.role?.role`).  It uses optional chaining (`?.`) to handle cases where the user or role might not be defined.
    *   It checks if the user's role is included in the allowed roles using `roles.includes()`.
    *   It returns `true` if the user has the required role (or if no roles are defined), and `false` otherwise.

    ```typescript
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
        if (!roles) return true; // Allow access if no roles are specified

        const request = context.switchToHttp().getRequest();
        return roles.includes(request?.user?.role?.role);
    }
    ```

## Usage

The `RBAcGuard` is used in conjunction with the `@Roles` decorator.  You apply the guard to a controller or method using the `@UseGuards` decorator.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator'; // Path to your Roles decorator
import { UserRole } from './user-role.enum'; // Path to your UserRole enum
import { RBAcGuard } from './rbac.guard'; // Path to this guard

@Controller('admin')
@UseGuards(RBAcGuard) // Apply the RBAC guard to this controller
export class AdminController {
    @Get('users')
    @Roles(UserRole.Admin) // Only Admin role can access this route
    getUsers() {
        return { message: 'Admin users' };
    }

    // ... other routes
}