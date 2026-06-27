"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Filter,
  Diamond,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "./PremiumButton";
import { AppointmentDetailsPanel } from "./AppointmentDetailsPanel";

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

function bk(id: string, s: string, e: string, ci: string, cl: string, svc: string, staff: string, vip: boolean, pal: keyof typeof PAL): CalBlock {
  return {
    id, startTime: parseTime(s), endTime: parseTime(e),
    clientInitials: ci, clientLabel: cl, service: svc, staffLabel: staff, isVip: vip,
    gradient: PAL[pal].gradient, borderColor: PAL[pal].border, accentColor: PAL[pal].accent,
  };
}

function parseTime(t: string): number {
  const [h, m] = t.replace(/\s*(AM|PM)/i, "").split(":").map(Number);
  const pm = /PM/i.test(t) && h !== 12;
  const am = /AM/i.test(t) && h === 12;
  return (pm ? h + 12 : am ? 0 : h) + (m || 0) / 60;
}

/* ── Data ───────────────────────────────────────────── */
const ALL_BOOKINGS: CalBlock[][] = [
  // Monday
  [bk("cb1","9:00 AM","10:00 AM","IA","Investor A","Strategy Session","Staff A",true,"gold"),
   bk("cb2","11:00 AM","11:45 AM","C7","Client 07","Team Workshop","Staff C",true,"teal"),
   bk("cb3","1:00 PM","2:00 PM","C3","Client 03","Full Consultation","Staff B",false,"purple"),
   bk("cb4","2:00 PM","3:00 PM","IA","Investor A","Deep Dive","Staff A",true,"gold"),
   bk("cb5","4:00 PM","5:00 PM","C1","Client 01","Onboarding Call","Staff C",false,"blue")],
  // Tuesday
  [bk("cb6","8:00 AM","9:00 AM","C5","Client 05","Portfolio Review","Staff B",false,"gold"),
   bk("cb7","10:00 AM","11:00 AM","C4","Client 04","Strategy Session","Staff A",true,"gold"),
   bk("cb8","12:00 PM","12:45 PM","B2","Client B","Quick Sync","Staff A",false,"green"),
   bk("cb9","3:00 PM","4:30 PM","C9","Client 09","Extended Session","Staff C",false,"purple"),
   bk("cb10","3:00 PM","3:45 PM","C2","Client 02","Follow-up Call","Staff B",false,"blue"),
   bk("cb11","6:00 PM","7:00 PM","C8","Client 08","Team Workshop","Staff C",false,"teal")],
  // Wednesday
  [bk("cb12","9:00 AM","10:00 AM","IA","Investor A","Strategy Session","Staff B",true,"gold"),
   bk("cb13","11:00 AM","12:00 PM","C3","Client 03","Full Consultation","Staff A",false,"purple"),
   bk("cb14","2:00 PM","3:00 PM","C5","Client 05","Portfolio Review","Staff B",false,"gold"),
   bk("cb15","4:00 PM","5:00 PM","B2","Client B","Quick Sync","Staff A",false,"green")],
  // Thursday
  [bk("cb16","9:00 AM","10:30 AM","IA","Investor A","Deep Dive","Staff A",true,"gold"),
   bk("cb17","11:00 AM","11:45 AM","C7","Client 07","Team Workshop","Staff C",true,"teal"),
   bk("cb18","1:00 PM","2:00 PM","C3","Client 03","Onboarding Call","Staff B",false,"blue"),
   bk("cb19","3:00 PM","4:00 PM","C1","Client 01","Strategy Session","Staff A",false,"gold"),
   bk("cb20","3:00 PM","3:45 PM","C6","Client 06","Follow-up Call","Staff C",false,"blue"),
   bk("cb21","5:00 PM","6:00 PM","C4","Client 04","Extended Session","Staff B",true,"purple")],
  // Friday
  [bk("cb22","9:00 AM","10:00 AM","C5","Client 05","Portfolio Review","Staff B",false,"gold"),
   bk("cb23","10:00 AM","11:00 AM","C9","Client 09","Full Consultation","Staff A",false,"purple"),
   bk("cb24","1:00 PM","2:00 PM","IA","Investor A","Strategy Session","Staff A",true,"gold"),
   bk("cb25","3:00 PM","4:00 PM","B2","Client B","Quick Sync","Staff C",false,"green"),
   bk("cb26","5:00 PM","6:30 PM","C2","Client 02","Team Workshop","Staff A",false,"teal")],
  // Saturday
  [bk("cb27","10:00 AM","11:00 AM","C6","Client 06","Onboarding Call","Staff B",false,"blue"),
   bk("cb28","12:00 PM","1:00 PM","C8","Client 08","Full Consultation","Staff C",false,"purple"),
   bk("cb29","2:00 PM","3:00 PM","C1","Client 01","Portfolio Review","Staff A",false,"gold"),
   bk("cb30","4:00 PM","5:00 PM","C7","Client 07","Team Workshop","Staff C",true,"teal")],
  // Sunday
  [bk("cb31","11:00 AM","12:00 PM","C4","Client 04","Strategy Session","Staff B",true,"gold"),
   bk("cb32","2:00 PM","3:00 PM","C9","Client 09","Follow-up Call","Staff A",false,"blue"),
   bk("cb33","4:00 PM","5:00 PM","C3","Client 03","Quick Sync","Staff C",false,"green")],
];

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
    // Find all blocks that overlap with b
    const overlapping = result.filter(o =>
      o.startTime < b.endTime && o.endTime > b.startTime
    );
    // Max column index among overlapping + 1 = total columns
    b.totalCols = Math.max(...overlapping.map(o => o.col)) + 1;
  }

  return result;
}

