"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Diamond,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "./PremiumButton";
import { AppointmentDetailsPanel } from "./AppointmentDetailsPanel";
import { useBookingStore, formatTime12 } from "@/lib/store";

type ViewMode = "DAY" | "WEEK" | "MONTH";

/* ── Types ──────────────────────────────────────────── */
interface CalBlock {
  id: string;
  startTime: number;   // hours since midnight, e.g. 9.0
  endTime: number;     // e.g. 10.0
  clientInitials: string;
  clientLabel: string;
  service: string;
  staffLabel: string;
  isVip: boolean;
  gradient: string;    // CSS gradient string
  borderColor: string; // CSS border color
  accentColor: string; // text / icon accent
}

/* ── Color palettes (dark top → lighter bottom) ─────── */
const PAL = {
  gold:   { gradient: "linear-gradient(180deg, #4a3810 0%, #6b5020 40%, #8a6a2a 100%)", border: "rgba(212,175,55,0.45)", accent: "#f5d76e" },
  teal:   { gradient: "linear-gradient(180deg, #0f3d3d 0%, #1a6060 40%, #257a7a 100%)", border: "rgba(45,212,191,0.40)", accent: "#5eead4" },
  green:  { gradient: "linear-gradient(180deg, #0f3d22 0%, #1a6040 40%, #257a50 100%)", border: "rgba(52,211,153,0.40)", accent: "#6ee7b7" },
  purple: { gradient: "linear-gradient(180deg, #351450 0%, #50206e 40%, #6b2e90 100%)", border: "rgba(192,132,252,0.40)", accent: "#d8b4fe" },
  blue:   { gradient: "linear-gradient(180deg, #122550 0%, #1a3870 40%, #254a90 100%)", border: "rgba(96,165,250,0.40)", accent: "#93c5fd" },
};

const PALETTE_KEYS = Object.keys(PAL) as (keyof typeof PAL)[];

/* ── Helpers ───────────────────────────────────────── */

/** Parse "HH:mm" (24h) → decimal hours, e.g. "09:30" → 9.5 */
function parseTime24(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h + (m || 0) / 60;
}

/** Format decimal hours → "h:mm AM/PM", e.g. 9.5 → "9:30 AM" */
function formatTime(h: number): string {
  const hr = Math.floor(h);
  const min = Math.round((h - hr) * 60);
  const ampm = hr >= 12 ? "PM" : "AM";
  const display = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
  return `${display}:${String(min).padStart(2, "0")} ${ampm}`;
}

