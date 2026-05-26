import express from 'express';
import { signup, login } from './authController.js';
import { signupSchema, loginSchema, validate } from './authValidation.js';

const router = express.Router();

// ==========================================
// PUBLIC AUTHENTICATION ENDPOINTS
// ==========================================

// Route for User Registration (Signup)
router.post('/signup', validate(signupSchema), signup);

// Route for User Authentication (Login)
router.post('/login', validate(loginSchema), login);

export default router;
