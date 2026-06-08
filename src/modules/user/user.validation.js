import { z } from 'zod';

export const userIdParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user id'),
});

export const updateUserBodySchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    email: z.string().email().toLowerCase().optional(),
    phone: z.string().trim().min(1).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
});
