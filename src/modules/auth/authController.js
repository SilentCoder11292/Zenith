import jwt from 'jsonwebtoken';
import User from './User.js';
import AppError from '../../shared/utils/AppError.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

/**
 * Generate secure JWT signature
 * @param {string} id - Database User ObjectId
 * @returns {string} Signed JSON Web Token
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

/**
 * Encapsulated Helper: Generate and send JWT response
 * @param {Object} user - User document instance
 * @param {number} statusCode - HTTP success code
 * @param {Object} res - Express response target
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Safely strip the password hash from the response payload for client-side security
  const userObject = user.toObject();
  delete userObject.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userObject,
    },
  });
};

// ==========================================
// AUTHENTICATION ROUTE HANDLERS
// ==========================================

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, onboardingPath, gstin } = req.body;

  // Attempt creation of User document.
  // Note: Duplicate emails naturally raise a MongoServerError 11000, 
  // which our global error handler translates into a clean, race-condition-free 409 Conflict.
  const newUser = await User.create({
    name,
    email,
    password,
    role,
    onboardingPath,
    gstin,
  });

  createSendToken(newUser, 201, res);
});

/**
 * @desc    Authenticate existing credentials
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Query document by email, forcing explicit retrieval of '+password'
  const user = await User.findOne({ email }).select('+password');

  // 2. Perform credential checks (protect against enum enumeration attacks by using generic response)
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email address or security credentials.', 401));
  }

  // 3. Successfully authenticate and issue active session JWT
  createSendToken(user, 200, res);
});
