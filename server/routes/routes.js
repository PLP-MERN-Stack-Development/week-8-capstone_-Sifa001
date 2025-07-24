const express = require('express');
const { query, param } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const routeController = require('../controllers/routeController');

const router = express.Router();

// Search available routes
router.get('/search',
  query('from').isMongoId(),
  query('to').isMongoId(),
  routeController.searchRoutes
);

// Add this endpoint to return all routes
router.get('/', require('../controllers/routeController').getAllRoutes);

// Get current matatu capacity
router.get('/:id/capacity',
  authMiddleware,
  param('id').isMongoId(),
  routeController.getRouteCapacity
);

module.exports = router;