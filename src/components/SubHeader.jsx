import React from 'react';
import { Home, RefreshCw, Plus, Eye, ListFilter } from 'lucide-react';

export default function SubHeader({ onNewClick }) {
  return (
    <div className="h-14 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
      {/* Route Directory Information */}
      {/* <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 cursor-pointer">
          <Home size={16} className="text-slate-500" />
          <span>Home</span>
        </div>
        <button className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors">
          <RefreshCw size={13} />
        </button>
      </div> */}

      {/* Quick Action Interactive Buttons Bundle */}
      <div className="flex items-center gap-2">
        {/* <div className="relative flex items-center bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 px-3 py-1.5 shadow-sm cursor-pointer hover:bg-slate-50">
          <span>Sort: Creation Date</span>
          <span className="ml-2 text-slate-400 text-[10px]">▼</span>
        </div> */}
        
        {/* <button className="p-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors shadow-sm">
          <ListFilter size={14} />
        </button> */}

        <button
          onClick={onNewClick}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors"
        >
          <Plus size={14} /> New
        </button>

        {/* <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors">
          <Eye size={14} /> Preview
        </button> */}
      </div>
    </div>
  );
}