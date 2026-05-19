import { AccessToken } from '../../common/utils/token/access-token.js';
import bcrypt from 'bcrypt';
import { UserResponseDTO } from '../user/dto/user-response.dto.js';
import { RefreshToken } from '../../common/utils/token/refresh-token.js';
import { Hash } from '../../common/utils/token/hash.js';
import { SessionModel } from '../session/session.model.js';
import { ApiError } from '../../common/utils/api/api-error.js';

export class AuthService {
    constructor(userService, sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;
    }

    async register(data, meta = {}) {
        const user = await this.userService.createUser(data);
        return this._generateAuthResponse(user, meta);
    }

    async login({ email, password }, meta = {}) {
        const { ipAddress = null, userAgent = null } = meta;

        // 1. Find user
        const user = await this.userService.findByEmail(email, {
            populate: ['Role'],
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // 4. Generate tokens + session
        return this._generateAuthResponse(user, {
            ipAddress,
            userAgent,
        });
    }
    async logout({ sessionId, meta = {} }) {
        if (!sessionId || !meta.userAgent) {
            throw ApiError.badRequest('Session not found.');
        }
        return await this.sessionService.revokeSessionById(sessionId);
    }

    async refreshTokens(refreshToken, meta = {}) {
        if (!refreshToken) {
            throw new Error('Refresh token missing');
        }

        const { ipAddress = null, userAgent = null } = meta;

        const decoded = RefreshToken.verifyRefreshToken(refreshToken);

        const { sessionId } = decoded;

        const session = await this.sessionService.getSessionById(sessionId);

        if (
            !session ||
            session.isRevoked ||
            session.tokenExpireAt < new Date()
        ) {
            throw new Error('Invalid or expired session');
        }

        const isValid = await Hash.compare(
            refreshToken,
            session.refreshTokenHash,
        );

        if (!isValid) {
            session.isRevoked = true;

            await session.save();

            throw new Error('Refresh token reuse detected');
        }

        /*
         Populate user
        */
        const user = await this.userService.findById(session.user, {
            populate: ['Role'],
        });

        if (!user) {
            throw new Error('User not found');
        }

        /*
         Rotate refresh token
        */
        const newRefreshToken = RefreshToken.generateRefreshToken(
            {
                userId: user._id,
                sessionId,
            },
            '7d',
        );

        /*
         Generate new access token
        */
        const newAccessToken = AccessToken.generateAccessToken(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role.name,
                sessionId: session._id,
            },
            '15m',
        );

        /*
         Update session
        */
        session.refreshTokenHash = await Hash.hash(newRefreshToken);

        session.tokenExpireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        session.ipAddress = ipAddress;

        session.userAgent = userAgent;

        await session.save();

        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },

            accessToken: newAccessToken,

            refreshToken: newRefreshToken,
        };
    }

    async _generateAuthResponse(user, meta = {}) {
        const { ipAddress = null, userAgent = null } = meta;

        const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // delete old session for this device
        await this.sessionService.deleteSessionByUserDevice(
            user._id,
            userAgent,
        );

        // create session instance (NOT saved yet)
        const session = new SessionModel({
            user: user._id,
            ipAddress,
            userAgent,
            tokenExpireAt: expireAt,
        });

        // generate refresh token
        const refreshToken = RefreshToken.generateRefreshToken(
            { userId: user._id, sessionId: session._id },
            '7d',
        );

        // hash + save
        session.refreshTokenHash = await Hash.hash(refreshToken);
        await session.save();

        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role.name,
            sessionId: session._id,
        };

        const accessToken = AccessToken.generateAccessToken(payload, '15m');

        return {
            user: user,
            accessToken,
            refreshToken,
            cookieOptions: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
                path: '/api/auth',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            },
        };
    }
}
