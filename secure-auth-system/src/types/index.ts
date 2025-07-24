export interface User {
    id: string;
    email: string;
    password: string;
    role: 'passenger' | 'driver' | 'admin';
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthPayload {
    userId: string;
    role: 'passenger' | 'driver' | 'admin';
}

export interface Token {
    accessToken: string;
    refreshToken: string;
}

export interface PasswordResetRequest {
    email: string;
    token: string;
}

export interface EmailVerificationRequest {
    email: string;
    token: string;
}