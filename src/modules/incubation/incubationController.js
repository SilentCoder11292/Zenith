import { GoogleGenAI } from '@google/genai';
import Asset from '../assets/Asset.js';
import AppError from '../../shared/utils/AppError.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';
import { getCachedSuggestions, setCachedSuggestions } from './incubationCache.js';

// ==========================================
// 1. OPENAPI JSON SCHEMA COMPLIANCE SCHEMAS
// ==========================================
const incubationResponseSchema = {
  type: 'OBJECT',
  properties: {
    suggestions: {
      type: 'ARRAY',
      description: 'Three highly personalized startup recommendations based on entrepreneur role and listed assets.',
      items: {
        type: 'OBJECT',
        properties: {
          businessName: { type: 'STRING', description: 'Proposed startup brand or company name.' },
          sector: { type: 'STRING', description: 'Domain sector (e.g., Agritech processing, D2C Organic Food, EV Battery swapping, Industrial Equipment).' },
          capitalRequirement: { type: 'STRING', description: 'Estimated capital threshold mapped to raw material costs in Indian Rupees (e.g. 5 Lakhs, 2 Crores).' },
          viabilityScore: { type: 'NUMBER', description: 'Asset-matching compatibility score between 0 and 100.' },
          regulatoryCompliances: {
            type: 'ARRAY',
            description: 'Specific, mandatory Indian legal compliance registrations required to operate this business.',
            items: { type: 'STRING' }
          },
          rawMaterialSourcing: { type: 'STRING', description: 'Localized competitive zones or raw material clusters in India for sourcing input assets.' },
          businessConcept: { type: 'STRING', description: 'A highly cohesive, professional business roadmap aligning listed assets to this recommendation.' }
        },
        required: [
          'businessName', 'sector', 'capitalRequirement', 'viabilityScore', 
          'regulatoryCompliances', 'rawMaterialSourcing', 'businessConcept'
        ]
      }
    }
  },
  required: ['suggestions']
};

// ==========================================
// 2. INDIA-CENTRIC SYSTEM INSTRUCTIONS
// ==========================================
const indianIncubationSystemInstructions = `You are the lead Startup Incubator and veteran Business Consultant for the Indian market at Zenith.
Your mission is to analyze an entrepreneur's profile details (role, path) and their physical and financial logged assets (capital, land, commercial spaces, machinery) to generate exactly 3 custom, highly viable startup recommendations.

CONSTRAINTS & LEGAL CRITERIA:
1. Indian Regulatory Compliances: You MUST prescribe specific, mandatory Indian legal registrations for each business concept. Select matching compliances from:
   - MSME Udyam Registration (mandatory for central/state benefits for micro-to-medium startups)
   - FSSAI (Food Safety and Standards Authority of India, mandatory for D2C food, processing, and beverages)
   - GSTIN (Goods and Services Tax Identification Number, required for tax reporting)
   - BIS Certification (Bureau of Indian Standards, mandatory for electronics, solar, automotive, and hardware items)
   - APEDA (Agricultural and Processed Food Products Export Development Authority, mandatory for agri-exports)
   - Local Municipal Trade Licenses / Shop & Establishment Act licenses (for brick-and-mortar storefronts or factories)
2. Localized Competitive Sourcing: Constrain suggestions to leverage regional raw material sourcing advantages in India (e.g., cotton from Maharashtra/Gujarat, leather from Kanpur, spices from Kerala, tech-talent from Bengaluru, brass from Moradabad).
3. Asset Alignment: Recommendations must match the scope of listed capital/assets. For example, if a user lists "Liquid Cash" worth 50,000 INR, do not suggest setting up an EV Battery manufacturing plant. Match the business concept scale directly to their holdings and justify this with a realistic viabilityScore (0-100).
4. Response Format: Output ONLY valid JSON matching the specified OpenAPI schema structure. Do not include markdown wraps (like \`\`\`json) or conversational explanations.`;

// ==========================================
// 3. AI INCUBATION SUGGESTIONS HANDLER
// ==========================================

/**
 * @desc    Generate personalized startup suggestions using Gemini 3.5 Flash
 * @route   GET /api/v1/incubation/suggestions
 * @access  Private
 */
export const getSuggestions = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Step 1: Check in-memory local cache to shield API quota limits
  const cachedSuggestions = getCachedSuggestions(userId);
  if (cachedSuggestions) {
    return res.status(200).json({
      status: 'success',
      cached: true,
      results: cachedSuggestions.length,
      data: {
        suggestions: cachedSuggestions,
      },
    });
  }

  // Step 2: Query Mongoose database for user's assets
  const assets = await Asset.find({ userId });

  // Format assets cleanly for the LLM prompt payload
  const formattedAssets = assets.map((asset, idx) => {
    const loc = asset.location || {};
    const coords = loc.coordinates || {};
    return `${idx + 1}. [AssetType: ${asset.assetType}]
   Value: INR ${asset.valueINR.toLocaleString('en-IN')}
   Description: ${asset.description || 'No description listed'}
   Location: ${loc.address || ''}, ${loc.city || ''}, ${loc.state || ''} (Coordinates: ${coords.lat || ''}, ${coords.lng || ''})`;
  }).join('\n');

  // Compile detailed contextual prompt
  const prompt = `Entrepreneur Profile:
- Name: ${req.user.name}
- Incubation Role: ${req.user.role}
- Registration Status: ${req.user.gstin ? `GSTIN Registered (${req.user.gstin})` : 'Not GSTIN Registered'}
- Onboarding Phase: ${req.user.onboardingPath}

Available Startup Assets & Financial Resources:
${assets.length > 0 ? formattedAssets : '- No physical or financial assets currently logged.'}`;

  // Step 3: Initialize Google GenAI client
  // Reads process.env.GEMINI_API_KEY implicitly
  if (!process.env.GEMINI_API_KEY) {
    return next(new AppError('Incubation service failure: Gemini API credentials are not configured on the server.', 500));
  }

  const ai = new GoogleGenAI({});

  try {
    // Step 4: Execute structured content generation via gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: incubationResponseSchema,
        systemInstruction: indianIncubationSystemInstructions,
      },
    });

    // Parse the generated text directly (guaranteed OpenAPI JSON)
    const incubationData = JSON.parse(response.text);

    // Step 5: Save suggestions to local cache map
    setCachedSuggestions(userId, incubationData.suggestions);

    res.status(200).json({
      status: 'success',
      cached: false,
      results: incubationData.suggestions.length,
      data: {
        suggestions: incubationData.suggestions,
      },
    });
  } catch (error) {
    console.error('[GenAI Error] Google Gemini handshake failure:', error);
    return next(new AppError(`Gemini AI service error: ${error.message}`, 502));
  }
});
