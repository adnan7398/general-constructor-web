import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/admin.js';

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'Hassan123@gmail.com' });
  if (user) {
    console.log('FOUND:', user._id.toString(), user.email, user.role);
  } else {
    console.log('NOT FOUND');
  }
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
