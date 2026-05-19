import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: 'Email address is required',
            unique: true,
            trim: true,
            lowercare: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Please fill a valid email address',
            ],
        },
        password: {
            type: String,
            required: 'Password is required',
            select: false,
        },
        phone: {
            type: String,
            required: 'Phone number is required',
            unique: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
        },
        isRoleProfileCreated: {
            type: Boolean,
            default: false,
        },
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'SUSPENDED'],
            default: 'ACTIVE',
        },
        varificationToken: {
            type: String,
            select: false,
        },
        varificationTokenExpireAt: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true },
);

export const UserModel =
    mongoose.models.User || mongoose.model('User', userSchema);
