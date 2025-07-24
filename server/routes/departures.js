const express = require('express');
const { body, param } = require('express-validator');
const { authMiddleware, authorizeRole } = require('../middleware/auth');
const departureController = require('../controllers/departureController');

const router = express.Router();

// Real-time departure data
router.get('/live/:routeId',
  authMiddleware,
  param('routeId').isMongoId(),
  departureController.getLiveDepartures
);

// Log departure time and passenger count
router.post('/log',
  authMiddleware,
  authorizeRole(['driver']),
  body('routeId').isMongoId(),
  body('departureTime').isISO8601(),
  body('passengerCount').isInt({ min: 0 }),
  departureController.logDeparture
);

// Update current passenger capacity
router.put('/:id/capacity',
  authMiddleware,
  authorizeRole(['driver']),
  param('id').isMongoId(),
  body('capacity').isInt({ min: 0 }),
  departureController.updateCapacity
);

module.exports = router; 