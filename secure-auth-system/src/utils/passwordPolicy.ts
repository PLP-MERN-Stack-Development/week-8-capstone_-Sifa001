export const PASSWORD_POLICY = {
    minLength: 8,
    maxLength: 20,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    disallowedPatterns: [
        '123456',
        'password',
        'qwerty',
        'abc123',
        'letmein',
        'iloveyou',
    ],
};

export const ACCOUNT_LOCKOUT_THRESHOLD = 5; // Number of failed login attempts before lockout
export const ACCOUNT_LOCKOUT_DURATION = 30 * 60 * 1000; // Lockout duration in milliseconds (30 minutes)

export const isPasswordValid = (password: string): boolean => {
    const { minLength, maxLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars, disallowedPatterns } = PASSWORD_POLICY;

    if (password.length < minLength || password.length > maxLength) {
        return false;
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
        return false;
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
        return false;
    }

    if (requireNumbers && !/[0-9]/.test(password)) {
        return false;
    }

    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return false;
    }

    if (disallowedPatterns.some(pattern => password.includes(pattern))) {
        return false;
    }

    return true;
};