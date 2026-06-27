"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Users,
  Layers,
  Settings,
  Globe,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: CalendarRange, label: "Calendar", id: "calendar" },
  { icon: CalendarDays, label: "Appointments", id: "appointments" },
  { icon: Users, label: "Clients", id: "clients" },
  { icon: Layers, label: "Services", id: "services" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenPublicPage: () => void;
}

export function Sidebar({ activeNav, onNavChange, collapsed, onToggleCollapse, onOpenPublicPage }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 220 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex flex-col h-screen bg-[#0a0a0a] border-r border-[#d4af37]/8 z-30 flex-shrink-0"
    >
      {/* Top decorative gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

      {/* Brand */}
      <div className={cn(
        "flex items-center gap-3 px-4 h-16 border-b border-[#d4af37]/8",
        collapsed && "justify-center px-2"
      )}>
        <div className="relative flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(212,175,55,0.2)]">
          <img src="/logo.png" alt="Obsidian Booking" className="w-full h-full object-cover" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="text-sm font-bold tracking-wide text-[#e0e0e0] leading-tight">
                OBSIDIAN
              </div>
              <div className="text-[10px] tracking-[0.2em] text-[#d4af37]/60 font-medium uppercase">
                Booking
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavChange(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "relative w-full flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer",
                    collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5",
                    isActive
                      ? "text-[#d4af37]"
                      : isHovered
                      ? "text-[#e0e0e0] bg-[#161616]"
                      : "text-[#777] hover:text-[#b0b0b0]"
                  )}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-line"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-[#d4af37] to-[#b8960b]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}

                  {/* Active background glow */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-0 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-lg"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}

                  <item.icon
                    className={cn(
                      "w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200 relative z-10",
                      isActive ? "text-[#d4af37]" : ""
                    )}
                    strokeWidth={isActive ? 2 : 1.5}
                  />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        className="text-[13px] font-medium relative z-10 whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* View booking page + collapse */}
      <div className="p-3 border-t border-[#d4af37]/8 space-y-1.5">
        <button
          onClick={onOpenPublicPage}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[#d4af37]/70 hover:text-[#d4af37] hover:bg-[#161616] transition-all duration-200 cursor-pointer text-xs"
        >
          <Globe className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium whitespace-nowrap overflow-hidden"
              >
                View Booking Page
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[#555] hover:text-[#d4af37] hover:bg-[#161616] transition-all duration-200 cursor-pointer"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xs font-medium whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}