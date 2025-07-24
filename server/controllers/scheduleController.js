const { validationResult } = require('express-validator');
const Schedule = require('../models/Schedule');
const Route = require('../models/Route');

// Get schedules
const getSchedules = async (req, res) => {
  try {
    const { routeId, date, status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (routeId) {
      query.routeId = routeId;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.departureTime = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    if (status) {
      query.status = status;
    }

    const schedules = await Schedule.find(query)
      .populate('routeId', 'routeName startLocation endLocation')
      .populate('driverId', 'name phone operatorName')
      .sort({ departureTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Schedule.countDocuments(query);

    res.json({
      success: true,
      data: {
        schedules,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single schedule
const getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('routeId')
      .populate('driverId', 'name phone operatorName');
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create schedule (Driver only)
const createSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Verify route exists
    const route = await Route.findById(req.body.routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Calculate estimated arrival time
    const departureTime = new Date(req.body.departureTime);
    const estimatedArrivalTime = new Date(departureTime.getTime() + route.estimatedDuration * 60000);

    const scheduleData = {
      ...req.body,
      driverId: req.user._id,
      vehicleRegNumber: req.user.vehicleRegNumber,
      estimatedArrivalTime,
      fare: req.body.fare || route.fare
    };

    const schedule = new Schedule(scheduleData);
    await schedule.save();

    // Populate the response
    await schedule.populate('routeId', 'routeName startLocation endLocation');
    await schedule.populate('driverId', 'name phone operatorName');

    // Emit real-time update
    req.io.to(`route-${req.body.routeId}`).emit('schedule-created', {
      schedule,
      message: 'New matatu schedule added'
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update schedule (Driver only - own schedules)
const updateSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const schedule = await Schedule.findOne({
      _id: req.params.id,
      driverId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found or access denied'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['actualDepartureTime', 'actualArrivalTime', 'status', 'passengerCount'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('routeId', 'routeName startLocation endLocation')
     .populate('driverId', 'name phone operatorName');

    // Emit real-time update
    req.io.to(`route-${updatedSchedule.routeId._id}`).emit('schedule-updated', {
      schedule: updatedSchedule,
      message: 'Schedule updated'
    });

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: { schedule: updatedSchedule }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete schedule (Driver only - own schedules)
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: req.params.id,
      driverId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found or access denied'
      });
    }

    // Emit real-time update
    req.io.to(`route-${schedule.routeId}`).emit('schedule-deleted', {
      scheduleId: schedule._id,
      message: 'Schedule cancelled'
    });

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
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
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
};