const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }],
  history: [{
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    searchedAt: { type: Date, default: Date.now },
    travelDate: Date
  }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
}, { timestamps: true });

module.exports = mongoose.model('Passenger', passengerSchema); 