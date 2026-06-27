"use client";

import { Search, Plus, ChevronDown } from "lucide-react";
import { PremiumButton } from "./PremiumButton";
import { useBookingStore } from "@/lib/store";

interface TopbarProps {
  onNewBooking?: () => void;
}

export function Topbar({ onNewBooking }: TopbarProps) {
  const settings = useBookingStore((s) => s.settings);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#d4af37]/8 bg-[#0e0e0e]/80 backdrop-blur-sm relative z-20 flex-shrink-0">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            type="text"
            placeholder="Search clients, bookings..."
            className="premium-input w-full pl-10 pr-4 py-2 rounded-lg text-sm text-[#e0e0e0] placeholder:text-[#555] outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <PremiumButton variant="primary" size="md" onClick={onNewBooking}>
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">New Booking</span>
        </PremiumButton>

        {/* Workspace / Profile */}
        <div className="flex items-center gap-3 ml-3 pl-3 border-l border-[#d4af37]/10">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center group-hover:border-[#d4af37]/40 transition-colors">
              <span className="text-xs font-bold text-[#d4af37]">OB</span>
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-medium text-[#e0e0e0] leading-tight">{settings.studioName}</div>
              <div className="text-[10px] text-[#666] truncate max-w-[150px]">{settings.location.split(",")[0]}</div>
            </div>
            <ChevronDown className="w-3 h-3 text-[#555] hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}