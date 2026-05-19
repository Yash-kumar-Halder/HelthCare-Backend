import { ApiError } from '../../common/utils/api/api-error.js';

export class DoctorService {
    constructor(doctorRepository, userRepository) {
        this.doctorRepository = doctorRepository;

        this.userRepository = userRepository;
    }

    async createDoctor(body) {
        const exists = await this.doctorRepository.findOne({
            licenseId: body.licenseId.trim(),
        });

        if (exists) {
            throw ApiError.badRequest(
                'Doctor with this license id already exists',
            );
        }

        const alreadyCreated = await this.doctorRepository.findOne({
            userId: body.userId,
        });

        if (alreadyCreated) {
            throw ApiError.badRequest(
                'Doctor profile already exists for this user',
            );
        }

        // Validate consultation fee
        const consultationFee = Number(body.consultationFee);

        if (Number.isNaN(consultationFee)) {
            throw ApiError.badRequest(
                'Consultation fee must be a valid number',
            );
        }

        if (consultationFee < 0) {
            throw ApiError.badRequest('Consultation fee cannot be negative');
        }

        // Validate experience
        const experience = Number(body.experience);

        if (Number.isNaN(experience)) {
            throw ApiError.badRequest('Experience must be a valid number');
        }

        if (experience < 0 || experience > 60) {
            throw ApiError.badRequest('Experience must be between 0 and 60');
        }

        // Validate qualifications
        const qualifications = body.qualifications
            ?.map((item) => item.trim())
            ?.filter(Boolean);

        if (!qualifications?.length) {
            throw ApiError.badRequest('At least one qualification is required');
        }

        const doctor = await this.doctorRepository.create({
            userId: body.userId,

            department: body.department.trim(),

            specialization: body.specialization.trim(),

            consultationFee,

            experience,

            qualifications,

            licenseId: body.licenseId.trim(),

            gender: body.gender,

            status: body.status ?? 'ACTIVE',
        });

        await this.userRepository.updateById(body.userId, {
            isRoleProfileCreated: true,

            profileId: doctor._id,
        });

        return doctor;
    }

    async listDoctors(query = {}) {
        const filter = {};

        // Status filter
        if (query.status) {
            filter.status = query.status;
        }

        // Department filter
        if (query.department) {
            filter.department = new RegExp(
                query.department.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                'i',
            );
        }

        // Verification filter
        if (query.isVerified !== undefined) {
            filter.isVerified = query.isVerified === 'true';
        }

        return this.doctorRepository.findAll(filter, { populate: ['userId'] });
    }

    async getDoctorById(id) {
        const doctor = await this.doctorRepository.findById(id, {
            populate: ['userId'],
        });

        if (!doctor) {
            throw ApiError.notFound('Doctor not found');
        }

        return doctor;
    }

    async updateDoctor(id, body) {
        await this.getDoctorById(id);

        const update = {};

        // Department
        if (body.department !== undefined) {
            update.department = body.department.trim();
        }

        // Specialization
        if (body.specialization !== undefined) {
            update.specialization = body.specialization.trim();
        }

        // Consultation Fee
        if (body.consultationFee !== undefined) {
            update.consultationFee = Number(body.consultationFee);
        }

        // Experience
        if (body.experience !== undefined) {
            update.experience = Number(body.experience);
        }

        // Qualifications
        if (body.qualifications !== undefined) {
            update.qualifications = body.qualifications
                .map((item) => item.trim())
                .filter(Boolean);

            if (update.qualifications.length === 0) {
                throw ApiError.badRequest(
                    'At least one qualification is required',
                );
            }
        }

        // License ID
        if (body.licenseId !== undefined) {
            const licenseId = body.licenseId.trim();

            const clash = await this.doctorRepository.findOne({
                licenseId,
                _id: { $ne: id },
            });

            if (clash) {
                throw ApiError.badRequest('License id already in use');
            }

            update.licenseId = licenseId;
        }

        // Gender
        if (body.gender !== undefined) {
            update.gender = body.gender;
        }

        // Status
        if (body.status !== undefined) {
            update.status = body.status;
        }

        const updatedDoctor = await this.doctorRepository.updateById(
            id,
            {
                $set: update,
            },
            {
                new: true,
                runValidators: true,
            },
        );

        return updatedDoctor;
    }

    async deleteDoctor(id) {
        const doctor = await this.getDoctorById(id);

        await this.doctorRepository.deleteById(id);

        await this.userRepository.updateById(doctor.userId, {
            isRoleProfileCreated: false,
        });

        return true;
    }

    async approveDoctor(id) {
        const doctor = await this.doctorRepository.approveById(id);

        if (!doctor) {
            throw ApiError.notFound('Doctor not found');
        }

        return doctor;
    }
}
