const mongoose = require('mongoose');

const systemMetricsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  activeDrivers: { type: Number, default: 0 },
  activePassengers: { type: Number, default: 0 },
  totalRoutes: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  tripsToday: { type: Number, default: 0 },
  systemHealth: { type: String, default: 'Unknown' },
  kpis: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('SystemMetrics', systemMetricsSchema); 