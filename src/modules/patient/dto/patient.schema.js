import { z } from 'zod';

import { objectIdSchema } from '../../../common/utils/zod/object-id.schema.js';

export const createPatientBodySchema = z.object({
    userId: objectIdSchema,

    age: z.coerce.number().min(0).max(120),

    gender: z.enum(['Male', 'Female', 'Other']),

    bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),

    height: z.coerce.number().min(0).optional(),

    weight: z.coerce.number().min(0).optional(),

    allergies: z.array(z.string().trim()).optional(),

    chronicDiseases: z.array(z.string().trim()).optional(),

    address: z.string().max(500).optional(),

    emergencyContact: z
        .object({
            name: z.string().trim().optional(),

            phone: z.string().trim().optional(),

            relation: z.string().trim().optional(),
        })
        .optional(),
});

export const updatePatientBodySchema = createPatientBodySchema.partial();

export const patientIdParamSchema = z.object({
    patientId: objectIdSchema,
});
