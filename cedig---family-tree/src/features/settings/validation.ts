import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(2, 'Нэр хамгийн багадаа 2 тэмдэгт байх ёстой'),
  lastName: z.string().min(2, 'Овог хамгийн багадаа 2 тэмдэгт байх ёстой'),
  username: z
    .string()
    .min(3, 'Хэрэглэгчийн нэр хамгийн багадаа 3 тэмдэгт байх ёстой')
    .regex(/^[a-zA-Z0-9_]+$/, 'Зөвхөн латин үсэг, тоо, доогуур зураас'),
});

export const emailSchema = z.object({
  email: z.string().email('Зөв и-мэйл хаяг оруулна уу'),
});

export const phoneSchema = z.object({
  phone: z.string().min(8, 'Утасны дугаараа зөв оруулна уу'),
  countryCode: z.string(),
});

export const contactSchema = z.object({
  email: z.string().email('Зөв и-мэйл хаяг оруулна уу'),
  phone: z.string().min(8, 'Утасны дугаараа зөв оруулна уу'),
  countryCode: z.string(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Одоогийн нууц үгээ оруулна уу'),
    newPassword: z
      .string()
      .min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Нууц үг таарахгүй байна',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Шинэ нууц үг одоогийн нууц үгээс ялгаатай байх ёстой',
    path: ['newPassword'],
  });

export type ProfileFormData = z.infer<typeof profileSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
