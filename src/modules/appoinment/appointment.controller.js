import { appointmentService } from './appointment.module.js';

export class AppointmentController {
    constructor() {
        this.service = appointmentService;
    }

    create = async (req, res, next) => {
        try {
            const appointment = await this.service.createAppointment(
                req.user.userId,
                req.body,
            );

            return res.status(201).json({
                success: true,
                message: 'Appointment created successfully',
                data: appointment,
            });
        } catch (error) {
            return next(error);
        }
    };

    async list(req, res, next) {
        try {
            let result;

            console.log(req.user.role);

            if (req.user.role === 'PATIENT') {
                result = await appointmentService.getPatientAppointments(
                    req.user.patientId,
                    req.query,
                );
            } else if (req.user.role === 'DOCTOR') {
                result = await appointmentService.getDoctorAppointments(
                    req.user.doctorId.toString().toString(),
                    req.query,
                );
            } else if (req.user.role === 'ADMIN') {
                result = await appointmentService.getAllAppointments(req.query);
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Appointments retrieved successfully',
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const appointment = await appointmentService.getAppointmentById(
                req.params.appointmentId,
            );

            if (
                req.user.role === 'PATIENT' &&
                appointment.patientId._id.toString() !== req.user.patientId
            ) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            if (
                req.user.role === 'DOCTOR' &&
                appointment.doctorId._id.toString() !==
                    req.user.doctorId.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Appointment retrieved successfully',
                data: appointment,
            });
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        try {
            if (req.user.role !== 'PATIENT') {
                return res.status(403).json({
                    success: false,
                    message: 'Only patients can update their appointments',
                });
            }

            const appointment = await appointmentService.getAppointmentById(
                req.params.appointmentId,
            );

            if (appointment.patientId._id.toString() !== req.user.patientId) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            const updated = await appointmentService.updateAppointment(
                req.params.appointmentId,
                req.body,
            );

            return res.status(200).json({
                success: true,
                message: 'Appointment updated successfully',
                data: updated,
            });
        } catch (error) {
            return next(error);
        }
    }

    async accept(req, res, next) {
        try {
            if (req.user.role !== 'DOCTOR') {
                return res.status(403).json({
                    success: false,
                    message: 'Only doctors can accept appointments',
                });
            }

            const appointment = await appointmentService.acceptAppointment(
                req.params.appointmentId,
                req.user.doctorId.toString(),
                req.body.notes,
            );

            return res.status(200).json({
                success: true,
                message: 'Appointment accepted successfully',
                data: appointment,
            });
        } catch (error) {
            return next(error);
        }
    }

    async reject(req, res, next) {
        try {
            if (req.user.role !== 'DOCTOR') {
                return res.status(403).json({
                    success: false,
                    message: 'Only doctors can reject appointments',
                });
            }

            console.log('Doctor id', req.user.doctorId.toString().toString());

            const appointment = await appointmentService.rejectAppointment(
                req.params.appointmentId,
                req.user.doctorId.toString().toString(),
                req.body.rejectionReason,
            );

            return res.status(200).json({
                success: true,
                message: 'Appointment rejected successfully',
                data: appointment,
            });
        } catch (error) {
            return next(error);
        }
    }

    async cancel(req, res, next) {
        try {
            if (req.user.role !== 'PATIENT') {
                return res.status(403).json({
                    success: false,
                    message: 'Only patients can cancel their appointments',
                });
            }

            const appointment = await appointmentService.cancelAppointment(
                req.params.appointmentId,
                req.user.patientId,
                req.body.cancellationReason,
            );

            return res.status(200).json({
                success: true,
                message: 'Appointment cancelled successfully',
                data: appointment,
            });
        } catch (error) {
            return next(error);
        }
    }

    async complete(req, res, next) {
        try {
            if (req.user.role !== 'DOCTOR') {
                return res.status(403).json({
                    success: false,
                    message: 'Only doctors can complete appointments',
                });
            }

            const appointment = await appointmentService.completeAppointment(
                req.params.appointmentId,
                req.user.doctorId.toString(),
            );

            return res.status(200).json({
                success: true,
                message: 'Appointment completed successfully',
                data: appointment,
            });
        } catch (error) {
            return next(error);
        }
    }

    async delete(req, res, next) {
        try {
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: 'Only admin can delete appointments',
                });
            }

            await appointmentService.deleteAppointment(
                req.params.appointmentId,
            );

            return res.status(200).json({
                success: true,
                message: 'Appointment deleted successfully',
            });
        } catch (error) {
            return next(error);
        }
    }

    async getStats(req, res, next) {
        try {
            if (req.user.role === 'ADMIN') {
                const stats = await appointmentService.getAppointmentStats();
                res.status(200).json({
                    success: true,
                    message: 'Appointment stats retrieved successfully',
                    data: stats,
                });
            } else if (req.user.role === 'DOCTOR') {
                const stats =
                    await appointmentService.getDoctorAppointmentStats(
                        req.user.doctorId.toString(),
                    );
                res.status(200).json({
                    success: true,
                    message: 'Appointment stats retrieved successfully',
                    data: stats,
                });
            } else {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

export const appointmentController = new AppointmentController();
