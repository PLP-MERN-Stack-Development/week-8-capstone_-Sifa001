import { User } from '../models/userModel';
import { generateToken, verifyToken } from '../utils/jwtUtil';
import { hashPassword, comparePassword } from '../utils/bcryptUtil';
import { sendVerificationEmail, sendRecoveryEmail } from './emailService';
import { createRefreshToken, verifyRefreshToken } from './tokenService';
import { PasswordPolicy } from '../utils/passwordPolicy';

export class AuthService {
    async register(email: string, password: string): Promise<User> {
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'passenger',
            isVerified: false,
        });
        await newUser.save();
        await sendVerificationEmail(email);
        return newUser;
    }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await User.findOne({ email });
        if (!user || !(await comparePassword(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        if (!user.isVerified) {
            throw new Error('Email not verified');
        }
        const accessToken = generateToken(user);
        const refreshToken = createRefreshToken(user);
        return { accessToken, refreshToken };
    }

    async verifyEmail(token: string): Promise<void> {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);
        if (user) {
            user.isVerified = true;
            await user.save();
        }
    }

    async resetPassword(email: string, newPassword: string): Promise<void> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        user.password = await hashPassword(newPassword);
        await user.save();
        await sendRecoveryEmail(email);
    }

    async recoverAccount(email: string): Promise<void> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        await sendRecoveryEmail(email);
    }
}