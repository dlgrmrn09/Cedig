import { z } from 'zod';
import { RESERVED_USERNAMES } from '../utils/username.js';

const usernameField = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_]{3,30}$/, 'Only letters, numbers, and underscores allowed')
  .refine((val) => !RESERVED_USERNAMES.has(val.toLowerCase()), 'This username is reserved');

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    username: usernameField,
  }),
});

export const updateEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
  }),
});

export const updatePhoneSchema = z.object({
  body: z.object({
    phone: z.string().min(8, 'Valid phone number is required'),
    countryCode: z.string(),
  }),
});

export const updateContactSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    phone: z.string().min(8, 'Valid phone number is required'),
    countryCode: z.string(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  }),
});

export const notificationPreferenceSchema = z.object({
  body: z.object({
    emailAlerts: z.boolean().optional(),
    inAppAlerts: z.boolean().optional(),
  }),
});
