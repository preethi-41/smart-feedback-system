import mongoose from 'mongoose';
import User from './src/models/User.js';

async function clearUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/smart_feedback');
    await User.deleteMany({});
    console.log('All users deleted');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clearUsers();
