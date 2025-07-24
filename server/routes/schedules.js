const express = require('express');
const { body } = require('express-validator');
const { getSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');
const { getScheduleUpdates, createScheduleUpdate } = require('../controllers/scheduleUpdateController');
const { authMiddleware, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const scheduleValidation = [
  body('routeId').isMongoId().withMessage('Valid route ID is required'),
  body('departureTime').isISO8601().withMessage('Valid departure time is required'),
  body('capacity').isInt({ min: 1, max: 25 }).withMessage('Capacity must be between 1 and 25'),
  body('fare').optional().isFloat({ min: 10 }).withMessage('Fare must be at least 10 KES')
];

const scheduleUpdateValidation = [
  body('actualDepartureTime').optional().isISO8601().withMessage('Valid departure time is required'),
  body('actualArrivalTime').optional().isISO8601().withMessage('Valid arrival time is required'),
  body('status').optional().isIn(['scheduled', 'departed', 'arrived', 'cancelled']).withMessage('Invalid status'),
  body('passengerCount').optional().isInt({ min: 0 }).withMessage('Passenger count must be non-negative')
];

const updateValidation = [
  body('updateType').isIn(['departure', 'arrival', 'delay', 'cancellation', 'passenger_count']).withMessage('Invalid update type'),
  body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message must be between 1 and 500 characters')
];

// Schedule routes
router.get('/', getSchedules);
router.get('/:id', getSchedule);
router.post('/', authMiddleware, authorizeRole(['driver']), scheduleValidation, createSchedule);
router.put('/:id', authMiddleware, authorizeRole(['driver']), scheduleUpdateValidation, updateSchedule);
router.delete('/:id', authMiddleware, authorizeRole(['driver']), deleteSchedule);

// Schedule update routes
router.get('/:scheduleId/updates', getScheduleUpdates);
router.post('/:scheduleId/updates', authMiddleware, updateValidation, createScheduleUpdate);

module.exports = router;