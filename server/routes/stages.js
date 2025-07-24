const express = require('express');
const { query } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const stageController = require('../controllers/stageController');

const router = express.Router();

// Find nearby matatu stages
router.get('/nearby',
  authMiddleware,
  query('lat').isFloat(),
  query('lng').isFloat(),
  stageController.getNearbyStages
);

// Add this endpoint to return all stages
router.get('/', require('../controllers/stageController').getAllStages);

module.exports = router; 