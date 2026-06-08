import asyncHandler from '../../common/middleware/async-handler.js';
import { ApiResponse } from '../../common/utils/api/api-response.js';

export default class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    list = asyncHandler(async (req, res) => {
        const users = await this.userService.listUsers(req.query);

        return ApiResponse.ok(res, 'Users fetched successfully', users);
    });

    getMe = asyncHandler(async (req, res) => {
        const user = await this.userService.findById(req.auth.userId);

        return ApiResponse.ok(res, 'Current user fetched successfully', user);
    });

    getUser = asyncHandler(async (req, res) => {
        const user = await this.userService.findById(req.params.id);

        return ApiResponse.ok(res, 'User fetched successfully', user);
    });

    update = asyncHandler(async (req, res) => {
        const user = await this.userService.updateUser(req.params.id, req.body);

        return ApiResponse.ok(res, 'User updated successfully', user);
    });

    remove = asyncHandler(async (req, res) => {
        await this.userService.deleteUser(req.params.id);

        return ApiResponse.ok(res, 'User deleted successfully');
    });
}
