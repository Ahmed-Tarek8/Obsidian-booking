"use client";

import { Plus } from "lucide-react";
import { PremiumButton } from "./PremiumButton";
import { useBookingStore } from "@/lib/store";

interface TopbarProps {
  onNewBooking?: () => void;
}

export function Topbar({ onNewBooking }: TopbarProps) {
  const settings = useBookingStore((s) => s.settings);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#d4af37]/8 bg-[#0e0e0e]/80 backdrop-blur-sm relative z-20 flex-shrink-0">
      {/* Business name area */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center">
          <span className="text-xs font-bold text-[#d4af37]">OA</span>
        </div>
        <div className="hidden md:block">
          <div className="text-xs font-medium text-[#e0e0e0] leading-tight">{settings.studioName}</div>
          <div className="text-[10px] text-[#666] truncate max-w-[200px]">{settings.location}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <PremiumButton variant="primary" size="md" onClick={onNewBooking}>
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">New Booking</span>
        </PremiumButton>
      </div>
    </header>
  );
}