import { PatientRepository } from './patient.repository.js';
import { PatientService } from './patient.service.js';
import PatientController from './patient.controller.js';
import { UserRepository } from '../user/user.repository.js';

const patientRepository = new PatientRepository();
const userRepository = new UserRepository();
const patientService = new PatientService(patientRepository, userRepository);
const patientController = new PatientController(patientService);

export { patientController };
