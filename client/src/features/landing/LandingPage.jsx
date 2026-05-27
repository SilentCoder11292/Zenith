import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onLaunch, theme, setTheme }) => {
  // 1. Scroll-Responsive Floating Pill State Trigger
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Dynamic Live Countdown Timer Ticking to mock venture cohort (Oct 17, 2026)
  const [countdown, setCountdown] = useState("— —");

  useEffect(() => {
    const targetDate = new Date("2026-10-17T19:00:00+05:30").getTime();
    
    const updateCountdown = () => {
      const now = Date.now();
      const distance = targetDate - now;
      
      if (distance < 0) {
        setCountdown("COHORT ACTIVE");
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Waitlist Form Submission Stateful States
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState("default"); // default, loading, success

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setFormState("loading");
    setTimeout(() => {
      setFormState("success");
    }, 1200);
  };

  return (
    <div className="hyperlane-body bg-[#FBFBFB] text-[#111111] dark:bg-[#0B0B0B] dark:text-[#F5F5F5] transition-colors duration-300">
      
      {/* Ambient Atmospheric Backdrop */}
      <div className="ambient" aria-hidden="true">
        <div className="bloom bloom--1"></div>
        <div className="bloom bloom--2"></div>
        <div className="grain"></div>
      </div>

      <a className="skip" href="#main">Skip to content</a>

      {/* ─── Navigation · N5 floating pill ────────────────────────────── */}
      <header className="nav" data-state={scrolled ? "scrolled" : "rest"}>
        <div className="nav__inner">
          <a className="nav__brand" href="#top" aria-label="Zenith Venture Engine · home">
            <span className="nav__brand-dot" aria-hidden="true"></span>
            <span className="nav__brand-text">Zenith<span className="nav__brand-num">/26</span></span>
          </a>
          <nav className="nav__links" aria-label="Primary">
            <a href="#format">Cohort Plan</a>
            <a href="#why">Why Us</a>
            <a href="#program">Core Modules</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Sleek low-profile Theme Toggle Icons */}
            <div className="flex items-center gap-0.5 bg-[#121110]/5 dark:bg-[#1A1917]/50 border border-[#E5E5E5] dark:border-[#222222] p-0.5 rounded-full transition-colors duration-200">
              <button 
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'text-[#8C6D47] bg-[#FBFBFB] dark:bg-transparent shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`}
                title="Light Mode"
                type="button"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'text-[#8C6D47] bg-[#1A1917] shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`}
                title="Dark Mode"
                type="button"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-full transition-colors ${theme === 'system' ? 'text-[#8C6D47] bg-white dark:bg-[#1A1917] shadow-sm' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`}
                title="System Theme"
                type="button"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            <a 
              className="nav__cta" 
              href="#rsvp" 
              onClick={(e) => {
                e.preventDefault();
                onLaunch();
              }}
            >
              <span>Launch Venture Portal</span>
              <span className="nav__cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </header>

      <main id="main">

        {/* ─── Hero · Marquee Hero ──────────────────────── */}
        <section className="hero" id="top" aria-labelledby="hero-h">
          <div className="hero__spotlight" aria-hidden="true"></div>

          <div className="hero__rail">
            <span className="hero__rail-dot" aria-hidden="true"></span>
            <span>ZENITH / 26 — DYNAMIC INDIAN INCUBATION COHORT · REGISTRATION OPEN</span>
          </div>

          <h1 className="hero__display" id="hero-h">
            <span className="hero__line">Map your asset runway.</span>
            <span className="hero__line">Deploy your</span>
            <span className="hero__line"><em>execution blueprint.</em></span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-sm md:text-base text-slate-400 dark:text-slate-500 font-medium leading-relaxed font-sans z-10">
            Log your operational capital and resource footprints. Zenith aggregates your venture inputs to instantly synthesize precise, localized regulatory pathways and step-by-step business execution plans built for modern Indian entrepreneurs.
          </p>

          <div className="hero__meta">
            <div className="hero__meta-cell">
              <span className="hero__label">Launch</span>
              <span className="hero__value">Sat 17 Oct 2026 · 7 PM</span>
            </div>
            <div className="hero__meta-cell hero__meta-cell--mid">
              <span className="hero__label">To liftoff</span>
              <span className="hero__value tnum" id="countdown">{countdown}</span>
            </div>
            <div className="hero__meta-cell hero__meta-cell--end">
              <span className="hero__label">Scope</span>
              <span className="hero__value">India-wide · 480 cap</span>
            </div>
          </div>
        </section>

        {/* ─── Format Band · Spec Sheet ────────────────────────── */}
        <section className="format" id="format" aria-labelledby="format-h">
          <header className="section-head">
            <p className="section-eyebrow"><span className="num tnum">01</span> · Timeline</p>
            <h2 className="section-h" id="format-h">Rapid Indian Venture Incubation</h2>
          </header>

          <ol className="format__schedule" aria-label="Timeline">
            <li className="format__row">
              <span className="format__time tnum">7:00 <small>PM</small></span>
              <span className="format__label">Capital Audit & Setup</span>
              <span className="format__note">Register seed assets · list equipment runways · log liquid reserve capacities</span>
            </li>
            <li className="format__row">
              <span className="format__time tnum">8:30 <small>PM</small></span>
              <span className="format__label">Spatial Geocoding</span>
              <span className="format__note">Pinpoint operations locations · auto-fill coordinates dynamically via debounced openstreetmap suggestion engines</span>
            </li>
            <li className="format__row">
              <span className="format__time tnum">11:00 <small>PM</small></span>
              <span className="format__label">AI Co-Piloting</span>
              <span className="format__note">Engage stateful venture co-piloting · persist chat histories securely in MongoDB Atlas</span>
            </li>
            <li className="format__row">
              <span className="format__time tnum">1:00 <small>AM</small></span>
              <span className="format__label">Venture Synthesis</span>
              <span className="format__note">Launch custom regulatory blueprints · export MSME & state compliance checklists · activate final dashboard ledger</span>
            </li>
            <li className="format__row format__row--reveal">
              <span className="format__time tnum">— —</span>
              <span className="format__label">Blueprints Issued</span>
              <span className="format__note">Fully synthesized and compiled within 48 hours for immediate physical execution in India</span>
            </li>
          </ol>

          <div className="format__cta">
            <button 
              className="cta cta--primary cta--lg" 
              onClick={onLaunch}
            >
              <span>Save your spot</span>
              <span aria-hidden="true">→</span>
            </button>
            <p className="format__cta-note tnum">— Wave 01 of 3 · 480 cap · public registration opens 09 Sep 2026</p>
          </div>
        </section>

        {/* ─── Why · Pitch ────────────────────────────────────── */}
        <section className="why" id="why" aria-labelledby="why-h">
          <header className="section-head">
            <p className="section-eyebrow"><span class="num tnum">02</span> · Core Philosophy</p>
            <h2 className="section-h" id="why-h">A platform for people still building at 2 AM.</h2>
          </header>

          <div className="why__body">
            <p className="why__lead">
              Rapid scaling. Zero friction. Absolute regulatory clarity. 480 founders, engineers, and suppliers mapping assets, geocoding footprints, and unlocking MSME pipelines directly from our co-piloted console. Start registration at seven. Ship when the sun rises.
            </p>
            <p>
              Standard incubators are fine. But the compliance guidelines that actually make or break a venture in India — state-wise filings, real-time capital evaluation, interactive geo-precision — don't happen in high-rise consulting offices. They happen when you log real assets, late, and let AI synthesis trace custom roadmaps against local MSME, GSTIN, or FSSAI regulatory frameworks.
            </p>
            <p>
              Zenith Venture Engine is built for that. <em>No pitches. No theoretical slide decks.</em> Direct interactive capital ledgers. Stateful chatbot advisors that persist dialogue streams across page refreshes. Real coordinates hidden automatically from the front-end to streamline physical deployment.
            </p>
            <p className="why__signoff">— Incubated strictly for physical resource synthesis in India.</p>
          </div>
        </section>

        {/* ─── Programme Grid · Feature Modules ───────────────────────── */}
        <section className="program" id="program" aria-labelledby="program-h">
          <header className="section-head">
            <p className="section-eyebrow"><span className="num tnum">03</span> · Incubation Engine Modules</p>
            <h2 className="section-h" id="program-h">Interactive Platform Capabilities</h2>
            <p className="section-note">Gemini-powered recommendation algorithms live · stateful MSME logs operational · coordinates auto-suggestions active.</p>
          </header>

          <ul className="program__grid">
            <li className="card card--keynote">
              <p className="card__time tnum">Step 01</p>
              <p className="card__type">Capital tracking</p>
              <h3 className="card__h">Smart Capital Ledger.</h3>
              <p className="card__sub">Audit and aggregate liquid capital, asset limits, and resource runways with live numeric accumulation formulas.</p>
              <p className="card__name">— MSME standard compliance</p>
            </li>

            <li className="card card--launch">
              <p className="card__time tnum">Step 02</p>
              <p className="card__type">Spatial mapping</p>
              <h3 className="card__h">Intelligent Location Mapping.</h3>
              <p className="card__sub">Eradicate manual coordinate inputs. Pull debounced address selections via live OpenStreetMap lookup engines seamlessly.</p>
              <p className="card__name">— OSM Nominatim autocomplete</p>
            </li>

            <li className="card card--talk">
              <p className="card__time tnum">Step 03</p>
              <p className="card__type">Artificial intelligence</p>
              <h3 className="card__h">Interactive Venture Co-Pilot.</h3>
              <p className="card__sub">Engage with a stateful Gemini consultant to synthesize custom regulatory pathways, tracking MSME, GSTIN, FSSAI, and BIS requirements.</p>
              <p className="card__name">— Gemini context-aware synthesis</p>
            </li>

            <li className="card card--tba">
              <p className="card__time tnum">Step 04</p>
              <p className="card__type">Cache layer</p>
              <h3 className="card__h">Suggestions TTL Caching.</h3>
              <p className="card__sub">Dynamic startup recommendations are stored in a dedicated high-performance memory cache. Automatically evicts when assets undergo edits.</p>
              <p className="card__name">— 15-minute TTL protection</p>
            </li>

            <li className="card card--launch">
              <p className="card__time tnum">Step 05</p>
              <p className="card__type">Regulatory check</p>
              <h3 className="card__h">Indian State Filings Synthesis.</h3>
              <p className="card__sub">Instantly match your asset locations against state laws to generate MSME, GSTIN, FSSAI, and local manufacturing clearances blueprints automatically.</p>
              <p className="card__name">— immediate state checks</p>
            </li>

            <li className="card card--closing">
              <p className="card__time tnum">Step 06</p>
              <p className="card__type">Portfolio portal</p>
              <h3 className="card__h">Founder & Investor Synergy.</h3>
              <p className="card__sub">Export completed venture blueprints directly to active entrepreneur or supplier cohorts to establish immediate capital runways.</p>
              <p className="card__name">— dynamic platform dashboard</p>
            </li>
          </ul>
        </section>

        {/* ─── RSVP · Waitlist Form ───────────────────────────── */}
        <section className="rsvp" id="rsvp" aria-labelledby="rsvp-h">
          <div className="rsvp__inner">
            <p className="section-eyebrow"><span className="num tnum">04</span> · Early access</p>
            <h2 className="rsvp__h" id="rsvp-h">Launch your venture portal today.</h2>
            <p className="rsvp__lead">
              Join our active Indian incubation waitlist and gain early entry to the platform. We send early cohort blueprints and location coordinates directly to your mail inbox — zero hassle.
            </p>

            <form className="rsvp__form" onSubmit={handleWaitlistSubmit} novalidate>
              <div className="rsvp__row">
                <label className="rsvp__field">
                  <span className="rsvp__field-label">Email Address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.in"
                    required
                    disabled={formState === "loading" || formState === "success"}
                  />
                </label>
                <button 
                  className="cta cta--primary cta--lg" 
                  type="submit"
                  disabled={formState === "loading" || formState === "success" || !email}
                >
                  <span>{formState === "loading" ? "Entering waitlist..." : "Get on the list"}</span>
                  <span className="cta__arrow" aria-hidden="true">→</span>
                </button>
              </div>
              <p className="rsvp__help">
                <span className="tnum">Wave 01 · MSME Tier</span> · <span className="tnum">Wave 02 · Founder Tier</span> · <span className="tnum">Wave 03 · Enterprise Tier</span> at checkout, capacity permitting.
              </p>
              {formState === "success" && (
                <output className="rsvp__success" aria-live="polite">
                  ✔ Successfully registered! Check your email inbox for early access credentials.
                </output>
              )}
            </form>
          </div>
        </section>

        {/* ─── FAQ · Accordion Drawer ───────────────────────────── */}
        <section className="faq" id="faq" aria-labelledby="faq-h">
          <header className="section-head">
            <p className="section-eyebrow"><span className="num tnum">05</span> · Questions</p>
            <h2 className="section-h" id="faq-h">A few honest answers.</h2>
          </header>

          <div className="faq__list">
            <details className="faq__item">
              <summary>
                <span>What exactly is Zenith Venture Engine?</span>
                <span className="faq__chev" aria-hidden="true">+</span>
              </summary>
              <div className="faq__a">
                <p>Zenith is a premium, AI-driven business incubation platform for India. It integrates seed capital ledgers, debounced geocoding search autocompletes, and stateful AI chatbot advisors in a high-contrast editorial dark viewport, enabling modern founders to synthesize regulatory compliance blueprints in minutes.</p>
              </div>
            </details>

            <details className="faq__item">
              <summary>
                <span>Who comes to the Incubation Space?</span>
                <span className="faq__chev" aria-hidden="true">+</span>
              </summary>
              <div className="faq__a">
                <p>A structured mix of entrepreneurs setting up new startups, physical suppliers logging physical resource runtimes, and Indian investors scouting verified compliance-ready business portfolios across MSME domains.</p>
              </div>
            </details>

            <details className="faq__item">
              <summary>
                <span>Where is the physical data located?</span>
                <span className="faq__chev" aria-hidden="true">+</span>
              </summary>
              <div className="faq__a">
                <p>All assets and geolocations are persisted securely in a MongoDB Atlas database, enabling rapid geographic mapping via Leaflet.js and live autocomplete requests to OpenStreetMap's geocoding APIs.</p>
              </div>
            </details>

            <details className="faq__item">
              <summary>
                <span>How does the cache logic work?</span>
                <span className="faq__chev" aria-hidden="true">+</span>
              </summary>
              <div className="faq__a">
                <p>To avoid token fatigue and redundant computation pipelines, all generated recommendations are preserved in a cache with a strict 15-minute TTL. The moment you update your ledger, the cache automatically evicts to compile new recommendations from Gemini.</p>
              </div>
            </details>

            <details className="faq__item">
              <summary>
                <span>Is my business blueprint kept secure?</span>
                <span className="faq__chev" aria-hidden="true">+</span>
              </summary>
              <div className="faq__a">
                <p>Yes. All communication endpoints are protected by decoupled JWT guards and secure middlewares, and all physical coordinates are hidden from the frontend modals to block unauthorized inspect-panel queries.</p>
              </div>
            </details>

            <details className="faq__item">
              <summary>
                <span>I'd like to present my venture to investors. Can I?</span>
                <span className="faq__chev" aria-hidden="true">+</span>
              </summary>
              <div className="faq__a">
                <p>Absolutely. You can log seed capital assets to instantly compile your MSME score, share operational city benchmarks, and chat with the AI Advisor to refine your financial blueprints prior to investor audit checks.</p>
              </div>
            </details>
          </div>
        </section>

      </main>

      {/* ─── Footer ──────────────────────────── */}
      <footer className="footer">
        <div className="footer__inner">
          <p className="footer__statement">
            <em>Built late. Shipped live.</em> One engine — for the Indian entrepreneurs who'd be coding tonight anyway.
          </p>
          <div className="footer__meta">
            <p className="footer__line tnum">Zenith / 26 · Mapped strictly for physical resource synthesis in India.</p>
            <ul className="footer__links">
              <li><a href="#main">Top</a></li>
              <li><a href="#format">Cohort Plan</a></li>
              <li><a href="#program">Core Modules</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
