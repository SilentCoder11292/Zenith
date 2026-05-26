import { z } from 'zod';
import AppError from '../../shared/utils/AppError.js';
import validate from '../../shared/middlewares/validate.js';

// ==========================================
// 1. ZOD VALIDATION SCHEMAS
// ==========================================

export const signupSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required.' })
      .trim()
      .min(2, 'Name must be at least 2 characters.')
      .max(50, 'Name cannot exceed 50 characters.'),
    email: z.string({ required_error: 'Email is required.' })
      .trim()
      .email('Please provide a valid email address.'),
    password: z.string({ required_error: 'Password is required.' })
      .min(8, 'Password must be at least 8 characters.'),
    role: z.enum(['entrepreneur', 'investor', 'supplier'], {
      errorMap: () => ({ message: 'Role must be either: entrepreneur, investor, or supplier.' })
    }),
    onboardingPath: z.enum(['has_idea', 'needs_idea'], {
      errorMap: () => ({ message: 'Onboarding path must be either: has_idea or needs_idea.' })
    }).optional(),
    gstin: z.string()
      .trim()
      .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid Indian GSTIN tax registration format.')
      .optional()
      .or(z.literal('')), // Allows optional empty strings
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required.' })
      .trim()
      .email('Please provide a valid email address.'),
    password: z.string({ required_error: 'Password is required.' }),
  })
});

export { validate };
