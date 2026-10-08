const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const dbHelper = require('../utils/dbHelper');
const { protect, BUILT_IN_ADMIN_ID } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    let user = null;
    let isMatch = false;

    // 1. Try finding in MongoDB first if connected
    if (mongoose.connection.readyState === 1 || global.dbConnected) {
      try {
        const mongoUser = await User.findOne({ email: cleanEmail });
        if (mongoUser) {
          user = mongoUser;
          isMatch = await mongoUser.matchPassword(password);
        }
      } catch (mongoErr) {
        console.error('Mongo user query error:', mongoErr.message);
      }
    }

    // 2. Fallback to dbHelper / JSON file
    if (!user) {
      user = await dbHelper.findOne(User, { email: cleanEmail });
      if (user && user.password) {
        isMatch = bcrypt.compareSync(password, user.password);
      }
    }

    // 3. Built-in super admin credentials for reliability
    if (!isMatch && (cleanEmail === 'rohith@nestcares.in' || cleanEmail === 'nestcares.in@gmail.com' || cleanEmail === 'admin@nestcares.in')) {
      if (password === 'Roya@1522') {
        isMatch = true;
        if (!user) {
          user = {
            _id: BUILT_IN_ADMIN_ID,
            name: 'Super Admin',
            email: cleanEmail,
            role: 'admin'
          };
        }
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id || user.id },
      process.env.JWT_SECRET || 'homehealthcare_secret_key_2026',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name || 'Administrator',
        email: user.email,
        role: user.role || 'admin'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await dbHelper.findById(User, req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Dispatch OTP for Doctor password change
// @route   POST /api/auth/doctor-otp
// @access  Public
router.post('/doctor-otp', async (req, res) => {
  const { doctorId, doctorName, otpCode } = req.body;

  try {
    if (!doctorId || !otpCode) {
      return res.status(400).json({ success: false, message: 'Doctor ID and OTP code are required' });
    }

    console.log(`🔑 [Doctor OTP Request] Doctor: ${doctorName || doctorId}, OTP: ${otpCode}`);

    // Dispatch email to administrator
    await sendEmail({
      to: 'nestcares.in@gmail.com',
      subject: `Doctor Password Verification OTP - ${doctorName || doctorId}`,
      templateName: 'doctorOtp',
      replacements: {
        doctorName: doctorName || 'Doctor',
        doctorId: doctorId,
        otpCode: otpCode,
        time: new Date().toLocaleString()
      }
    }).catch(err => {
      console.warn('Doctor OTP email dispatch notice:', err.message);
    });

    res.json({
      success: true,
      message: 'Verification OTP generated and sent to administrator email'
    });
  } catch (error) {
    console.error('Doctor OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to process OTP verification' });
  }
});

module.exports = router;
