import React from 'react';

export default function StatusBar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-9 bg-white border-t border-slate-200/80 px-8 flex items-center justify-between text-xs text-slate-500 z-10 select-none">
      {/* Storage allocation status indicator */}
      <div className="flex items-center gap-2 font-medium">
        <span className="text-slate-700 font-semibold">81.3 MB / 65</span>
        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <div className="h-full bg-blue-500 w-[45%]" />
        </div>
      </div>

      {/* Concurrent Worker Queue Info */}
      <div className="flex items-center gap-6 font-semibold">
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800 transition-colors">
          <span>Downloads</span>
        </div>
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800 transition-colors">
          <span>Pending Jobs</span>
          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-bold border border-slate-200/60">0</span>
        </div>
      </div>
    </div>
  );
}