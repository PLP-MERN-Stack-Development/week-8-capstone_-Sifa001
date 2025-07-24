const express = require('express');
const { body, param, query } = require('express-validator');
const { authMiddleware, authorizeRole } = require('../middleware/auth');
const driverController = require('../controllers/driverController');

const router = express.Router();

// Driver authentication
router.post('/login',
  body('email').isEmail(),
  body('password').isString(),
  driverController.login
);

// Update driver online/offline status
router.put('/:id/status',
  authMiddleware,
  authorizeRole(['driver']),
  param('id').isMongoId(),
  body('status').isIn(['online', 'offline']),
  driverController.updateStatus
);

// Get assigned routes
router.get('/:id/routes',
  authMiddleware,
  authorizeRole(['driver']),
  param('id').isMongoId(),
  driverController.getAssignedRoutes
);

// Get earnings summary
router.get('/:id/earnings',
  authMiddleware,
  authorizeRole(['driver']),
  param('id').isMongoId(),
  query('period').isIn(['daily', 'weekly']),
  driverController.getEarnings
);

// Get driver feedback
router.get('/:id/feedback',
  authMiddleware,
  authorizeRole(['driver']),
  param('id').isMongoId(),
  driverController.getFeedback
);

// Get analytics
router.get('/:id/analytics',
  authMiddleware,
  authorizeRole(['driver']),
  param('id').isMongoId(),
  driverController.getAnalytics
);

// Update real-time GPS location
router.post('/location',
  authMiddleware,
  authorizeRole(['driver']),
  body('lat').isFloat(),
  body('lng').isFloat(),
  driverController.updateLocation
);

module.exports = router; 