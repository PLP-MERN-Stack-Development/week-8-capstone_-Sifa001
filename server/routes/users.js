const express = require('express');
const { authMiddleware, authorizeRole } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// GET /api/users - List all users (admin only)
router.get(
  '/',
  authMiddleware,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json({ success: true, data: { users } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// GET /api/users/:id - Get single user (admin only)
router.get(
  '/:id',
  authMiddleware,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: { user } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// PUT /api/users/:id - Update user (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const { name, email, phone, role, isVerified } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, phone, role, isVerified },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, message: 'User updated successfully', data: { user } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// DELETE /api/users/:id - Delete user (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeRole(['admin']),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;