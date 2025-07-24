const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  regNumber: { type: String, required: true, unique: true, uppercase: true },
  model: { type: String, required: true },
  capacity: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maintenanceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Maintenance' }],
  fuelExpenses: [{ date: Date, amount: Number }]
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema); 