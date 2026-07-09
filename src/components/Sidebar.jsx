"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Layers,
  PanelLeft,
  Plus,
  Key,
  LogOut,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useStore from "@/lib/useStore";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useStore((state) => state.auth);
  const logout = useStore((state) => state.logout);


  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const damItems = [
    { name: "Media library", id: "dash", icon: Layers, href: "/dashboard" },
    { name: "API Keys", id: "api-keys", icon: Key, href: "/api-keys" },
    {
      name: "Quickstart",
      id: "quickstart",
      icon: FileText,
      href: "/quickstart",
    },
  ];

  const isActiveItem = (item) => {
    if (item.id === "api-keys") {
      return pathname === "/api-keys" || pathname.startsWith("/api-keys/");
    }
    if (item.id === "quickstart") {
      return pathname === "/quickstart" || pathname.startsWith("/quickstart/");
    }
    return (
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/") ||
      pathname === "/media" ||
      pathname.startsWith("/media/")
    );
  };

  return (
    <>
      <motion.div
        animate={{
          width: isOpen ? 260 : 56,
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full bg-[#0a1829] text-slate-300 flex flex-col justify-between shrink-0 relative overflow-hidden"
      >
        <div>
          <div className="p-5 flex items-center justify-between border-b border-slate-800/60 h-16">
            {/* <div
              className={`flex items-center gap-2 ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity`}
            >
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-base">
                i
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                imagix<span className="text-slate-400 font-normal">.io</span>
              </span>
            </div> */}

            <motion.div
              animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div>
                <div className="flex items-end gap-2">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="36"
                      height="36"
                      rx="6"
                      fill="#0a1829"
                    />
                    <rect
                      x="2.5"
                      y="2.5"
                      width="31"
                      height="31"
                      rx="4"
                      fill="none"
                      stroke="#0066cc"
                      stroke-width="1"
                    />
                    <rect
                      x="5"
                      y="5"
                      width="5"
                      height="5"
                      rx="1"
                      fill="#0066cc"
                      opacity="0.9"
                    />

                    <rect
                      x="26"
                      y="5"
                      width="5"
                      height="5"
                      rx="1"
                      fill="#092646"
                      opacity="0.35"
                    />

                    <rect
                      x="5"
                      y="26"
                      width="5"
                      height="5"
                      rx="1"
                      fill="#082749"
                      opacity="0.35"
                    />

                    <rect
                      x="26"
                      y="26"
                      width="5"
                      height="5"
                      rx="1"
                      fill="#0066cc"
                      opacity="0.35"
                    />
                    <text
                      x="18"
                      y="25"
                      text-anchor="middle"
                      font-family="monospace"
                      font-weight="700"
                      font-size="16"
                      fill="white"
                    >
                      i
                    </text>
                  </svg>

                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      letterSpacing: "-0.5px",
                      color: "#f1f5f9",
                    }}
                  >
                    pixtura
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#0066cc",
                      }}
                    >
                      .io
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 transition-colors"
            >
              <PanelLeft size={16} />
            </button>
          </div>

          {/* <div className="p-4">
            <div className="bg-linear-to-br from-slate-900 to-[#11253e] rounded-xl p-4 border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-2 right-2 text-yellow-500 animate-pulse">
                ⚡
              </div>
              <h4 className="text-white text-sm font-semibold mb-1">
                Upgrade to Pro
              </h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                225GB bandwidth and much more
              </p>
              <button className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white py-1.5 px-3 rounded-lg border border-slate-700 transition-all flex items-center gap-1">
                Know more <span className="text-[10px]">»</span>
              </button>
            </div>
          </div> */}

          <div className="px-3 space-y-6 mt-2">
            <div>
              <div className="overflow-hidden h-4">
                <motion.span
                  animate={{ y: isOpen ? 0 : -50 }}
                  transition={{ duration: 0.5 }}
                  className="px-3 text-[10px] block font-bold tracking-wider text-slate-500 uppercase overflow-hidden whitespace-nowrap"
                >
                  Digital Asset Management
                </motion.span>
              </div>
              <ul className="space-y-1 mt-2">
                {damItems.map((item) => {
                  const isActive = isActiveItem(item);
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`group relative flex items-center justify-between px-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700"
                            : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                        }`}
                      >
                        <span
                          className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full ${
                            isOpen && isActive
                              ? "bg-blue-500"
                              : "bg-transparent"
                          }`}
                        />
                        <div className="flex items-center justify-center gap-3">
                          <item.icon
                            size={16}
                            className={`
                              
                              ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"}
                            `}
                          />
                          <motion.span
                            animate={{
                              opacity: isOpen ? 1 : 0,
                              width: isOpen ? "auto" : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        </div>
                        {item.hasPlus && (
                          <Plus
                            size={14}
                            className="text-slate-500 hover:text-white cursor-pointer"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/60 bg-slate-900/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {auth?.loading ? (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse shrink-0" />
                <div className="min-w-0 space-y-2">
                  <div className="h-2.5 w-24 rounded-full bg-slate-800 animate-pulse" />
                  <div className="h-2.5 w-32 rounded-full bg-slate-800 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-600/80 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {auth?.user?.username?.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {auth?.user?.username || auth?.user?.email}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {auth?.user?.email}
                  </p>
                </div>
              </div>
            )}
           
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center w-full py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm ${
              isOpen ? "gap-2" : "gap-0"
            }`}
          >
            <div className="flex items-center justify-center">
              <LogOut size={14} className="shrink-0" />
            </div>

            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                width: isOpen ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              Logout
            </motion.span>
          </button>
        </div>
      </motion.div>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute left-3 top-4 z-20 p-2 bg-[#0a1829] hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors shadow-md"
        >
          <PanelLeft size={16} />
        </button>
      )}
    </>
  );
}
