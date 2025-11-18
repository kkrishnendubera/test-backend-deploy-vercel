**# Role Controller**

This controller handles the API endpoints for role management. It includes endpoints for creating, retrieving, updating, deleting, and listing roles, as well as changing the status of roles.

**## Endpoints**

**### Save Role**

****POST**** `/admin/role`

- ****Description****: Creates a new role.
- ****Guards****: `AuthGuard('jwt')`
- ****Bearer Auth****: Required
- ****Request Body****: `SaveRoleDto`
- ****Response****: `ApiResponse`
- ****Example Request****:
    ```json
    {
        "role": "admin",
        "roleGroup": "management",
        "roleDisplayName": "Administrator"
    }
    ```
- ****Example Response****:
    ```json
    {
        "message": "Role saved successfully.",
        "data": {
            "_id": "roleId",
            "role": "admin",
            "roleGroup": "management",
            "roleDisplayName": "Administrator",
            "isDeleted": false
        }
    }
    ```

**### Get Role**

****GET**** `/admin/role/:id`

- ****Description****: Retrieves the details of a specific role by ID.
- ****Guards****: [AuthGuard('jwt')](__http://_vscodecontentref_/0__)
- ****Bearer Auth****: Required
- ****Request Params****:
    - [id](__http://_vscodecontentref_/1__) (string): The ID of the role to retrieve.
- ****Response****: [ApiResponse](__http://_vscodecontentref_/2__)
- ****Example Response****:
    ```json
    {
        "message": "Role retrieved successfully.",
        "data": {
            "_id": "roleId",
            "role": "admin",
            "roleGroup": "management",
            "roleDisplayName": "Administrator",
            "isDeleted": false
        }
    }
    ```

**### Update Role**

****PATCH**** `/admin/role/:id`

- ****Description****: Updates the information of a specific role by ID.
- ****Guards****: [AuthGuard('jwt')](__http://_vscodecontentref_/3__)
- ****Bearer Auth****: Required
- ****Request Params****:
    - [id](__http://_vscodecontentref_/4__) (string): The ID of the role to update.
- ****Request Body****: [UpdateRoleDto](__http://_vscodecontentref_/5__)
- ****Response****: [ApiResponse](__http://_vscodecontentref_/6__)
- ****Example Request****:
    ```json
    {
        "role": "admin",
        "roleGroup": "management",
        "roleDisplayName": "Administrator"
    }
    ```
- ****Example Response****:
    ```json
    {
        "message": "Role updated successfully.",
        "data": {
            "_id": "roleId",
            "role": "admin",
            "roleGroup": "management",
            "roleDisplayName": "Administrator",
            "isDeleted": false
        }
    }
    ```

**### Change Role Status**

****PATCH**** `/admin/role/status-change/:id`

- ****Description****: Changes the status of a specific role by ID.
- ****Guards****: [AuthGuard('jwt')](__http://_vscodecontentref_/7__)
- ****Bearer Auth****: Required
- ****Request Params****:
    - [id](__http://_vscodecontentref_/8__) (string): The ID of the role to update.
- ****Request Body****: [StatusRoleDto](__http://_vscodecontentref_/9__)
- ****Response****: [ApiResponse](__http://_vscodecontentref_/10__)
- ****Example Request****:
    ```json
    {
        "status": "active"
    }
    ```
- ****Example Response****:
    ```json
    {
        "message": "Status updated successfully.",
        "data": {
            "_id": "roleId",
            "status": "active"
        }
    }
    ```

**### Delete Role**

****DELETE**** `/admin/role/:id`

- ****Description****: Deletes a specific role by ID.
- ****Guards****: [AuthGuard('jwt')](__http://_vscodecontentref_/11__)
- ****Bearer Auth****: Required
- ****Request Params****:
    - [id](__http://_vscodecontentref_/12__) (string): The ID of the role to delete.
- ****Response****: [ApiResponse](__http://_vscodecontentref_/13__)
- ****Example Response****:
    ```json
    {
        "message": "Role deleted successfully."
    }
    ```

**### Get All Roles**

****POST**** `/admin/role/getall`

- ****Description****: Retrieves a list of all roles with pagination.
- ****Guards****: [AuthGuard('jwt')](__http://_vscodecontentref_/14__)
- ****Bearer Auth****: Required
- ****Request Body****: [RoleListingDto](__http://_vscodecontentref_/15__)
- ****Response****: [ApiResponse](__http://_vscodecontentref_/16__)
- ****Example Request****:
    ```json
    {
        "page": 1,
        "limit": 10
    }
    ```
- ****Example Response****:
    ```json
    {
        "message": "Roles fetched successfully.",
        "data": [
            {
                "_id": "roleId1",
                "role": "admin",
                "roleGroup": "management",
                "roleDisplayName": "Administrator",
                "isDeleted": false
            },
            {
                "_id": "roleId2",
                "role": "user",
                "roleGroup": "general",
                "roleDisplayName": "User",
                "isDeleted": false
            }
        ]
    }
    ```

**## Decorators and Guards**

- ********`@ApiTags('Role')`********: Adds a tag to the Swagger documentation for this controller.
- ********`@Controller('admin/role')`********: Defines the base route for this controller.
- ********`@Version('1')`********: Specifies the version of the API.
- ********`@UseGuards(AuthGuard('jwt'))`********: Applies the JWT authentication guard to the endpoints.
- ********`@ApiBearerAuth()`********: Indicates that the endpoints require bearer authentication.
- ********`@HttpCode(200)`********: Sets the HTTP status code to 200 for successful responses.

**## DTOs**

- ****[****RoleListingDto****](**__http://_vscodecontentref_/17__**)****: Data Transfer Object for listing roles with pagination.
- ****[****SaveRoleDto****](**__http://_vscodecontentref_/18__**)****: Data Transfer Object for creating a new role.
- ****[****StatusRoleDto****](**__http://_vscodecontentref_/19__**)****: Data Transfer Object for changing the status of a role.
- ****[****UpdateRoleDto****](**__http://_vscodecontentref_/20__**)****: Data Transfer Object for updating a role.

**## Services**

- ****[****RoleService****](**__http://_vscodecontentref_/21__**)****: The service that handles the business logic for role operations.

**## Pipes**

- ****[****MongoIdPipe****](**__http://_vscodecontentref_/22__**)****: A custom pipe for validating MongoDB ObjectId parameters.

**## Example Usage**

**### Save Role**

```sh
curl -X POST "http://localhost:3000/admin/role" -H "Authorization: Bearer <your_token>" -H "Content-Type: application/json" -d '{
    "role": "admin",
    "roleGroup": "management",
    "roleDisplayName": "Administrator"
}'