const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// Subscribe to route alerts
router.post('/subscribe',
  authMiddleware,
  body('routeId').isMongoId(),
  notificationController.subscribeToRoute
);

module.exports = router; 