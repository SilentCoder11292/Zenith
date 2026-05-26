import express from 'express';
import { getSuggestions } from './incubationController.js';
import protect from '../../shared/middlewares/protect.js';

const router = express.Router();

// ==========================================
// PROTECTED AI INCUBATION ROUTING PIPELINE
// ==========================================

// Enforce token validation context for all incubation analytics endpoints
router.use(protect);

// Route to analyze profile/assets and fetch personalized recommendations
router.get('/suggestions', getSuggestions);

export default router;
