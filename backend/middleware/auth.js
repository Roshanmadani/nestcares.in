const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dbHelper = require('../utils/dbHelper');

// Id the login route assigns to the built-in admin account (see routes/auth.js)
const BUILT_IN_ADMIN_ID = '6a4d42c13fe3185756e53aef';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'homehealthcare_secret_key_2026');

      // Get user from database (with fallback compatibility)
      let user = null;
      try {
        user = await dbHelper.findById(User, decoded.id);
      } catch (lookupErr) {
        // e.g. a non-ObjectId id while MongoDB is connected
        console.warn('Auth user lookup failed:', lookupErr.message);
      }

      // The login route can issue a token for the built-in admin when no user
      // record exists; accept that same identity here so its session works.
      if (!user && decoded.id === BUILT_IN_ADMIN_ID) {
        user = { _id: BUILT_IN_ADMIN_ID, name: 'Super Admin', role: 'admin' };
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect, BUILT_IN_ADMIN_ID };
