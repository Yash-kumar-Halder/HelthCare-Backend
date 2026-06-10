import asyncHandler from '../../common/middleware/async-handler.js';
import { ApiError } from '../../common/utils/api/api-error.js';
import { ApiResponse } from '../../common/utils/api/api-response.js';

export default class DoctorController {
    constructor(doctorService) {
        this.doctorService = doctorService;
    }

    create = asyncHandler(async (req, res) => {
        const doctor = await this.doctorService.createDoctor({
            ...req.body,
            userId: req.auth.userId,
        });

        console.log('Doctor controller-userId: ', req.auth.userId);

        return ApiResponse.created(res, 'Doctor created successfully', doctor);
    });

    list = asyncHandler(async (req, res) => {
        const doctors = await this.doctorService.listDoctors(req.query);
        return ApiResponse.ok(res, 'Doctors fetched successfully', doctors);
    });

    getById = asyncHandler(async (req, res) => {
        const doctor = await this.doctorService.getDoctorById(
            req.params.doctorId,
        );
        return ApiResponse.ok(res, 'Doctor fetched successfully', doctor);
    });

    update = asyncHandler(async (req, res) => {
        console.log(req.body);

        const existingDoctor = await this.doctorService.getDoctorById(
            req.params.doctorId,
        );

        const isOwner =
            String(existingDoctor.userId._id) === String(req.auth.userId);

        const isAdmin = req.auth.role === 'ADMIN';

        if (!isOwner && !isAdmin) {
            throw ApiError.forbidden(
                'You are not allowed to update this doctor profile',
            );
        }

        const doctor = await this.doctorService.updateDoctor(
            req.params.doctorId,
            req.body,
        );

        return ApiResponse.ok(res, 'Doctor updated successfully', doctor);
    });

    remove = asyncHandler(async (req, res) => {
        const doctor = await this.doctorService.getDoctorById(
            req.params.doctorId,
        );

        const isOwner = String(doctor.userId._id) === String(req.auth.userId);

        const isAdmin = req.auth.role === 'ADMIN';

        if (!isOwner && !isAdmin) {
            // console.log('match: ', doctor.userId._id, '-', req.auth.userId);
            throw ApiError.forbidden(
                'You are not allowed to delete this doctor profile',
            );
        }

        await this.doctorService.deleteDoctor(req.params.doctorId);

        return ApiResponse.ok(res, 'Doctor deleted successfully');
    });

    approveDoctor = asyncHandler(async (req, res) => {
        const doctor = await this.doctorService.approveDoctor(
            req.params.doctorId,
        );

        return res.status(200).json({
            success: true,
            message: 'Doctor approved successfully',
            data: doctor,
        });
    });
    getDoctorSlotsByDate = asyncHandler(async (req, res) => {
        const { doctorId } = req.params;

        const { date } = req.query;

        const slots = await this.doctorService.getDoctorSlotsByDate(
            doctorId,
            date,
        );

        return ApiResponse.ok(
            res,
            'Available slots fetched successfully',
            slots,
        );
    });
}
