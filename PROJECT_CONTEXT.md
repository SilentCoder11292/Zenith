# Zenith Project Context & Roadmap (Last Updated: 2026-05-27)

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
- [x] Established HSL theme tokens, Inter typography font bindings, and custom glassmorphism styles in `client/src/index.css`.
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
- [x] Refactored main layout to adopt "Modern Editorial" design: shifted canvas background to warm ivory (`bg-[#faf8f5]`), locked the layout sidebar to sticky-locked top navigation (`h-screen sticky top-0 overflow-y-auto`), padded the chatbot conversation viewport, and introduced a dedicated frosted "Add New Asset" action drawer modal.
- [x] Overhauled frontend visual cards to crisp ivory whites (`bg-white`) and outlines to boundary-borders (`border-slate-200/60`), updated loading screens and application backgrounds to warm alabaster (`bg-[#FBF9F6]`), and styled statistics primary numbers with heavy bold weights (`font-bold text-slate-900`) for premium contrast.
- [x] Completely hid manual numerical text inputs for Latitude and Longitude from AddAssetModal and EditAssetModal overlays inside `App.jsx`, injecting them invisibly in the background.
- [x] Designed a custom 400ms debounced OpenStreetMap Nominatim API geolocation autocomplete search on Address input fields with dynamic absolute floating suggestion cards under address inputs inside both modals.
- [x] Programmed auto-fill selection click handlers that instantly populate address, city, state, and hidden coordinates, and added click-outside event listeners to dismiss dropdown cards cleanly.
- [x] Verified that client production bundles compile cleanly with zero errors.
- [x] Executed end-to-end browser automation checking user onboarding steps, multi-tab layout alignments, auto-suggestions card populates, and multi-asset database rows creation.
- [x] Locked active chatbot layout flush to viewport bottom using component-level screen constraints (`h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden` wrapper, `flex-1 overflow-y-auto` scroll isolate, and `sticky bottom-0 bg-[#FAF8F5] pt-2 pb-6 z-50` input tray) and main layout alignments (`h-screen overflow-hidden pt-[120px] px-8 pb-0` when active), resolving double scrollbars and gaps under active cache conditions.
- [x] Forced a complete server cache nuke and development server process reboot (`npm run dev -- --force`) to force the browser to sync and display the updated feature components immediately.
- [x] Extracted all dashboard and popup modules into discrete component files (`client/src/components/Sidebar.jsx`, `client/src/features/assets/AssetTable.jsx`, `client/src/features/assets/AddAssetModal.jsx`, `client/src/features/assets/EditAssetModal.jsx`, and `client/src/features/chat/Chatbot.jsx`) to satisfy the modular architectural audit and guarantee visual live-screen refreshes.
- [x] Rebuilt the "Explore Ecosystem" secondary CTA outline button with high-contrast sharp bounds to prevent it from washing out against the bright ivory canvas.
- [x] Overhauled the outermost container and geometric wireframe background overlay in `LandingPage.jsx`, implementing dynamic inline SVG stroke maps (`stroke-[#111111] dark:stroke-[#F5F5F5]`) and true conditional theme wrappers to prevent pitch-black background stickiness.
- [x] Wiped pre-bundling caches and verified live theme changes, hot module replacements, and E2E geocoding workflows with 100% test success via automated Playwright runs.
- [x] Fully repaired system theme engine class toggle failures: declared `@custom-variant dark` variant inside `index.css` for Tailwind CSS v4, synchronized HTML document element `classList` states inside global `App.jsx` effect trigger to discard sticky toggles, and refactored structural boundary parameters across `Sidebar.jsx`, `Chatbot.jsx`, `AuthPage.jsx`, `AddAssetModal.jsx`, and `EditAssetModal.jsx` to dynamically switch colors.
- [x] Completely redesigned client public landing portal (`LandingPage.jsx` and `LandingPage.css`) in 100% exact conformity to the Hallmark "Hyperlane" layout—featuring a dynamic ticking countdown clock, ambient blobs blur nodes, overlay SVG grain turbulence masks, scroll-responsive pill navigation headers, rapid incubation schedulers, and native accordions drawers.
- [x] Upgraded unauthenticated theme toggles inside floating header navigation bar to sleek, low-profile geometric SVG icons (Sun, Moon, Monitor) highlighted with dynamic `#8C6D47` amber accents.
- [x] Resolved Light Mode landing page canvas rendering failures by isolating radial atmospheric blooms (`.bloom`) to dark mode and implementing a fully responsive OKLCH variable engine in `LandingPage.css`.
- [x] Engineered a fully optimistic instant logout handler in `App.jsx`, wiping client credentials, resetting modal controls, clearing chatbot history, and clearing URL hashes instantly to eliminate UI lag.
- [x] Validated production compilation, building client assets in 1.82s with zero warnings or errors.

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
3. **Core Platform Features (Completed):**
   - [x] Create User Resource & Asset Management module (Liquid Cash, Land, Buildings, and Equipment) with geographic coordinates and multi-tenant security.
   - [x] Integrate Gemini API for AI business advice engine (gemini-3.5-flash with OpenAPI structured JSON schema outputs and 15-min TTL cache).
   - [x] Create Context-Aware AI Business Consultant Chatbot with database-backed memory and real-time asset prompts injection.
4. **Frontend Client Layer (Completed):**
   - [x] Scaffold Vite React client with Tailwind CSS v4, PostCSS, and global Inter styles.
   - [x] Establish Redux Toolkit central state store and secure JWT session synchronization slices.
   - [x] Build elegant unified login/signup forms under centered minimalist card layout.
   - [x] Refactor AuthPage.jsx: Discard dark mode, restore crisp light background, apply pulsing Antigravity ambient glows, and optimize contrast.
   - [x] Implement onboarding 3-step progressive stepper (Capital logging, Physical mapping, AI execution) with interactive Leaflet.js mapping coordinates capture.
   - [x] Build the dynamic Business Incubation Suggestions and AI Advisor Chat panels on the dashboard main views with a sticky sidebar, padded chatbot viewport, and frosted overlays.
   - [x] Integrate debounced geocoding search lookups on address inputs to auto-fill locations and hide numeric coordinates parameters.
   - [x] Build the premium public-facing Hero Landing Page (LandingPage.jsx) and integrate it with unauthenticated application gateways.
   - [x] Validate production build compliance and complete end-to-end browser verification scripts checking all components.
5. **Theme Engine & Hallmark Redesign Redux (Completed):**
   - [x] Force Tailwind v4 class dark selector via `@custom-variant dark` in `index.css`.
   - [x] Rewrite DOM listener in `App.jsx` to strip sticky `light`/`dark` custom classes before applying target states.
   - [x] Redesign layout boundaries, modal cards, scroll-responsive pill navigation headers, waitlists forms, and native collapsible accordions in Hallmark "Hyperlane" layout format.
   - [x] Compile production build packages with 100% compiler success.
6. **Precision Polish Sprint & Production Integrity (Completed):**
   - [x] Upgrade unauthenticated theme switcher to sleek navigation-bar pinned geometric icons (Sun, Moon, Monitor).
   - [x] Repair Light Mode canvas background to high-contrast crisp off-white and isolate ambient blooms to Dark Mode.
   - [x] Implement instant, fully optimistic client-side logout to eliminate lag and redirect users instantly.
   - [x] Run comprehensive client-side production compilation tests to verify zero warnings or syntax errors.
