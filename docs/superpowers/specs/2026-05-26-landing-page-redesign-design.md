# Design Specification: Zenith Landing Page Redesign (Hyperlane Style)

This document specifies the technical design, structure, and style mappings to rebuild the public-facing landing page of the Zenith Venture Engine to look exactly like the Hallmark "Hyperlane" summit layout.

## Goals
- Overhaul `client/src/features/landing/LandingPage.jsx` into the dark, atmospheric Hallmark Hyperlane design.
- Create a dedicated stylesheet `LandingPage.css` containing the exact OKLCH tokens, glowing radial blooms, inline SVG turbulence noise filters, responsive navigation scroll transformations, and relative rise animations.
- Integrate a live, dynamic countdown timer indicating the time left until the next virtual venture incubation cohort.
- Retain platform routing access hooks: connecting nav CTA, header buttons, and main landing page CTA buttons to navigation/portal launch triggers.

---

## 1. Design Tokens & Styling System (`LandingPage.css`)

The styling system maps the exact tokens and animations extracted from the Hallmark Hyperlane summit example.

### Color Theme (OKLCH Bloom Atmosphere)
```css
:root {
  color-scheme: dark;
  --color-paper:        oklch(13% 0.018 35);
  --color-paper-2:      oklch(17% 0.020 35);
  --color-paper-3:      oklch(22% 0.022 35);
  --color-paper-4:      oklch(28% 0.020 35);
  --color-ink:          oklch(95% 0.010 70);
  --color-ink-2:        oklch(78% 0.015 60);
  --color-ink-3:        oklch(58% 0.015 50);
  --color-rule:         oklch(28% 0.018 40);
  --color-rule-strong:  oklch(40% 0.025 40);
  --color-accent:       oklch(74% 0.180 55);
  --color-accent-2:     oklch(68% 0.220 18);
  --color-accent-soft:  oklch(74% 0.060 55);
  --color-accent-ink:   oklch(15% 0.040 50);
  --color-focus:        oklch(82% 0.180 55);
  --color-error:        oklch(70% 0.220 25);
  --color-success:      oklch(74% 0.160 145);
  --color-bloom-1:      oklch(74% 0.220 50);
  --color-bloom-2:      oklch(60% 0.220 15);
}
```

### Typography Bindings
- **Display Sans**: `"Inter Tight"`, system-ui, sans-serif
- **Body Sans**: `"Inter"`, system-ui, sans-serif
- **Monospace**: `"JetBrains Mono"`, ui-monospace, monospace
- **Italic Serif Highlight**: `"Instrument Serif"`, Georgia, serif

### Animations
1. **Pulse**: Slow opacity pulsing on the navigation indicator dot (`pulse 2.4s ease-in-out infinite`).
2. **Rise**: Staggered content entrance animations on the hero title lines:
   ```css
   @keyframes rise {
     to { opacity: 1; transform: translateY(0); }
   }
   ```
3. **Pill Scale/Color Transition**: When scrolled past 50px, the floating nav scales down to `0.965`, adds a rich amber glow shadow, and increases backdrop filter blur.

---

## 2. React Component Architecture (`LandingPage.jsx`)

The component will be rewritten using semantic HTML elements that tie directly into the `LandingPage.css` selectors.

### Scroll State Listener
We will register a scroll-event listener when the component mounts to track vertical scroll depth:
```javascript
const [scrolled, setScrolled] = React.useState(false);

React.useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```
This state is injected directly as `data-state={scrolled ? "scrolled" : "rest"}` on the `<header className="nav">` element to trigger the transition.

### Dynamic Venture Countdown Timer
We will implement an active ticker counting down to a mock future cohort launch (e.g. October 17, 2026 at 7:00 PM EST):
```javascript
const [countdownText, setCountdownText] = React.useState("— —");

React.useEffect(() => {
  const targetDate = new Date("2026-10-17T19:00:00-04:00").getTime();
  
  const updateTimer = () => {
    const now = Date.now();
    const diff = targetDate - now;
    if (diff <= 0) {
      setCountdownText("COHORT ACTIVE");
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  updateTimer();
  const timer = setInterval(updateTimer, 1000);
  return () => clearInterval(timer);
}, []);
```

### Page Sections Structure
1. **Background Ambient System**:
   - Two `<div className="bloom">` nodes to apply OKLCH blurs.
   - SVG turbulence noise grain backdrop.
2. **Floating Pill Header**:
   - Floating `<header className="nav" data-state={...}>` with an active pulsing amber dot next to brand name "Zenith/26".
   - Links pointing to target page IDs (`#format`, `#why`, `#program`, `#faq`).
   - Call-to-action button "Launch Portal" triggering the parent `onLaunch` prop handler.
3. **Hero Section**:
   - **Static Monospace Ticker Rail**: `ZENITH / 26 — DYNAMIC INDIAN INCUBATION COHORT · REGISTRATION OPEN`
   - **Hero Text**: Weighty display heading with the signature serif italics: "For founders / who ship / *after dark.*"
   - **Metadata Cells**: Displays mock start date, dynamic countdown, and capacity/geographic scope limits (e.g., India-wide, 480 startups limit).
4. **Format (Incubation Blueprint Stages)**:
   - A step-by-step table mapping 7:00 PM, 8:30 PM, 11:00 PM, and 1:00 AM stages of the Zenith incubation flow.
   - Core primary button "Launch Portal" mapping directly to portal entrance.
5. **Why (The Pitch)**:
   - Beautiful multi-paragraph layout discussing the philosophy of startup incubation in India, catering to people building products under constraint.
6. **Programme (Feature Cohort Showcase)**:
   - A feature grid showcasing the MERN ledger, geocoding coordinates lookup auto-suggestions, stateful AI chat consultant dialogues, and Indian state compliance modules.
   - Highlighting live incubation tracks with a glowing "LIVE" orange badge and gradient backgrounds.
7. **RSVP (Access waitlist)**:
   - Input waitlist form accepting emails with the signature rounded pill field styling, loading states, and custom success messages.
8. **FAQ & Footer**:
   - Structured native accordions using `<details>` and `<summary>` tags with rotatable plus marks.
   - Editorial large typography footer: *Built late. Shipped live.*

---

## 3. Verification Plan

### Automated Tests
- Run client development compiler (`npm run build` or Vite checks) to ensure absolute compilation with zero syntax warnings.
- Run Playwright E2E browser tests to verify that the landing page renders without warnings, links are operational, and the countdown ticks down correctly.

### Manual Verification
- Visual inspection of the off-screen animations, active radial blooms, film grain transparency, details summaries, and the floating pill's interactive transitions.
