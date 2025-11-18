# User Controller

This controller handles user-related operations such as fetching, creating, updating, deleting, and changing the status of users, as well as managing user profiles and passwords.

## Endpoints

### Get All Users

**POST** `/admin/user/getall`

- **Description**: Fetches all users with pagination.
- **Guards**: `AuthGuard('jwt')`, `RBAcGuard`
- **Roles**: `ADMIN`
- **Bearer Auth**: Required
- **Request Body**: `ListingUserDto`
- **Response**: `ApiResponse`
- **Example Request**:
    ```json
    {
        "page": 1,
        "limit": 10,
        "search": "user"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "User data fetched successfully.",
        "data": {
            "users": [
                {
                    "_id": "userId",
                    "userName": "UserName",
                    "fullName": "Full Name",
                    "email": "user@example.com",
                    "profileImage": "profileImage.jpg",
                    "role": "user",
                    "isDeleted": false
                }
            ],
            "total": 1,
            "page": 1,
            "limit": 10
        }
    }
    ```

### Get Profile Details

**GET** `/admin/user/profile-details`

- **Description**: Retrieves the profile details of the logged-in user.
- **Guards**: [AuthGuard('jwt')](http://_vscodecontentref_/0), [RBAcGuard](http://_vscodecontentref_/1)
- **Roles**: [ADMIN](http://_vscodecontentref_/2)
- **Bearer Auth**: Required
- **Response**: [ApiResponse](http://_vscodecontentref_/3)
- **Example Response**:
    ```json
    {
        "message": "Profile details retrieved successfully.",
        "data": {
            "_id": "userId",
            "userName": "UserName",
            "fullName": "Full Name",
            "email": "user@example.com",
            "profileImage": "profileImage.jpg",
            "role": "user",
            "isDeleted": false
        }
    }
    ```

### Save User

**POST** `/admin/user`

- **Description**: Creates a new user.
- **Guards**: [AuthGuard('jwt')](http://_vscodecontentref_/4), [RBAcGuard](http://_vscodecontentref_/5)
- **Roles**: [ADMIN](http://_vscodecontentref_/6)
- **Bearer Auth**: Required
- **Consumes**: `multipart/form-data`
- **Request Body**: [SaveUserDTO](http://_vscodecontentref_/7)
- **Uploaded Files**: [Express.Multer.File[]](http://_vscodecontentref_/8)
- **Response**: [ApiResponse](http://_vscodecontentref_/9)
- **Example Request**:
    ```json
    {
        "userName": "NewUserName",
        "fullName": "New Full Name",
        "email": "newuser@example.com",
        "role": "roleId",
        "profileImage": "profileImage.jpg"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "User added successfully.",
        "data": {
            "_id": "userId",
            "userName": "NewUserName",
            "fullName": "New Full Name",
            "email": "newuser@example.com",
            "profileImage": "profileImage.jpg",
            "role": "roleId",
            "isDeleted": false
        }
    }
    ```

### Get User

**GET** `/admin/user/:id`

- **Description**: Retrieves a user by its ID.
- **Guards**: [AuthGuard('jwt')](http://_vscodecontentref_/10), [RBAcGuard](http://_vscodecontentref_/11)
- **Roles**: [ADMIN](http://_vscodecontentref_/12)
- **Bearer Auth**: Required
- **Request Param**: [id](http://_vscodecontentref_/13) (MongoDB ObjectId)
- **Response**: [ApiResponse](http://_vscodecontentref_/14)
- **Example Request**:
    ```json
    {
        "id": "userId"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "User retrieved successfully.",
        "data": {
            "_id": "userId",
            "userName": "UserName",
            "fullName": "Full Name",
            "email": "user@example.com",
            "profileImage": "profileImage.jpg",
            "role": "roleId",
            "isDeleted": false
        }
    }
    ```

### Update User

**PATCH** `/admin/user/:id`

- **Description**: Updates a user by its ID.
- **Guards**: [AuthGuard('jwt')](http://_vscodecontentref_/15), [RBAcGuard](http://_vscodecontentref_/16)
- **Roles**: [ADMIN](http://_vscodecontentref_/17)
- **Bearer Auth**: Required
- **Consumes**: `multipart/form-data`
- **Request Param**: [id](http://_vscodecontentref_/18) (MongoDB ObjectId)
- **Request Body**: [UpdateUserDto](http://_vscodecontentref_/19)
- **Uploaded Files**: [Express.Multer.File[]](http://_vscodecontentref_/20)
- **Response**: [ApiResponse](http://_vscodecontentref_/21)
- **Example Request**:
    ```json
    {
        "id": "userId",
        "userName": "UpdatedUserName",
        "fullName": "Updated Full Name",
        "email": "updateduser@example.com",
        "profileImage": "updatedProfileImage.jpg"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "User updated successfully.",
        "data": {
            "_id": "userId",
            "userName": "UpdatedUserName",
            "fullName": "Updated Full Name",
            "email": "updateduser@example.com",
            "profileImage": "updatedProfileImage.jpg",
            "role": "roleId",
            "isDeleted": false
        }
    }
    ```

### Change User Status

**PATCH** `/admin/user/status-change/:id`

- **Description**: Changes the status of a user by its ID.
- **Guards**: [AuthGuard('jwt')](http://_vscodecontentref_/22), [RBAcGuard](http://_vscodecontentref_/23)
- **Roles**: [ADMIN](http://_vscodecontentref_/24)
- **Bearer Auth**: Required
- **Request Param**: [id](http://_vscodecontentref_/25) (MongoDB ObjectId)
- **Request Body**: [StatusUserDto](http://_vscodecontentref_/26)
- **Response**: [ApiResponse](http://_vscodecontentref_/27)
- **Example Request**:
    ```json
    {
        "id": "userId",
        "status": "active"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "Status updated successfully.",
        "data": {
            "_id": "userId",
            "userName": "UserName",
            "fullName": "Full Name",
            "email": "user@example.com",
            "profileImage": "profileImage.jpg",
            "role": "roleId",
            "status": "active",
            "isDeleted": false
        }
    }
    ```

### Change User Password

**PATCH** `/admin/user/change-password/:id`

- **Description**: Changes the password of a user by its ID.
- **Guards**: [AuthGuard('jwt')](http://_vscodecontentref_/28), [RBAcGuard](http://_vscodecontentref_/29)
- **Roles**: [ADMIN](http://_vscodecontentref_/30)
- **Bearer Auth**: Required
- **Request Param**: [id](http://_vscodecontentref_/31) (MongoDB ObjectId)
- **Request Body**: [ChangePasswordDto](http://_vscodecontentref_/32)
- **Response**: [ApiResponse](http://_vscodecontentref_/33)
- **Example Request**:
    ```json
    {
        "id": "userId",
        "currentPassword": "currentPassword",
        "password": "newPassword"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "User password updated successfully.",
        "data": {
            "_id": "userId",
            "userName": "UserName",
            "fullName": "Full Name",
            "email": "user@example.com",
            "profileImage": "profileImage.jpg",
            "role": "roleId",
            "isDeleted": false
        }
    }
    ```

### Delete User

**DELETE** `/admin/user/:id`

- **Description**: Deletes a user by its ID.
- **Guards**: [AuthGuard('jwt')](http://_vscodecontentref_/34), [RBAcGuard](http://_vscodecontentref_/35)
- **Roles**: [ADMIN](http://_vscodecontentref_/36)
- **Bearer Auth**: Required
- **Request Param**: [id](http://_vscodecontentref_/37) (MongoDB ObjectId)
- **Response**: [ApiResponse](http://_vscodecontentref_/38)
- **Example Request**:
    ```json
    {
        "id": "userId"
    }
    ```
- **Example Response**:
    ```json
    {
        "message": "User deleted successfully."
    }
    ```