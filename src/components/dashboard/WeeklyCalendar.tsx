"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "./PremiumButton";

type ViewMode = "DAY" | "WEEK" | "MONTH";

interface BookingBlock {
  id: string;
  time: string;
  endTime: string;
  clientInitials: string;
  clientLabel: string;
  service: string;
  staffInitials: string;
  color: string;
  span?: number;
}

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const days = [
  { short: "MON", full: "Mon, May 12", date: "12" },
  { short: "TUE", full: "Tue, May 13", date: "13" },
  { short: "WED", full: "Wed, May 14", date: "14" },
  { short: "THU", full: "Thu, May 15", date: "15", isToday: true },
  { short: "FRI", full: "Fri, May 16", date: "16" },
  { short: "SAT", full: "Sat, May 17", date: "17" },
  { short: "SUN", full: "Sun, May 18", date: "18" },
];

const bookingsBySlot: Record<string, BookingBlock[][]> = {
  "0": [
    [
      { id: "b1", time: "9:00 AM", endTime: "10:00 AM", clientInitials: "IA", clientLabel: "Investor A", service: "Strategy Session", staffInitials: "SB", color: "bg-gradient-to-b from-[#3d2e0a] via-[#2a2008] to-[#1a1505] border border-[#d4af37]/25" },
    ],
    [],
    [
      { id: "b2", time: "11:00 AM", endTime: "11:45 AM", clientInitials: "C7", clientLabel: "Client 07", service: "Team Workshop", staffInitials: "SC", color: "bg-gradient-to-b from-[#0a3d2d] via-[#0d2e23] to-[#071f17] border border-emerald-500/25" },
    ],
    [],
    [
      { id: "b3", time: "1:00 PM", endTime: "2:00 PM", clientInitials: "C3", clientLabel: "Client 03", service: "Full Consultation", staffInitials: "SB", color: "bg-gradient-to-b from-[#3d2e0a] via-[#2a2008] to-[#1a1505] border border-[#d4af37]/25" },
    ],
    [
      { id: "b4", time: "2:00 PM", endTime: "3:00 PM", clientInitials: "IA", clientLabel: "Investor A", service: "Deep Dive Session", staffInitials: "SA", color: "bg-gradient-to-b from-[#2d1a3d] via-[#20102e] to-[#150a20] border border-purple-500/25" },
    ],
    [],
    [
      { id: "b5", time: "4:00 PM", endTime: "5:00 PM", clientInitials: "C1", clientLabel: "Client 01", service: "Onboarding Call", staffInitials: "SC", color: "bg-gradient-to-b from-[#3d2a0a] via-[#2e1f08] to-[#1f1505] border border-amber-500/25" },
    ],
    [],
    [],
  ],
  "3": [
    [],
    [
      { id: "b6", time: "10:00 AM", endTime: "11:00 AM", clientInitials: "C5", clientLabel: "Client 05", service: "Portfolio Review", staffInitials: "SB", color: "bg-gradient-to-b from-[#3d2e0a] via-[#2a2008] to-[#1a1505] border border-[#d4af37]/25" },
    ],
    [],
    [
      { id: "b7", time: "12:00 PM", endTime: "12:45 PM", clientInitials: "B2", clientLabel: "Client B", service: "Quick Sync", staffInitials: "SA", color: "bg-gradient-to-b from-[#0a3d2d] via-[#0d2e23] to-[#071f17] border border-emerald-500/25" },
    ],
    [],
    [],
    [
      { id: "b8", time: "3:00 PM", endTime: "4:30 PM", clientInitials: "C9", clientLabel: "Client 09", service: "Extended Session", staffInitials: "SC", color: "bg-gradient-to-b from-[#3d2a0a] via-[#2e1f08] to-[#1f1505] border border-amber-500/25" },
      { id: "b9", time: "3:00 PM", endTime: "3:45 PM", clientInitials: "C2", clientLabel: "Client 02", service: "Follow-up Call", staffInitials: "SB", color: "bg-gradient-to-b from-[#2d1a3d] via-[#20102e] to-[#150a20] border border-purple-500/25" },
    ],
    [],
    [],
  ],
};

const nowSlotIndex = 2;
const nowSubLabel = "11:45 AM";

interface WeeklyCalendarProps {
  onSelectBooking?: (booking: BookingBlock) => void;
  selectedBookingId?: string | null;
}

