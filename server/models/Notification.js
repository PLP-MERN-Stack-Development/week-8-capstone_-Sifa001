const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  type: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  // Admin notification fields
  recipients: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'recipientsModel' }],
  recipientsModel: { type: String, enum: ['User', 'AdminUser'], default: 'User' },
  isBroadcast: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema); 