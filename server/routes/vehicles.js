const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, authorizeRole } = require('../middleware/auth');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

// Log maintenance records
router.post('/maintenance',
  authMiddleware,
  authorizeRole(['driver']),
  body('vehicleId').isMongoId(),
  body('date').isISO8601(),
  body('type').isString(),
  body('description').optional().isString(),
  body('cost').isFloat({ min: 0 }),
  vehicleController.logMaintenance
);

module.exports = router; 