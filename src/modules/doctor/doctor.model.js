import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        department: {
            type: String,
            required: true,
            enum: [
                'Cardiology',
                'Neurology',
                'Orthopedics',
                'Pediatrics',
                'General Medicine',
                'Dermatology',
                'ENT',
            ],
        },
        specialization: {
            type: String,
            required: true,
        },
        consultationFee: {
            type: Number,
            required: true,
            min: [0, 'Fee cannot be negative'],
            default: 0,
        },
        experience: {
            type: Number,
            required: true,
            min: [0, 'Experience cannot be negative'],
            max: [60, 'Experience seems invalid'],
            default: 0,
        },
        qualifications: {
            type: [
                {
                    type: String,
                    trim: true,
                },
            ],
            required: true,
            validate: {
                validator: (value) => value.length > 0,
                message: 'At least one qualification is required',
            },
        },
        licenseId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: [64, 'License id max 64 characters'],
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: true,
        },
    },
    { timestamps: true },
);

export const DoctorModel =
    mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
