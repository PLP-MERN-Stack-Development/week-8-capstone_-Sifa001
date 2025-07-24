const mongoose = require('mongoose');
const User = require('./models/User');
let Passenger;
try {
  Passenger = require('./models/Passenger');
} catch (e) {
  Passenger = null;
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/YOUR_DB_NAME';

async function listUsers() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const users = await User.find();
  console.log('--- Users Collection ---');
  users.forEach(u => console.log(`User: ${u.email} | Role: ${u.role}`));
  if (Passenger) {
    const passengers = await Passenger.find();
    console.log('--- Passenger Collection ---');
    passengers.forEach(p => console.log(`Passenger: ${p.email} | Name: ${p.name}`));
  }
  await mongoose.disconnect();
}

listUsers().catch(err => {
  console.error('Error listing users:', err);
  process.exit(1);
}); 