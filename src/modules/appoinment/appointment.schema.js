import { z } from 'zod';

export const createAppointmentBodySchema = z.object({
    doctorId: z.string().min(1, 'Doctor ID is required'),

    appointmentDate: z
        .string()
        .date()
        .refine(
            (date) => {
                const selectedDate = new Date(date);

                const today = new Date();

                today.setHours(0, 0, 0, 0);

                selectedDate.setHours(0, 0, 0, 0);

                return selectedDate >= today;
            },
            {
                message: 'Appointment date cannot be in the past',
            },
        ),

    slot: z.object({
        startTime: z.string().min(1, 'Start time is required'),

        endTime: z.string().min(1, 'End time is required'),
    }),

    notes: z
        .string()
        .max(2000, 'Notes max 2000 characters')
        .optional()
        .default(''),
});

export const updateAppointmentBodySchema = z.object({
    appointmentDate: z
        .string()
        .datetime()
        .refine((date) => new Date(date) > new Date(), {
            message: 'Appointment date must be in the future',
        })
        .optional(),
    reason: z
        .string()
        .min(3, 'Reason must be at least 3 characters')
        .max(500, 'Reason max 500 characters')
        .optional(),
    notes: z.string().max(2000, 'Notes max 2000 characters').optional(),
});

export const acceptAppointmentBodySchema = z.object({
    notes: z
        .string()
        .max(2000, 'Notes max 2000 characters')
        .optional()
        .default(''),
});

export const rejectAppointmentBodySchema = z.object({
    rejectionReason: z
        .string()
        .min(3, 'Rejection reason must be at least 3 characters')
        .max(500, 'Rejection reason max 500 characters')
        .optional()
        .default(''),
});

export const cancelAppointmentBodySchema = z.object({
    cancellationReason: z
        .string()
        .min(3, 'Cancellation reason must be at least 3 characters')
        .max(500, 'Cancellation reason max 500 characters')
        .optional()
        .default(''),
});

export const appointmentIdParamSchema = z.object({
    appointmentId: z.string().min(1, 'Appointment ID is required'),
});

export const listAppointmentsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z
        .enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'])
        .optional(),
    sortBy: z.enum(['appointmentDate', 'createdAt']).default('appointmentDate'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
