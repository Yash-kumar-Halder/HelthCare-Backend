import asyncHandler from '../../common/middleware/async-handler.js';
import { ApiResponse } from '../../common/utils/api/api-response.js';

export default class PatientController {
    constructor(patientService) {
        this.patientService = patientService;
    }

    create = asyncHandler(async (req, res) => {
        const patient = await this.patientService.createPatient(req.body);

        return ApiResponse.created(
            res,
            'Patient created successfully',
            patient,
        );
    });

    list = asyncHandler(async (req, res) => {
        const patients = await this.patientService.listPatients(req.query);

        return ApiResponse.ok(res, 'Patients fetched successfully', patients);
    });

    getById = asyncHandler(async (req, res) => {
        const patient = await this.patientService.getPatientById(
            req.params.patientId,
        );

        return ApiResponse.ok(res, 'Patient fetched successfully', patient);
    });

    update = asyncHandler(async (req, res) => {
        const patient = await this.patientService.updatePatient(
            req.params.patientId,
            req.body,
        );

        return ApiResponse.ok(res, 'Patient updated successfully', patient);
    });

    remove = asyncHandler(async (req, res) => {
        await this.patientService.deletePatient(req.params.patientId);

        return ApiResponse.ok(res, 'Patient deleted successfully');
    });
}
