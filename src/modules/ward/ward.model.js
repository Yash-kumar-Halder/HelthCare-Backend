import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: [120, 'Name max 120 characters'],
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            maxlength: [32, 'Code max 32 characters'],
        },
        floor: {
            type: Number,
            default: null,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
        },
    },
    { timestamps: true },
);

export const WardModel =
    mongoose.models.Ward || mongoose.model('Ward', wardSchema);
