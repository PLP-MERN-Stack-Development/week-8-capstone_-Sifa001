const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/YOUR_DB_NAME';

async function resetPassword(email, newPassword) {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found:', email);
    process.exit(1);
  }
  const hash = await bcrypt.hash(newPassword, 10);
  user.password = hash;
  await user.save();
  console.log(`Password for ${email} has been reset.`);
  await mongoose.disconnect();
}

const [,, email, newPassword] = process.argv;
if (!email || !newPassword) {
  console.error('Usage: node reset-user-password.js <email> <newPassword>');
  process.exit(1);
}
resetPassword(email, newPassword).catch(err => {
  console.error('Error resetting password:', err);
  process.exit(1);
}); 