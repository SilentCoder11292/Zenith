import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const AddAssetModal = ({
  isOpen,
  onClose,
  onSubmit,
  assetType,
  setAssetType,
  valueINR,
  setValueINR,
  description,
  setDescription,
  address,
  setAddress,
  city,
  setCity,
  stateName,
  setStateName,
  lat,
  lng,
  suggestions,
  showSuggestions,
  justSelected,
  setJustSelected,
  suggestionsRef,
  handleSelectSuggestion,
  isCreating
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#121110]/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-colors duration-200">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none shadow-2xl p-6 relative z-50 animate-fadeIn text-[#111111] dark:text-[#F5F5F5] transition-colors duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#222222] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-none bg-[#8C6D47] flex items-center justify-center text-[#F4F0EA] shadow-sm">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] dark:text-[#F5F5F5]">Add New Asset Footprint</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Log new seed assets and locations coordinates</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-none border border-[#E5E5E5] dark:border-[#222222] flex items-center justify-center text-slate-400 hover:text-[#111111] dark:hover:text-[#F5F5F5] hover:bg-slate-50 dark:hover:bg-[#121110] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Asset Type toggle row */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">Asset Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['Liquid Cash', 'Land', 'Commercial Building', 'Equipment'].map((type) => {
                const active = assetType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAssetType(type)}
                    className={`py-1.5 px-0.5 rounded-none border text-center transition-all duration-150 text-[10px] font-mono font-bold outline-none ${
                      active
                        ? 'border-[#8C6D47] bg-[#161513]/5 dark:bg-white/5 text-[#161513] dark:text-[#F4F0EA] ring-1 ring-[#8C6D47]'
                        : 'border-[#E5E5E5] dark:border-[#222222] text-slate-500 dark:text-slate-400 hover:border-[#8C6D47] bg-white dark:bg-[#1A1917]'
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
            <label className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">Asset Value (INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500">₹</span>
              <input
                id="add-val-input"
                type="number"
                min="1"
                value={valueINR}
                onChange={(e) => setValueINR(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full pl-7 pr-4 py-2 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] font-semibold focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] outline-none"
                required
              />
            </div>
          </div>

          {/* Brief Description */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">Brief Description</label>
            <textarea
              id="add-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify asset attributes e.g., '1000 sq ft office in downtown Tech Hub'"
              rows={2}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] outline-none resize-none"
              required
            />
          </div>

          {/* Address inputs */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1 relative" ref={suggestionsRef}>
              <label className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setJustSelected(false);
                }}
                placeholder="e.g. 102 MG Road"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] outline-none"
                required
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] shadow-xl rounded-none overflow-hidden max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full px-4 py-2 text-left text-xs text-[#111111] dark:text-[#F5F5F5] hover:bg-[#F4F0EA] dark:hover:bg-[#121110] border-b border-[#E5E5E5] dark:border-[#222222] last:border-0 block truncate transition-colors cursor-pointer"
                      title={suggestion.display_name}
                    >
                      {suggestion.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">State</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="e.g. Karnataka"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] outline-none"
                required
              />
            </div>
          </div>

          {/* Geopoints hidden from user view */}
          <input type="hidden" name="latitude" value={lat} />
          <input type="hidden" name="longitude" value={lng} />

          {/* Submit footer actions */}
          <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#222222] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 border border-[#E5E5E5] dark:border-[#222222] rounded-none text-slate-500 dark:text-slate-400 hover:text-[#111111] dark:hover:text-[#F5F5F5] hover:bg-[#F4F0EA] dark:hover:bg-[#121110] text-xs font-semibold transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="add-submit-btn"
              type="submit"
              disabled={isCreating}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#161513] text-[#F4F0EA] dark:bg-[#F4F0EA] dark:text-[#161513] hover:bg-[#8C6D47] dark:hover:bg-[#8C6D47] dark:hover:text-white rounded-none font-mono font-bold tracking-wider uppercase transition-all duration-150 disabled:bg-slate-400 cursor-pointer text-xs"
            >
              {isCreating ? 'Synthesizing...' : 'Log Asset'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddAssetModal;
