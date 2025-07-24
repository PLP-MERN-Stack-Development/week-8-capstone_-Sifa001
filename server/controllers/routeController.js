const { validationResult } = require('express-validator');
const Route = require('../models/Route');

// Get all routes
const getRoutes = async (req, res) => {
  try {
    const { search, startLocation, endLocation, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    // Add search filters
    if (search) {
      query.$or = [
        { routeName: { $regex: search, $options: 'i' } },
        { 'startLocation.name': { $regex: search, $options: 'i' } },
        { 'endLocation.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startLocation) {
      query['startLocation.name'] = { $regex: startLocation, $options: 'i' };
    }
    
    if (endLocation) {
      query['endLocation.name'] = { $regex: endLocation, $options: 'i' };
    }

    const routes = await Route.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Route.countDocuments(query);

    res.json({
      success: true,
      data: {
        routes,
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

// Get single route
const getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: { route }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create route (Driver only)
const createRoute = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const route = new Route(req.body);
    await route.save();

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: { route }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update route (Driver only)
const updateRoute = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      message: 'Route updated successfully',
      data: { route }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all routes (optionally filtered by isActive)
const getAllRoutes = async (req, res) => {
  try {
    const { isActive } = req.query;
    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    const routes = await Route.find(query);
    res.json({ success: true, data: routes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Search for a route by start and end stage IDs
const searchRoutes = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ success: false, message: 'Both from and to stage IDs are required.' });
    }
    const Stage = require('../models/Stage');
    // Find the stage documents for the given IDs
    const [startStage, endStage] = await Promise.all([
      Stage.findById(from),
      Stage.findById(to)
    ]);
    if (!startStage || !endStage) {
      return res.status(404).json({ success: false, message: 'Start or end stage not found.' });
    }
    // Find a route where startLocation and endLocation names match the selected stages
    const route = await Route.findOne({
      'startLocation.name': startStage.name,
      'endLocation.name': endStage.name,
      isActive: true
    });
    if (!route) {
      return res.status(404).json({ success: false, message: 'No route found for the selected stages.' });
    }
    res.json({ success: true, data: { route } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getRouteCapacity = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

module.exports = {
  getRoutes,
  getRoute,
  createRoute,
  updateRoute,
  searchRoutes,
  getRouteCapacity: exports.getRouteCapacity,
  getAllRoutes
};