import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/admin.js';
import UserProfile from '../models/userprofile.js';

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Ensure there's an admin to set as `createdBy`
  let admin = await User.findOne({ email: 'seed-admin@example.com' });
  if (!admin) {
    admin = new User({
      name: 'Seed Admin',
      email: 'seed-admin@example.com',
      password: 'Admin@123',
      role: 'admin',
    });
    await admin.save();
    console.log('Created seed admin:', admin._id.toString());
  } else {
    console.log('Found existing admin:', admin._id.toString());
  }

  // Create the requested test user if not present
  const testEmail = 'Hassan123@gmail.com';
  let user = await UserProfile.findOne({ email: testEmail });
  if (user) {
    console.log('Test user already exists:', user._id.toString());
  } else {
    const newUser = new UserProfile({
      name: 'Hassan',
      role: 'Client',
      email: testEmail,
      password: 'Hassan@123',
      createdBy: admin._id,
    });
    await newUser.save();
    console.log('Created test user:', newUser._id.toString());
  }

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error creating test user:', err);
  process.exit(1);
});
