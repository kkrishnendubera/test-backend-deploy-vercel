# LoginUser Decorator

This file (`login-user.decorator.ts`) defines a custom parameter decorator called `LoginUser` for accessing the currently logged-in user within NestJS controllers.

## Description

The `LoginUser` decorator simplifies the process of retrieving the authenticated user object from the request object.  It's designed to be used in controller methods to directly access the user without needing to access the request object directly. This improves code readability and reduces boilerplate.

## Usage

The `LoginUser` decorator can be used in any controller method to access the logged-in user.  The user object is typically made available on the request object by an authentication guard (e.g., `AuthGuard('jwt')`).

```typescript
import { Controller, Get } from '@nestjs/common';
import { LoginUser } from './login-user.decorator'; // Path to your decorator file
import { User } from './user.entity'; // Or your user entity/interface

@Controller('profile')
export class ProfileController {
  @Get()
  getProfile(@LoginUser() user: User) {
    return { userProfile: user };
  }
}