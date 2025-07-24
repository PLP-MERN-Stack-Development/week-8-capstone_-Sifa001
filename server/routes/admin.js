const express = require('express');
const { body, param, query } = require('express-validator');
const { authMiddleware, authorizeRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// System overview metrics
router.get('/dashboard', authMiddleware, authorizeRole(['admin']), adminController.getDashboard);

// User management
router.get('/users', authMiddleware, authorizeRole(['admin']), adminController.getUsers);

// Create/approve new routes
router.post('/routes', authMiddleware, authorizeRole(['admin']), body('name').isString(), adminController.createRoute);

// Usage analytics
router.get('/analytics/usage', authMiddleware, authorizeRole(['admin']), query('period').isIn(['daily', 'weekly', 'monthly']), adminController.getUsageAnalytics);

// Revenue reports
router.get('/reports/revenue', authMiddleware, authorizeRole(['admin']), query('from').isISO8601(), query('to').isISO8601(), adminController.getRevenueReport);

// Verify driver
router.put('/drivers/:id/verify', authMiddleware, authorizeRole(['admin']), param('id').isMongoId(), adminController.verifyDriver);

// Moderate feedback
router.delete('/feedback/:id', authMiddleware, authorizeRole(['admin']), param('id').isMongoId(), adminController.deleteFeedback);

// System health monitoring
router.get('/system/health', authMiddleware, authorizeRole(['admin']), adminController.getSystemHealth);

// Send system notifications
router.post('/notifications/broadcast', authMiddleware, authorizeRole(['admin']), body('message').isString(), adminController.broadcastNotification);

// Pending stage approvals
router.get('/stages/pending', authMiddleware, authorizeRole(['admin']), adminController.getPendingStages);

// Export system data
router.post('/data/export', authMiddleware, authorizeRole(['admin']), query('type').isString(), adminController.exportData);

// System error logs
router.get('/logs', authMiddleware, authorizeRole(['admin']), query('level').optional().isString(), query('date').optional().isString(), adminController.getLogs);

module.exports = router; 