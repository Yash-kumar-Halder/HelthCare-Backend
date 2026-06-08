import express from 'express';
import { patientController } from './patient.module.js';
import { admissionController } from '../admission/admission.module.js';
import { requireAuth } from '../../common/middleware/require-auth.js';
import { validateRequest } from '../../common/middleware/validate-request.js';
import {
    createPatientBodySchema,
    patientIdParamSchema,
    updatePatientBodySchema,
} from './dto/patient.schema.js';

const router = express.Router();

router.post(
    '/',
    requireAuth,
    validateRequest({ body: createPatientBodySchema }),
    patientController.create,
);

router.get('/', requireAuth, patientController.list);

router.get(
    '/:patientId/admissions',
    requireAuth,
    validateRequest({ params: patientIdParamSchema }),
    admissionController.listByPatientId,
);

router.get(
    '/:patientId',
    requireAuth,
    validateRequest({ params: patientIdParamSchema }),
    patientController.getById,
);

router.patch(
    '/:patientId',
    requireAuth,
    validateRequest({
        params: patientIdParamSchema,
        body: updatePatientBodySchema,
    }),
    patientController.update,
);

router.delete(
    '/:patientId',
    requireAuth,
    validateRequest({ params: patientIdParamSchema }),
    patientController.remove,
);

export default router;
