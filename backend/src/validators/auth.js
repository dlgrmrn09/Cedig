import { z } from 'zod';
import { RESERVED_USERNAMES } from '../utils/username.js';

const usernameField = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_]{3,30}$/, 'Only letters, numbers, and underscores allowed')
  .refine((val) => !RESERVED_USERNAMES.has(val.toLowerCase()), 'This username is reserved');

export const emailLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required').transform((v) => v.toLowerCase().trim()),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const phoneLoginSchema = z.object({
  body: z.object({
    phone: z.string().min(8, 'Valid phone number is required'),
    countryCode: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const emailRegisterSchema = z.object({
  body: z.object({
    username: usernameField,
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Valid email is required').transform((v) => v.toLowerCase().trim()),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    agreeTerms: z.literal(true, { errorMap: () => ({ message: 'You must agree to terms' }) }),
    agreePrivacy: z.literal(true, { errorMap: () => ({ message: 'You must agree to privacy policy' }) }),
  }),
});

export const phoneRegisterSchema = z.object({
  body: z.object({
    username: usernameField,
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    countryCode: z.string(),
    phone: z.string().min(8, 'Valid phone number required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    agreeTerms: z.literal(true),
    agreePrivacy: z.literal(true),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required').transform((v) => v.toLowerCase().trim()),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email().transform((v) => v.toLowerCase().trim()),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().transform((v) => v.toLowerCase().trim()),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    token: z.string().min(1),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email().transform((v) => v.toLowerCase().trim()),
  }),
});

export const socialLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(1),
    provider: z.enum(['google', 'facebook']),
  }),
});
