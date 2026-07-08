"use client";

import React, { useEffect } from "react";
import { Search, Bell, Sparkles } from "lucide-react";
import { useStore } from "../lib/useStore";

export default function Header({ searchQuery = "", onSearchChange }) {
  const user = useStore((state) => state.auth.user);
  const fetchCurrentUser = useStore((state) => state.fetchCurrentUser);
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-end flex-shrink-0">
      {/* <div className="w-full max-w-xl relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search media by name"
          className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-transparent focus:border-slate-300 rounded-lg outline-none text-sm font-medium transition-all text-slate-700"
        />
      </div> */}

      {/* Action Center Components Group */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all">
          <Sparkles size={14} />
          DAM agent
        </button>
      </div>
    </header>
  );
}
