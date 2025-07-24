const Stage = require('../models/Stage');

exports.getNearbyStages = async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'Latitude and longitude are required.' });
  }
  try {
    // Find stages within 5km radius, sorted by distance
    const stages = await Stage.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 5000 // 5km
        }
      }
    }).limit(10);
    res.json({ success: true, data: { stages } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAllStages = async (req, res) => {
  try {
    const stages = await Stage.find();
    res.json({ success: true, data: stages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}; 