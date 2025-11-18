**# User API Controller**

This controller handles the API endpoints for frontend user operations. It includes endpoints for retrieving profile details and updating user information.

**## Endpoints**

**### Get Profile Details**

****GET**** `/user/profile-details`

- ****Description****: Retrieves the profile details of the logged-in user.
- ****Guards****: `AuthGuard('jwt')`
- ****Bearer Auth****: Required
- ****Response****: `ApiResponse`
- ****Example Response****:
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

**### Update Frontend User**

****PATCH**** `/user/:id`

- ****Description****: Updates the information of a frontend user.
- ****Guards****: [AuthGuard('jwt')](__http://_vscodecontentref_/0__)
- ****Bearer Auth****: Required
- ****Consumes****: `multipart/form-data`
- ****Request Params****:
    - [id](__http://_vscodecontentref_/1__) (string): The ID of the user to update.
- ****Request Body****: [UpdateFrontendUserDto](__http://_vscodecontentref_/2__)
- ****Uploaded Files****: [Express.Multer.File[]](__http://_vscodecontentref_/3__)
- ****Response****: [ApiResponse](__http://_vscodecontentref_/4__)
- ****Example Request****:
    ```json
    {
        "userName": "UpdatedUserName",
        "fullName": "Updated Full Name",
        "email": "updateduser@example.com",
        "profileImage": "updatedProfileImage.jpg"
    }
    ```
- ****Example Response****:
    ```json
    {
        "message": "Profile updated successfully.",
        "data": {
            "_id": "userId",
            "userName": "UpdatedUserName",
            "fullName": "Updated Full Name",
            "email": "updateduser@example.com",
            "profileImage": "updatedProfileImage.jpg",
            "role": "user",
            "isDeleted": false
        }
    }
    ```

## Decorators and Guards

- **`@ApiTags('Frontend User')`**: Adds a tag to the Swagger documentation for this controller.
- **`@Controller('user')`**: Defines the base route for this controller.
- **`@Version('1')`**: Specifies the version of the API.
- **`@UseGuards(AuthGuard('jwt'))`**: Applies the JWT authentication guard to the endpoints.
- **`@ApiBearerAuth()`**: Indicates that the endpoints require bearer authentication.
- **`@HttpCode(200)`**: Sets the HTTP status code to 200 for successful responses.
- **`@ApiConsumes('multipart/form-data')`**: Specifies that the endpoint consumes multipart/form-data.
- **`@UseInterceptors(SingleFileInterceptor('users', 'profileImage'))`**: Applies the file interceptor for handling file uploads.

## DTOs

- **[UpdateFrontendUserDto](http://_vscodecontentref_/5)**: Data Transfer Object for updating frontend user information.

## Services

- **[UserService](http://_vscodecontentref_/6)**: The service that handles the business logic for user operations.

## Pipes

- **[MongoIdPipe](http://_vscodecontentref_/7)**: A custom pipe for validating MongoDB ObjectId parameters.

## Example Usage

### Get Profile Details

```sh
curl -X GET "http://localhost:3000/user/profile-details" -H "Authorization: Bearer <your_token>"