import { z } from 'zod';
import AppError from '../utils/AppError.js';

/**
 * Reusable schema validation wrapper middleware
 * @param {z.ZodSchema} schema - Zod schema validation layout
 * @returns {Function} Express middleware that parses request segments
 */
const validate = (schema) => (req, res, next) => {
  try {
    // Parse input fields cleanly against structural blueprint
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Map nested array validation messages and strip root segments (e.g. 'body.email' -> 'email')
      const errorsArray = error.errors || error.issues || [];
      const formattedErrors = errorsArray.map((err) => {
        const fieldName = err.path.slice(1).join('.');
        return `${fieldName ? `'${fieldName}': ` : ''}${err.message}`;
      });
      
      // Feed directly into our global AppError handler as a 400 Operational failure
      return next(new AppError(`Validation mismatch: ${formattedErrors.join(' ')}`, 400));
    }
    next(error);
  }
};

export default validate;
