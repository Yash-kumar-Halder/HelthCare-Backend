import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
            index: true,
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
            index: true,
        },

        appointmentDate: {
            type: Date,
            required: true,
            index: true,
        },

        slot: {
            startTime: {
                type: String,
                required: true,
            },

            endTime: {
                type: String,
                required: true,
            },
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [2000, 'Notes max 2000 characters'],
            default: '',
        },

        status: {
            type: String,
            enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
            default: 'PENDING',
            index: true,
        },

        cancellationReason: {
            type: String,
            trim: true,
            maxlength: [500, 'Cancellation reason max 500 characters'],
            default: '',
        },

        rejectionReason: {
            type: String,
            trim: true,
            maxlength: [500, 'Rejection reason max 500 characters'],
            default: '',
        },
    },
    {
        timestamps: true,
    },
);

appointmentSchema.index({
    patientId: 1,
    appointmentDate: -1,
});

appointmentSchema.index({
    doctorId: 1,
    appointmentDate: -1,
});

appointmentSchema.index({
    status: 1,
    appointmentDate: -1,
});

appointmentSchema.index(
    {
        doctorId: 1,
        appointmentDate: 1,
        'slot.startTime': 1,
        'slot.endTime': 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            status: {
                $in: ['PENDING', 'ACCEPTED'],
            },
        },
    },
);

export const AppointmentModel =
    mongoose.models.Appointment ||
    mongoose.model('Appointment', appointmentSchema);
