import { DoctorRepository } from './doctor.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { DoctorService } from './doctor.service.js';
import DoctorController from './doctor.controller.js';
import { appointmentRepository } from '../appoinment/appointment.repository.js';

const doctorRepository = new DoctorRepository();
const userRepository = new UserRepository();
const doctorService = new DoctorService(
    doctorRepository,
    userRepository,
    appointmentRepository,
);
const doctorController = new DoctorController(doctorService);

export { doctorController };
