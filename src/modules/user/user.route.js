import express from 'express';
import { userController } from './user.module.js';
import { userIdParamSchema } from './user.validation.js';
import { validateRequest } from '../../common/middleware/validate-request.js';

const router = express.Router();

router.get(
    '/:id',
    validateRequest({
        params: userIdParamSchema,
    }),
    userController.getUser,
);

export default router;
