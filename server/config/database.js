const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/matatu-scheduler';
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes
    await createIndexes();
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const Schedule = require('../models/Schedule');
    const Route = require('../models/Route');
    const ScheduleUpdate = require('../models/ScheduleUpdate');

    // Create performance indexes
    await Schedule.collection.createIndex({ routeId: 1, departureTime: 1 });
    await Schedule.collection.createIndex({ driverId: 1, createdAt: -1 });
    await Schedule.collection.createIndex({ status: 1, departureTime: 1 });
    
    await Route.collection.createIndex({ "startLocation.coordinates": "2dsphere" });
    await Route.collection.createIndex({ "endLocation.coordinates": "2dsphere" });
    
    await ScheduleUpdate.collection.createIndex({ scheduleId: 1, timestamp: -1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error.message);
  }
};

module.exports = connectDB;