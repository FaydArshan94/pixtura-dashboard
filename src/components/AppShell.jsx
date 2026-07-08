"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatusBar from './StatusBar';

export default function AppShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen bg-[#f3f7f9] overflow-hidden antialiased font-sans select-none text-[#1e293b]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* <Header /> */}

        <div className="flex-1 overflow-y-auto px-8 pb-20 pt-2 custom-scrollbar">
          {children}
        </div>

        <StatusBar />
      </div>
    </div>
  );
}
