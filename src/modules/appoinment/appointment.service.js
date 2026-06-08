import { appointmentRepository } from './appointment.repository.js';

export class AppointmentService {
    constructor(patientRepository, doctorRepository, appointmentRepository) {
        this.patientRepository = patientRepository;

        this.doctorRepository = doctorRepository;

        this.appointmentRepository = appointmentRepository;
    }

    async createAppointment(userId, appointmentData) {
        const { doctorId, appointmentDate, slot, notes = '' } = appointmentData;

        // Find patient profile using logged-in user id
        const patient = await this.patientRepository.findOne({
            userId,
        });
        console.log(userId, patient);

        if (!patient) {
            throw new Error('Patient profile not found');
        }

        const patientId = patient._id;

        // Verify doctor exists
        const doctor = await this.doctorRepository.findById(doctorId);

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        // Verify doctor active
        if (doctor.status !== 'ACTIVE') {
            throw new Error('Doctor is not active');
        }

        // Verify doctor verified
        if (!doctor.isVerified) {
            throw new Error('Doctor is not verified');
        }

        // Validate appointment date
        const parsedAppointmentDate = new Date(appointmentDate);

        if (Number.isNaN(parsedAppointmentDate.getTime())) {
            throw new Error('Invalid appointment date');
        }

        // Normalize date
        parsedAppointmentDate.setHours(0, 0, 0, 0);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        // Prevent past booking
        if (parsedAppointmentDate < today) {
            throw new Error('Appointment date cannot be in the past');
        }

        // Validate slot
        if (!slot || !slot.startTime || !slot.endTime) {
            throw new Error('Slot is required');
        }

        // Check already booked
        const existingAppointment = await this.appointmentRepository.findOne({
            doctorId,

            appointmentDate: parsedAppointmentDate,

            'slot.startTime': slot.startTime,

            'slot.endTime': slot.endTime,

            status: {
                $in: ['PENDING', 'ACCEPTED'],
            },
        });

        if (existingAppointment) {
            throw new Error('Selected slot is already booked');
        }

        // Create appointment
        const appointment = await this.appointmentRepository.create({
            patientId,

            doctorId,

            appointmentDate: parsedAppointmentDate,

            slot: {
                startTime: slot.startTime,

                endTime: slot.endTime,
            },

            notes,

            status: 'PENDING',
        });

        return appointment;
    }

    async getPatientAppointments(patientId, query) {
        const result = await appointmentRepository.findByPatientId(
            patientId,
            query,
        );
        return result.appointments;
    }

    async getDoctorAppointments(doctorId, query) {
        const result = await appointmentRepository.findByDoctorId(
            doctorId,
            query,
        );
        return result.appointments;
    }

    async getAllAppointments(query) {
        const result = await appointmentRepository.findAll(query);
        return result;
    }

    async getAppointmentById(appointmentId) {
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment;
    }

    async updateAppointment(appointmentId, updateData) {
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        if (appointment.status !== 'PENDING') {
            throw new Error('Can only update pending appointments');
        }

        if (updateData.appointmentDate) {
            const newDate = new Date(updateData.appointmentDate);
            if (newDate <= new Date()) {
                throw new Error('Appointment date must be in the future');
            }
        }

        const updated = await appointmentRepository.update(
            appointmentId,
            updateData,
        );
        return updated;
    }

    async acceptAppointment(appointmentId, doctorId, notes = '') {
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        // Verify doctor is the one accepting their own appointment
        if (appointment.doctorId._id.toString() !== doctorId) {
            throw new Error('Doctor can only accept their own appointments');
        }

        if (appointment.status !== 'PENDING') {
            throw new Error('Can only accept pending appointments');
        }

        const updated = await appointmentRepository.update(appointmentId, {
            status: 'ACCEPTED',
            notes: notes || appointment.notes,
        });

        return updated;
    }

    async rejectAppointment(appointmentId, doctorId, rejectionReason = '') {
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        // Verify doctor is the one rejecting their own appointment
        if (appointment.doctorId._id.toString() !== doctorId) {
            throw new Error('Doctor can only reject their own appointments');
        }

        if (appointment.status !== 'PENDING') {
            throw new Error('Can only reject pending appointments');
        }

        const updated = await appointmentRepository.update(appointmentId, {
            status: 'REJECTED',
            rejectionReason: rejectionReason || '',
        });

        return updated;
    }

    async cancelAppointment(appointmentId, patientId, cancellationReason = '') {
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        // Verify patient is the one cancelling their own appointment
        if (appointment.patientId._id.toString() !== patientId) {
            throw new Error('Patient can only cancel their own appointments');
        }

        if (
            appointment.status === 'COMPLETED' ||
            appointment.status === 'CANCELLED'
        ) {
            throw new Error(`Cannot cancel ${appointment.status} appointments`);
        }

        const updated = await appointmentRepository.update(appointmentId, {
            status: 'CANCELLED',
            cancellationReason: cancellationReason || '',
        });

        return updated;
    }

    async completeAppointment(appointmentId, doctorId) {
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        // Verify doctor is the one completing their own appointment
        if (appointment.doctorId._id.toString() !== doctorId) {
            throw new Error('Doctor can only complete their own appointments');
        }

        if (appointment.status !== 'ACCEPTED') {
            throw new Error('Can only complete accepted appointments');
        }

        const updated = await appointmentRepository.update(appointmentId, {
            status: 'COMPLETED',
        });

        return updated;
    }

    async deleteAppointment(appointmentId) {
        const appointment = await appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        await appointmentRepository.delete(appointmentId);
        return appointment;
    }

    async getAppointmentStats() {
        return appointmentRepository.getAppointmentStats();
    }

    async getDoctorAppointmentStats(doctorId) {
        return appointmentRepository.getDoctorAppointmentStats(doctorId);
    }
}

export const appointmentService = new AppointmentService();
