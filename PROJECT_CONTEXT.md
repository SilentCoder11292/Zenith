# Zenith Project Context & Roadmap

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
   - [ ] Implement Indian business registration matching & profile creation (Next Step).
   - [ ] Hook up Leaflet.js mapping layers for regional incubators.
