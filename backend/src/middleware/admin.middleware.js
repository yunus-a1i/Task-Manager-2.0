// middleware/admin.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is admin or accessing own resource
export const isAdminOrSelf = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const requestedUserId = req.params.userId || req.params.id;
    
    if (req.user.role === 'admin' || req.user._id.toString() === requestedUserId) {
      return next();
    }

    return res.status(403).json({ 
      message: 'Access denied. You can only access your own resources.' 
    });
  } catch (error) {
    console.error('Admin or self middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};