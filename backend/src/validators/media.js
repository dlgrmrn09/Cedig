import { z } from 'zod';

export const createMediaSchema = z.object({
  body: z.object({
    treeId: z.string().uuid('Valid tree ID is required'),
    personId: z.string().uuid('Valid person ID is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().default(''),
    type: z.enum(['photo', 'document', 'certificate']),
    url: z.string().url('Valid URL is required').or(z.string().min(1)).optional(),
  }),
});

export const mediaIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateMediaSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});
