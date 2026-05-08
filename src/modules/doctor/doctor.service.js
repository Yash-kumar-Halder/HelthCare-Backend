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

        console.log('User id: ', body.userId);

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

        const doctor = await this.doctorRepository.create({
            userId: body.userId,

            department: body.department.trim(),

            specialization: body.specialization.trim(),

            licenseId: body.licenseId.trim(),

            consultationFee: Number(body.consultationFee),

            experience: Number(body.experience),

            qualifications: body.qualifications,

            gender: body.gender,

            status: body.status ?? 'ACTIVE',
        });

        await this.userRepository.updateById(body.userId, {
            isRoleProfileCreated: true,
        });

        return doctor;
    }

    listDoctors(query = {}) {
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

        return this.doctorRepository.findAll(filter);
    }

    async getDoctorById(id) {
        const doctor = await this.doctorRepository.findById(id);
        if (!doctor) {
            throw ApiError.notFound('Doctor not found');
        }
        return doctor;
    }

    async updateDoctor(id, body) {
        await this.getDoctorById(id);
        const update = {};
        if (body.firstName !== undefined) {
            update.firstName = body.firstName.trim();
        }
        if (body.lastName !== undefined) {
            update.lastName = body.lastName.trim();
        }
        if (body.department !== undefined) {
            update.department = body.department.trim();
        }
        if (body.licenseId !== undefined) {
            const lid = body.licenseId.trim();
            const clash = await this.doctorRepository.findOne({
                licenseId: lid,
                _id: { $ne: id },
            });
            if (clash) {
                throw ApiError.badRequest('License id already in use');
            }
            update.licenseId = lid;
        }
        if (body.email !== undefined) {
            update.email = body.email?.trim().toLowerCase() ?? '';
        }
        if (body.phone !== undefined) {
            update.phone = body.phone?.trim() ?? '';
        }
        if (body.status !== undefined) {
            update.status = body.status;
        }

        return this.doctorRepository.updateById(id, { $set: update });
    }

    async deleteDoctor(id) {
        await this.getDoctorById(id);
        return this.doctorRepository.deleteById(id);
    }

    async approveDoctor(id) {
        // console.log('Doctor id for approve:', id);
        const doctor = await this.doctorRepository.approveById(id);

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        return doctor;
    }
}
