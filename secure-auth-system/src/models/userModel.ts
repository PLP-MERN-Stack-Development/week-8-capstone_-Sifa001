import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    role: 'passenger' | 'driver' | 'admin';
    isVerified: boolean;
    verificationToken: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['passenger', 'driver', 'admin'],
        default: 'passenger',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const User = model<IUser>('User', userSchema);

export default User;