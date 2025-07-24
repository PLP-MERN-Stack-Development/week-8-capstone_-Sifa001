const Booking = require('../models/Booking');
const Schedule = require('../models/Schedule');

exports.saveFavoriteRoute = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

exports.getFavoriteRoutes = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

exports.submitFeedback = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

exports.getHistory = (req, res) => {
  return res.status(501).json({ message: 'Not implemented' });
};

exports.getUpcomingTrips = async (req, res) => {
  try {
    const passengerId = req.params.id;
    const now = new Date();
    const bookings = await Booking.find({
      passenger: passengerId,
      status: 'booked'
    })
      .populate({
        path: 'schedule',
        match: { departureTime: { $gte: now } },
        populate: { path: 'routeId', select: 'routeName startLocation endLocation' }
      })
      .sort({ createdAt: -1 });
    // Filter out bookings with no schedule (past trips)
    const upcoming = bookings.filter(b => b.schedule);
    res.json({ success: true, data: upcoming });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const passengerId = req.user._id;
    const { scheduleId } = req.body;
    if (!scheduleId) {
      return res.status(400).json({ success: false, message: 'Schedule ID is required.' });
    }
    // Prevent duplicate booking
    const existing = await Booking.findOne({ passenger: passengerId, schedule: scheduleId, status: 'booked' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already booked this trip.' });
    }
    // Check schedule exists
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found.' });
    }
    // Create booking
    const booking = new Booking({ passenger: passengerId, schedule: scheduleId });
    await booking.save();
    await booking.populate({ path: 'schedule', populate: { path: 'routeId', select: 'routeName startLocation endLocation' } });
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}; 