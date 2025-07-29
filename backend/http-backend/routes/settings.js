import express from 'express';
import User from '../models/admin.js';
import AdminMiddleware from '../middleware/adminmiddleware.js';

const settingsRoutes = express.Router();
settingsRoutes.use(express.json());
settingsRoutes.use(AdminMiddleware);

// Get user settings
settingsRoutes.get('/me', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return default settings if user doesn't have settings
    const userSettings = user.settings || {
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        projectUpdates: true,
        taskAssignments: true,
        weeklyReports: false,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginAttempts: 5,
      },
      appearance: {
        theme: 'light',
        sidebarCollapsed: false,
        compactMode: false,
        colorScheme: 'blue',
      },
      system: {
        autoBackup: true,
        backupFrequency: 'weekly',
        dataRetention: 365,
        debugMode: false,
      },
      integrations: {
        slackIntegration: false,
        emailIntegration: true,
        calendarSync: false,
        fileStorage: 'local',
      },
    };

    res.json(userSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update user settings
settingsRoutes.put('/me', async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user settings
    user.settings = settings;
    await user.save();

    res.json({ 
      message: 'Settings updated successfully', 
      settings: user.settings 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Update specific setting category
settingsRoutes.patch('/me/:category', async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.params;
    const categorySettings = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize settings if they don't exist
    if (!user.settings) {
      user.settings = {};
    }

    // Update specific category
    user.settings[category] = {
      ...user.settings[category],
      ...categorySettings
    };

    await user.save();

    res.json({ 
      message: `${category} settings updated successfully`, 
      settings: user.settings[category] 
    });
  } catch (error) {
    console.error('Error updating settings category:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Reset settings to default
settingsRoutes.post('/me/reset', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Reset to default settings
    user.settings = {
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        projectUpdates: true,
        taskAssignments: true,
        weeklyReports: false,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginAttempts: 5,
      },
      appearance: {
        theme: 'light',
        sidebarCollapsed: false,
        compactMode: false,
        colorScheme: 'blue',
      },
      system: {
        autoBackup: true,
        backupFrequency: 'weekly',
        dataRetention: 365,
        debugMode: false,
      },
      integrations: {
        slackIntegration: false,
        emailIntegration: true,
        calendarSync: false,
        fileStorage: 'local',
      },
    };

    await user.save();

    res.json({ 
      message: 'Settings reset to default successfully', 
      settings: user.settings 
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

export default settingsRoutes; 