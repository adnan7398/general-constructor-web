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

  const email = 'Hassan123@gmail.com';
  let user = await User.findOne({ email });
  if (user) {
    console.log('Admin already exists:', user._id.toString());
    await mongoose.disconnect();
    return;
  }

  const newUser = new User({
    name: 'Hassan',
    email,
    password: 'Hassan@123',
    role: 'admin'
  });
  await newUser.save();
  console.log('Created admin:', newUser._id.toString());

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
