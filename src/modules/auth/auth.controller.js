import asyncHandler from '../../common/middleware/async-handler.js';
import { ApiError } from '../../common/utils/api/api-error.js';
import { ApiResponse } from '../../common/utils/api/api-response.js';
import { RefreshToken } from '../../common/utils/token/refresh-token.js';

export default class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register = asyncHandler(async (req, res) => {
        const meta = {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        };
        const result = await this.authService.register(req.body, meta);
        res.cookie('refreshToken', result.refreshToken, result.cookieOptions);
        return ApiResponse.created(res, 'User created successfully', result);
    });
    login = asyncHandler(async (req, res) => {
        const meta = {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        };
        const result = await this.authService.login(req.body, meta);
        res.cookie('refreshToken', result.refreshToken, result.cookieOptions);
        return ApiResponse.ok(res, 'Login successfull', result);
    });
    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw ApiError.badRequest('Refresh token missing');
        }

        // decode refresh token
        const decoded = await RefreshToken.verifyRefreshToken(refreshToken);
        console.log(decoded);
        const { sessionId } = decoded;

        const meta = {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        };

        await this.authService.logout({ sessionId, meta });

        // clear cookie (IMPORTANT: same options as set)
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
            path: '/api/auth',
        });

        return ApiResponse.ok(res, 'Logout successful');
    });
    refreshTokens = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new Error('Refresh token missing');
        }

        const meta = {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        };

        const result = await this.authService.refreshTokens(refreshToken, meta);

        return ApiResponse.ok(res, 'Tokens refreshed successfully', result);
    });
}
