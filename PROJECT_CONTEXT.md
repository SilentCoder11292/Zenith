# Zenith Project Context & Roadmap (Last Updated: 2026-05-26)

- **Project Goal:** AI-Driven Business Incubation Platform for India.
- **Tech Stack:** MERN Stack (MongoDB Atlas Free Tier, Node.js, Express, React).
- **Mapping Layer:** Leaflet.js + OpenStreetMap (Free Tier alternative to Google Maps).

## Current Execution Progress
- [x] Initialized `.env` and `.gitignore` to secure the project credentials and exclude developer environment files.
- [x] Planned and designed our modern Express backend foundation setup (Custom Async Error Handler, Feature-Based Structure, and Graceful Mongoose Connection Lifecycle Manager).
- [x] Initialized Node.js project (`package.json`) and installed foundational dependencies (including `helmet` and `express-rate-limit`).
- [x] Bootstrapped the Express app, DB connection module, global error handling middleware, and tested the active server boot loop.
- [x] Created decoupled Core User Authentication domain module under `src/modules/auth/` (User schema with pre-save hashing lifecycle checks, Zod validations, JWT controllers, and router bindings).
- [x] Verified user auth sprint endpoints (signup validations, duplicate account protection, login password comparative matches, and incorrect credentials security).
- [x] Implemented decoupled shared authentication guardian and request validation middlewares (`protect.js` and `validate.js`) under `src/shared/middlewares/`.
- [x] Created decoupled User Resource & Asset Management domain module under `src/modules/assets/` (Asset schema, Zod coordinate validations, CRUD controllers, and secure router bounds).
- [x] Verified asset sprint endpoints (unauthenticated request block, malformed token captures, asset creation mapping, coordinate limits constraints, and multi-tenant ownership security).
- [x] Installed the modern Google GenAI SDK package `@google/genai`.
- [x] Implemented server-side suggestions caching utility `incubationCache.js` under `src/modules/incubation/` with a strict 15-minute TTL.
- [x] Created AI Business Incubation & Recommendation Engine domain module under `src/modules/incubation/` (OpenAPI schemas, system instructions, GET suggestions routes, and controllers).
- [x] Connected cache-eviction hooks inside the asset controller to clear the recommendations cache upon asset CRUD changes.
- [x] Verified AI incubation sprint endpoints (unauthenticated routes protection, dynamic asset analytical aggregation, structured OpenAPI compliance response mapping, and high-performance TTL cache hits).
- [x] Created decoupled Context-Aware AI Business Consultant Chatbot domain module under `src/modules/chat/` (Message schema with compound indexes, stateful dialogue database logging, chronological sliding frames mapping, and routes/controllers).
- [x] Refactored the Message schema text parameter to support a high-capacity limit of 20,000 characters to prevent validation failures on extensive AI roadmaps.
- [x] Verified chatbot sprint endpoints (unauthenticated route protection, dynamic per-request asset prompts injection, stateless dialogue conversions, and chronological database persistence logging).
- [x] Scaffolded Vite-React web client environment in a dedicated `client/` subdirectory.
- [x] Installed core production packages (`@reduxjs/toolkit`, `react-redux`, `lucide-react`, `framer-motion`, `sonner`, `zod`, `clsx`, `tailwind-merge`).
- [x] Configured Tailwind CSS v4, PostCSS, and autoprefixer utilizing modern `@tailwindcss/postcss` plugins.
- [x] Established global HSL theme tokens, Inter typography font bindings, and custom glassmorphism styles in `client/src/index.css`.
- [x] Created Redux global state store `app/store.js`, `apiSlice.js` base queries with auto-reauth, and `authSlice.js` with local persistence.
- [x] Scaffolded vertical feature folders (`assets`, `incubation`, `chat`) and shared UI primitives folders.
- [x] Verified client compiles successfully via `vite build` production packages.
- [x] Created the unified Centered Minimalist Authentication Portal `client/src/features/auth/AuthPage.jsx` (framer-motion transitions, custom role select toggles, Zod-compliant validations).
- [x] Created RTK Query database-linked authentication mutations `client/src/features/auth/authApiSlice.js`.
- [x] Mounted global Redux store Provider inside `client/src/main.jsx`.
- [x] Rendered AuthPage in `client/src/App.jsx` and verified complete production build compiling.
- [x] Refactored `client/src/features/auth/AuthPage.jsx`: Discarded heavy dark mode, restored crisp light background, implemented slow-pulsing Antigravity floating ambient glows, and optimized all text elements for maximum readability and contrast.
- [x] Fine-tuned `client/src/features/auth/AuthPage.jsx` typography: Enhanced form label weight and size to text-[13px], improved typing text size to text-sm, raised placeholder contrast using slate-500, and fully adjusted active/unselected role selector states.
- [x] Overhauled main dashboard workspace with dynamic `activeTab` switches (Ledger, Suggestions, Chatbot) synchronized with `window.location.hash`, premium luxury tech visual HSL slate cards typography scales with indigo accents, a dynamic stateful chatbot connected to MongoDB Atlas, and a modal-based "Edit Asset" action overlay drawer.
- [x] Verified that the complete client-side dashboard compiles successfully and builds without warnings.

## Roadmap Checklist
1. **Foundation Initialization (Completed):**
   - [x] Establish `package.json` with ESM `"type": "module"`.
   - [x] Build robust, process-aware database connection manager in `src/shared/config/db.js`.
   - [x] Build shared error handling utilities (`AppError`, `asyncHandler`, global `errorHandler` middleware).
   - [x] Bootstrap `app.js` and `server.js` with lifecycle process guards.
2. **Core Authentication Module (Completed):**
   - [x] Create Mongoose schema for standard Zenith User (roles: entrepreneur, investor, supplier).
   - [x] Set up secure JWT authentication and password hashing pipelines.
   - [x] Create authentication controllers, validation schemas (Zod/Joi), and routes.
3. **Core Platform Features:**
   - [x] Create User Resource & Asset Management module (Liquid Cash, Land, Buildings, and Equipment) with geographic coordinates and multi-tenant security.
   - [x] Integrate Gemini API for AI business advice engine (gemini-3.5-flash with OpenAPI structured JSON schema outputs and 15-min TTL cache).
   - [x] Create Context-Aware AI Business Consultant Chatbot with database-backed memory and real-time asset prompts injection.
4. **Frontend Client Layer:**
   - [x] Scaffold Vite React client with Tailwind CSS v4, PostCSS, and global Inter styles.
   - [x] Establish Redux Toolkit central state store and secure JWT session synchronization slices.
   - [x] Build elegant unified login/signup forms under centered minimalist card layout.
   - [x] Refactor AuthPage.jsx: Discard dark mode, restore crisp light background, apply pulsing Antigravity ambient glows, and optimize contrast.
   - [x] Implement onboarding 3-step progressive stepper (Capital logging, Physical mapping, AI execution) with interactive Leaflet.js mapping coordinates capture.
   - [ ] Build the dynamic Business Incubation Suggestions and AI Advisor Chat panels on the dashboard main views (Next Step).