/** Get Monday of the week containing `date` */
function getMonday(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay(); // 0=Sun, 1=Mon ...
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** Format Date → "YYYY-MM-DD" */
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ── Collision / Layout Algorithm ───────────────────── */
interface LayoutBlock extends CalBlock {
  col: number;
  totalCols: number;
}

function layoutDay(blocks: CalBlock[]): LayoutBlock[] {
  if (!blocks.length) return [];

  const sorted = [...blocks].sort((a, b) => a.startTime - b.startTime || a.endTime - b.endTime);

  // Assign columns greedily
  const columns: { start: number; end: number }[][] = [];

  for (const b of sorted) {
    let placed = false;
    for (let c = 0; c < columns.length; c++) {
      const last = columns[c][columns[c].length - 1];
      if (b.startTime >= last.end) {
        columns[c].push({ start: b.startTime, end: b.endTime });
        (b as LayoutBlock).col = c;
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([{ start: b.startTime, end: b.endTime }]);
      (b as LayoutBlock).col = columns.length - 1;
    }
  }

  // Now for each block, find max columns in its overlapping group
  const result: LayoutBlock[] = sorted.map((b) => ({ ...b, col: (b as LayoutBlock).col, totalCols: 1 }));

  for (const b of result) {
    const overlapping = result.filter(o =>
      o.startTime < b.endTime && o.endTime > b.startTime
    );
    b.totalCols = Math.max(...overlapping.map(o => o.col)) + 1;
  }

  return result;
}

/* ── Constants ──────────────────────────────────────── */
const START_HOUR = 8;
const END_HOUR = 19;  // 7 PM — last visible hour
const ROW_H = 52;     // px per hour
const TOTAL_H = (END_HOUR - START_HOUR) * ROW_H;

const DAY_SHORTS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

/* ── Component ──────────────────────────────────────── */
interface CalendarPageProps {
  onSelectBooking?: (id: string) => void;
  selectedBookingId?: string | null;
}

export function CalendarPage({ onSelectBooking, selectedBookingId }: CalendarPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("WEEK");

  /* ── Store subscriptions ─────────────────────────── */
  const appointments = useBookingStore((s) => s.appointments);
  const getClient = useBookingStore((s) => s.getClient);
  const getService = useBookingStore((s) => s.getService);
  const getStaff = useBookingStore((s) => s.getStaff);
  const getResource = useBookingStore((s) => s.getResource);

  /* ── Week navigation ─────────────────────────────── */
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const { appointments: appts } = useBookingStore.getState();
    if (appts.length) {
      const dates = appts.map((a) => a.date).sort();
      return getMonday(new Date(dates[0] + "T00:00:00"));
    }
    return getMonday(new Date());
  });

  const goToPrevWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  /* ── Derived: day metadata (Mon–Sun of current week) */
  const dayMeta = useMemo(() => {
    const todayStr = toDateString(new Date());
    return DAY_SHORTS.map((short, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return {
        short,
        date: d.getDate().toString(),
        dateStr: toDateString(d),
        isToday: toDateString(d) === todayStr,
      };
    });
  }, [weekStart]);

  /* ── Derived: header date range label ────────────── */
  const headerDateRange = useMemo(() => {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    const monthName = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
    return `${monthName(start)} ${start.getDate()} — ${monthName(end)} ${end.getDate()}, ${start.getFullYear()}`;
  }, [weekStart]);

  /* ── Derived: CalBlocks from store appointments ──── */
  const dayLayouts = useMemo(() => {
    let globalIdx = 0;

    return dayMeta.map((day) => {
      const dayAppts = appointments.filter((a) => a.date === day.dateStr);
      const blocks: CalBlock[] = dayAppts.map((appt) => {
        const client = getClient(appt.clientId);
        const service = getService(appt.serviceId);
        const staff = getStaff(appt.staffId);
        const pal = PALETTE_KEYS[globalIdx % PALETTE_KEYS.length];
        globalIdx++;

        return {
          id: appt.id,
          startTime: parseTime24(appt.startTime),
          endTime: parseTime24(appt.endTime),
          clientInitials: client?.initials ?? "??",
          clientLabel: client?.name ?? "Unknown Client",
          service: service?.name ?? "Unknown Service",
          staffLabel: staff?.name ?? "Unknown Staff",
          isVip: client?.tier === "VIP",
          gradient: PAL[pal].gradient,
          borderColor: PAL[pal].border,
          accentColor: PAL[pal].accent,
        };
      });
      return layoutDay(blocks);
    });
  }, [appointments, dayMeta, getClient, getService, getStaff]);

  /* ── Derived: hour labels ────────────────────────── */
  const hourLabels = useMemo(() => {
    const labels: string[] = [];
    for (let h = START_HOUR; h < END_HOUR; h++) {
      const ampm = h >= 12 ? "PM" : "AM";
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      labels.push(`${display}:00 ${ampm}`);
    }
    return labels;
  }, []);

  /* ── Derived: NOW indicator ──────────────────────── */
  const nowIndicator = useMemo(() => {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const y = (h - START_HOUR) * ROW_H;
    const label = formatTime12(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    );
    return { y, label };
  }, []);

  /* ── Derived: selected appointment details for panel */
  const selectedDetails = useMemo(() => {
    if (!selectedBookingId) return undefined;
    const appt = appointments.find((a) => a.id === selectedBookingId);
    if (!appt) return undefined;

    const client = getClient(appt.clientId);
    const service = getService(appt.serviceId);
    const staff = getStaff(appt.staffId);
    const resource = getResource(appt.resourceId);
    if (!client || !service || !staff) return undefined;

    const dateObj = new Date(appt.date + "T00:00:00");
    const dateStr = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const [sh, sm] = appt.startTime.split(":").map(Number);
    const [eh, em] = appt.endTime.split(":").map(Number);
    const durationMin = (eh * 60 + em) - (sh * 60 + sm);

    return {
      id: appt.id,
      clientInitials: client.initials,
      clientLabel: client.name,
      clientType: client.tier === "VIP" ? ("VIP" as const) : undefined,
      service: service.name,
      staffInitials: staff.initials,
      staffLabel: staff.name,
      date: dateStr,
      time: formatTime12(appt.startTime),
      endTime: formatTime12(appt.endTime),
      duration: `${durationMin} min`,
      location: resource?.location ?? "",
      status: appt.status as
        | "confirmed"
        | "pending"
        | "rescheduled"
        | "cancelled"
        | "completed",
      notes: appt.notes || undefined,
      bookingId: appt.bookingId,
    };
  }, [selectedBookingId, appointments, getClient, getService, getStaff, getResource]);

  return (
    <div className="p-6 animate-fade-in-up flex gap-5 h-full">
      {/* Main calendar */}
      <div className="premium-panel rounded-xl overflow-hidden flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#d4af37]/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <PremiumButton
              variant="ghost"
              size="sm"
              className="!p-1.5 !rounded-md"
              onClick={goToPrevWeek}
            >
              <ChevronLeft className="w-4 h-4" />
            </PremiumButton>
            <button className="flex items-center gap-2 text-sm font-semibold text-[#e0e0e0] tracking-wide cursor-pointer hover:text-[#d4af37] transition-colors">
              {headerDateRange}
              <ChevronDown className="w-3.5 h-3.5 text-[#666]" />
            </button>
            <PremiumButton
              variant="ghost"
              size="sm"
              className="!p-1.5 !rounded-md"
              onClick={goToNextWeek}
            >
              <ChevronRight className="w-4 h-4" />
            </PremiumButton>
          </div>

          <div className="flex items-center gap-2">
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
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-[#d4af37]/8 flex-shrink-0">
          <div className="py-2.5 px-3" />
          {dayMeta.map((day) => (
            <div
              key={day.short}
              className={cn(
                "py-2 text-center border-l border-[#d4af37]/5",
                day.isToday && "bg-[#d4af37]/5"
              )}
            >
              <div
                className={cn(
                  "text-[10px] font-semibold tracking-[0.15em]",
                  day.isToday ? "text-[#d4af37]" : "text-[#555]"
                )}
              >
                {day.short}
              </div>
              <div
                className={cn(
                  "text-sm font-bold mt-0.5",
                  day.isToday ? "text-[#d4af37]" : "text-[#999]"
                )}
              >
                {day.date}
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable time grid */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Now indicator */}
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{ top: nowIndicator.y }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-red-400 tracking-wider bg-red-500/10 px-1.5 py-0.5 rounded ml-1 whitespace-nowrap">
                NOW {nowIndicator.label}
              </span>
              <div className="flex-1 h-px bg-red-500/50" />
            </div>
          </div>

          <div className="flex">
            {/* Time labels column */}
            <div
              className="w-[72px] flex-shrink-0 relative"
              style={{ height: TOTAL_H }}
            >
              {hourLabels.map((label, i) => (
                <div
                  key={label}
                  className="absolute right-3 -translate-y-1/2"
                  style={{ top: i * ROW_H }}
                >
                  <span className="text-[10px] text-[#555] font-medium tabular-nums">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div
              className="flex-1 grid grid-cols-7 relative"
              style={{ height: TOTAL_H }}
            >
              {dayMeta.map((day, dayIdx) => (
                <div
                  key={day.short}
                  className={cn(
                    "relative border-l border-[#d4af37]/5",
                    day.isToday && "bg-[#d4af37]/[0.015]"
                  )}
                >
                  {/* Hour grid lines */}
                  {hourLabels.map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 border-b border-[#d4af37]/5"
                      style={{ top: i * ROW_H }}
                    />
                  ))}

                  {/* Booking blocks */}
                  {dayLayouts[dayIdx].map((b) => {
                    const top = (b.startTime - START_HOUR) * ROW_H;
                    const height = Math.max(
                      (b.endTime - b.startTime) * ROW_H - 2,
                      36
                    );
                    const widthPct = 100 / b.totalCols;
                    const leftPct = b.col * widthPct;

                    return (
                      <motion.button
                        key={b.id}
                        onClick={() => onSelectBooking?.(b.id)}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "absolute rounded-md text-left cursor-pointer transition-all duration-200 group/bk",
                          "booking-block",
                          selectedBookingId === b.id &&
                            "ring-1 ring-[#d4af37]/50",
                          "hover:brightness-125 hover:z-10"
                        )}
                        style={{
                          top: top + 1,
                          height,
                          left: `calc(${leftPct}% + 2px)`,
                          width: `calc(${widthPct}% - 4px)`,
                          background: b.gradient,
                          border: `1px solid ${b.borderColor}`,
                          boxShadow:
                            selectedBookingId === b.id
                              ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 6px rgba(0,0,0,0.5), 0 0 12px rgba(212,175,55,0.15)"
                              : "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 4px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
                        }}
                      >
                        <div className="px-1 py-1 h-full flex flex-col justify-start overflow-hidden relative">
                          {/* Client name + VIP */}
                          <div className="flex items-center gap-1">
                            {b.isVip && (
                              <Diamond
                                className="w-2 h-2 flex-shrink-0"
                                style={{ color: b.accentColor }}
                              />
                            )}
                            <span
                              className={cn(
                                "font-semibold truncate leading-tight",
                                b.totalCols > 1
                                  ? "text-[8px]"
                                  : "text-[10px]"
                              )}
                              style={{ color: b.accentColor }}
                            >
                              {b.clientLabel}
                            </span>
                          </div>
                          {/* Service — hide in narrow overlapping blocks */}
                          {b.totalCols <= 1 && (
                            <div className="text-[8px] text-[#bbb] truncate leading-tight mt-px">
                              {b.service}
                            </div>
                          )}
                          {/* Time + Staff (only if block is tall AND wide enough) */}
                          {height > 50 && b.totalCols <= 1 && (
                            <div className="text-[7px] text-[#888] mt-px truncate leading-tight">
                              {formatTime(b.startTime)} — {formatTime(b.endTime)} ·{" "}
                              {b.staffLabel}
                            </div>
                          )}

                          {/* Hover actions */}
                          <div className="absolute top-1 right-1 opacity-0 group-hover/bk:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-3 h-3 text-[#888]" />
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right detail panel — driven from store */}
      <div className="w-[300px] flex-shrink-0">
        <AppointmentDetailsPanel
          details={selectedDetails}
          isOpen={!!selectedBookingId}
          onClose={() => onSelectBooking?.(null as unknown as string)}
        />
      </div>
    </div>
  );
}