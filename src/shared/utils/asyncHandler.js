/**
 * Custom Async Route Handler Wrapper
 * Resolves asynchronous route functions and forwards any thrown errors/rejected promises directly to next()
 * @param {Function} fn - Asynchronous Express controller function
 * @returns {Function} Express route handler middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
