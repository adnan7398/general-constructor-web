import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/admin.js';
import AdminMiddleware from '../middleware/adminmiddleware.js';

const profileRoutes = express.Router();
profileRoutes.use(express.json());
profileRoutes.use(AdminMiddleware);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get current user profile (from token)
profileRoutes.get('/me', async (req, res) => {
  try {
    console.error('Profile Route /me Hit'); // DEBUG FORCE
    console.error('req.user type:', typeof req.user); // DEBUG
    console.error('req.user keys:', req.user ? Object.keys(req.user) : 'null'); // DEBUG

    // Get user ID from the token (assuming it's stored in req.user by middleware)
    const userId = req.user?.id || req.user?._id || req.userId;

    if (!userId) {
      console.error('Profile Route: No userId found', { user: req.user, userId: req.userId }); // DEBUG
      return res.status(401).json({
        error: 'User not authenticated (No ID)',
        debug: {
          reqUser: !!req.user,
          reqUserId: req.userId,
          keys: req.user ? Object.keys(req.user) : []
        }
      });
    }

    const user = await User.findById(userId).select('-password');
    console.error('Profile Route: DB Lookup for', userId, user ? 'Found' : 'Not Found'); // DEBUG

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update current user profile
profileRoutes.put('/me', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { name, phone, email, address, notes } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (address) user.address = address;
    if (notes) user.notes = notes;

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: 'Profile updated successfully', user: userResponse });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Upload profile picture
profileRoutes.post('/me/upload-picture', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile image if exists and it's not the default gravatar
    if (user.profileImage && !user.profileImage.includes('gravatar.com')) {
      const oldImagePath = user.profileImage.replace('/uploads', 'uploads');
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update profile image URL
    user.profileImage = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.json({
      message: 'Profile image uploaded successfully',
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Change password
profileRoutes.put('/me/change-password', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Delete profile image
profileRoutes.delete('/me/profile-image', async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.profileImage && !user.profileImage.includes('gravatar.com')) {
      const imagePath = user.profileImage.replace('/uploads', 'uploads');
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      user.profileImage = 'https://www.gravatar.com/avatar/';
      await user.save();
    }

    res.json({ message: 'Profile image deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).json({ error: 'Failed to delete profile image' });
  }
});

export default profileRoutes; 