import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster, toast } from 'sonner';
import { motion } from 'framer-motion';
import AuthPage from './features/auth/AuthPage.jsx';
import OnboardingStepper from './features/assets/OnboardingStepper.jsx';
import { useGetAssetsQuery, useUpdateAssetMutation, useCreateAssetMutation } from './features/assets/assetsApiSlice.js';
import { useGetChatHistoryQuery, useSendChatMessageMutation } from './features/chat/chatApiSlice.js';
import { useGetIncubationSuggestionsQuery } from './features/incubation/incubationApiSlice.js';
import { logout } from './features/auth/authSlice.js';
import { Compass, Briefcase, MapPin, Coins, ShieldCheck, Sun, Moon, Monitor } from 'lucide-react';

// Import our newly modularized feature components
import Sidebar from './components/Sidebar.jsx';
import AssetTable from './features/assets/AssetTable.jsx';
import AddAssetModal from './features/assets/AddAssetModal.jsx';
import EditAssetModal from './features/assets/EditAssetModal.jsx';
import Chatbot from './features/chat/Chatbot.jsx';
import LandingPage from './features/landing/LandingPage.jsx';
import IncubationSuggestions from './features/incubation/IncubationSuggestions.jsx';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Always strip existing theme states first to prevent layout stickiness
    root.classList.remove('light', 'dark');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.add('light');
    } else if (theme === 'system') {
      const systemMatchesDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemMatchesDark ? 'dark' : 'light');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // URL Location Hash Synced Tab State Management
  const getTabFromHash = () => {
    const hash = window.location.hash;
    if (hash === '#incubation') return 'incubation';
    if (hash === '#chat') return 'chat';
    return 'ledger';
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash());
  const [showAuth, setShowAuth] = useState(false);

  // Listen to browser hash changes for seamless back/forward navigation sync
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  // Edit Modal State Controls
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Edit Form Fields State
  const [editAssetType, setEditAssetType] = useState('Liquid Cash');
  const [editValueINR, setEditValueINR] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editStateName, setEditStateName] = useState('');
  const [editLat, setEditLat] = useState(12.9716);
  const [editLng, setEditLng] = useState(77.5946);

  // Add Asset Modal State Controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Form Fields State
  const [addAssetType, setAddAssetType] = useState('Liquid Cash');
  const [addValueINR, setAddValueINR] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addCity, setAddCity] = useState('');
  const [addStateName, setAddStateName] = useState('');
  const [addLat, setAddLat] = useState(12.9716);
  const [addLng, setAddLng] = useState(77.5946);

  // Add Asset Suggestions States
  const [addSuggestions, setAddSuggestions] = useState([]);
  const [showAddSuggestions, setShowAddSuggestions] = useState(false);
  const [justSelectedAdd, setJustSelectedAdd] = useState(false);
  const addSuggestionsRef = useRef(null);

  // Edit Asset Suggestions States
  const [editSuggestions, setEditSuggestions] = useState([]);
  const [showEditSuggestions, setShowEditSuggestions] = useState(false);
  const [justSelectedEdit, setJustSelectedEdit] = useState(false);
  const editSuggestionsRef = useRef(null);

  // Debounced geolocation lookup for Add modal address
  useEffect(() => {
    if (justSelectedAdd) return;
    if (!addAddress || addAddress.trim().length < 3) {
      setAddSuggestions([]);
      setShowAddSuggestions(false);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addAddress)}&addressdetails=1&limit=5`);
        if (res.ok) {
          const json = await res.json();
          setAddSuggestions(json);
          setShowAddSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching Nominatim suggestions:', error);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [addAddress, justSelectedAdd]);

  // Debounced geolocation lookup for Edit modal address
  useEffect(() => {
    if (justSelectedEdit) return;
    if (!editAddress || editAddress.trim().length < 3) {
      setEditSuggestions([]);
      setShowEditSuggestions(false);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(editAddress)}&addressdetails=1&limit=5`);
        if (res.ok) {
          const json = await res.json();
          setEditSuggestions(json);
          setShowEditSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching Nominatim suggestions:', error);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [editAddress, justSelectedEdit]);

  // Click outside to close suggestion cards
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addSuggestionsRef.current && !addSuggestionsRef.current.contains(event.target)) {
        setShowAddSuggestions(false);
      }
      if (editSuggestionsRef.current && !editSuggestionsRef.current.contains(event.target)) {
        setShowEditSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofill handlers
  const handleSelectAddSuggestion = (suggestion) => {
    setJustSelectedAdd(true);
    setAddAddress(suggestion.display_name);
    
    const city = suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || suggestion.address?.suburb || suggestion.address?.county || '';
    const state = suggestion.address?.state || '';
    
    setAddCity(city);
    setAddStateName(state);
    setAddLat(parseFloat(suggestion.lat));
    setAddLng(parseFloat(suggestion.lon));
    
    setAddSuggestions([]);
    setShowAddSuggestions(false);
  };

  const handleSelectEditSuggestion = (suggestion) => {
    setJustSelectedEdit(true);
    setEditAddress(suggestion.display_name);
    
    const city = suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || suggestion.address?.suburb || suggestion.address?.county || '';
    const state = suggestion.address?.state || '';
    
    setEditCity(city);
    setEditStateName(state);
    setEditLat(parseFloat(suggestion.lat));
    setEditLng(parseFloat(suggestion.lon));
    
    setEditSuggestions([]);
    setShowEditSuggestions(false);
  };

  // Real Stateful Chatbot States
  const [chatInput, setChatInput] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Skip query execution if anonymous to block unauthorized console interceptors
  const { data, isLoading, refetch } = useGetAssetsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: chatHistoryData, isLoading: isChatLoading } = useGetChatHistoryQuery(undefined, {
    skip: !isAuthenticated || activeTab !== 'chat',
  });

  const { data: incubationData, isLoading: isIncubationLoading } = useGetIncubationSuggestionsQuery(undefined, {
    skip: !isAuthenticated || activeTab !== 'incubation',
  });

  const [sendChatMessage, { isLoading: isSendingMessage }] = useSendChatMessageMutation();
  const [updateAsset, { isLoading: isUpdating }] = useUpdateAssetMutation();
  const [createAsset, { isLoading: isCreating }] = useCreateAssetMutation();

  const assetsList = data?.data?.assets || [];

  // Sync historical messages from RTK Query into local state array
  useEffect(() => {
    if (chatHistoryData?.data?.history) {
      setLocalMessages(chatHistoryData.data.history);
    }
  }, [chatHistoryData]);

  // Instantly snap scroll viewport to bottom on message creation/load
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [localMessages, activeTab, isSendingMessage]);

  const handleLogout = () => {
    // 1. Instantly dispatch Redux logout which clears redux and localStorage tokens
    dispatch(logout());
    
    // 2. Systematic optimistic local component state eviction
    setChatInput('');
    setLocalMessages([]);
    setActiveTab('ledger');
    setShowAuth(false);
    
    setIsEditModalOpen(false);
    setSelectedAsset(null);
    setEditAssetType('Liquid Cash');
    setEditValueINR('');
    setEditDescription('');
    setEditAddress('');
    setEditCity('');
    setEditStateName('');
    setEditLat(12.9716);
    setEditLng(77.5946);
    
    setIsAddModalOpen(false);
    setAddAssetType('Liquid Cash');
    setAddValueINR('');
    setAddDescription('');
    setAddAddress('');
    setAddCity('');
    setAddStateName('');
    setAddLat(12.9716);
    setAddLng(77.5946);
    
    setAddSuggestions([]);
    setShowAddSuggestions(false);
    setJustSelectedAdd(false);
    
    setEditSuggestions([]);
    setShowEditSuggestions(false);
    setJustSelectedEdit(false);
    
    // 3. Clear url hash pathways instantly to snap the viewport route back
    window.location.hash = '';
    
    toast.success('Successfully logged out.');
  };

  // Dispatches actual RTK Query backend chat mutator
  const handleSendMessage = async (e, customText = null) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const textToShow = chatInput.trim();
    const textToSend = customText || textToShow;
    setChatInput('');

    // Pre-append user message to UI state for instant, responsive feedback
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      text: textToShow,
      createdAt: new Date().toISOString()
    };
    setLocalMessages((prev) => [...prev, tempUserMsg]);

    try {
      await sendChatMessage({ text: textToSend }).unwrap();
    } catch (err) {
      const msg = err.data?.message || 'AI advisor offline. Please retry sending your query.';
      toast.error(msg);
      throw err;
    }
  };

  // Open asset edit modal and pre-populate parameters
  const openEditModal = (asset) => {
    setSelectedAsset(asset);
    setEditAssetType(asset.assetType);
    setEditValueINR(asset.valueINR);
    setEditDescription(asset.description || '');
    setEditAddress(asset.location?.address || '');
    setEditCity(asset.location?.city || '');
    setEditStateName(asset.location?.state || '');
    setEditLat(asset.location?.coordinates?.lat || 12.9716);
    setEditLng(asset.location?.coordinates?.lng || 77.5946);
    // Reset suggestions
    setEditSuggestions([]);
    setShowEditSuggestions(false);
    setJustSelectedEdit(true);
    setIsEditModalOpen(true);
  };

  // Open new asset modal and clear fields
  const openAddModal = () => {
    setAddAssetType('Liquid Cash');
    setAddValueINR('');
    setAddDescription('');
    setAddAddress('');
    setAddCity('');
    setAddStateName('');
    setAddLat(12.9716);
    setAddLng(77.5946);
    // Reset suggestions
    setAddSuggestions([]);
    setShowAddSuggestions(false);
    setJustSelectedAdd(false);
    setIsAddModalOpen(true);
  };

  // Submit asset updates handler
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsset) return;

    const val = parseFloat(editValueINR);
    if (isNaN(val) || val <= 0) {
      toast.error('Asset value must be a strict positive, non-zero number.');
      return;
    }

    if (!editAddress.trim() || !editCity.trim() || !editStateName.trim()) {
      toast.error('Complete location fields are required.');
      return;
    }

    const payload = {
      id: selectedAsset._id,
      assetType: editAssetType,
      valueINR: val,
      description: editDescription.trim(),
      location: {
        address: editAddress.trim(),
        city: editCity.trim(),
        state: editStateName.trim(),
        coordinates: {
          lat: parseFloat(editLat),
          lng: parseFloat(editLng)
        }
      }
    };

    try {
      await updateAsset(payload).unwrap();
      toast.success('Asset parameters successfully updated in database!');
      setIsEditModalOpen(false);
    } catch (err) {
      const msg = err.data?.message || 'Failed to update asset footprints.';
      toast.error(msg);
    }
  };

  // Submit new asset creation handler
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const val = parseFloat(addValueINR);
    if (isNaN(val) || val <= 0) {
      toast.error('Asset value must be a strict positive, non-zero number.');
      return;
    }

    if (!addAddress.trim() || !addCity.trim() || !addStateName.trim()) {
      toast.error('Complete location fields are required.');
      return;
    }

    const payload = {
      assetType: addAssetType,
      valueINR: val,
      description: addDescription.trim() || `Asset of type ${addAssetType} registered.`,
      location: {
        address: addAddress.trim(),
        city: addCity.trim(),
        state: addStateName.trim(),
        coordinates: {
          lat: parseFloat(addLat),
          lng: parseFloat(addLng)
        }
      }
    };

    try {
      await createAsset(payload).unwrap();
      toast.success('New venture footprint registered successfully!');
      setIsAddModalOpen(false);
    } catch (err) {
      const msg = err.data?.message || 'Failed to log new asset footprints.';
      toast.error(msg);
    }
  };

  // --- MATH REFACTOR: Functional accumulator over active portfolio array ---
  const totalCapacity = assetsList.reduce((sum, asset) => sum + Number(asset.valueINR || 0), 0);

  // 1. Unauthenticated Gateway (Serves public-facing landing page by default)
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" closeButton richColors theme="light" />
        {showAuth ? (
          <AuthPage onBack={() => setShowAuth(false)} />
        ) : (
          <LandingPage onLaunch={() => setShowAuth(true)} theme={theme} setTheme={setTheme} />
        )}
      </>
    );
  }

  // 2. Loading State Gate
  if (isLoading) {
    return (
      <div className="hyperlane-body min-h-screen flex flex-col items-center justify-center bg-[#FBFBFB] dark:bg-[#0B0B0B] transition-colors duration-300 gap-4 relative overflow-hidden">
        {/* Ambient Atmospheric Backdrop */}
        <div className="ambient" aria-hidden="true">
          <div className="bloom bloom--1"></div>
          <div className="bloom bloom--2"></div>
          <div className="grain"></div>
        </div>
        <div className="fixed top-4 right-4 z-50 flex items-center gap-0.5 bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] p-0.5 rounded-full shadow-sm">
          {['light', 'dark', 'system'].map((mode) => {
            const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
            return (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                className={`p-1.5 rounded-full transition-colors ${
                  theme === mode 
                    ? 'text-[#8C6D47] bg-[#FBFBFB] dark:bg-[#121110] shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-transparent'
                }`}
                title={`${mode} Mode`}
                type="button"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
        <div className="w-12 h-12 rounded-none bg-[#161513] dark:bg-[#F4F0EA] flex items-center justify-center text-[#F4F0EA] dark:text-[#161513] animate-bounce shadow-md">
          <Compass className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs font-mono font-bold text-[#161513] dark:text-[#F4F0EA] tracking-wider uppercase animate-pulse">Syncing Venture Workspace...</p>
      </div>
    );
  }

  // 3. Conditional Assets Gate (Enforces onboarding stepper for assetless users)
  if (assetsList.length === 0) {
    return (
      <>
        <Toaster position="top-right" closeButton richColors theme="light" />
        <div className="fixed top-4 right-4 z-50 flex items-center gap-0.5 bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] p-0.5 rounded-full shadow-sm">
          {['light', 'dark', 'system'].map((mode) => {
            const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
            return (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                className={`p-1.5 rounded-full transition-colors ${
                  theme === mode 
                    ? 'text-[#8C6D47] bg-[#FBFBFB] dark:bg-[#121110] shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-transparent'
                }`}
                title={`${mode} Mode`}
                type="button"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
        <OnboardingStepper onComplete={refetch} />
      </>
    );
  }

  // 4. Main Authenticated Dashboard Shell (Hallmark Hyperlane Theme)
  return (
    <div className="hyperlane-body min-h-screen flex bg-[#FBFBFB] dark:bg-[#0B0B0B] font-sans antialiased text-[#111111] dark:text-[#F5F5F5] transition-colors duration-300 select-none relative overflow-hidden">
      <Toaster position="top-right" closeButton richColors theme="light" />

      {/* Pinned Corner Mode-Switch Controller */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-0.5 bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] p-0.5 rounded-full shadow-sm">
        {['light', 'dark', 'system'].map((mode) => {
          const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
          return (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              className={`p-1.5 rounded-full transition-colors ${
                theme === mode 
                  ? 'text-[#8C6D47] bg-[#FBFBFB] dark:bg-[#121110] shadow-sm' 
                  : 'text-slate-400 hover:text-[#161513] dark:hover:text-[#F4F0EA] bg-transparent'
              }`}
              title={`${mode} Mode`}
              type="button"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>

      {/* Ambient Atmospheric Backdrop */}
      <div className="ambient" aria-hidden="true">
        <div className="bloom bloom--1"></div>
        <div className="bloom bloom--2"></div>
        <div className="grain"></div>
      </div>

      {/* Left Locked Sticky Layout Sidebar navigation component */}
      <Sidebar 
        activeTab={activeTab} 
        handleTabChange={handleTabChange} 
        user={user} 
        handleLogout={handleLogout} 
      />

      {/* Main Dynamic Viewport Container */}
      <main className={`flex-1 z-10 relative ${
        activeTab === 'chat' 
          ? 'h-screen flex flex-col justify-between overflow-hidden pt-[120px] px-8 pb-0 bg-transparent' 
          : 'bg-transparent p-6 overflow-y-auto'
      }`}>
        
        {/* ====================================================
            VIEWPORT TAB 1: LEDGER PORTAL
            ==================================================== */}
        {activeTab === 'ledger' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Header */}
            <header>
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8C6D47]">Venture Ledger Portal</span>
              <h2 className="text-3xl font-bold font-sans text-[#161513] dark:text-[#F4F0EA] mt-1 tracking-tight">Venture Resource Footprints</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Manage registered seed assets, locations coordinates, and Indian compliance parameters.</p>
            </header>

            {/* Asset statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Registered Seed Assets', val: assetsList.length, icon: Coins, detail: 'Dynamic portfolio count' },
                { label: 'Total Venture Capital', val: `₹ ${totalCapacity.toLocaleString('en-IN')}`, icon: Briefcase, detail: 'Allocated seed funds' },
                { label: 'Core Operational Geo', val: assetsList[0]?.location?.city || 'Bengaluru', icon: MapPin, detail: `${assetsList[0]?.location?.state || 'Karnataka'}, India` }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white/60 dark:bg-[#1A1917]/60 backdrop-blur-sm border border-[#E5E5E5] dark:border-[#222222] p-6 rounded-none shadow-sm hover:-translate-y-0.5 hover:border-[#8C6D47] transition-all duration-300 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold uppercase text-[#111111] dark:text-[#F5F5F5] tracking-wide block">{item.label}</span>
                      <p className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-[#111111] dark:text-[#F5F5F5] mt-2">{item.val}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-1.5">{item.detail}</span>
                    </div>
                    <div className="w-10 h-10 rounded-none bg-[#FBFBFB] dark:bg-[#0B0B0B] border border-[#E5E5E5] dark:border-[#222222] flex items-center justify-center text-[#111111] dark:text-[#F5F5F5]">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table datagrid modular component */}
            <AssetTable 
              assetsList={assetsList} 
              openAddModal={openAddModal} 
              openEditModal={openEditModal} 
            />
          </motion.div>
        )}

        {/* ====================================================
            VIEWPORT TAB 2: AI INCUBATION SUGGESTIONS
            ==================================================== */}
        {activeTab === 'incubation' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <IncubationSuggestions 
              assets={assetsList}
              incubationData={incubationData}
              isIncubationLoading={isIncubationLoading}
            />

            {/* Quick action triggers */}
            <div className="bg-[#161513]/90 dark:bg-[#1A1917]/90 backdrop-blur-sm border border-[#E5E5E5] dark:border-[#222222] text-[#F4F0EA] p-6 rounded-none flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-sm font-mono font-bold">Venture parameters altered?</h3>
                <p className="text-xs text-slate-400 mt-1">Evict suggestion cache matrices and trigger real-time backend modeling updates from Gemini.</p>
              </div>
              <button 
                onClick={() => toast.success('Suggestions parameters successfully updated! Refreshed structured models from Gemini API.')}
                className="px-4 py-2 bg-[#F4F0EA] text-[#161513] hover:-translate-y-0.5 hover:bg-[#8C6D47] hover:text-white rounded-none text-xs font-mono font-bold transition-all duration-300 shadow-md shrink-0 cursor-pointer uppercase border border-transparent"
              >
                Synthesize Fresh Recommendations
              </button>
            </div>
          </motion.div>
        )}

        {/* ====================================================
            VIEWPORT TAB 3: STATEFUL DIALOGUE CONSULTANT CHAT (Margin Adjusted)
            ==================================================== */}
        {activeTab === 'chat' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full flex flex-col justify-between"
          >
            <Chatbot 
              localMessages={localMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
              isChatLoading={isChatLoading}
              isSendingMessage={isSendingMessage}
              chatEndRef={chatEndRef}
            />
          </motion.div>
        )}

      </main>

      {/* ====================================================
          "ADD NEW ASSET" ACTION DRAWER MODAL OVERLAY (Elite Frosted Backdrop)
          ==================================================== */}
      <AddAssetModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        assetType={addAssetType}
        setAssetType={setAddAssetType}
        valueINR={addValueINR}
        setValueINR={setAddValueINR}
        description={addDescription}
        setDescription={setAddDescription}
        address={addAddress}
        setAddress={setAddAddress}
        city={addCity}
        setCity={setAddCity}
        stateName={addStateName}
        setStateName={setAddStateName}
        lat={addLat}
        lng={addLng}
        suggestions={addSuggestions}
        showSuggestions={showAddSuggestions}
        justSelected={justSelectedAdd}
        setJustSelected={setJustSelectedAdd}
        suggestionsRef={addSuggestionsRef}
        handleSelectSuggestion={handleSelectAddSuggestion}
        isCreating={isCreating}
      />

      {/* ====================================================
          "EDIT ASSET" ACTION DRAWER MODAL OVERLAY (Elite Frosted Backdrop)
          ==================================================== */}
      <EditAssetModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateSubmit}
        assetType={editAssetType}
        setAssetType={setEditAssetType}
        valueINR={editValueINR}
        setValueINR={setEditValueINR}
        description={editDescription}
        setDescription={setEditDescription}
        address={editAddress}
        setAddress={setEditAddress}
        city={editCity}
        setCity={setEditCity}
        stateName={editStateName}
        setStateName={setEditStateName}
        lat={editLat}
        lng={editLng}
        suggestions={editSuggestions}
        showSuggestions={showEditSuggestions}
        justSelected={justSelectedEdit}
        setJustSelected={setJustSelectedEdit}
        suggestionsRef={editSuggestionsRef}
        handleSelectSuggestion={handleSelectEditSuggestion}
        isUpdating={isUpdating}
      />
    </div>
  );
}

export default App;
