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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230f172a" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
const MapEventsHandler = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      setCoordinates({
        lat: parseFloat(e.latlng.lat.toFixed(6)),
        lng: parseFloat(e.latlng.lng.toFixed(6))
      });
    }
  });
  return null;
};

const OnboardingStepper = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  // Multi-step State Tracking
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);

  // Asset Form parameters state
  const [assetType, setAssetType] = useState('Liquid Cash');
  const [valueINR, setValueINR] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 12.9716, lng: 77.5946 }); // Defaults to Bengaluru

  const [createAsset, { isLoading: isCreating }] = useCreateAssetMutation();

  // Next Step Action Validation
  const handleNext = () => {
    if (step === 1) {
      const val = parseFloat(valueINR);
      if (isNaN(val) || val <= 0) {
        toast.error('Capital value must be a strict positive, non-zero number.');
        return;
      }
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      if (!address.trim() || !city.trim() || !stateName.trim()) {
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

  // Final Action Execution: Fires Mongoose asset mutation and flushes suggestions recommendations cache
  const handleExecuteSynthesis = async () => {
    const payload = {
      assetType,
      valueINR: parseFloat(valueINR),
      description: description.trim() || `Asset of type ${assetType} registered during onboarding.`,
      location: {
        address: address.trim(),
        city: city.trim(),
        state: stateName.trim(),
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng
        }
      }
    };

    try {
      await createAsset(payload).unwrap();
      toast.success('Capital resources successfully synthesized! Unlocking dashboard workspace...');
    } catch (error) {
      const msg = error.data?.message || 'Failed to synthesize asset profile. Please check validation requirements.';
      toast.error(msg);
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans antialiased relative overflow-hidden select-none">
      {/* Background Ambient Glowing Nodes */}
      <div 
        className="absolute top-[-10%] left-[-15%] w-[55%] h-[55%] rounded-full bg-indigo-400/20 blur-[130px] animate-pulse pointer-events-none" 
        style={{ animationDuration: '9s' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-15%] w-[55%] h-[55%] rounded-full bg-amber-400/15 blur-[130px] animate-pulse pointer-events-none" 
        style={{ animationDuration: '7s', animationDelay: '1s' }}
      />

      <div className="w-full max-w-2xl bg-white/90 border border-slate-200 rounded-2xl shadow-xl shadow-slate-100/40 p-6 backdrop-blur-md relative z-10">
        
        {/* Wizard Header Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10">
              <Compass className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Venture Setup Wizard</h1>
              <p className="text-[10px] text-slate-400">Initialize resource credentials for {user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-[11px] font-semibold transition-colors duration-150 cursor-pointer"
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
                className={`flex items-center gap-2 p-2 rounded-xl border transition-all duration-200 ${
                  active 
                    ? 'border-slate-900 bg-slate-50/50' 
                    : completed
                    ? 'border-slate-200 bg-slate-50/30 opacity-70'
                    : 'border-slate-100 opacity-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                  active || completed ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Step 0{item.stepNum}</span>
                  <p className="text-[10px] font-semibold text-slate-700 mt-0.5 leading-none">{item.label}</p>
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
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              className="space-y-4"
            >
              {/* ==========================================
                  STEP 1: CAPITAL ALLOCATION & PROFILE
                  ========================================== */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Configure Initial Startup Asset</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Define your core seed capital type and transaction values to seed the incubator suggestion modules.</p>
                  </div>

                  {/* Custom Segmented Radio Cards for Asset Type Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 tracking-wide uppercase">Asset Resource Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { type: 'Liquid Cash', subtitle: 'Capital Funds' },
                        { type: 'Land', subtitle: 'Physical Real estate' },
                        { type: 'Commercial Building', subtitle: 'Office Space' },
                        { type: 'Equipment', subtitle: 'Hardware/Machines' }
                      ].map((item) => {
                        const active = assetType === item.type;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => setAssetType(item.type)}
                            className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-150 outline-none ${
                              active
                                ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <span className={`text-xs font-bold leading-none ${active ? 'text-slate-900' : 'text-slate-600'}`}>{item.type}</span>
                            <span className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wide leading-none">{item.subtitle}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* INR Value input */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 tracking-wide uppercase">Asset Value (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="1"
                        value={valueINR}
                        onChange={(e) => setValueINR(e.target.value)}
                        placeholder="e.g. 500000"
                        className="w-full pl-7 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus-visible:outline-none transition-all duration-150 font-medium"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 leading-none">Positive, non-zero numeric evaluation rules apply.</span>
                  </div>

                  {/* Description input */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 tracking-wide uppercase">Resource Brief & Parameters (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Specify asset attributes e.g., '1000 sq ft office in downtown Tech Hub'"
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus-visible:outline-none transition-all duration-150 resize-none"
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
                    <h2 className="text-sm font-bold text-slate-900">Map Resource Location</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Specify geographic coordinates and physical parameters to query Indian regulatory bounds.</p>
                  </div>

                  {/* Address grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 102 MG Road"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none transition-all duration-150"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none transition-all duration-150"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">State</label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="e.g. Karnataka"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none transition-all duration-150"
                        required
                      />
                    </div>
                  </div>

                  {/* Coordinates indicator display */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 uppercase tracking-wide">Pinpoint Capture:</span>
                    <span className="font-mono">Lat: {coordinates.lat.toFixed(4)} | Lng: {coordinates.lng.toFixed(4)}</span>
                  </div>

                  {/* Leaflet Map Grid Container */}
                  <div className="h-[200px] rounded-xl overflow-hidden border border-slate-200 z-0 relative shadow-sm">
                    <MapContainer
                      center={[coordinates.lat, coordinates.lng]}
                      zoom={13}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[coordinates.lat, coordinates.lng]} icon={customMarkerIcon} />
                      <MapEventsHandler setCoordinates={setCoordinates} />
                    </MapContainer>
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-none text-center">Click anywhere on the map grid to adjust coordinates.</span>
                </div>
              )}

              {/* ==========================================
                  STEP 3: SYNTHESIS REVIEW & MUTATE
                  ========================================== */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Venture Synthesis Verification</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">Please review your structured assets and mapping location parameters before triggering the AI incubation engine.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/50 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Resource Category</span>
                      <span className="col-span-2 font-semibold text-slate-800">{assetType}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Assigned Value</span>
                      <span className="col-span-2 font-bold text-slate-900 font-mono">₹ {parseFloat(valueINR).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Brief Description</span>
                      <span className="col-span-2 text-slate-600">{description.trim() || 'No custom description provided.'}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Physical Address</span>
                      <span className="col-span-2 text-slate-700 leading-tight">
                        {address}, {city}, {stateName}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Map Geopoint</span>
                      <span className="col-span-2 font-mono text-slate-500">
                        Lat: {coordinates.lat} | Lng: {coordinates.lng}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] text-indigo-700 leading-normal flex items-start gap-2">
                    <Compass className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                    <p>Executing Venture Synthesis registers your resource parameters and evicts the recommendation cache, prompting the Gemini engine to model custom startup opportunities for you.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={isCreating}
              className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors duration-150 disabled:opacity-50 cursor-pointer"
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
              className="flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-md shadow-slate-900/10 transition-colors duration-150 cursor-pointer"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleExecuteSynthesis}
              disabled={isCreating}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-lg shadow-slate-900/15 transition-all duration-150 disabled:bg-slate-400 cursor-pointer"
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
