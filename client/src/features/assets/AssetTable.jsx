import React from 'react';
import { Plus, Edit2 } from 'lucide-react';

const AssetTable = ({ assetsList, openAddModal, openEditModal }) => {
  return (
    <section className="bg-white/60 dark:bg-[#1A1917]/60 backdrop-blur-sm border border-[#E5E5E5] dark:border-[#222222] rounded-none p-6 shadow-sm hover:-translate-y-0.5 hover:border-[#8C6D47] transition-all duration-300 overflow-hidden text-[#161513] dark:text-[#F4F0EA]">
      <div className="pb-5 border-b border-[#E5E5E5] dark:border-[#222222] flex items-center justify-between">
        <div>
          <h3 className="text-sm tracking-tight font-bold font-sans text-[#161513] dark:text-[#F4F0EA]">Venture Footprint Ledger</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Physical and financial assets mapped securely inside MongoDB Atlas.</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            id="add-new-asset-btn"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#161513] text-[#F4F0EA] dark:bg-[#F4F0EA] dark:text-[#161513] font-mono font-bold rounded-none uppercase hover:-translate-y-0.5 hover:bg-[#8C6D47] dark:hover:bg-[#8C6D47] dark:hover:text-white transition-all duration-300 shadow cursor-pointer text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Asset
          </button>
          <span className="text-[9px] bg-[#F4F0EA] dark:bg-[#121110] border border-[#E5E5E5] dark:border-[#222222] text-slate-600 dark:text-slate-400 font-mono font-bold rounded-none uppercase tracking-wider px-2 py-1">Active Ledger</span>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs divide-y divide-[#E5E5E5] dark:divide-[#222222]">
          <thead className="bg-[#F4F0EA]/40 dark:bg-[#121110]/40">
            <tr>
              <th className="p-4 font-mono font-bold text-[#161513] dark:text-[#F4F0EA] tracking-wider text-xs uppercase">Category</th>
              <th className="p-4 font-mono font-bold text-[#161513] dark:text-[#F4F0EA] tracking-wider text-xs uppercase">Value (INR)</th>
              <th className="p-4 font-mono font-bold text-[#161513] dark:text-[#F4F0EA] tracking-wider text-xs uppercase">Description Parameters</th>
              <th className="p-4 font-mono font-bold text-[#161513] dark:text-[#F4F0EA] tracking-wider text-xs uppercase">Physical Address</th>
              <th className="p-4 font-mono font-bold text-[#161513] dark:text-[#F4F0EA] tracking-wider text-xs uppercase">Geo Pins</th>
              <th className="p-4 font-mono font-bold text-[#161513] dark:text-[#F4F0EA] tracking-wider text-xs uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#222222]">
            {assetsList.map((asset) => (
              <tr key={asset._id} className="hover:bg-[#F4F0EA]/20 dark:hover:bg-[#121110]/20 transition-colors">
                <td className="p-4 font-bold text-[#161513] dark:text-[#F4F0EA] text-sm">{asset.assetType}</td>
                <td className="p-4 font-mono font-extrabold tracking-tight text-[#161513] dark:text-[#F4F0EA] text-base">
                  ₹ {asset.valueINR?.toLocaleString('en-IN')}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold text-xs max-w-xs truncate">{asset.description}</td>
                <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold text-xs leading-normal">
                  {asset.location?.address}, {asset.location?.city}, {asset.location?.state}
                </td>
                <td className="p-4 font-mono text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                  {asset.location?.coordinates?.lat?.toFixed(4)}, {asset.location?.coordinates?.lng?.toFixed(4)}
                </td>
                <td className="p-4 text-right">
                  <button
                    id={`edit-btn-${asset._id}`}
                    onClick={() => openEditModal(asset)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#E5E5E5] dark:border-[#222222] text-[#161513]/70 dark:text-[#F4F0EA]/70 hover:-translate-y-0.5 hover:border-[#8C6D47] hover:text-[#8C6D47] rounded-none text-xs font-mono font-bold transition-all duration-300 cursor-pointer shadow-sm"
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
  );
};

export default AssetTable;
