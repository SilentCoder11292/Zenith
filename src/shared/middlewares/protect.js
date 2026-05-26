import jwt from 'jsonwebtoken';
import User from '../../modules/auth/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Route protection middleware
 * Restricts access to authenticated users by validating their JSON Web Token (JWT)
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Extract token from standard HTTP Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Reject early if token is completely missing
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to request access.', 401)
    );
  }

  // 2. Cryptographically verify signature against environment secret
  // Note: JSONWebToken exceptions (JsonWebTokenError, TokenExpiredError) are automatically 
  // forwarded by asyncHandler to our global errorHandler to be mapped to clean operational 401s.
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Confirm that the user belonging to this token still exists in our systems
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this security token no longer exists in our systems.', 401)
    );
  }

  // 4. Grant access by attaching active User context directly to req.user
  req.user = currentUser;
  next();
});

export default protect;
