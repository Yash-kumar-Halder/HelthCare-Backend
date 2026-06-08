import express from 'express';
import { appointmentController } from './appointment.controller.js';
import { requireAuth } from '../../common/middleware/require-auth.js';
import { populateUser } from '../../common/middleware/populate-user.js';
import { validateRequest } from '../../common/middleware/validate-request.js';
import {
    createAppointmentBodySchema,
    updateAppointmentBodySchema,
    acceptAppointmentBodySchema,
    rejectAppointmentBodySchema,
    cancelAppointmentBodySchema,
    appointmentIdParamSchema,
    listAppointmentsQuerySchema,
} from './appointment.schema.js';
import { authorize } from '../../common/middleware/authorize.js';

const router = express.Router();

// Get all appointments (with role-based filtering)
router.get(
    '/',
    requireAuth,
    populateUser,
    validateRequest({ query: listAppointmentsQuerySchema }),
    appointmentController.list,
);

// Get appointment stats
router.get(
    '/stats/overview',
    requireAuth,
    populateUser,
    appointmentController.getStats,
);

// Create appointment (patient only)
router.post(
    '/',
    requireAuth,
    populateUser,
    authorize('PATIENT'),
    validateRequest({ body: createAppointmentBodySchema }),
    appointmentController.create,
);

// Get specific appointment
router.get(
    '/:appointmentId',
    requireAuth,
    populateUser,
    validateRequest({ params: appointmentIdParamSchema }),
    appointmentController.getById,
);

// Update appointment (patient only, pending appointments)
router.patch(
    '/:appointmentId',
    requireAuth,
    populateUser,
    authorize('PATIENT'),
    validateRequest({
        params: appointmentIdParamSchema,
        body: updateAppointmentBodySchema,
    }),
    appointmentController.update,
);

// Accept appointment (doctor only)
router.patch(
    '/:appointmentId/accept',
    requireAuth,
    populateUser,
    authorize('DOCTOR'),
    validateRequest({
        params: appointmentIdParamSchema,
        body: acceptAppointmentBodySchema,
    }),
    appointmentController.accept,
);

// Reject appointment (doctor only)
router.patch(
    '/:appointmentId/reject',
    requireAuth,
    populateUser,
    authorize('DOCTOR'),
    validateRequest({
        params: appointmentIdParamSchema,
        body: rejectAppointmentBodySchema,
    }),
    appointmentController.reject,
);

// Cancel appointment (patient only)
router.patch(
    '/:appointmentId/cancel',
    requireAuth,
    populateUser,
    authorize('PATIENT'),
    validateRequest({
        params: appointmentIdParamSchema,
        body: cancelAppointmentBodySchema,
    }),
    appointmentController.cancel,
);

// Complete appointment (doctor only)
router.patch(
    '/:appointmentId/complete',
    requireAuth,
    populateUser,
    authorize('DOCTOR'),
    validateRequest({ params: appointmentIdParamSchema }),
    appointmentController.complete,
);

// Delete appointment (admin only)
router.delete(
    '/:appointmentId',
    requireAuth,
    populateUser,
    authorize('ADMIN'),
    validateRequest({ params: appointmentIdParamSchema }),
    appointmentController.delete,
);

export default router;
