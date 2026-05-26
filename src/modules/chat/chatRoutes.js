import express from 'express';
import { getChatHistory, sendMessage } from './chatController.js';
import protect from '../../shared/middlewares/protect.js';

const router = express.Router();

// ==========================================
// PROTECTED AI CHATBOT ROUTING PIPELINE
// ==========================================

// Enforce token validation context for all conversational endpoints
router.use(protect);

// Route to fetch dialogue exchanges history sorted chronologically
router.get('/history', getChatHistory);

// Route to send user message and fetch context-aware AI response
router.post('/message', sendMessage);

export default router;