/* ── Constants ──────────────────────────────────────── */
const START_HOUR = 8;
const END_HOUR = 19;  // 7 PM — last visible hour
const ROW_H = 52;     // px per hour
const TOTAL_H = (END_HOUR - START_HOUR) * ROW_H;

const dayMeta = [
  { short: "MON", date: "12" },
  { short: "TUE", date: "13" },
  { short: "WED", date: "14" },
  { short: "THU", date: "15", isToday: true },
  { short: "FRI", date: "16" },
  { short: "SAT", date: "17" },
  { short: "SUN", date: "18" },
];

const nowHour = 13.75; // 1:45 PM
const nowSlotY = (nowHour - START_HOUR) * ROW_H;

/* ── Component ──────────────────────────────────────── */
interface CalendarPageProps {
  onSelectBooking?: (id: string) => void;
  selectedBookingId?: string | null;
}

export function CalendarPage({ onSelectBooking, selectedBookingId }: CalendarPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("WEEK");

  const dayLayouts = useMemo(
    () => ALL_BOOKINGS.map(dayBlocks => layoutDay(dayBlocks)),
    []
  );

  const hourLabels = useMemo(() => {
    const labels: string[] = [];
    for (let h = START_HOUR; h < END_HOUR; h++) {
      const ampm = h >= 12 ? "PM" : "AM";
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      labels.push(`${display}:00 ${ampm}`);
    }
    return labels;
  }, []);

  return (
    <div className="p-6 animate-fade-in-up flex gap-5 h-full">
      {/* Main calendar */}
      <div className="premium-panel rounded-xl overflow-hidden flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#d4af37]/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <PremiumButton variant="ghost" size="sm" className="!p-1.5 !rounded-md">
              <ChevronLeft className="w-4 h-4" />
            </PremiumButton>
            <button className="flex items-center gap-2 text-sm font-semibold text-[#e0e0e0] tracking-wide cursor-pointer hover:text-[#d4af37] transition-colors">
              MAY 12 — MAY 18, 2024
              <ChevronDown className="w-3.5 h-3.5 text-[#666]" />
            </button>
            <PremiumButton variant="ghost" size="sm" className="!p-1.5 !rounded-md">
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
            <PremiumButton variant="secondary" size="sm">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </PremiumButton>
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
              <div className={cn(
                "text-[10px] font-semibold tracking-[0.15em]",
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

        {/* Scrollable time grid */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Now indicator */}
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{ top: nowSlotY }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-red-400 tracking-wider bg-red-500/10 px-1.5 py-0.5 rounded ml-1 whitespace-nowrap">
                NOW 1:45 PM
              </span>
              <div className="flex-1 h-px bg-red-500/50" />
            </div>
          </div>

          <div className="flex">
            {/* Time labels column */}
            <div className="w-[72px] flex-shrink-0 relative" style={{ height: TOTAL_H }}>
              {hourLabels.map((label, i) => (
                <div
                  key={label}
                  className="absolute right-3 -translate-y-1/2"
                  style={{ top: i * ROW_H }}
                >
                  <span className="text-[10px] text-[#555] font-medium tabular-nums">{label}</span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div className="flex-1 grid grid-cols-7 relative" style={{ height: TOTAL_H }}>
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
                    const height = Math.max((b.endTime - b.startTime) * ROW_H - 2, 36);
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
                          selectedBookingId === b.id && "ring-1 ring-[#d4af37]/50",
                          "hover:brightness-125 hover:z-10"
                        )}
                        style={{
                          top: top + 1,
                          height,
                          left: `calc(${leftPct}% + 2px)`,
                          width: `calc(${widthPct}% - 4px)`,
                          background: b.gradient,
                          border: `1px solid ${b.borderColor}`,
                          boxShadow: selectedBookingId === b.id
                            ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 6px rgba(0,0,0,0.5), 0 0 12px rgba(212,175,55,0.15)"
                            : "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 4px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
                        }}
                      >
                        <div className="px-1 py-1 h-full flex flex-col justify-start overflow-hidden relative">
                          {/* Client name + VIP */}
                          <div className="flex items-center gap-1">
                            {b.isVip && <Diamond className="w-2 h-2 flex-shrink-0" style={{ color: b.accentColor }} />}
                            <span
                              className={cn(
                                "font-semibold truncate leading-tight",
                                b.totalCols > 1 ? "text-[8px]" : "text-[10px]"
                              )}
                              style={{ color: b.accentColor }}
                            >
                              {b.clientLabel}
                            </span>
                          </div>
                          {/* Service — hide in narrow overlapping blocks */}
                          {b.totalCols <= 1 && (
                            <div className="text-[8px] text-[#bbb] truncate leading-tight mt-px">{b.service}</div>
                          )}
                          {/* Time + Staff (only if block is tall AND wide enough) */}
                          {height > 50 && b.totalCols <= 1 && (
                            <div className="text-[7px] text-[#888] mt-px truncate leading-tight">
                              {formatTime(b.startTime)} — {formatTime(b.endTime)} · {b.staffLabel}
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

      {/* Right detail panel */}
      <div className="w-[300px] flex-shrink-0">
        <AppointmentDetailsPanel isOpen={!!selectedBookingId} onClose={() => onSelectBooking?.(null)} />
      </div>
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────── */
function formatTime(h: number): string {
  const hr = Math.floor(h);
  const min = Math.round((h - hr) * 60);
  const ampm = hr >= 12 ? "PM" : "AM";
  const display = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
  return `${display}:${String(min).padStart(2, "0")} ${ampm}`;
}