import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRoutes from './src/modules/auth/auth.route.js';
import WardRoutes from './src/modules/ward/ward.route.js';
import RoomRoutes from './src/modules/room/room.route.js';
import BedRoutes from './src/modules/bed/bed.route.js';
import PatientRoutes from './src/modules/patient/patient.route.js';
import DoctorRoutes from './src/modules/doctor/doctor.route.js';
import AdmissionRoutes from './src/modules/admission/admission.route.js';
import errorHandler from './src/common/middleware/error-handler.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server running',
    });
});

app.use('/api/auth', AuthRoutes);
app.use('/api/wards', WardRoutes);
app.use('/api/rooms', RoomRoutes);
app.use('/api/beds', BedRoutes);
app.use('/api/patients', PatientRoutes);
app.use('/api/doctors', DoctorRoutes);
app.use('/api/admissions', AdmissionRoutes);

app.use(errorHandler);

export default app;
