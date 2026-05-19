import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        age: {
            type: Number,
            required: true,
            min: [0, 'Age cannot be negative'],
            max: [120, 'Invalid age'],
        },

        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
        },

        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },

        height: {
            type: Number,
            min: [0, 'Height cannot be negative'],
        },

        weight: {
            type: Number,
            min: [0, 'Weight cannot be negative'],
        },

        allergies: [
            {
                type: String,
                trim: true,
            },
        ],

        chronicDiseases: [
            {
                type: String,
                trim: true,
            },
        ],

        emergencyContact: {
            name: {
                type: String,
                trim: true,
            },

            phone: {
                type: String,
                trim: true,
            },

            relation: {
                type: String,
                trim: true,
            },
        },

        address: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true },
);

export const PatientModel =
    mongoose.models.Patient || mongoose.model('Patient', patientSchema);
