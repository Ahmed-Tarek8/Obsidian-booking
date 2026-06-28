"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "./PremiumButton";
import { useBookingStore, formatTime12 } from "@/lib/store";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

interface WeeklyCalendarProps {
  onSelectBooking?: (bookingId: string) => void;
  selectedBookingId?: string | null;
}

export function WeeklyCalendar({ onSelectBooking, selectedBookingId }: WeeklyCalendarProps) {
  const appointments = useBookingStore((s) => s.appointments);
  const clients = useBookingStore((s) => s.clients);
  const services = useBookingStore((s) => s.services);
  const staff = useBookingStore((s) => s.staff);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      return {
        date,
        short: format(date, "EEE").toUpperCase(),
        dayNum: format(date, "d"),
        isToday: isSameDay(date, today),
        dateStr: format(date, "yyyy-MM-dd"),
      };
    });
  }, [weekStart, today]);

  const headerLabel = useMemo(() => {
    const start = format(weekStart, "MMM d");
    const end = format(addDays(weekStart, 6), "MMM d, yyyy");
    return `${start} — ${end}`;
  }, [weekStart]);

  // Group appointments by date and time slot
  const appointmentsByDayAndSlot = useMemo(() => {
    const result: Record<string, Record<number, typeof appointments>> = {};
    weekDays.forEach((day) => {
      result[day.dateStr] = {};
    });

    appointments.forEach((appt) => {
      const dayEntry = weekDays.find((d) => d.dateStr === appt.date);
      if (!dayEntry) return;
      if (appt.status === "cancelled") return;

      // Parse start time to get slot index
      const [h, m] = appt.startTime.split(":").map(Number);
      const totalMinutes = h * 60 + m;
      const slotIndex = Math.floor((totalMinutes - 9 * 60) / 60); // 9 AM start

      if (slotIndex < 0 || slotIndex > 8) return;

      if (!result[dayEntry.dateStr][slotIndex]) {
        result[dayEntry.dateStr][slotIndex] = [];
      }
      result[dayEntry.dateStr][slotIndex].push(appt);
    });

    return result;
  }, [appointments, weekDays]);

  // Current time indicator
  const nowIndicator = useMemo(() => {
    const now = new Date();
    const nowDay = weekDays.find((d) => d.isToday);
    if (!nowDay) return null;

    const [h, m] = [now.getHours(), now.getMinutes()];
    const totalMinutes = h * 60 + m;
    const slotIndex = Math.floor((totalMinutes - 9 * 60) / 60);

    if (slotIndex < 0 || slotIndex > 8) return null;

    return {
      top: (slotIndex + 0.3) * 60,
      label: format(now, "h:mm a"),
    };
  }, [weekDays]);

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  return (
    <div className="premium-panel rounded-xl overflow-hidden h-full flex flex-col">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#d4af37]/8">
        <div className="flex items-center gap-3">
          <PremiumButton variant="ghost" size="sm" className="!p-1.5 !rounded-md">
            <ChevronLeft className="w-4 h-4" />
          </PremiumButton>
          <span className="text-sm font-semibold text-[#e0e0e0] tracking-wide">
            {headerLabel}
          </span>
          <PremiumButton variant="ghost" size="sm" className="!p-1.5 !rounded-md">
            <ChevronRight className="w-4 h-4" />
          </PremiumButton>
        </div>

        <div className="flex items-center gap-0.5 bg-[#0e0e0e] rounded-lg p-0.5 border border-[#d4af37]/8">
          <button className="px-3 py-1 text-[11px] font-semibold tracking-wider rounded-md bg-gradient-to-b from-[#d4af37] via-[#c9a227] to-[#b8960b] text-[#0a0a0a] shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]">
            WEEK
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-[#d4af37]/8">
        <div className="py-2.5 px-3" />
        {weekDays.map((day) => (
          <div
            key={day.dateStr}
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
              {day.dayNum}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Now indicator */}
        {nowIndicator && (
          <div
            className="absolute left-0 right-0 z-10 pointer-events-none"
            style={{ top: `${nowIndicator.top}px` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-[#d4af37] tracking-wider bg-[#d4af37]/10 px-1.5 py-0.5 rounded ml-2">
                NOW {nowIndicator.label}
              </span>
              <div className="flex-1 h-px bg-[#d4af37]/40" />
            </div>
          </div>
        )}

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
            {weekDays.map((day) => {
              const dayAppts = appointmentsByDayAndSlot[day.dateStr]?.[slotIdx] || [];
              const isNowRow = slotIdx === Math.floor((new Date().getHours() - 9) + (new Date().getMinutes() / 60)) && day.isToday;

              return (
                <div
                  key={day.dateStr + slotIdx}
                  className={cn(
                    "py-1 px-1.5 border-l border-[#d4af37]/5 relative",
                    isNowRow && "bg-[#d4af37]/2"
                  )}
                >
                  {dayAppts.map((appt) => {
                    const client = clients.find((c) => c.id === appt.clientId);
                    const service = services.find((s) => s.id === appt.serviceId);
                    const staffMember = staff.find((s) => s.id === appt.staffId);

                    return (
                      <motion.button
                        key={appt.id}
                        onClick={() => onSelectBooking?.(appt.id)}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: slotIdx * 0.03 }}
                        className={cn(
                          "booking-block w-full rounded-md p-2 text-left border bg-gradient-to-r cursor-pointer mb-1",
                          appt.status === "completed" ? "from-[#1a3d1a] via-[#142e14] to-[#0d1f0d] border-[#2ecc40]/25" :
                          appt.status === "cancelled" ? "from-[#3d1a1a] via-[#2e1414] to-[#1f0d0d] border-red-500/25 opacity-50" :
                          "from-[#3d2e0a] via-[#2a2008] to-[#1a1505] border-[#d4af37]/25",
                          selectedBookingId === appt.id && "ring-1 ring-[#d4af37]/40"
                        )}
                      >
                        <div className="text-[10px] text-[#999] font-medium">
                          {formatTime12(appt.startTime)} — {formatTime12(appt.endTime)}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-4 h-4 rounded bg-[#d4af37]/15 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[8px] font-bold text-[#d4af37]">{client?.initials || "??"}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-medium text-[#e0e0e0] truncate">
                              {client?.name || "Unknown"}
                            </div>
                            <div className="text-[9px] text-[#777] truncate">
                              {service?.name || "Service"} · {staffMember?.initials || "??"}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}