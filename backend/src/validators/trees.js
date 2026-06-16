import { z } from 'zod';

export const createTreeSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Tree name must be at least 2 characters'),
    clanName: z.string().optional(),
  }),
});

export const joinTreeSchema = z.object({
  body: z.object({
    code: z.string().min(5, 'Valid invite code is required'),
  }),
});

export const treeIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateTreeSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    clanName: z.string().optional(),
    description: z.string().optional(),
    privacySetting: z.enum(['public', 'private', 'invite_only']).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});
