import express from 'express';
import { authController } from './auth.module.js';
import { requireAuth } from '../../common/middleware/require-auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);
router.post('/verify-email', authController.verifyEmail);
router.post(
    '/resend-verification',
    requireAuth,
    authController.resendVerification,
);

export default router;
