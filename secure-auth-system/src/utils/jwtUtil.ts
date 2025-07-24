import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { User } from '../models/userModel';
import { config } from '../config/index';

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

const JWT_SECRET = config.JWT_SECRET;
const JWT_EXPIRATION = config.JWT_EXPIRATION || '1h';
const REFRESH_TOKEN_EXPIRATION = config.REFRESH_TOKEN_EXPIRATION || '7d';

export const generateToken = async (user: User) => {
    const payload = { id: user.id, role: user.role };
    const token = await signAsync(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return token;
};

export const generateRefreshToken = async (user: User) => {
    const payload = { id: user.id, role: user.role };
    const refreshToken = await signAsync(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
    return refreshToken;
};

export const verifyToken = async (token: string) => {
    try {
        const decoded = await verifyAsync(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Token verification failed');
    }
};