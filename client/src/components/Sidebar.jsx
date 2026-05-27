import React from 'react';
import { Compass, Briefcase, MessageSquare, LayoutDashboard, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, handleTabChange, user, handleLogout }) => {
  return (
    <aside className="w-64 h-screen sticky top-0 overflow-y-auto bg-white dark:bg-[#1A1917] border-r border-[#E5E5E5] dark:border-[#222222] flex flex-col justify-between shrink-0 z-10 relative transition-colors duration-200 rounded-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E5E5E5] dark:border-[#222222] flex items-center gap-2.5 transition-colors duration-200">
          <div className="w-8 h-8 rounded-none bg-[#8C6D47] flex items-center justify-center text-[#F4F0EA] shadow-md shadow-[#8C6D47]/10">
            <Compass className="w-4.5 h-4.5 stroke-[1.8]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5] leading-tight">Zenith</h1>
            <p className="text-[9px] uppercase tracking-wider font-bold text-[#8C6D47] font-mono">Business Incubation</p>
          </div>
        </div>

        {/* Interactive Navigation button Switches with left vertical anchor borders */}
        <nav className="p-4 space-y-1">
          <button 
            id="tab-ledger"
            onClick={() => handleTabChange('ledger')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer rounded-none ${
              activeTab === 'ledger' 
                ? 'bg-[#161513]/5 dark:bg-white/5 text-[#161513] dark:text-[#F4F0EA] border-l-4 border-[#8C6D47]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-[#161513] dark:hover:text-[#F4F0EA] hover:bg-[#161513]/5 dark:hover:bg-white/5 border-l-4 border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Venture Ledger
          </button>
          <button 
            id="tab-incubation"
            onClick={() => handleTabChange('incubation')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer rounded-none ${
              activeTab === 'incubation' 
                ? 'bg-[#161513]/5 dark:bg-white/5 text-[#161513] dark:text-[#F4F0EA] border-l-4 border-[#8C6D47]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-[#161513] dark:hover:text-[#F4F0EA] hover:bg-[#161513]/5 dark:hover:bg-white/5 border-l-4 border-transparent'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            Incubation Suggestions
          </button>
          <button 
            id="tab-chat"
            onClick={() => handleTabChange('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all duration-150 cursor-pointer rounded-none ${
              activeTab === 'chat' 
                ? 'bg-[#161513]/5 dark:bg-white/5 text-[#161513] dark:text-[#F4F0EA] border-l-4 border-[#8C6D47]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-[#161513] dark:hover:text-[#F4F0EA] hover:bg-[#161513]/5 dark:hover:bg-white/5 border-l-4 border-transparent'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            Consultant Chat
          </button>
        </nav>
      </div>

      {/* User Card */}
      <div className="p-4 border-t border-[#E5E5E5] dark:border-[#222222] bg-white dark:bg-[#1A1917] transition-colors duration-200">
        <div className="p-3 bg-[#FBFBFB] dark:bg-[#121110] rounded-none border border-[#E5E5E5] dark:border-[#222222] flex items-center justify-between gap-2.5 transition-colors duration-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-none bg-[#8C6D47] flex items-center justify-center text-[#F4F0EA] shrink-0 font-bold text-xs shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-[#111111] dark:text-[#F5F5F5] leading-none truncate">{user?.name}</p>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 capitalize font-semibold">{user?.role || 'Entrepreneur'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all p-1.5 rounded-none text-slate-500 dark:text-slate-400 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
