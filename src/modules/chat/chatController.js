import { GoogleGenAI } from '@google/genai';
import Message from './Message.js';
import Asset from '../assets/Asset.js';
import AppError from '../../shared/utils/AppError.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

// ==========================================
// DYNAMIC PROMPT INJECTION COMPILER
// ==========================================

/**
 * Constructs the core advisor instructions injected with the user's real-time asset metrics.
 * @param {Object} user - Authenticated User document
 * @param {Array} assets - Array of User's logged Asset documents
 * @returns {string} Fully compiled system instruction string
 */
const compileSystemInstruction = (user, assets) => {
  // Format asset list into clear, structured bullet points for clean LLM parsing
  const formattedAssetsList = assets.map((asset, idx) => {
    const loc = asset.location || {};
    const coords = loc.coordinates || {};
    return `${idx + 1}. [AssetType: ${asset.assetType}]
   Value: INR ${asset.valueINR.toLocaleString('en-IN')}
   Description: ${asset.description || 'No description listed'}
   Location: ${loc.address || ''}, ${loc.city || ''}, ${loc.state || ''} (Coordinates: ${coords.lat || ''}, ${coords.lng || ''})`;
  }).join('\n');

  return `You are the lead AI Business Consultant, startup incubator lead, and senior Indian Corporate Advisor at Zenith.
Your objective is to conduct a professional, stateful, and highly contextual startup advisory conversation with the entrepreneur.

==========================================
ENTREPRENEUR PROFILE (CONTEXT ANCHOR):
==========================================
- Full Name: ${user.name}
- Incubation Role: ${user.role}
- Registration Status: ${user.gstin ? `GSTIN Registered (${user.gstin})` : 'Not GSTIN Registered'}
- Onboarding Path: ${user.onboardingPath}

==========================================
ACTIVE RESOURCES & ASSETS PORTFOLIO:
==========================================
${assets.length > 0 ? formattedAssetsList : '- No physical or financial assets currently logged.'}

==========================================
ADVISORY MANDATE & LOCALIZED CONSTRAINTS:
==========================================
1. Resource-Grounded Consultations: You have full visibility of their resource portfolio listed above. Ground your answers inside this data. If they ask "What business should I start?" or "How can I launch this project?", refer back to their listed assets (e.g. Indiranagar land, capital) and guide them on leveraging these specific inputs.
2. Indian Regulatory Compliance Expert: Deliver specific, accurate guidance concerning Indian business compliances. Reference actual frameworks where relevant:
   - MSME Udyam Registration (benefits, subsidies)
   - FSSAI (for food production, cafe logistics, agritech processing)
   - GSTIN (registration thresholds, CGST/SGST details)
   - BIS Certification (electronics, clean tech, EV parts manufacturing)
   - Trade Licenses (municipal corporations, Shops & Establishment Act compliance)
   - SIDBI, MUDRA loans, and Startup India recognition perks.
3. Indian Regional Markets & Sourcing: Propose competitive local sourcing channels in India appropriate for their startup domain (e.g. steel from Yeshwanthpur fabrication markets, agricultural inputs from Mandya, battery parts from Hosur).
4. Conversational Charter: Be highly realistic, encouraging, and business-focused. Avoid conversational fluff. Speak as an elite venture incubator director.`;
};

// ==========================================
// CHAT ENDPOINT HANDLERS
// ==========================================

/**
 * @desc    Fetch chronological chat history for logged user
 * @route   GET /api/v1/chat/history
 * @access  Private
 */
export const getChatHistory = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Retrieve all historical logs, sorting chronologically (oldest first)
  const history = await Message.find({ userId }).sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: history.length,
    data: {
      history,
    },
  });
});

/**
 * @desc    Send message and get stateful AI response
 * @route   POST /api/v1/chat/message
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { text } = req.body;

  // 1. Validate payload presence
  if (!text || text.trim() === '') {
    return next(new AppError('Please provide a message string.', 400));
  }

  // 2. Persist user message to the database immediately
  const userMessage = await Message.create({
    userId,
    role: 'user',
    text: text.trim(),
  });

  // 3. Retrieve latest 50 messages of sorted chronological history from MongoDB
  // We query with newest first to capture the sliding window correctly, then reverse it.
  const rawHistory = await Message.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);
  
  const chronologicalHistory = rawHistory.reverse();

  // 4. Map the logs database entries into standard `@google/genai` message turn inputs
  const formattedContents = chronologicalHistory.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  // 5. Query active user assets to construct the customized system instruction prompt
  const assets = await Asset.find({ userId });
  const systemInstruction = compileSystemInstruction(req.user, assets);

  // 6. Initialize standard Google GenAI SDK connection
  if (!process.env.GEMINI_API_KEY) {
    return next(new AppError('AI consultant service error: Gemini credentials are not configured on the server.', 500));
  }

  const ai = new GoogleGenAI({});

  try {
    // 7. Execute stateful multi-turn generation
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || 'I was unable to compile a startup consultation response at this time. Please retry.';

    // 8. Persist AI model response to MongoDB
    const modelMessage = await Message.create({
      userId,
      role: 'model',
      text: replyText,
    });

    res.status(200).json({
      status: 'success',
      data: {
        userMessage,
        modelMessage,
      },
    });
  } catch (error) {
    console.error('[GenAI Chat Error] Dialogue generation failure:', error);
    return next(new AppError(`AI Chat Service Error: ${error.message}`, 502));
  }
});
