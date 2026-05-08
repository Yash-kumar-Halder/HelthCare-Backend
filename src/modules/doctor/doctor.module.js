import { DoctorRepository } from './doctor.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { DoctorService } from './doctor.service.js';
import DoctorController from './doctor.controller.js';

const doctorRepository = new DoctorRepository();
const userRepository = new UserRepository();
const doctorService = new DoctorService(doctorRepository, userRepository);
const doctorController = new DoctorController(doctorService);

export { doctorController };
