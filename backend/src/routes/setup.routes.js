// routes/setup.routes.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Create first admin user (only works if no admin exists)
router.post('/create-first-admin', async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    // Verify secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ 
        message: 'Admin already exists. Use admin routes to create more admins.' 
      });
    }

    // Create first admin
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isActive: true
    });

    res.status(201).json({
      message: 'First admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create first admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if setup is needed
router.get('/status', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    res.json({
      setupRequired: !adminExists,
      message: adminExists 
        ? 'System is configured' 
        : 'No admin exists. Please create the first admin.'
    });
  } catch (error) {
    console.error('Check setup status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;