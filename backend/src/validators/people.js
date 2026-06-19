import { z } from 'zod';

export const createPersonSchema = z.object({
  body: z.object({
    treeId: z.string().uuid('Invalid tree ID'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    surname: z.string().optional(),
    clanName: z.string().default(''),
    birthPlace: z.string().default(''),
    residence: z.string().optional(),
    citizenship: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    title: z.string().optional(),
    employment: z.string().optional(),
    biography: z.string().optional(),
    zodiacSign: z.string().optional(),
    birthYear: z.number().int().min(1800).max(2100).default(1980),
    birthDate: z.string().optional(),
    deathDate: z.string().optional().nullable(),
    gender: z.enum(['male', 'female']),
    occupation: z.string().optional(),
    education: z.string().optional(),
    awards: z.array(z.string()).optional(),
    notes: z.string().optional(),
    customFields: z.record(z.string(), z.unknown()).optional(),
    relationshipLabel: z.enum(['DIRECT LINE', 'HEAD OF CLAN', 'MATRIARCH', 'DESCENDANT', 'SPOUSE', 'RELATIVE']).default('RELATIVE'),
    avatarUrl: z.string().url().optional().nullable(),
    fatherId: z.string().uuid().optional().nullable(),
    motherId: z.string().uuid().optional().nullable(),
    spouseId: z.string().uuid().optional().nullable(),
  }),
});

export const updatePersonSchema = z.object({
  body: z.object({
    treeId: z.string().uuid('Invalid tree ID').optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    surname: z.string().optional(),
    clanName: z.string().optional(),
    birthPlace: z.string().optional(),
    residence: z.string().optional(),
    citizenship: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    title: z.string().optional(),
    employment: z.string().optional(),
    biography: z.string().optional().nullable(),
    zodiacSign: z.string().optional().nullable(),
    birthYear: z.number().int().min(1800).max(2100).optional(),
    birthDate: z.string().optional().nullable(),
    deathDate: z.string().optional().nullable(),
    gender: z.enum(['male', 'female']).optional(),
    occupation: z.string().optional().nullable(),
    education: z.string().optional().nullable(),
    awards: z.array(z.string()).optional(),
    notes: z.string().optional().nullable(),
    customFields: z.record(z.string(), z.unknown()).optional(),
    relationshipLabel: z.enum(['DIRECT LINE', 'HEAD OF CLAN', 'MATRIARCH', 'DESCENDANT', 'SPOUSE', 'RELATIVE']).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    fatherId: z.string().uuid().optional().nullable(),
    motherId: z.string().uuid().optional().nullable(),
    spouseId: z.string().uuid().optional().nullable(),
    verified: z.boolean().optional(),
    pendingOralHistory: z.boolean().optional(),
  }).partial(),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const personIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getPeopleQuerySchema = z.object({
  query: z.object({
    treeId: z.string().uuid().optional(),
    clan: z.string().optional(),
    search: z.string().optional(),
    gender: z.enum(['male', 'female']).optional(),
    verified: z.string().optional(),
    birthYearFrom: z.string().optional(),
    birthYearTo: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
    order: z.string().optional(),
  }),
});
