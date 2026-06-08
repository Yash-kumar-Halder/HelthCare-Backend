import express from 'express';
import { userController } from './user.module.js';
import { userIdParamSchema, updateUserBodySchema } from './user.validation.js';
import { requireAuth } from '../../common/middleware/require-auth.js';
import { validateRequest } from '../../common/middleware/validate-request.js';

const router = express.Router();

router.get('/', requireAuth, userController.list);

router.get('/me', requireAuth, userController.getMe);

router.get(
    '/:id',
    requireAuth,
    validateRequest({
        params: userIdParamSchema,
    }),
    userController.getUser,
);

router.patch(
    '/:id',
    requireAuth,
    validateRequest({
        params: userIdParamSchema,
        body: updateUserBodySchema,
    }),
    userController.update,
);

router.delete(
    '/:id',
    requireAuth,
    validateRequest({
        params: userIdParamSchema,
    }),
    userController.remove,
);

export default router;
