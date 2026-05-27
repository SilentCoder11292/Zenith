import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, Coins, Building, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const IncubationSuggestions = ({
  assets,
  incubationData,
  isIncubationLoading
}) => {
  // Persistence of completion checkboxes in localStorage
  const [completedMilestones, setCompletedMilestones] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zenith_completed_milestones') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('zenith_completed_milestones', JSON.stringify(completedMilestones));
  }, [completedMilestones]);

  // Dynamic computations from live assets array
  const totalCapital = assets.reduce((sum, a) => sum + Number(a.valueINR || 0), 0);
  
  const hasKarnataka = assets.some(a => {
    const addr = (a.physicalAddress || a.location?.address || '').toLowerCase();
    const city = (a.location?.city || '').toLowerCase();
    const state = (a.location?.state || '').toLowerCase();
    return addr.includes('bengaluru') || addr.includes('karnataka') || 
           city.includes('bengaluru') || state.includes('karnataka');
  });

  const hasCommercialBuilding = assets.some(a => 
    (a.category || a.assetType || '').toLowerCase() === 'commercial building'
  );

  const hasAssets = assets.length > 0;

  // Build dynamic milestones array based on registered assets ledger
  const milestones = [];

  if (hasAssets) {
    // 1. MSME Udyam Registration: Always active if there is at least 1 seed asset
    milestones.push({
      id: 'msme',
      title: 'MSME Udyam Registration',
      tag: 'Active Mandate',
      subtext: 'Registering your venture footprint under the Ministry of MSME to unlock corporate lending rates and incubation support.',
      icon: Coins,
      badgeText: 'Verified by Zenith'
    });

    // 2. GSTIN Tax Compliance: Flag as Recommended if total capital > 40 Lakhs or Commercial Building is logged
    const isGstRecommended = totalCapital > 4000000 || hasCommercialBuilding;
    milestones.push({
      id: 'gstin',
      title: 'GSTIN Tax Compliance',
      tag: isGstRecommended ? 'Recommended' : 'Standard Compliance',
      subtext: 'Filing for a localized Goods and Services Tax Identification Number to formalize capital expenditures.',
      icon: FileText,
      badgeText: 'Tax Locked'
    });

    // 3. Karnataka Shop & Establishment License: State Mandate if address matches Bengaluru or Karnataka
    if (hasKarnataka) {
      milestones.push({
        id: 'karnataka-shop',
        title: 'Karnataka Shop & Establishment License',
        tag: 'State Mandate',
        subtext: 'Securing local labor department clearance for your operational hub.',
        icon: Building,
        badgeText: 'Govt Approved'
      });
    }
  }

  const handleToggleMilestone = (id, title) => {
    setCompletedMilestones(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      if (updated[id]) {
        toast.success(`Compliance Milestone "${title}" Completed!`);
      }
      return updated;
    });
  };

  // Aggregation handler compiling dynamic document blueprints
  const handleExportBlueprint = () => {
    // Determine core geo/location or primary address
    const primaryAsset = assets[0];
    const primaryLocation = primaryAsset 
      ? `${primaryAsset.physicalAddress || primaryAsset.location?.address || 'Bengaluru, Karnataka'}` 
      : 'No core location registered.';

    // Generate registered asset entries as a clean markdown table string
    let assetRowsMarkdown = '| Asset Category | Value (INR) | Physical Location | Description |\n| :--- | :--- | :--- | :--- |\n';
    if (assets.length > 0) {
      assets.forEach(a => {
        const cat = a.category || a.assetType || '';
        const val = `₹${Number(a.valueINR || 0).toLocaleString('en-IN')}`;
        const loc = a.physicalAddress || a.location?.address || 'Bengaluru, Karnataka';
        const desc = a.description || 'No description listed';
        assetRowsMarkdown += `| ${cat} | ${val} | ${loc} | ${desc} |\n`;
      });
    } else {
      assetRowsMarkdown += '| - | - | - | - |\n';
    }

    // Generate milestones checklist status lines
    let milestonesStatusText = '';
    if (milestones.length > 0) {
      milestones.forEach(m => {
        const status = completedMilestones[m.id] ? 'COMPLETED' : 'PENDING';
        milestonesStatusText += `- [${status === 'COMPLETED' ? 'x' : ' '}] ${m.title} (${m.tag}) - ${status}\n  *Detail: ${m.subtext}*\n\n`;
      });
    } else {
      milestonesStatusText = 'No active compliance milestones identified.';
    }

    const documentText = `# ZENITH VENTURE EXECUTION BLUEPRINT
Generated via Zenith Core Portal Tools

## I. OPERATIONAL FOOTPRINT SUMMARY
- Total Capital Runway: ₹${totalCapital.toLocaleString('en-IN')}
- Core Operational Geo: ${primaryLocation}

## II. REGISTERED ASSET LEDGER
${assetRowsMarkdown}

## III. REGULATORY COMPLIANCE STATUS
${milestonesStatusText}`;

    // Convert string layout to blob file object
    const blob = new Blob([documentText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'zenith-execution-blueprint.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Zenith Venture Execution Blueprint downloaded successfully!');
  };

  // Progress metrics calculation
  const totalMilestones = milestones.length;
  const completedCount = Object.keys(completedMilestones).filter(id => 
    completedMilestones[id] && milestones.some(m => m.id === id)
  ).length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Dynamic Incubation AI Suggestions Grid */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8C6D47]">AI Incubator Suggestions</span>
          <h2 className="text-2xl md:text-3xl font-bold font-sans text-[#161513] dark:text-[#F4F0EA] mt-1 tracking-tight">Personalized Venture Synthesis</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Custom startup roadmaps engineered strictly against your geographical operations and seed limits.</p>
        </div>

        {isIncubationLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="bg-white/40 dark:bg-[#1A1917]/40 backdrop-blur-md border border-[#E5E5E5] dark:border-[#222222] p-6 rounded-none shadow-sm min-h-[300px] animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-none w-1/3 animate-pulse" />
                  <div className="h-5.5 bg-slate-200 dark:bg-slate-800 rounded-none w-3/4 animate-pulse" />
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-none w-1/2 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-none animate-pulse" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-none animate-pulse" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-none w-5/6 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (incubationData?.data?.suggestions || []).length === 0 ? (
          <div className="bg-white/40 dark:bg-[#1A1917]/40 backdrop-blur-md border border-[#E5E5E5] dark:border-[#222222] p-6 rounded-none text-center space-y-3 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No suggestions compiled yet. Map startup capital assets on your Ledger page to trigger AI synthesis!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(incubationData?.data?.suggestions || []).map((startup, idx) => (
              <div 
                key={idx}
                className="bg-white/40 dark:bg-[#1A1917]/40 backdrop-blur-md border border-[#E5E5E5] dark:border-[#222222] p-6 rounded-none shadow-sm hover:-translate-y-0.5 hover:border-[#8C6D47] transition-all duration-300 flex flex-col justify-between min-h-[300px]"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] bg-[#8C6D47]/10 dark:bg-[#8C6D47]/20 border border-[#8C6D47]/30 text-[#8C6D47] px-2 py-0.5 rounded-none font-bold uppercase tracking-wider inline-block">
                       Option 0{idx + 1} • {startup.sector}
                    </span>
                    <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider">
                       Match: {startup.viabilityScore}%
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#161513] dark:text-[#F4F0EA] leading-tight">{startup.businessName}</h3>
                  <p className="text-sm font-bold text-[#161513] dark:text-[#F4F0EA] font-mono">{startup.capitalRequirement}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{startup.businessConcept}</p>
                  <p className="text-[10px] text-[#8C6D47] font-semibold italic">Sourcing: {startup.rawMaterialSourcing}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E5E5E5] dark:border-[#222222] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#111111] dark:text-[#F5F5F5] tracking-wider block">Required Compliance Bounds:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {startup.regulatoryCompliances?.map((tag, tIdx) => (
                       <span 
                        key={tIdx} 
                        className="text-[9px] bg-[#FBFBFB] dark:bg-[#0B0B0B] border border-[#E5E5E5] dark:border-[#222222] px-2 py-0.5 rounded-none font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-2.5 h-2.5 text-[#8C6D47]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Interactive Compliance Milestone Cards Section */}
      <div className="space-y-4 pt-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8C6D47]">Operational Trackers</span>
          <h2 className="text-xl md:text-2xl font-bold font-sans text-[#161513] dark:text-[#F4F0EA] mt-1 tracking-tight">Incubation & Compliance Roadmap</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Interactive regulatory compliance steps dynamically compiled from your active asset footprints.</p>
        </div>

        {hasAssets ? (
          <div className="space-y-4">
            {/* Minimalist Progress Meter Bar */}
            <div className="bg-white/30 dark:bg-[#1A1917]/30 backdrop-blur-xs border border-[#E5E5E5] dark:border-[#222222] rounded-none p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-200">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 bg-[#8C6D47] text-white flex items-center justify-center font-bold text-xs shadow-sm rounded-none">
                  {progressPercent}%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111] dark:text-[#F5F5F5] uppercase tracking-wide">Roadmap Progression</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{completedCount} of {totalMilestones} milestone clearances satisfied</p>
                </div>
              </div>
              
              <div className="flex-1 max-w-xs h-1 bg-slate-100 dark:bg-slate-900 rounded-none overflow-hidden relative border border-slate-200/20 dark:border-slate-800/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-[#8C6D47]"
                />
              </div>

              <button
                onClick={handleExportBlueprint}
                className="bg-[#161513] text-[#F4F0EA] dark:bg-[#F4F0EA] dark:text-[#161513] border border-transparent rounded-none px-4 py-2 font-mono text-xs tracking-wider uppercase hover:bg-[#8C6D47] dark:hover:bg-[#8C6D47] dark:hover:text-white transition-all cursor-pointer shrink-0"
              >
                Export Blueprint
              </button>
            </div>

            {/* Structured milestone list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {milestones.map((m) => {
                const isCompleted = !!completedMilestones[m.id];
                const Icon = m.icon;
                return (
                  <div 
                    key={m.id}
                    className="bg-white/40 dark:bg-[#1A1917]/40 backdrop-blur-md border border-[#E5E5E5] dark:border-[#222222] rounded-none p-6 relative hover:border-[#8C6D47] transition-all duration-300 flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      {/* Card Header Tag Row */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]/40 dark:border-[#222222]/40 mb-3">
                        <span className="text-[9px] text-[#8C6D47] font-mono font-bold uppercase tracking-wider">
                          {m.tag}
                        </span>
                        
                        {/* Interactive toggle switch checkbox */}
                        <button
                          onClick={() => handleToggleMilestone(m.id, m.title)}
                          className={`w-4.5 h-4.5 border rounded-none flex items-center justify-center transition-colors cursor-pointer outline-none ${
                            isCompleted 
                              ? 'bg-[#8C6D47] border-[#8C6D47] text-white' 
                              : 'bg-transparent border-[#E5E5E5] dark:border-[#333] hover:border-[#8C6D47]'
                          }`}
                          aria-label={`Toggle ${m.title}`}
                        >
                          {isCompleted && <Check className="w-3 h-3 stroke-[2.5]" />}
                        </button>
                      </div>

                      {/* Content block: Opacity dims down smoothly when completed */}
                      <motion.div 
                        animate={{ opacity: isCompleted ? 0.45 : 1 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-2 select-none"
                      >
                        <h4 className="text-xs font-bold text-[#161513] dark:text-[#F4F0EA] font-sans tracking-tight leading-tight flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-[#8C6D47]" />
                          {m.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-semibold">
                          {m.subtext}
                        </p>
                      </motion.div>
                    </div>

                    {/* Animated custom badge overlay sliding in view */}
                    <div className="min-h-[24px] relative mt-4">
                      <AnimatePresence>
                        {isCompleted && (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider inline-flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {m.badgeText}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/40 dark:bg-[#1A1917]/40 backdrop-blur-md border border-[#E5E5E5] dark:border-[#222222] p-6 rounded-none text-center space-y-3 shadow-sm transition-colors duration-200">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Map dynamic capital assets or physical footprints on your Ledger page to compile localized compliance roadmaps!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncubationSuggestions;
