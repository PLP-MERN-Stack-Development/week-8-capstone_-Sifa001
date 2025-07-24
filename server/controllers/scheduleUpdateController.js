const { validationResult } = require('express-validator');
const ScheduleUpdate = require('../models/ScheduleUpdate');
const Schedule = require('../models/Schedule');

// Get schedule updates
const getScheduleUpdates = async (req, res) => {
  try {
    const updates = await ScheduleUpdate.find({ scheduleId: req.params.scheduleId })
      .populate('userId', 'name role')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      data: { updates }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create schedule update
const createScheduleUpdate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Verify schedule exists
    const schedule = await Schedule.findById(req.params.scheduleId);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    const updateData = {
      scheduleId: req.params.scheduleId,
      userId: req.user._id,
      updateType: req.body.updateType,
      message: req.body.message,
      isVerified: req.user.role === 'driver' && schedule.driverId.toString() === req.user._id.toString()
    };

    const scheduleUpdate = new ScheduleUpdate(updateData);
    await scheduleUpdate.save();

    await scheduleUpdate.populate('userId', 'name role');

    // Emit real-time update
    req.io.to(`route-${schedule.routeId}`).emit('schedule-update-added', {
      update: scheduleUpdate,
      scheduleId: schedule._id,
      message: `New update: ${req.body.message}`
    });

    res.status(201).json({
      success: true,
      message: 'Schedule update created successfully',
      data: { update: scheduleUpdate }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getScheduleUpdates,
  createScheduleUpdate
};