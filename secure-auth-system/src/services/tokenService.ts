import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { jwtSecret, jwtExpiration, refreshTokenSecret, refreshTokenExpiration } from '../config';
import { v4 as uuidv4 } from 'uuid';

const refreshTokens: Map<string, string> = new Map();

export const generateAccessToken = (user: User) => {
    return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiration });
};

export const generateRefreshToken = (user: User) => {
    const refreshToken = uuidv4();
    refreshTokens.set(refreshToken, user.id);
    return refreshToken;
};

export const validateAccessToken = (token: string) => {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (error) {
        return null;
    }
};

export const validateRefreshToken = (token: string) => {
    const userId = refreshTokens.get(token);
    if (userId) {
        return userId;
    }
    return null;
};

export const revokeRefreshToken = (token: string) => {
    refreshTokens.delete(token);
};