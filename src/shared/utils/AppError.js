class AppError extends Error {
  /**
   * Custom Operational Error Class
   * @param {string} message - User-friendly error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Operational error flag represents predictable developer-modeled client failures
    this.isOperational = true;

    // Capture stack trace for detailed diagnostic debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
