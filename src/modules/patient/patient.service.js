import { ApiError } from '../../common/utils/api/api-error.js';

export class PatientService {
    constructor(patientRepository, userRepository) {
        this.patientRepository = patientRepository;

        this.userRepository = userRepository;
    }

    async createPatient(body) {
        // Check existing patient profile
        const alreadyCreated = await this.patientRepository.findOne({
            userId: body.userId,
        });

        if (alreadyCreated) {
            throw ApiError.badRequest(
                'Patient profile already exists for this user',
            );
        }

        // Validate age
        const age = Number(body.age);

        if (Number.isNaN(age)) {
            throw ApiError.badRequest('Age must be a valid number');
        }

        if (age < 0 || age > 120) {
            throw ApiError.badRequest('Age must be between 0 and 120');
        }

        // Validate height
        let height;

        if (body.height !== undefined) {
            height = Number(body.height);

            if (Number.isNaN(height) || height < 0) {
                throw ApiError.badRequest(
                    'Height must be a valid positive number',
                );
            }
        }

        // Validate weight
        let weight;

        if (body.weight !== undefined) {
            weight = Number(body.weight);

            if (Number.isNaN(weight) || weight < 0) {
                throw ApiError.badRequest(
                    'Weight must be a valid positive number',
                );
            }
        }

        const patient = await this.patientRepository.create({
            userId: body.userId,

            age,

            gender: body.gender,

            bloodGroup: body.bloodGroup,

            height,

            weight,

            allergies:
                body.allergies?.map((item) => item.trim())?.filter(Boolean) ??
                [],

            chronicDiseases:
                body.chronicDiseases
                    ?.map((item) => item.trim())
                    ?.filter(Boolean) ?? [],

            emergencyContact: {
                name: body.emergencyContact?.name?.trim(),

                phone: body.emergencyContact?.phone?.trim(),

                relation: body.emergencyContact?.relation?.trim(),
            },

            address: body.address?.trim(),
        });

        await this.userRepository.updateById(body.userId, {
            isRoleProfileCreated: true,

            profileId: patient._id,
        });

        return await this.patientRepository.findById(patient._id, {
            populate: ['userId'],
        });
    }

    async listPatients(query = {}) {
        const filter = {};

        // Gender filter
        if (query.gender) {
            filter.gender = query.gender;
        }

        // Blood group filter
        if (query.bloodGroup) {
            filter.bloodGroup = query.bloodGroup;
        }

        return this.patientRepository.findAll(filter, {
            populate: ['userId'],
        });
    }

    async getPatientById(id) {
        const patient = await this.patientRepository.findById(id, {
            populate: ['userId'],
        });

        if (!patient) {
            throw ApiError.notFound('Patient not found');
        }

        return patient;
    }

    async updatePatient(id, body) {
        await this.getPatientById(id);

        const update = {};

        // Age
        if (body.age !== undefined) {
            const age = Number(body.age);

            if (Number.isNaN(age) || age < 0 || age > 120) {
                throw ApiError.badRequest('Age must be between 0 and 120');
            }

            update.age = age;
        }

        // Gender
        if (body.gender !== undefined) {
            update.gender = body.gender;
        }

        // Blood Group
        if (body.bloodGroup !== undefined) {
            update.bloodGroup = body.bloodGroup;
        }

        // Height
        if (body.height !== undefined) {
            const height = Number(body.height);

            if (Number.isNaN(height) || height < 0) {
                throw ApiError.badRequest(
                    'Height must be a valid positive number',
                );
            }

            update.height = height;
        }

        // Weight
        if (body.weight !== undefined) {
            const weight = Number(body.weight);

            if (Number.isNaN(weight) || weight < 0) {
                throw ApiError.badRequest(
                    'Weight must be a valid positive number',
                );
            }

            update.weight = weight;
        }

        // Allergies
        if (body.allergies !== undefined) {
            update.allergies = body.allergies
                .map((item) => item.trim())
                .filter(Boolean);
        }

        // Chronic Diseases
        if (body.chronicDiseases !== undefined) {
            update.chronicDiseases = body.chronicDiseases
                .map((item) => item.trim())
                .filter(Boolean);
        }

        // Emergency Contact
        if (body.emergencyContact !== undefined) {
            update.emergencyContact = {
                name: body.emergencyContact?.name?.trim(),

                phone: body.emergencyContact?.phone?.trim(),

                relation: body.emergencyContact?.relation?.trim(),
            };
        }

        // Address
        if (body.address !== undefined) {
            update.address = body.address?.trim();
        }

        const updatedPatient = await this.patientRepository.updateById(
            id,
            {
                $set: update,
            },
            {
                new: true,
                runValidators: true,
            },
        );

        return await this.patientRepository.findById(updatedPatient._id, {
            populate: ['userId'],
        });
    }

    async deletePatient(id) {
        const patient = await this.getPatientById(id);

        await this.patientRepository.deleteById(id);

        await this.userRepository.updateById(patient.userId._id, {
            isRoleProfileCreated: false,
        });

        return true;
    }
}
