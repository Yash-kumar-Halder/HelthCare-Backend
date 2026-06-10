import { UserModel } from '../../modules/user/user.model.js';
import { PatientRepository } from '../../modules/patient/patient.repository.js';
import { DoctorRepository } from '../../modules/doctor/doctor.repository.js';
import { ApiError } from '../utils/api/api-error.js';

const patientRepository = new PatientRepository();
const doctorRepository = new DoctorRepository();

/**
 * Populates req.user with user details, role, and profile information
 * Requires req.auth to be set by requireAuth middleware
 */
export async function populateUser(req, res, next) {
    try {
        if (!req.auth || !req.auth.userId) {
            return next(ApiError.unauthorized('User not authenticated'));
        }

        const user = await UserModel.findById(req.auth.userId).populate('role');

        if (!user) {
            return next(ApiError.notFound('User not found'));
        }

        req.user = {
            _id: user._id,
            userId: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role?.name || req.auth.role,
        };

        // Add profile-specific IDs based on role
        if (user.role?.name === 'PATIENT') {
            const patient = await patientRepository.findOne({
                userId: user._id,
            });
            if (patient) {
                req.user.patientId = patient._id;
            }
        } else if (user.role?.name === 'DOCTOR') {
            const doctor = await doctorRepository.findOne({ userId: user._id });
            if (doctor) {
                req.user.doctorId = doctor._id;
            }
        }

        return next();
    } catch (error) {
        return next(error);
    }
}
