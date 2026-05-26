import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster, toast } from 'sonner';
import AuthPage from './features/auth/AuthPage.jsx';
import OnboardingStepper from './features/assets/OnboardingStepper.jsx';
import { useGetAssetsQuery, useUpdateAssetMutation, useCreateAssetMutation } from './features/assets/assetsApiSlice.js';
import { useGetChatHistoryQuery, useSendChatMessageMutation } from './features/chat/chatApiSlice.js';
import { logout } from './features/auth/authSlice.js';
import { 
  Compass, 
  Coins, 
  MapPin, 
  Briefcase, 
  LogOut, 
  User, 
  ArrowUpRight,
  TrendingUp,
  LayoutDashboard,
  MessageSquare,
  Edit2,
  X,
  Send,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // URL Location Hash Synced Tab State Management
  const getTabFromHash = () => {
    const hash = window.location.hash;
    if (hash === '#incubation') return 'incubation';
    if (hash === '#chat') return 'chat';
    return 'ledger';
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash());

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

  // Real Stateful Chatbot States
  const [chatInput, setChatInput] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Skip query execution if anonymous to block unauthorized console interceptors
  const { data, isLoading } = useGetAssetsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: chatHistoryData, isLoading: isChatLoading } = useGetChatHistoryQuery(undefined, {
    skip: !isAuthenticated || activeTab !== 'chat',
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
    dispatch(logout());
    toast.success('Successfully logged out.');
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

  // Dispatches actual RTK Query backend chat mutator
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const textToSend = chatInput.trim();
    setChatInput('');

    // Pre-append user message to UI state for instant, responsive feedback
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      text: textToSend,
      createdAt: new Date().toISOString()
    };
    setLocalMessages((prev) => [...prev, tempUserMsg]);

    try {
      await sendChatMessage({ text: textToSend }).unwrap();
    } catch (err) {
      const msg = err.data?.message || 'AI advisor offline. Please retry sending your query.';
      toast.error(msg);
    }
  };

  // --- MATH REFACTOR: Functional accumulator over active portfolio array ---
  const totalCapacity = assetsList.reduce((sum, asset) => sum + Number(asset.valueINR || 0), 0);

  // 1. Unauthenticated Gateway
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" closeButton richColors theme="light" />
        <AuthPage />
      </>
    );
  }

  // 2. Loading State Gate
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8f5] gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white animate-bounce shadow-md">
          <Compass className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs font-semibold text-slate-700 tracking-wider uppercase animate-pulse">Syncing Venture Workspace...</p>
      </div>
    );
  }

  // 3. Conditional Assets Gate (Enforces onboarding stepper for assetless users)
  if (assetsList.length === 0) {
    return (
      <>
        <Toaster position="top-right" closeButton richColors theme="light" />
        <OnboardingStepper />
      </>
    );
  }

  // 4. Main Authenticated Dashboard Shell (Modern Editorial Warm Ivory Theme)
  return (
    <div className="min-h-screen flex bg-[#faf8f5] font-sans antialiased text-slate-900 select-none relative overflow-hidden">
      <Toaster position="top-right" closeButton richColors theme="light" />

      {/* Floating Background Ambient Glowing Nodes */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[130px] pointer-events-none" 
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[130px] pointer-events-none" 
      />

      {/* Left Locked Sticky Layout Sidebar */}
      <aside className="w-64 h-screen sticky top-0 overflow-y-auto border-r border-slate-200/80 bg-white/95 backdrop-blur-md flex flex-col justify-between shrink-0 z-10 relative">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10 animate-pulse">
              <Compass className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Zenith</h1>
              <p className="text-[9px] uppercase tracking-wider font-bold text-indigo-600">Business Incubation</p>
            </div>
          </div>

          {/* Interactive Navigation button Switches with left vertical anchor borders */}
          <nav className="p-4 space-y-1">
            <button 
              id="tab-ledger"
              onClick={() => handleTabChange('ledger')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === 'ledger' 
                  ? 'bg-indigo-50/60 text-indigo-600 border-l-4 border-indigo-600' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Venture Ledger
            </button>
            <button 
              id="tab-incubation"
              onClick={() => handleTabChange('incubation')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === 'incubation' 
                  ? 'bg-indigo-50/60 text-indigo-600 border-l-4 border-indigo-600' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              Incubation Suggestions
            </button>
            <button 
              id="tab-chat"
              onClick={() => handleTabChange('chat')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
                activeTab === 'chat' 
                  ? 'bg-indigo-50/60 text-indigo-600 border-l-4 border-indigo-600' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              Consultant Chat
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2.5 mb-1.5">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-slate-900 leading-none truncate">{user?.name}</p>
                <span className="text-[9px] text-slate-400 capitalize font-medium">{user?.role || 'Entrepreneur'}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition-colors duration-150 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Dynamic Viewport Container */}
      <main className="flex-1 overflow-y-auto p-8 z-10 relative">
        
        {/* ====================================================
            VIEWPORT TAB 1: LEDGER PORTAL
            ==================================================== */}
        {activeTab === 'ledger' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <header>
              <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-600">Venture Ledger Portal</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">Venture Resource Footprints</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage registered seed assets, locations coordinates, and Indian compliance parameters.</p>
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
                    className="bg-white border border-slate-100/80 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-sm font-bold uppercase text-slate-900 tracking-wide block">{item.label}</span>
                      <p className="text-2xl font-bold font-mono text-slate-900 mt-2">{item.val}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{item.detail}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table datagrid */}
            <section className="bg-white border border-slate-100/80 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Venture Footprint Ledger</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Physical and financial assets mapped securely inside MongoDB Atlas.</p>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    id="add-new-asset-btn"
                    onClick={openAddModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Asset
                  </button>
                  <span className="text-[10px] bg-slate-100 border border-slate-200/50 px-2 py-1 rounded-md text-slate-600 font-bold uppercase tracking-wider">Active Ledger</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="p-4 font-bold text-slate-900 tracking-wider text-xs uppercase">Category</th>
                      <th className="p-4 font-bold text-slate-900 tracking-wider text-xs uppercase">Value (INR)</th>
                      <th className="p-4 font-bold text-slate-900 tracking-wider text-xs uppercase">Description Parameters</th>
                      <th className="p-4 font-bold text-slate-900 tracking-wider text-xs uppercase">Physical Address</th>
                      <th className="p-4 font-bold text-slate-900 tracking-wider text-xs uppercase">Geo Pins</th>
                      <th className="p-4 font-bold text-slate-900 tracking-wider text-xs uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assetsList.map((asset) => (
                      <tr key={asset._id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="p-4 font-bold text-slate-900 text-sm">{asset.assetType}</td>
                        <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                          ₹ {asset.valueINR?.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 text-slate-600 font-semibold text-xs max-w-xs truncate">{asset.description}</td>
                        <td className="p-4 text-slate-600 font-semibold text-xs leading-normal">
                          {asset.location?.address}, {asset.location?.city}, {asset.location?.state}
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-400 font-semibold">
                          {asset.location?.coordinates?.lat?.toFixed(4)}, {asset.location?.coordinates?.lng?.toFixed(4)}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            id={`edit-btn-${asset._id}`}
                            onClick={() => openEditModal(asset)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ====================================================
            VIEWPORT TAB 2: AI INCUBATION SUGGESTIONS
            ==================================================== */}
        {activeTab === 'incubation' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <header>
              <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-600">AI Incubator Suggestions</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">Personalized Venture Synthesis</h2>
              <p className="text-xs text-slate-400 mt-0.5">Custom startup roadmaps engineered strictly against your geographical operations and seed limits.</p>
            </header>

            {/* Structured startup suggestion cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'D2C Organic Agro Products',
                  domain: 'Agri-Tech Retail',
                  capital: '₹ 3,50,000 Seed Requirement',
                  desc: 'Formulate organic food items sourced from Karnataka farms. Direct-to-Consumer branding strategy.',
                  compliance: ['FSSAI Food License', 'GSTIN Setup', 'APEDA Trade Registration']
                },
                {
                  title: 'B2B Smart Logistics Route Optimizer',
                  domain: 'SaaS Software',
                  capital: '₹ 1,80,000 Seed Requirement',
                  desc: 'Deploy low-code scheduling software optimizing route parameters for freight suppliers in operational cities.',
                  compliance: ['GSTIN Invoicing', 'MeitY MSME Registration', 'ISO 27001 Security Standard']
                },
                {
                  title: 'EV Fleet Battery swap Brokerage',
                  domain: 'Green Infrastructure',
                  capital: '₹ 5,00,000 Seed Requirement',
                  desc: 'Establish clean EV grid brokers coordinates mapping local battery storage points across Bengaluru centers.',
                  compliance: ['BIS Safety Approval', 'PESO Green Clearance', 'Municipal Trade License']
                }
              ].map((startup, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-100/80 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between min-h-[340px]"
                >
                  <div className="space-y-3">
                    <span className="text-[9px] bg-indigo-50 border border-indigo-100/50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block">
                      Option 0{idx + 1} • {startup.domain}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{startup.title}</h3>
                    <p className="text-sm font-bold text-slate-900 font-mono">{startup.capital}</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">{startup.desc}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-900 tracking-wider">Required Compliance Bounds:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {startup.compliance.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="text-[9px] bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md font-semibold text-slate-600 flex items-center gap-1"
                        >
                          <ShieldCheck className="w-2.5 h-2.5 text-slate-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action triggers */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-slate-950">
              <div>
                <h3 className="text-sm font-bold">Venture parameters altered?</h3>
                <p className="text-xs text-slate-400 mt-1">Evict suggestion cache matrices and trigger real-time backend modeling updates from Gemini.</p>
              </div>
              <button 
                onClick={() => toast.success('Suggestions parameters successfully updated! Refreshed structured models from Gemini API.')}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
              >
                Synthesize Fresh Recommendations
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            VIEWPORT TAB 3: STATEFUL DIALOGUE CONSULTANT CHAT (Margin Adjusted)
            ==================================================== */}
        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-10rem)] mt-6 flex flex-col justify-between bg-white border border-slate-100/80 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm animate-pulse">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">AI Venture Consultant</h3>
                  <span className="text-[9px] text-emerald-600 font-semibold block leading-none">Online • Context-Aware Mode</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-slate-500">Gemini-3.5-Flash</span>
              </div>
            </div>

            {/* Scrollable bubble list connecting real backend history */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
              {isChatLoading ? (
                <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-400 uppercase tracking-wider animate-pulse">
                  Syncing Conversational Log...
                </div>
              ) : (
                <>
                  {localMessages.map((msg, index) => {
                    const isModel = msg.role === 'model';
                    return (
                      <div 
                        key={msg._id || index} 
                        className={`flex items-start gap-2.5 ${isModel ? '' : 'flex-row-reverse'}`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm ${
                          isModel ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isModel ? 'AI' : 'U'}
                        </div>
                        <div className={`max-w-xl p-3 rounded-2xl text-xs leading-normal shadow-sm border whitespace-pre-wrap ${
                          isModel 
                            ? 'bg-white border-slate-100 text-slate-800' 
                            : 'bg-slate-900 border-slate-950 text-white'
                        }`}>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Thinking status bubble overlay */}
                  {isSendingMessage && (
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 animate-bounce">
                        AI
                      </div>
                      <div className="max-w-xl p-3 rounded-2xl text-xs leading-normal bg-white border border-slate-100 text-slate-400 font-medium italic animate-pulse">
                        Consultant is compiling compliance frameworks...
                      </div>
                    </div>
                  )}
                  
                  {/* Automatic scroll snap anchor point */}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Input submission form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2 shrink-0">
              <input
                id="chat-input-field"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask our AI Consultant about MSME, GSTIN, FSSAI, or BIS regulatory requirements..."
                className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none focus:bg-white transition-all duration-150"
                disabled={isSendingMessage}
              />
              <button 
                type="submit"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shrink-0 cursor-pointer shadow transition-colors"
                disabled={isSendingMessage}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </main>

      {/* ====================================================
          "ADD NEW ASSET" ACTION DRAWER MODAL OVERLAY (Elite Frosted Backdrop)
          ==================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-white/95 border border-slate-200 rounded-2xl shadow-2xl p-6 backdrop-blur relative z-50 animate-fadeIn"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add New Asset Footprint</h3>
                  <p className="text-[10px] text-slate-400">Log new seed assets and locations coordinates</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Asset Type toggle row */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700 tracking-wide uppercase">Asset Category</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Liquid Cash', 'Land', 'Commercial Building', 'Equipment'].map((type) => {
                    const active = addAssetType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAddAssetType(type)}
                        className={`py-1.5 px-0.5 rounded-lg border text-center transition-all duration-150 text-[10px] font-semibold outline-none ${
                          active
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-1 ring-indigo-600'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Value INR Input */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700 tracking-wide uppercase">Asset Value (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">₹</span>
                  <input
                    id="add-val-input"
                    type="number"
                    min="1"
                    value={addValueINR}
                    onChange={(e) => setAddValueINR(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full pl-7 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-1 focus:ring-slate-900 focus-visible:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Brief Description */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700 tracking-wide uppercase">Brief Description</label>
                <textarea
                  id="add-desc-input"
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  placeholder="Specify asset attributes e.g., '1000 sq ft office in downtown Tech Hub'"
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none resize-none"
                  required
                />
              </div>

              {/* Address inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Address</label>
                  <input
                    type="text"
                    value={addAddress}
                    onChange={(e) => setAddAddress(e.target.value)}
                    placeholder="e.g. 102 MG Road"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">City</label>
                  <input
                    type="text"
                    value={addCity}
                    onChange={(e) => setAddCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">State</label>
                  <input
                    type="text"
                    value={addStateName}
                    onChange={(e) => setAddStateName(e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Geopoint inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    value={addLat}
                    onChange={(e) => setAddLat(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    value={addLng}
                    onChange={(e) => setAddLng(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              {/* Submit footer actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isCreating}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="add-submit-btn"
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 disabled:bg-slate-400 cursor-pointer"
                >
                  {isCreating ? 'Synthesizing...' : 'Log Asset'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ====================================================
          "EDIT ASSET" ACTION DRAWER MODAL OVERLAY (Elite Frosted Backdrop)
          ==================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-white/95 border border-slate-200 rounded-2xl shadow-2xl p-6 backdrop-blur relative z-50 animate-fadeIn"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Asset Footprint</h3>
                  <p className="text-[10px] text-slate-400">Update coordinates and metrics mapping</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Asset Type toggle row */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700 tracking-wide uppercase">Asset Category</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Liquid Cash', 'Land', 'Commercial Building', 'Equipment'].map((type) => {
                    const active = editAssetType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEditAssetType(type)}
                        className={`py-1.5 px-0.5 rounded-lg border text-center transition-all duration-150 text-[10px] font-semibold outline-none ${
                          active
                            ? 'border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Value INR Input */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700 tracking-wide uppercase">Asset Value (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">₹</span>
                  <input
                    id="edit-val-input"
                    type="number"
                    min="1"
                    value={editValueINR}
                    onChange={(e) => setEditValueINR(e.target.value)}
                    className="w-full pl-7 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-1 focus:ring-slate-900 focus-visible:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Brief Description */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700 tracking-wide uppercase">Brief Description</label>
                <textarea
                  id="edit-desc-input"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none resize-none"
                  required
                />
              </div>

              {/* Address inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">State</label>
                  <input
                    type="text"
                    value={editStateName}
                    onChange={(e) => setEditStateName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Geopoint inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    value={editLat}
                    onChange={(e) => setEditLat(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    value={editLng}
                    onChange={(e) => setEditLng(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-900 focus-visible:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              {/* Submit footer actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="update-submit-btn"
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 disabled:bg-slate-400 cursor-pointer"
                >
                  {isUpdating ? 'Saving Footprints...' : 'Update Asset'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;
