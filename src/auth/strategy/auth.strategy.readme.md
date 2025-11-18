# JWT Strategy

This file (`jwt.strategy.ts`) defines the JWT (JSON Web Token) authentication strategy for the application using Passport.js.  It's responsible for verifying JWTs and authenticating users.

## Description

The `JwtStrategy` extends the `PassportStrategy` class and implements the JWT authentication strategy. It's used to protect routes and ensure that only authenticated users can access them.  This strategy extracts the JWT from the Authorization header, verifies its signature, and retrieves the associated user from the database.

## Implementation

The `JwtStrategy` is implemented as follows:

1.  **Constructor:**
    *   Injects the `UserRepository` to access user data.
    *   Injects the `ConfigService` to retrieve the JWT secret key.
    *   Calls the `super` constructor with the strategy configuration:
        *   `jwtFromRequest`: Extracts the JWT from the `Authorization` header as a Bearer token.
        *   `secretOrKey`: The secret key used to verify the JWT signature (retrieved from the configuration).
        *   `passReqToCallback`: Passes the Express `Request` object to the `validate` callback.

    ```typescript
    constructor(
        private readonly userRepository: UserRepository,
        readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
            passReqToCallback: true
        });
    }
    ```

2.  **`validate` Method:**
    *   This method is called by Passport.js when a JWT is received.
    *   It receives the JWT payload and the Express `Request` object.
    *   Extracts the user ID (`id`) from the payload.
    *   Uses the `userRepository` to retrieve the user details based on the ID.
    *   If the user is not found, it throws an `UnauthorizedException`.
    *   If the user is found, it calls the `done` callback with the user object, making the user available in the request object (e.g., `req.user`). It also passes the `iat` (issued at) timestamp of the token.

    ```typescript
    async validate(_req: Request, payload: JwtPayloadType, done: VerifiedCallback) {
        const { id } = payload;

        const user = await this.userRepository.getUserDetailsJwtAuth(id);
        if (!user) return done(new UnauthorizedException(), false,);

        return done(null, user, payload.iat);
    }
    ```

## Usage

To use the `JwtStrategy`, you need to protect routes using the `@UseGuards(AuthGuard('jwt'))` decorator.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('protected')
export class ProtectedController {
    @Get()
    @UseGuards(AuthGuard('jwt')) // Protect this route with the JWT strategy
    getProtectedData(@Req() req: Request) {
        const user = req.user; // Access the authenticated user
        return { message: 'Protected data', user };
    }
}