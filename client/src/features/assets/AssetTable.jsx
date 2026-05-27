import React from 'react';
import { Plus, Edit2 } from 'lucide-react';

const AssetTable = ({ assetsList, openAddModal, openEditModal }) => {
  return (
    <section className="bg-white dark:bg-[#1A1917] border border-[#E0D9CF] dark:border-[#2E2C29] rounded-none shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden text-[#161513] dark:text-[#F4F0EA] transition-colors duration-200">
      <div className="p-5 border-b border-[#E0D9CF] dark:border-[#2E2C29] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#161513] dark:text-[#F4F0EA]">Venture Footprint Ledger</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Physical and financial assets mapped securely inside MongoDB Atlas.</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            id="add-new-asset-btn"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#161513] text-[#F4F0EA] dark:bg-[#F4F0EA] dark:text-[#161513] font-mono font-bold rounded-none uppercase hover:bg-[#8C6D47] dark:hover:bg-[#8C6D47] dark:hover:text-white transition-all shadow cursor-pointer text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Asset
          </button>
          <span className="text-[9px] bg-[#F4F0EA] dark:bg-[#121110] border border-[#E0D9CF] dark:border-[#2E2C29] text-slate-600 dark:text-slate-400 font-mono font-bold rounded-none uppercase tracking-wider px-2 py-1">Active Ledger</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-[#E0D9CF] dark:divide-[#2E2C29]">
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
          <tbody className="divide-y divide-[#E0D9CF] dark:divide-[#2E2C29]">
            {assetsList.map((asset) => (
              <tr key={asset._id} className="hover:bg-[#F4F0EA]/20 dark:hover:bg-[#121110]/20 transition-colors">
                <td className="p-4 font-bold text-[#161513] dark:text-[#F4F0EA] text-sm">{asset.assetType}</td>
                <td className="p-4 font-mono font-bold text-[#161513] dark:text-[#F4F0EA] text-sm">
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#E0D9CF] dark:border-[#2E2C29] text-[#161513]/70 dark:text-[#F4F0EA]/70 hover:border-[#8C6D47] hover:text-[#8C6D47] hover:bg-[#161513]/5 dark:hover:bg-white/5 rounded-none text-xs font-mono font-bold transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
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
