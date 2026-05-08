import { ApiError } from '../utils/api/api-error.js';

/**
 * Usage:
 *
 * authorize('ADMIN')
 *
 * authorize('ADMIN', 'DOCTOR')
 *
 * authorize(['ADMIN', 'DOCTOR'])
 */
export function authorize(...roles) {
    // Support array also
    const allowedRoles = roles.flat();

    return (req, _res, next) => {
        // Check auth exists
        if (!req.auth) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        const userRole = req.auth.role;

        // No role found
        if (!userRole) {
            return next(ApiError.forbidden('Role not assigned'));
        }

        // Check authorization
        if (!allowedRoles.includes(userRole)) {
            return next(
                ApiError.forbidden(
                    'You are not authorized to access this resource',
                ),
            );
        }

        return next();
    };
}
