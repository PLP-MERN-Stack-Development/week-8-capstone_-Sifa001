import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { User } from '../models/userModel';
import { sendVerificationEmail } from '../services/emailService';
import { generateTwoFactorCode } from '../utils/twoFactorUtil';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async register(req: Request, res: Response): Promise<Response> {
        const { email, password, role } = req.body;
        const user = await this.authService.createUser(email, password, role);
        await sendVerificationEmail(user);
        return res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    }

    public async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        const tokens = await this.authService.login(email, password);
        return res.status(200).json(tokens);
    }

    public async verifyEmail(req: Request, res: Response): Promise<Response> {
        const { token } = req.params;
        const user = await this.authService.verifyEmail(token);
        return res.status(200).json({ message: 'Email verified successfully.', user });
    }

    public async resetPassword(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;
        await this.authService.sendPasswordResetEmail(email);
        return res.status(200).json({ message: 'Password reset email sent.' });
    }

    public async updatePassword(req: Request, res: Response): Promise<Response> {
        const { token, newPassword } = req.body;
        await this.authService.updatePassword(token, newPassword);
        return res.status(200).json({ message: 'Password updated successfully.' });
    }

    public async enableTwoFactor(req: Request, res: Response): Promise<Response> {
        const userId = req.user.id;
        const twoFactorCode = generateTwoFactorCode();
        await this.authService.enableTwoFactor(userId, twoFactorCode);
        return res.status(200).json({ message: 'Two-factor authentication enabled.', twoFactorCode });
    }

    public async verifyTwoFactor(req: Request, res: Response): Promise<Response> {
        const { code } = req.body;
        const isValid = await this.authService.verifyTwoFactor(req.user.id, code);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid two-factor code.' });
        }
        return res.status(200).json({ message: 'Two-factor code verified successfully.' });
    }
}