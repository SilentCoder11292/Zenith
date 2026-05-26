import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster, toast } from 'sonner';
import AuthPage from './features/auth/AuthPage.jsx';
import OnboardingStepper from './features/assets/OnboardingStepper.jsx';
import { useGetAssetsQuery } from './features/assets/assetsApiSlice.js';
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
  MessageSquare
} from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Skip query execution if anonymous to prevent 401 interceptor loop
  const { data, isLoading } = useGetAssetsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const assetsList = data?.data?.assets || [];

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Successfully logged out.');
  };

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        {/* Elegant pulsing loader */}
        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white animate-bounce shadow-md">
          <Compass className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs font-semibold text-slate-700 tracking-wider uppercase animate-pulse">Syncing Venture Workspace...</p>
      </div>
    );
  }

  // 3. Conditional Assets Gate (Forces new users to complete onboarding setup)
  if (assetsList.length === 0) {
    return (
      <>
        <Toaster position="top-right" closeButton richColors theme="light" />
        <OnboardingStepper />
      </>
    );
  }

  // 4. Authenticated Dashboard Shell (Venture Ledger Sidebar Layout)
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-900 select-none relative overflow-hidden">
      <Toaster position="top-right" closeButton richColors theme="light" />

      {/* Floating Background Ambient Glowing Nodes */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[130px] pointer-events-none" 
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[130px] pointer-events-none" 
      />

      {/* Left Sidebar Layout */}
      <aside className="w-64 border-r border-slate-200 bg-white/80 backdrop-blur-md flex flex-col justify-between shrink-0 z-10 relative">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10">
              <Compass className="w-4.5 h-4.5 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Zenith</h1>
              <p className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">Business Incubation</p>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="p-4 space-y-1">
            <a 
              href="#dashboard" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-sm transition-all duration-150"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Venture Ledger
            </a>
            <a 
              href="#incubation" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-all duration-150"
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              Incubation Suggestions
            </a>
            <a 
              href="#chat" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-all duration-150"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              Consultant Chat
            </a>
          </nav>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2.5 mb-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-slate-800 leading-none truncate">{user?.name}</p>
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

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-y-auto p-8 z-10 relative">
        {/* Welcome Header */}
        <header className="mb-8">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Zenith Ledger Dashboard</span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Hello, {user?.name} 👋</h2>
          <p className="text-xs text-slate-400 mt-0.5">Track registered venture footprints and trigger automated Gemini recommendation strategies.</p>
        </header>

        {/* Active Asset Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Registered Assets</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-slate-900">{assetsList.length}</p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-2">
              <TrendingUp className="w-3 h-3" /> Setup complete
            </span>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Venture Capacity</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-slate-900">
              ₹ {assetsList.reduce((acc, curr) => acc + (curr.valueINR || 0), 0).toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-2">
              Total allocated seed capital
            </span>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Geographic Footprint</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 truncate">
              {assetsList[0]?.location?.city || 'Bengaluru'}
            </p>
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-2">
              {assetsList[0]?.location?.state || 'Karnataka'}, India
            </span>
          </div>
        </div>

        {/* Ledger Grid */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Asset Footprint Ledger</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Physical and financial startup resources mapped inside MERN.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-slate-600 font-semibold">Active Ledger</span>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Resource Category</th>
                  <th className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Description</th>
                  <th className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Assigned Value (INR)</th>
                  <th className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Physical Location</th>
                  <th className="p-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Coordinate Pins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assetsList.map((asset) => (
                  <tr key={asset._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{asset.assetType}</td>
                    <td className="p-4 text-slate-500 max-w-[200px] truncate">{asset.description}</td>
                    <td className="p-4 font-mono font-bold text-slate-800">
                      ₹ {asset.valueINR?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-slate-600 leading-normal">
                      {asset.location?.address}, {asset.location?.city}, {asset.location?.state}
                    </td>
                    <td className="p-4 font-mono text-[10px] text-slate-400">
                      Lat: {asset.location?.coordinates?.lat?.toFixed(4) || '—'} | Lng: {asset.location?.coordinates?.lng?.toFixed(4) || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dynamic Next Steps Indicator Block */}
        <section className="bg-slate-900 border border-slate-950 p-6 rounded-2xl relative text-white shadow-lg shadow-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="relative z-10">
            <span className="text-[9px] bg-slate-800 border border-slate-700/80 px-2 py-0.5 rounded-full text-indigo-300 font-bold uppercase tracking-wider">Next Step Scheduled</span>
            <h3 className="text-base font-bold mt-2">Engage AI Business Incubation suggestions</h3>
            <p className="text-xs text-slate-400 mt-1 leading-normal max-w-lg">Based on your newly logged location parameters and capital allocation structure, our Gemini business suggestions analysis model is ready to produce 3 fully compliant Indian startup ventures.</p>
          </div>
          <a 
            href="#incubation"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all duration-150 relative z-10 self-start md:self-auto shadow-md shadow-white/5 shrink-0"
          >
            Launch Incubation suggestions
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </section>
      </main>
    </div>
  );
}

export default App;