export function WeeklyCalendar({ onSelectBooking, selectedBookingId }: WeeklyCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("WEEK");

  return (
    <div className="premium-panel rounded-xl overflow-hidden h-full flex flex-col">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#d4af37]/8">
        <div className="flex items-center gap-3">
          <PremiumButton variant="ghost" size="sm" className="!p-1.5 !rounded-md">
            <ChevronLeft className="w-4 h-4" />
          </PremiumButton>
          <span className="text-sm font-semibold text-[#e0e0e0] tracking-wide">
            MAY 12 — MAY 18, 2024
          </span>
          <PremiumButton variant="ghost" size="sm" className="!p-1.5 !rounded-md">
            <ChevronRight className="w-4 h-4" />
          </PremiumButton>
        </div>

        <div className="flex items-center gap-0.5 bg-[#0e0e0e] rounded-lg p-0.5 border border-[#d4af37]/8">
          {(["DAY", "WEEK", "MONTH"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "px-3 py-1 text-[11px] font-semibold tracking-wider rounded-md transition-all duration-200 cursor-pointer",
                viewMode === mode
                  ? "bg-gradient-to-b from-[#d4af37] via-[#c9a227] to-[#b8960b] text-[#0a0a0a] shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
                  : "text-[#666] hover:text-[#999]"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-[#d4af37]/8">
        <div className="py-2.5 px-3" />
        {days.map((day) => (
          <div
            key={day.short}
            className={cn(
              "py-2.5 text-center border-l border-[#d4af37]/5 first:border-l-0",
              day.isToday && "bg-[#d4af37]/3"
            )}
          >
            <div className={cn(
              "text-[10px] font-semibold tracking-widest",
              day.isToday ? "text-[#d4af37]" : "text-[#555]"
            )}>
              {day.short}
            </div>
            <div className={cn(
              "text-sm font-bold mt-0.5",
              day.isToday ? "text-[#d4af37]" : "text-[#999]"
            )}>
              {day.date}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Now indicator */}
        <div
          className="absolute left-0 right-0 z-10 pointer-events-none"
          style={{ top: `${(nowSlotIndex + 0.75) * 60}px` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-[#d4af37] tracking-wider bg-[#d4af37]/10 px-1.5 py-0.5 rounded ml-2">
              NOW {nowSubLabel}
            </span>
            <div className="flex-1 h-px bg-[#d4af37]/40" />
          </div>
        </div>

        {timeSlots.map((time, slotIdx) => (
          <div
            key={time}
            className="grid grid-cols-[80px_repeat(7,1fr)] h-[60px] border-b border-[#d4af37]/5"
          >
            {/* Time label */}
            <div className="py-1.5 px-3 flex items-start">
              <span className="text-[11px] text-[#555] font-medium tabular-nums">
                {time}
              </span>
            </div>

            {/* Day cells */}
            {days.map((day, dayIdx) => {
              const dayBookings = bookingsBySlot[String(dayIdx)]?.[slotIdx] || [];
              const isNowRow = slotIdx === nowSlotIndex && day.isToday;

              return (
                <div
                  key={day.short + dayIdx}
                  className={cn(
                    "py-1 px-1.5 border-l border-[#d4af37]/5 relative",
                    isNowRow && "bg-[#d4af37]/2"
                  )}
                >
                  {dayBookings.map((booking) => (
                    <motion.button
                      key={booking.id}
                      onClick={() => onSelectBooking?.(booking)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: slotIdx * 0.03 }}
                      className={cn(
                        "booking-block w-full rounded-md p-2 text-left border bg-gradient-to-r cursor-pointer group/bk",
                        booking.color,
                        selectedBookingId === booking.id && "ring-1 ring-[#d4af37]/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#999] font-medium">
                          {booking.time} — {booking.endTime}
                        </span>
                        <MoreHorizontal className="w-3 h-3 text-[#555] opacity-0 group-hover/bk:opacity-100 transition-opacity cursor-pointer" />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-4 h-4 rounded bg-[#d4af37]/15 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[8px] font-bold text-[#d4af37]">{booking.clientInitials}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-medium text-[#e0e0e0] truncate">
                            {booking.clientLabel}
                          </div>
                          <div className="text-[9px] text-[#777] truncate">
                            {booking.service} · {booking.staffInitials}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}