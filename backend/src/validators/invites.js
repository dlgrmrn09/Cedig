import { z } from 'zod';

export const createInviteSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Valid user ID is required'),
    role: z.enum(['Editor', 'Viewer']),
  }),
});

export const updateInviteRoleSchema = z.object({
  body: z.object({
    role: z.enum(['Editor', 'Viewer']),
  }),
  params: z.object({
    inviteId: z.string().uuid(),
  }),
});

export const inviteParamSchema = z.object({
  params: z.object({
    inviteId: z.string().uuid(),
  }),
});
