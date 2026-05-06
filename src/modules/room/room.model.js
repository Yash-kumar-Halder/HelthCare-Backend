import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        wardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ward',
            required: true,
        },
        roomNumber: {
            type: String,
            required: true,
            trim: true,
            maxlength: [32, 'Room number max 32 characters'],
        },
        type: {
            type: String,
            enum: [
                'GENERAL',
                'ICU',
                'NICU',
                'PRIVATE',
                'SEMI_PRIVATE',
                'ISOLATION',
            ],
            default: 'GENERAL',
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
        },
    },
    { timestamps: true },
);

roomSchema.index({ wardId: 1, roomNumber: 1 }, { unique: true });

export const RoomModel =
    mongoose.models.Room || mongoose.model('Room', roomSchema);
