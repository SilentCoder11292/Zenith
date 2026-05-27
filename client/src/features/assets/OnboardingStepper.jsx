import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useCreateAssetMutation } from './assetsApiSlice.js';
import { logout } from '../auth/authSlice.js';
import { Coins, MapPin, CheckCircle, Compass, LogOut, ArrowRight, ArrowLeft } from 'lucide-react';

import 'leaflet/dist/leaflet.css';

// Central Leaflet Vite Image Asset Fix: Override with custom inline SVG marker icon matching slate design
const customMarkerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%238C6D47" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="white"></circle>
    </svg>
  `),
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

/**
 * Child helper component to register coordinate captures on Leaflet Map click events
 */
const MapEventsHandler = ({ setFormData }) => {
  useMapEvents({
    click(e) {
      setFormData(prev => ({
        ...prev,
        latitude: parseFloat(e.latlng.lat.toFixed(6)),
        longitude: parseFloat(e.latlng.lng.toFixed(6))
      }));
    }
  });
  return null;
};

const OnboardingStepper = ({ onComplete }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  
  // Multi-step State Tracking
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);

  // Asset Form parameters state (unified local wizard state)
  const [formData, setFormData] = useState({
    category: 'Liquid Cash',
    valueINR: '',
    description: '',
    physicalAddress: '',
    latitude: null,
    longitude: null
  });

  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Default coordinate center when lat/lng is null (defaults to Bengaluru)
  const mapCenterLat = formData.latitude || 12.9716;
  const mapCenterLng = formData.longitude || 77.5946;

  // Next Step Action Validation
  const handleNext = () => {
    if (step === 1) {
      const val = parseFloat(formData.valueINR);
      if (isNaN(val) || val <= 0) {
        toast.error('Capital value must be a strict positive, non-zero number.');
        return;
      }
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      if (!formData.physicalAddress.trim() || !city.trim() || !stateName.trim()) {
        toast.error('Please fill in complete physical location address parameters.');
        return;
      }
      setDirection(1);
      setStep(3);
    }
  };

  // Back Step Action
  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Action Execution: Fires native fetch asset mutation and refreshes global context data
  const handleExecuteSynthesis = async () => {
    // Cleanly parse valueINR as float value, format address with city and state, and default coordinates
    const finalPayload = {
      ...formData,
      physicalAddress: `${formData.physicalAddress}, ${city}, ${stateName}`,
      latitude: formData.latitude || 12.9716,
      longitude: formData.longitude || 77.5946,
      valueINR: parseFloat(formData.valueINR)
    };

    try {
      setIsCreating(true);
      // Point to our active asset ledger endpoint using raw fetch API
      const response = await fetch('http://localhost:5000/api/v1/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to synthesize asset profile.');
      }

      toast.success('Capital resources successfully synthesized! Unlocking dashboard workspace...');
      
      // Trigger global refetch hook to update the central dashboard cards instantly
      if (typeof onComplete === 'function') {
        onComplete();
      }
    } catch (error) {
      const msg = error.message || 'Failed to synthesize asset profile. Please check validation requirements.';
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Successfully logged out.');
  };

  // Custom step transitions variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir < 0 ? 120 : -120,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] dark:bg-[#0B0B0B] text-[#111111] dark:text-[#F5F5F5] p-4 font-sans antialiased relative overflow-hidden select-none transition-colors duration-300">
      {/* Background Ambient Glowing Nodes */}
      <div 
        className="absolute top-[-10%] left-[-15%] w-[55%] h-[55%] rounded-full bg-[#8C6D47]/10 dark:bg-[#8C6D47]/5 blur-[130px] pointer-events-none" 
      />
      <div 
        className="absolute bottom-[-10%] right-[-15%] w-[55%] h-[55%] rounded-full bg-[#8C6D47]/10 dark:bg-[#8C6D47]/5 blur-[130px] pointer-events-none" 
      />

      <div className="w-full max-w-2xl bg-white/60 dark:bg-[#1A1917]/60 backdrop-blur-sm border border-[#E5E5E5] dark:border-[#222222] rounded-none shadow-xl p-6 relative z-10 text-[#161513] dark:text-[#F4F0EA] transition-colors duration-200">
        
        {/* Wizard Header Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-[#E5E5E5] dark:border-[#222222] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-none bg-[#161513] dark:bg-[#F4F0EA] flex items-center justify-center text-[#F4F0EA] dark:text-[#161513] shadow-md">
              <Compass className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#161513] dark:text-[#F4F0EA] leading-tight">Venture Setup Wizard</h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Initialize resource credentials for {user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E5E5] dark:border-[#222222] rounded-none text-slate-500 dark:text-slate-400 hover:text-[#161513] dark:hover:text-[#F4F0EA] hover:bg-slate-50 dark:hover:bg-slate-900 text-[11px] font-mono font-bold transition-colors duration-150 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Stepper Steps Indicators */}
        <div className="grid grid-cols-3 gap-3 mb-6 relative">
          {[
            { stepNum: 1, label: 'Capital Profile', icon: Coins },
            { stepNum: 2, label: 'Resource Mapping', icon: MapPin },
            { stepNum: 3, label: 'Venture Synthesis', icon: CheckCircle }
          ].map((item) => {
            const Icon = item.icon;
            const active = step === item.stepNum;
            const completed = step > item.stepNum;
            return (
              <div 
                key={item.stepNum}
                className={`flex items-center gap-2 p-2 rounded-none border transition-all duration-200 ${
                  active 
                    ? 'border-[#8C6D47] bg-[#161513]/5 dark:bg-white/5' 
                    : completed
                    ? 'border-[#E5E5E5] dark:border-[#222222] bg-[#F4F0EA]/30 dark:bg-[#121110]/30 opacity-70'
                    : 'border-[#E5E5E5]/40 dark:border-[#222222]/40 opacity-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-none flex items-center justify-center text-[11px] font-bold ${
                  active || completed 
                    ? 'bg-[#161513] dark:bg-[#F4F0EA] text-white dark:text-[#161513]' 
                    : 'bg-[#F4F0EA] dark:bg-[#121110] text-slate-400 dark:text-slate-500'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-[9px] font-mono uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Step 0{item.stepNum}</span>
                  <p className="text-[10px] font-semibold text-[#161513] dark:text-[#F4F0EA] mt-0.5 leading-none">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Slidably Animated Content Container */}
        <div className="min-h-[300px] overflow-hidden relative mb-6">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* ==========================================
                  STEP 1: CAPITAL ALLOCATION & PROFILE
                  ========================================== */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#161513] dark:text-[#F4F0EA]">Configure Initial Startup Asset</h2>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Define your core seed capital type and transaction values to seed the incubator suggestion modules.</p>
                  </div>

                  {/* Custom Segmented Radio Cards for Asset Type Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">Asset Resource Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { type: 'Liquid Cash', subtitle: 'Capital Funds' },
                        { type: 'Land', subtitle: 'Physical Real estate' },
                        { type: 'Commercial Building', subtitle: 'Office Space' },
                        { type: 'Equipment', subtitle: 'Hardware/Machines' }
                      ].map((item) => {
                        const active = formData.category === item.type;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: item.type }))}
                            className={`flex flex-col text-left p-3 rounded-none border transition-all duration-150 outline-none ${
                              active
                                ? 'border-[#8C6D47] bg-[#161513]/5 dark:bg-white/5 text-[#161513] dark:text-[#F4F0EA] ring-1 ring-[#8C6D47] font-bold'
                                : 'border-[#E5E5E5] dark:border-[#222222] text-slate-600 dark:text-slate-400 hover:border-[#8C6D47] bg-white dark:bg-[#1A1917]'
                            }`}
                          >
                            <span className="text-xs font-bold leading-none">{item.type}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-1 uppercase tracking-wide leading-none">{item.subtitle}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* INR Value input */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">Asset Value (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500">₹</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.valueINR}
                        onChange={(e) => setFormData(prev => ({ ...prev, valueINR: e.target.value }))}
                        placeholder="e.g. 500000"
                        className="w-full pl-7 pr-4 py-2 text-sm bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#161513] dark:text-[#F4F0EA] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] focus-visible:outline-none transition-all duration-150 font-semibold"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">Positive, non-zero numeric evaluation rules apply.</span>
                  </div>

                  {/* Description input */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">Resource Brief & Parameters (Optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Specify asset attributes e.g., '1000 sq ft office in downtown Tech Hub'"
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#161513] dark:text-[#F4F0EA] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] focus-visible:outline-none transition-all duration-150 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ==========================================
                  STEP 2: LOCATION & MAP MAPPING
                  ========================================== */}
              {step === 2 && (
                <div className="space-y-3.5">
                  <div>
                    <h2 className="text-sm font-bold text-[#161513] dark:text-[#F4F0EA]">Map Resource Location</h2>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Specify geographic coordinates and physical parameters to query Indian regulatory bounds.</p>
                  </div>

                  {/* Address grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Address</label>
                      <input
                        type="text"
                        value={formData.physicalAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, physicalAddress: e.target.value }))}
                        placeholder="e.g. 102 MG Road"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#161513] dark:text-[#F4F0EA] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus-visible:outline-none transition-all duration-150"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#161513] dark:text-[#F4F0EA] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus-visible:outline-none transition-all duration-150"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">State</label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="e.g. Karnataka"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#161513] dark:text-[#F4F0EA] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus-visible:outline-none transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Coordinates indicator display */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-[#F4F0EA] dark:bg-[#121110] p-2 rounded-none border border-[#E5E5E5] dark:border-[#222222] transition-colors duration-200">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Pinpoint Capture:</span>
                    <span className="font-mono">Lat: {mapCenterLat.toFixed(4)} | Lng: {mapCenterLng.toFixed(4)}</span>
                  </div>

                  {/* Leaflet Map Grid Container */}
                  <div className="h-[200px] rounded-none overflow-hidden border border-[#E5E5E5] dark:border-[#222222] z-0 relative shadow-sm transition-colors duration-200">
                    <MapContainer
                      center={[mapCenterLat, mapCenterLng]}
                      zoom={13}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[mapCenterLat, mapCenterLng]} icon={customMarkerIcon} />
                      <MapEventsHandler setFormData={setFormData} />
                    </MapContainer>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-none text-center">Click anywhere on the map grid to adjust coordinates.</span>
                </div>
              )}

              {/* ==========================================
                  STEP 3: SYNTHESIS REVIEW & MUTATE
                  ========================================== */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#161513] dark:text-[#F4F0EA]">Venture Synthesis Verification</h2>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Please review your structured assets and mapping location parameters before triggering the AI incubation engine.</p>
                  </div>

                  <div className="bg-[#F4F0EA] dark:bg-[#121110] border border-[#E5E5E5] dark:border-[#222222] rounded-none divide-y divide-[#E5E5E5] dark:divide-[#222222] overflow-hidden text-xs transition-colors duration-200">
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Resource Category</span>
                      <span className="col-span-2 font-semibold text-[#161513] dark:text-[#F4F0EA]">{formData.category}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Assigned Value</span>
                      <span className="col-span-2 font-bold text-[#161513] dark:text-[#F4F0EA] font-mono">₹ {parseFloat(formData.valueINR || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Brief Description</span>
                      <span className="col-span-2 text-slate-600 dark:text-slate-400">{formData.description.trim() || 'No custom description provided.'}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Physical Address</span>
                      <span className="col-span-2 text-[#161513] dark:text-[#F4F0EA] leading-tight">
                        {formData.physicalAddress}, {city}, {stateName}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Map Geopoint</span>
                      <span className="col-span-2 font-mono text-slate-500 dark:text-slate-400">
                        Lat: {mapCenterLat} | Lng: {mapCenterLng}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#8C6D47]/10 dark:bg-[#8C6D47]/20 border border-[#8C6D47]/30 text-[#8C6D47] rounded-none text-[11px] leading-normal flex items-start gap-2">
                    <Compass className="w-4.5 h-4.5 text-[#8C6D47] shrink-0 mt-0.5" />
                    <p>Executing Venture Synthesis registers your resource parameters and evicts the recommendation cache, prompting the Gemini engine to model custom startup opportunities for you.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between pt-5 border-t border-[#E5E5E5] dark:border-[#222222]">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={isCreating}
              className="flex items-center gap-1 px-4 py-2 border border-[#E5E5E5] dark:border-[#222222] rounded-none text-slate-500 dark:text-slate-400 hover:text-[#161513] dark:hover:text-[#F4F0EA] hover:bg-[#F4F0EA] dark:hover:bg-[#121110] text-xs font-semibold transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-[#161513] text-[#F4F0EA] dark:bg-[#F4F0EA] dark:text-[#161513] hover:bg-[#8C6D47] dark:hover:bg-[#8C6D47] dark:hover:text-white rounded-none font-mono font-bold tracking-wider uppercase transition-colors duration-150 cursor-pointer text-xs"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleExecuteSynthesis}
              disabled={isCreating}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#161513] text-[#F4F0EA] dark:bg-[#F4F0EA] dark:text-[#161513] hover:bg-[#8C6D47] dark:hover:bg-[#8C6D47] dark:hover:text-white rounded-none font-mono font-bold tracking-wider uppercase transition-all duration-150 disabled:bg-slate-400 cursor-pointer text-xs shadow-lg"
            >
              {isCreating ? 'Synthesizing Venture...' : 'Execute Venture Synthesis'}
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OnboardingStepper;
