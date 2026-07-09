"use client";

import Sidebar from "@/components/Sidebar";
import StatusBar from "@/components/StatusBar";
import useStore from "@/lib/useStore";

export default function DashboardShell({ children }) {
  const sidebarOpen = useStore((state) => state.ui.sidebarOpen);
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);

  return (
    <div className="flex h-screen w-screen bg-[#f3f7f9] overflow-hidden antialiased font-sans select-none text-[#1e293b]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 pb-20 pt-2 custom-scrollbar">
          {children}
        </div>
        <StatusBar />
      </div>
    </div>
  );
}