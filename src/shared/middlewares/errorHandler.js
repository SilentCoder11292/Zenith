import AppError from '../utils/AppError.js';

// Central Database/Mongoose Error Mapping Functions
const handleCastErrorDB = (error) => {
  const message = `Invalid format for field '${error.path}': "${error.value}".`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  // Extract all nested validation error messages
  const errorMessages = Object.values(error.errors).map((el) => el.message);
  const message = `Validation parameters failed: ${errorMessages.join(' ')}`;
  return new AppError(message, 400);
};

const handleDuplicateKeyDB = (error) => {
  const keys = Object.keys(error.keyValue || {});
  const fieldName = keys.length > 0 ? keys[0] : 'field';
  const duplicateValue = error.keyValue ? error.keyValue[fieldName] : '';
  
  // Format readable user-facing duplicate fields (e.g. Email, Username, GSTIN)
  const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  const message = `${capitalizedField} '${duplicateValue}' is already registered. Please choose another value!`;
  
  return new AppError(message, 409); // 409 Conflict is optimal for duplicate values
};

// Response Formatting: Development Mode
const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  });
};

// Response Formatting: Production Mode
const sendErrorProd = (error, res) => {
  // Operational, trusted user-facing errors: disclose details safely
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  // Non-operational, system or programmer crashes: mask all inner details
  console.error('[CRITICAL SYSTEM ERROR] 💥', error);
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected systems error occurred on the Zenith engine.',
  });
};

// Global Catch-All Express Error Interceptor
const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // Instantiate active clone of the error context
  let activeError = { ...error };
  activeError.message = error.message;
  activeError.stack = error.stack;
  activeError.name = error.name;
  activeError.code = error.code;

  // Intercept database validation exceptions
  if (activeError.name === 'CastError') activeError = handleCastErrorDB(activeError);
  if (error.name === 'ValidationError') activeError = handleValidationErrorDB(error); // ValidationError holds raw nested arrays
  if (activeError.code === 11000) activeError = handleDuplicateKeyDB(activeError);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(activeError, res);
  } else {
    sendErrorProd(activeError, res);
  }
};

export default globalErrorHandler;
