# Auth Controller

This controller handles authentication-related operations such as user registration, login, password reset, and token refresh.

## Endpoints

### Login

**POST** `/auth/login`

- **Description**: Authenticates a user and returns an access token and refresh token.
- **Guards**: `ThrottlerGuard`
- **Request Body**: `UserSignInDTO`
- **Response**: `ApiResponse`
- **Example Request**:
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "User login successful",
        "data": {
            "user": {
                "_id": "userId",
                "email": "user@example.com",
                "role": "user",
                "profileImage": "profileImage.jpg"
            },
            "accessToken": "accessToken",
            "refreshToken": "refreshToken"
        }
    }
    ```

### Register

**POST** `/auth/register`

- **Description**: Registers a new user.
- **Guards**: [ThrottlerGuard](http://_vscodecontentref_/0)
- **Interceptors**: [SingleFileInterceptor](http://_vscodecontentref_/1) (for handling profile image upload)
- **Consumes**: `application/json`, `multipart/form-data`
- **Request Body**: [UserSignupDTO](http://_vscodecontentref_/2)
- **Uploaded Files**: [Express.Multer.File[]](http://_vscodecontentref_/3)
- **Response**: [ApiResponse](http://_vscodecontentref_/4)
- **Example Request**:
    ```json
    {
        "email": "newuser@example.com",
        "password": "password123",
        "firstName": "John",
        "lastName": "Doe"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "User registration successful",
        "data": {
            "user": {
                "_id": "userId",
                "email": "newuser@example.com",
                "role": "user",
                "profileImage": "profileImage.jpg"
            },
            "accessToken": "accessToken",
            "refreshToken": "refreshToken"
        }
    }
    ```

### Forgot Password

**POST** `/auth/forgot-password`

- **Description**: Sends a password reset link to the user's email.
- **Guards**: [ThrottlerGuard](http://_vscodecontentref_/5)
- **Request Body**: [ForgotPasswordDTO](http://_vscodecontentref_/6)
- **Response**: [ApiResponse](http://_vscodecontentref_/7)
- **Example Request**:
    ```json
    {
        "email": "user@example.com",
        "baseUrl": "http://example.com"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "Password reset link sent successfully"
    }
    ```

### Reset Password

**POST** `/auth/reset-password`

- **Description**: Resets the user's password using the provided token.
- **Guards**: [ThrottlerGuard](http://_vscodecontentref_/8)
- **Request Body**: [ResetPasswordDTO](http://_vscodecontentref_/9)
- **Response**: [ApiResponse](http://_vscodecontentref_/10)
- **Example Request**:
    ```json
    {
        "authToken": "resetToken",
        "newPassword": "newPassword123"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "Password updated successfully"
    }
    ```

### Refresh Token

**POST** `/auth/refresh-token`

- **Description**: Refreshes the user's access token using the provided refresh token.
- **Guards**: [AuthGuard('jwt')](http://_vscodecontentref_/11)
- **Bearer Auth**: Required
- **Request Body**: [RefreshJwtDto](http://_vscodecontentref_/12)
- **Response**: [ApiResponse](http://_vscodecontentref_/13)
- **Example Request**:
    ```json
    {
        "accessToken": "accessToken",
        "refreshToken": "refreshToken"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "Refresh token issued successfully",
        "data": {
            "accessToken": "newAccessToken",
            "refreshToken": "newRefreshToken"
        }
    }
    ```