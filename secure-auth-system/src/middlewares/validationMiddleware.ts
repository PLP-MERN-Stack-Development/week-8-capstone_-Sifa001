import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const validateRegistration = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[0-9]/)
        .withMessage('Password must contain a number')
        .matches(/[a-z]/)
        .withMessage('Password must contain a lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter')
        .matches(/[\W_]/)
        .withMessage('Password must contain a special character'),
    body('role').isIn(['passenger', 'driver', 'admin']).withMessage('Role must be one of: passenger, driver, admin'),
];

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
];

const validatePasswordReset = [
    body('email').isEmail().withMessage('Invalid email format'),
];

const validateEmailVerification = [
    body('token').notEmpty().withMessage('Verification token is required'),
];

const validateInput = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export {
    validateRegistration,
    validateLogin,
    validatePasswordReset,
    validateEmailVerification,
    validateInput,
};