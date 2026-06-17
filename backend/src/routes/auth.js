import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { verifyRecaptcha } from '../middleware/recaptcha.js';
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

// Public routes protected by reCAPTCHA v3 + rate limiting
router.post('/login/email', authLimiter, verifyRecaptcha(), validate(emailLoginSchema), authController.loginWithEmail);
router.post('/login/phone', authLimiter, verifyRecaptcha(), validate(phoneLoginSchema), authController.loginWithPhone);
router.post('/register/email', authLimiter, verifyRecaptcha(), validate(emailRegisterSchema), authController.registerWithEmail);
router.post('/register/phone', authLimiter, verifyRecaptcha(), validate(phoneRegisterSchema), authController.registerWithPhone);
// Social login uses provider (Google/Facebook) attestation; reCAPTCHA not applied
router.post('/social', authLimiter, validate(socialLoginSchema), authController.socialLogin);
router.post('/forgot-password', authLimiter, verifyRecaptcha(), validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-otp', authLimiter, verifyRecaptcha(), validate(verifyOtpSchema), authController.verifyOtp);
router.post('/reset-password', authLimiter, verifyRecaptcha(), validate(resetPasswordSchema), authController.resetPassword);
router.post('/resend-otp', authLimiter, verifyRecaptcha(), validate(resendOtpSchema), authController.resendOtp);
router.post('/refresh', authLimiter, authController.refreshToken);
router.post('/logout', authenticate, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});
router.get('/me', authenticate, authController.getMe);

export default router;
