const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^(\+254|0)[17]\d{8}$/).withMessage('Please provide a valid Kenyan phone number'),
  body('role').isIn(['driver', 'passenger']).withMessage('Role must be either driver or passenger'),
  body('licenseNumber').if(body('role').equals('driver')).notEmpty().withMessage('License number is required for drivers'),
  body('vehicleRegNumber').if(body('role').equals('driver')).notEmpty().withMessage('Vehicle registration number is required for drivers'),
  body('operatorName').if(body('role').equals('driver')).notEmpty().withMessage('Operator name is required for drivers')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;