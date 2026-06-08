import { appointmentController } from './appointment.controller.js';
import { AppointmentService } from './appointment.service.js';
import { AppointmentRepository } from './appointment.repository.js';
import { DoctorRepository } from '../doctor/doctor.repository.js';
import { PatientRepository } from '../patient/patient.repository.js';

const patientRepository = new PatientRepository();
const doctorRepository = new DoctorRepository();
const appointmentRepository = new AppointmentRepository();
const appointmentService = new AppointmentService(
    patientRepository,
    doctorRepository,
    appointmentRepository,
);

export { appointmentController, appointmentService, appointmentRepository };
