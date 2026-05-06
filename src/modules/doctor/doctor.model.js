import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: [80, 'First name max 80 characters'],
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: [80, 'Last name max 80 characters'],
        },
        department: {
            type: String,
            required: true,
            trim: true,
            maxlength: [120, 'Department max 120 characters'],
        },
        licenseId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: [64, 'License id max 64 characters'],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            maxlength: [120, 'Email max 120 characters'],
        },
        phone: {
            type: String,
            trim: true,
            maxlength: [20, 'Phone max 20 characters'],
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
        },
    },
    { timestamps: true },
);

export const DoctorModel =
    mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
