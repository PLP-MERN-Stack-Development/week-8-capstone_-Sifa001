const mongoose = require('mongoose');

const scheduleUpdateSchema = new mongoose.Schema({
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: [true, 'Schedule ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  updateType: {
    type: String,
    enum: ['departure', 'arrival', 'delay', 'cancellation', 'passenger_count'],
    required: [true, 'Update type is required']
  },
  message: {
    type: String,
    required: [true, 'Update message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
scheduleUpdateSchema.index({ scheduleId: 1, timestamp: -1 });

module.exports = mongoose.model('ScheduleUpdate', scheduleUpdateSchema);