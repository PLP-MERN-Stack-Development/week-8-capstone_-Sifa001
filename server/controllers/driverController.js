const Feedback = require('../models/Feedback');

exports.login = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

exports.updateStatus = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

exports.getAssignedRoutes = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

exports.getEarnings = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

exports.getFeedback = async (req, res) => {
  try {
    const driverId = req.params.id;
    const feedbacks = await Feedback.find({ driver: driverId })
      .populate({ path: 'passenger', select: 'name' })
      .populate({ path: 'route', select: 'routeName' })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAnalytics = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

exports.updateLocation = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
}; 