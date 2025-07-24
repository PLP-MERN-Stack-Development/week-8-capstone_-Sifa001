const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  period: { type: String, enum: ['daily', 'weekly'], required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Earnings', earningsSchema); 