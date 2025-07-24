const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true,
    maxlength: [100, 'Route name cannot exceed 100 characters']
  },
  startLocation: {
    name: {
      type: String,
      required: [true, 'Start location name is required'],
      trim: true
    },
    coordinates: {
      type: [Number],
      required: [true, 'Start location coordinates are required'],
      validate: {
        validator: function(v) {
          return v.length === 2 && v[0] >= -90 && v[0] <= 90 && v[1] >= -180 && v[1] <= 180;
        },
        message: 'Coordinates must be [latitude, longitude] with valid ranges'
      }
    }
  },
  endLocation: {
    name: {
      type: String,
      required: [true, 'End location name is required'],
      trim: true
    },
    coordinates: {
      type: [Number],
      required: [true, 'End location coordinates are required'],
      validate: {
        validator: function(v) {
          return v.length === 2 && v[0] >= -90 && v[0] <= 90 && v[1] >= -180 && v[1] <= 180;
        },
        message: 'Coordinates must be [latitude, longitude] with valid ranges'
      }
    }
  },
  distance: {
    type: Number,
    required: [true, 'Distance is required'],
    min: [0.1, 'Distance must be at least 0.1 km']
  },
  estimatedDuration: {
    type: Number,
    required: [true, 'Estimated duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  fare: {
    type: Number,
    required: [true, 'Fare is required'],
    min: [10, 'Fare must be at least 10 KES']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
routeSchema.index({ "startLocation.coordinates": "2dsphere" });
routeSchema.index({ "endLocation.coordinates": "2dsphere" });

module.exports = mongoose.model('Route', routeSchema);