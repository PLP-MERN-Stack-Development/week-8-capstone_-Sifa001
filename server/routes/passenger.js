const express = require('express');
const { body, param } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
// Controllers to be implemented
const passengerController = require('../controllers/passengerController');

const router = express.Router();

// Save favorite route
router.post('/favorites',
  authMiddleware,
  body('routeId').isMongoId(),
  passengerController.saveFavoriteRoute
);

// Get user's favorite routes
router.get('/:id/favorites',
  authMiddleware,
  param('id').isMongoId(),
  passengerController.getFavoriteRoutes
);

// Submit feedback
router.post('/feedback',
  authMiddleware,
  body('routeId').optional().isMongoId(),
  body('driverId').optional().isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').isString(),
  passengerController.submitFeedback
);

// Get search/travel history
router.get('/:id/history',
  authMiddleware,
  param('id').isMongoId(),
  passengerController.getHistory
);

// Get upcoming trips for a passenger
router.get('/:id/upcoming-trips',
  authMiddleware,
  param('id').isMongoId(),
  passengerController.getUpcomingTrips
);

// Book a schedule (create booking)
router.post('/bookings',
  authMiddleware,
  passengerController.createBooking
);

module.exports = router; 