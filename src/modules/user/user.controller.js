import asyncHandler from '../../common/middleware/async-handler.js';
import { ApiResponse } from '../../common/utils/api/api-response.js';

export default class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    getUser = asyncHandler(async (req, res) => {
        const user = await this.userService.findById(req.params.id);

        return ApiResponse.ok(res, 'User fetched successfully', user);
    });
}
