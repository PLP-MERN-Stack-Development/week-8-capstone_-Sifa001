const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: [true, 'Route ID is required']
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Driver ID is required']
  },
  vehicleRegNumber: {
    type: String,
    required: [true, 'Vehicle registration number is required'],
    uppercase: true,
    trim: true
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Departure time must be in the future'
    }
  },
  actualDepartureTime: {
    type: Date
  },
  estimatedArrivalTime: {
    type: Date,
    required: [true, 'Estimated arrival time is required']
  },
  actualArrivalTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['scheduled', 'departed', 'arrived', 'cancelled'],
    default: 'scheduled'
  },
  passengerCount: {
    type: Number,
    default: 0,
    min: [0, 'Passenger count cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Vehicle capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [25, 'Capacity cannot exceed 25 passengers']
  },
  fare: {
    type: Number,
    required: [true, 'Fare is required'],
    min: [10, 'Fare must be at least 10 KES']
  }
}, {
  timestamps: true
});

// Indexes for performance
scheduleSchema.index({ routeId: 1, departureTime: 1 });
scheduleSchema.index({ driverId: 1, createdAt: -1 });
scheduleSchema.index({ status: 1, departureTime: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);