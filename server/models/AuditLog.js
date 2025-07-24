const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  targetType: { type: String },
  targetId: { type: String },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now },
  level: { type: String, enum: ['info', 'warning', 'error'], default: 'info' }
});

module.exports = mongoose.model('AuditLog', auditLogSchema); 