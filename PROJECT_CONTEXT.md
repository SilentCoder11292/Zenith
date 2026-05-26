# Zenith Project Context & Roadmap

- **Project Goal:** AI-Driven Business Incubation Platform for India.
- **Tech Stack:** MERN Stack (MongoDB Atlas Free Tier, Node.js, Express, React).
- **Mapping Layer:** Leaflet.js + OpenStreetMap (Free Tier alternative to Google Maps).

## Current Execution Progress
- [x] Initialized `.env` and `.gitignore` to secure the project credentials and exclude developer environment files.
- [x] Planned and designed our modern Express backend foundation setup (Custom Async Error Handler, Feature-Based Structure, and Graceful Mongoose Connection Lifecycle Manager).
- [x] Initialized Node.js project (`package.json`) and installed foundational dependencies (including `helmet` and `express-rate-limit`).
- [x] Bootstrapped the Express app, DB connection module, global error handling middleware, and tested the active server boot loop.

## Roadmap Checklist
1. **Foundation Initialization (Completed):**
   - [x] Establish `package.json` with ESM `"type": "module"`.
   - [x] Build robust, process-aware database connection manager in `src/shared/config/db.js`.
   - [x] Build shared error handling utilities (`AppError`, `asyncHandler`, global `errorHandler` middleware).
   - [x] Bootstrap `app.js` and `server.js` with lifecycle process guards.
2. **Core Authentication Module (Next Step):**
   - [ ] Create Mongoose schema for standard Zenith User (roles: Incubatee, Incubator, Admin).
   - [ ] Set up secure JWT authentication and password hashing pipelines.
   - [ ] Create authentication controllers, validation schemas (Zod/Joi), and routes.
3. **Core Platform Features:**
   - [ ] Implement Indian business registration matching & profile creation.
   - [ ] Hook up Leaflet.js mapping layers for regional incubators.
   - [ ] Integrate Gemini API for AI business advice engine.
