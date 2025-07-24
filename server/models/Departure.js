const mongoose = require('mongoose');

const departureSchema = new mongoose.Schema({
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  stage: { type: mongoose.Schema.Types.ObjectId, ref: 'Stage', required: true },
  departureTime: { type: Date, required: true },
  vehicleRegNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  passengerCount: { type: Number, default: 0 },
  fare: { type: Number, required: true },
  estimatedArrivalTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Departure', departureSchema); 