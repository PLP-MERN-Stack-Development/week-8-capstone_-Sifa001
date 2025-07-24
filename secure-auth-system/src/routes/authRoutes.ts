import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { rateLimitMiddleware } from '../middlewares/rateLimitMiddleware';
import { validationMiddleware } from '../middlewares/validationMiddleware';

const router = Router();
const authController = new AuthController();

// User registration
router.post('/register', validationMiddleware.validateRegistration, authController.register);

// User login
router.post('/login', validationMiddleware.validateLogin, authController.login);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);

// Password reset request
router.post('/reset-password', validationMiddleware.validateEmail, authController.requestPasswordReset);

// Password reset
router.post('/reset-password/:token', validationMiddleware.validatePasswordReset, authController.resetPassword);

// OAuth login
router.post('/oauth/google', authController.oauthGoogle);
router.post('/oauth/facebook', authController.oauthFacebook);

// Two-factor authentication for admin
router.post('/2fa/setup', authMiddleware.verifyToken, roleMiddleware.checkAdmin, authController.setupTwoFactor);
router.post('/2fa/verify', authMiddleware.verifyToken, roleMiddleware.checkAdmin, authController.verifyTwoFactor);

export default router;