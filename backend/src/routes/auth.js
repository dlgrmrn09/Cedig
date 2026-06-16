import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  emailLoginSchema,
  phoneLoginSchema,
  emailRegisterSchema,
  phoneRegisterSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  resendOtpSchema,
  socialLoginSchema,
} from '../validators/auth.js';

const router = Router();

router.post('/login/email', authLimiter, validate(emailLoginSchema), authController.loginWithEmail);
router.post('/login/phone', authLimiter, validate(phoneLoginSchema), authController.loginWithPhone);
router.post('/register/email', authLimiter, validate(emailRegisterSchema), authController.registerWithEmail);
router.post('/register/phone', authLimiter, validate(phoneRegisterSchema), authController.registerWithPhone);
router.post('/social', authLimiter, validate(socialLoginSchema), authController.socialLogin);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), authController.verifyOtp);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.post('/resend-otp', authLimiter, validate(resendOtpSchema), authController.resendOtp);
router.post('/refresh', authLimiter, authController.refreshToken);
router.post('/logout', authenticate, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});
router.get('/me', authenticate, authController.getMe);

export default router;
