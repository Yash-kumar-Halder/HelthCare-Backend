import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/api/api-error.js';

/**
 * Requires `Authorization: Bearer <accessToken>`.
 * Attaches decoded payload to `req.auth` (user id: `req.auth.userId`).
 */
export function requireAuth(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        console.log('no access token');
        return next(ApiError.unauthorized('Access token requireddddd'));
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        return next(ApiError.unauthorized('Access token required'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id ?? decoded.userId ?? decoded.sub;
        if (!userId) {
            return next(ApiError.unauthorized('Invalid token payload'));
        }
        req.auth = {
            userId: String(userId),
            role: decoded.role,
            sessionId: decoded.sessionId,
            raw: decoded,
        };
        return next();
    } catch {
        return next(ApiError.unauthorized('Invalid or expired access token'));
    }
}
