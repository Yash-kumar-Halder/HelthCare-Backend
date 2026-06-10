import { z } from 'zod';
import { objectIdSchema } from '../../../common/utils/zod/object-id.schema.js';

export const createDoctorBodySchema = z.object({
    department: z.enum([
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'General Medicine',
        'Dermatology',
        'ENT',
    ]),

    specialization: z.string().trim().min(2).max(120),

    consultationFee: z.coerce
        .number()
        .min(0, 'Consultation fee cannot be negative'),

    experience: z.coerce
        .number()
        .min(0, 'Experience cannot be negative')
        .max(60, 'Experience seems invalid'),

    qualifications: z
        .array(z.string().trim().min(1))
        .min(1, 'At least one qualification is required'),

    licenseId: z.string().trim().min(2).max(64),

    gender: z.enum(['Male', 'Female']),

    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateDoctorBodySchema = createDoctorBodySchema.partial();

export const doctorIdParamSchema = z.object({
    doctorId: objectIdSchema,
});

export const appointmentDateQuerySchema = z.object({
    date: z.string().min(1),
});

export const listDoctorsQuerySchema = z.object({
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),

    department: z.string().max(120).optional(),

    isVerified: z.enum(['true', 'false']).optional(),
});
