"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Calendar,
  Filter,
  LayoutGrid,
  List,
  Edit3,
  MessageSquare,
  MoreHorizontal,
  Clock,
  MapPin,
  Layers,
  User,
  FileText,
  Phone,
  Diamond,
  ArrowUpDown,
  CheckCircle2,
  UserCheck,
  Hourglass,
  CircleCheckBig,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "./PremiumButton";
import { StatusChip } from "./StatusChip";
import type { StatusType } from "./StatusChip";

/* ─── Data ─── */

interface AppointmentRow {
  id: string;
  time: string;
  endTime: string;
  duration: string;
  clientInitials: string;
  clientLabel: string;
  clientPhone: string;
  isVip: boolean;
  service: string;
  price: string;
  staffInitials: string;
  staffLabel: string;
  staffTitle: string;
  status: StatusType;
  location: string;
  date: string;
  created: string;
  notes: string;
  bookingId: string;
}

const allAppointments: AppointmentRow[] = [
  { id: "a1", time: "9:00 AM", endTime: "10:00 AM", duration: "60 min", clientInitials: "IA", clientLabel: "Investor A", clientPhone: "+1 (555) 000-01", isVip: true, service: "Strategy Session", price: "$150", staffInitials: "SB", staffLabel: "Staff B", staffTitle: "Senior Consultant", status: "confirmed", location: "Suite A — Room 1", date: "Thursday, May 15, 2024", created: "May 10, 2024 at 8:42 AM", notes: "Quarterly review. Prepare deck.", bookingId: "#0821" },
  { id: "a2", time: "10:00 AM", endTime: "11:00 AM", duration: "60 min", clientInitials: "C5", clientLabel: "Client 05", clientPhone: "+1 (555) 000-05", isVip: false, service: "Portfolio Review", price: "$120", staffInitials: "SB", staffLabel: "Staff B", staffTitle: "Senior Consultant", status: "arrived", location: "Suite B — Room 2", date: "Thursday, May 15, 2024", created: "May 11, 2024 at 2:15 PM", notes: "Bring updated portfolio docs.", bookingId: "#0822" },
  { id: "a3", time: "11:00 AM", endTime: "11:45 AM", duration: "45 min", clientInitials: "C7", clientLabel: "Client 07", clientPhone: "+1 (555) 000-07", isVip: true, service: "Team Workshop", price: "$200", staffInitials: "SC", staffLabel: "Staff C", staffTitle: "Lead Facilitator", status: "confirmed", location: "Suite A — Room 3", date: "Thursday, May 15, 2024", created: "May 9, 2024 at 10:30 AM", notes: "Prefers afternoon slots. Previous session notes on file.", bookingId: "#0823" },
  { id: "a4", time: "12:00 PM", endTime: "12:45 PM", duration: "45 min", clientInitials: "B2", clientLabel: "Client B", clientPhone: "+1 (555) 000-02", isVip: false, service: "Quick Sync", price: "$75", staffInitials: "SA", staffLabel: "Staff A", staffTitle: "Associate", status: "pending", location: "Suite C — Room 1", date: "Thursday, May 15, 2024", created: "May 12, 2024 at 5:00 PM", notes: "Follow-up from last session.", bookingId: "#0824" },
  { id: "a5", time: "1:00 PM", endTime: "2:00 PM", duration: "60 min", clientInitials: "C3", clientLabel: "Client 03", clientPhone: "+1 (555) 000-03", isVip: false, service: "Full Consultation", price: "$180", staffInitials: "SB", staffLabel: "Staff B", staffTitle: "Senior Consultant", status: "confirmed", location: "Suite A — Room 1", date: "Thursday, May 15, 2024", created: "May 8, 2024 at 9:12 AM", notes: "Initial consultation — needs onboarding package.", bookingId: "#0825" },
  { id: "a6", time: "2:00 PM", endTime: "3:00 PM", duration: "60 min", clientInitials: "IA", clientLabel: "Investor A", clientPhone: "+1 (555) 000-01", isVip: true, service: "Deep Dive Session", price: "$250", staffInitials: "SA", staffLabel: "Staff A", staffTitle: "Associate", status: "completed", location: "Suite B — Room 1", date: "Thursday, May 15, 2024", created: "May 7, 2024 at 11:00 AM", notes: "Deep financial review session.", bookingId: "#0826" },
  { id: "a7", time: "3:00 PM", endTime: "4:30 PM", duration: "90 min", clientInitials: "C9", clientLabel: "Client 09", clientPhone: "+1 (555) 000-09", isVip: false, service: "Extended Session", price: "$220", staffInitials: "SC", staffLabel: "Staff C", staffTitle: "Lead Facilitator", status: "confirmed", location: "Suite A — Room 2", date: "Thursday, May 15, 2024", created: "May 13, 2024 at 3:45 PM", notes: "Extended planning session. Block 90 min.", bookingId: "#0827" },
  { id: "a8", time: "3:00 PM", endTime: "3:45 PM", duration: "45 min", clientInitials: "C2", clientLabel: "Client 02", clientPhone: "+1 (555) 000-02", isVip: false, service: "Follow-up Call", price: "$85", staffInitials: "SB", staffLabel: "Staff B", staffTitle: "Senior Consultant", status: "pending", location: "Suite B — Room 3", date: "Thursday, May 15, 2024", created: "May 14, 2024 at 1:20 PM", notes: "Quick follow-up from last week.", bookingId: "#0828" },
  { id: "a9", time: "4:00 PM", endTime: "5:00 PM", duration: "60 min", clientInitials: "C1", clientLabel: "Client 01", clientPhone: "+1 (555) 000-01", isVip: false, service: "Onboarding Call", price: "$100", staffInitials: "SC", staffLabel: "Staff C", staffTitle: "Lead Facilitator", status: "completed", location: "Suite C — Room 2", date: "Thursday, May 15, 2024", created: "May 10, 2024 at 7:00 AM", notes: "New client onboarding — send welcome pack first.", bookingId: "#0829" },
  { id: "a10", time: "5:00 PM", endTime: "5:30 PM", duration: "30 min", clientInitials: "B2", clientLabel: "Client B", clientPhone: "+1 (555) 000-02", isVip: false, service: "Quick Sync", price: "$75", staffInitials: "SA", staffLabel: "Staff A", staffTitle: "Associate", status: "completed", location: "Suite A — Room 3", date: "Thursday, May 15, 2024", created: "May 11, 2024 at 4:10 PM", notes: "Status update sync.", bookingId: "#0830" },
  { id: "a11", time: "9:30 AM", endTime: "10:30 AM", duration: "60 min", clientInitials: "C4", clientLabel: "Client 04", clientPhone: "+1 (555) 000-04", isVip: true, service: "Strategy Session", price: "$150", staffInitials: "SA", staffLabel: "Staff A", staffTitle: "Associate", status: "confirmed", location: "Suite B — Room 1", date: "Friday, May 16, 2024", created: "May 12, 2024 at 9:00 AM", notes: "Strategy planning for Q3.", bookingId: "#0831" },
  { id: "a12", time: "11:00 AM", endTime: "12:00 PM", duration: "60 min", clientInitials: "C6", clientLabel: "Client 06", clientPhone: "+1 (555) 000-06", isVip: false, service: "Team Workshop", price: "$200", staffInitials: "SC", staffLabel: "Staff C", staffTitle: "Lead Facilitator", status: "pending", location: "Suite A — Room 1", date: "Friday, May 16, 2024", created: "May 13, 2024 at 6:30 PM", notes: "Team alignment workshop.", bookingId: "#0832" },
];

const PER_PAGE = 7;

/* ─── Sub-components ─── */

function FilterDropdown({ label, icon: Icon }: { label: string; icon: typeof Calendar }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="premium-btn flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] text-[#ccc] font-medium
          bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#d4af37]/10
          hover:border-[#d4af37]/25 hover:text-[#e0e0e0] transition-all cursor-pointer
          shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)]"
      >
        <Icon className="w-3.5 h-3.5 text-[#d4af37]/60" />
        <span>{label}</span>
        <ChevronDown className={cn("w-3 h-3 text-[#666] transition-transform", open && "rotate-180")} />
      </button>
    </div>
  );
}

function SummaryCard({ label, count, colorClass, icon: Icon }: { label: string; count: number; colorClass: string; icon: typeof CircleCheckBig }) {
  return (
    <div className={cn(
      "flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border",
      colorClass
    )}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <div>
        <div className="text-lg font-bold leading-tight">{count}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</div>
      </div>
    </div>
  );
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / PER_PAGE);
  return (
    <div className="flex items-center justify-between px-1 pt-3">
      <span className="text-[12px] text-[#666]">
        Showing {current * PER_PAGE - PER_PAGE + 1} to {Math.min(current * PER_PAGE, total)} of {total} appointments
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-[#d4af37] hover:bg-[#1e1e1e] disabled:opacity-30 disabled:cursor-default transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "w-8 h-8 rounded-lg text-[12px] font-semibold transition-all cursor-pointer",
              p === current
                ? "bg-gradient-to-b from-[#d4af37] via-[#c9a227] to-[#b8960b] text-[#0a0a0a] shadow-[0_1px_4px_rgba(212,175,55,0.3)]"
                : "text-[#666] hover:text-[#d4af37] hover:bg-[#1e1e1e]"
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(Math.min(pages, current + 1))}
          disabled={current === pages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-[#d4af37] hover:bg-[#1e1e1e] disabled:opacity-30 disabled:cursor-default transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Detail Panel ─── */

function DetailRow({ icon: Icon, label, value, sub }: { icon: typeof Clock; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-md bg-[#0e0e0e] border border-[#d4af37]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[#d4af37]" strokeWidth={1.8} />
      </div>
      <div>
        <div className="text-[10px] font-medium text-[#555] uppercase tracking-wider">{label}</div>
        <div className="text-[13px] text-[#e0e0e0] font-medium mt-0.5">{value}</div>
        {sub && <div className="text-[10px] text-[#666]">{sub}</div>}
      </div>
    </div>
  );
}

function AppointmentDetailPanel({ appointment, onClose }: { appointment: AppointmentRow; onClose: () => void }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-[320px] flex-shrink-0 h-full"
    >
      <div className="premium-panel rounded-xl h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4af37]/8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
            <span className="text-xs font-semibold text-[#999] uppercase tracking-widest">Appointment Details</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Client info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center">
                <span className="text-lg font-bold text-[#d4af37]">{appointment.clientInitials}</span>
              </div>
              {appointment.isVip && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-b from-[#d4af37] to-[#b8960b] rounded-md px-1 py-0.5">
                  <Diamond className="w-2.5 h-2.5 text-[#0a0a0a]" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e0e0e0]">{appointment.clientLabel}</div>
              {appointment.isVip && (
                <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">VIP Member</span>
              )}
              <div className="text-[11px] text-[#666] mt-0.5">Booking {appointment.bookingId}</div>
            </div>
          </div>

          {/* Status + Booking ID */}
          <div className="flex items-center gap-3">
            <StatusChip status={appointment.status} />
            <span className="text-[11px] text-[#666] tabular-nums">{appointment.bookingId}</span>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#161616] border border-[#d4af37]/8 text-[#888] hover:text-[#d4af37] hover:border-[#d4af37]/20 transition-all cursor-pointer">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#161616] border border-[#d4af37]/8 text-[#888] hover:text-[#d4af37] hover:border-[#d4af37]/20 transition-all cursor-pointer">
              <Calendar className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#161616] border border-[#d4af37]/8 text-[#888] hover:text-[#d4af37] hover:border-[#d4af37]/20 transition-all cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#161616] border border-[#d4af37]/8 text-[#888] hover:text-[#d4af37] hover:border-[#d4af37]/20 transition-all cursor-pointer">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Detail rows */}
          <div className="space-y-3.5">
            <DetailRow icon={FileText} label="Date" value={appointment.date} />
            <DetailRow icon={Clock} label="Time" value={`${appointment.time} — ${appointment.endTime}`} sub={appointment.duration} />
            <DetailRow icon={Layers} label="Service" value={appointment.service} sub={appointment.price} />
            <DetailRow icon={User} label="Staff" value={`${appointment.staffLabel} — ${appointment.staffTitle}`} />
            <DetailRow icon={MapPin} label="Location" value={appointment.location} />
            <DetailRow icon={Phone} label="Contact" value={appointment.clientPhone} />
          </div>

          {/* Notes */}
          <div className="pt-3 border-t border-[#d4af37]/8">
            <div className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-2">Notes</div>
            <p className="text-xs text-[#888] leading-relaxed">{appointment.notes}</p>
          </div>

          {/* Created */}
          <div className="text-[10px] text-[#444]">
            Created: {appointment.created}
          </div>

          {/* Gold divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent" />
            <div className="w-1 h-1 rotate-45 bg-[#d4af37]/25" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent" />
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-[#d4af37]/8 space-y-2">
          <PremiumButton variant="primary" className="w-full">
            <UserCheck className="w-4 h-4" />
            Check In Client
          </PremiumButton>
          <PremiumButton variant="secondary" className="w-full !text-red-400 !border-red-500/15 hover:!bg-red-500/5">
            Cancel Appointment
          </PremiumButton>
        </div>
      </div>
    </motion.aside>
  );
}

/* ─── Main Page ─── */

export function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>("a3");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filtered = allAppointments; // could be filtered by dropdowns
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selected = allAppointments.find((a) => a.id === selectedId);

  const counts = {
    total: filtered.length,
    confirmed: filtered.filter((a) => a.status === "confirmed").length,
    arrived: filtered.filter((a) => a.status === "arrived").length,
    pending: filtered.filter((a) => a.status === "pending").length,
    completed: filtered.filter((a) => a.status === "completed").length,
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in-up">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-[#e0e0e0] tracking-tight">Appointments</h1>
        <p className="text-[13px] text-[#666] mt-1">View and manage all appointments.</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown label="May 12 – May 18, 2024" icon={Calendar} />
        <FilterDropdown label="All Staff" icon={User} />
        <FilterDropdown label="All Services" icon={Layers} />
        <FilterDropdown label="All Status" icon={CircleCheckBig} />
        <PremiumButton variant="secondary" size="sm">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </PremiumButton>

        <div className="ml-auto flex items-center gap-1 bg-[#0e0e0e] rounded-lg p-0.5 border border-[#d4af37]/8">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 rounded-md transition-all cursor-pointer",
              viewMode === "grid" ? "bg-gradient-to-b from-[#d4af37] via-[#c9a227] to-[#b8960b] text-[#0a0a0a]" : "text-[#555] hover:text-[#999]"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-1.5 rounded-md transition-all cursor-pointer",
              viewMode === "list" ? "bg-gradient-to-b from-[#d4af37] via-[#c9a227] to-[#b8960b] text-[#0a0a0a]" : "text-[#555] hover:text-[#999]"
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="flex flex-wrap gap-3">
        <SummaryCard label="Total" count={counts.total} colorClass="bg-[#1a1a1a] border-[#d4af37]/10 text-[#e0e0e0]" icon={CircleCheckBig} />
        <SummaryCard label="Confirmed" count={counts.confirmed} colorClass="bg-emerald-500/8 border-emerald-500/15 text-emerald-400" icon={CheckCircle2} />
        <SummaryCard label="Arrived" count={counts.arrived} colorClass="bg-teal-500/8 border-teal-500/15 text-teal-400" icon={UserCheck} />
        <SummaryCard label="Pending" count={counts.pending} colorClass="bg-amber-500/8 border-amber-500/15 text-amber-400" icon={Hourglass} />
        <SummaryCard label="Completed" count={counts.completed} colorClass="bg-white/4 border-white/8 text-[#999]" icon={CircleCheckBig} />
      </div>

      {/* Main content: table + detail panel */}
      <div className="flex gap-5 min-h-[460px]">
        <div className={cn("flex-1 min-w-0", selectedId && "max-w-[calc(100%-340px)]")}>
          <div className="premium-panel rounded-xl overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#d4af37]/8">
                    {[
                      { key: "time", label: "TIME", sortable: true },
                      { key: "client", label: "CLIENT", sortable: true },
                      { key: "service", label: "SERVICE" },
                      { key: "staff", label: "STAFF" },
                      { key: "status", label: "STATUS" },
                      { key: "action", label: "" },
                    ].map((col) => (
                      <th key={col.key} className="px-4 py-3 text-left">
                        {col.sortable ? (
                          <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#555] uppercase tracking-widest hover:text-[#d4af37] transition-colors cursor-pointer">
                            {col.label}
                            <ArrowUpDown className="w-3 h-3 text-[#333]" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest">{col.label}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                      onClick={() => setSelectedId(row.id === selectedId ? null : row.id)}
                      className={cn(
                        "border-b border-[#d4af37]/5 last:border-b-0 transition-all cursor-pointer group/row",
                        selectedId === row.id
                          ? "bg-[#d4af37]/5 border-l-2 border-l-[#d4af37]"
                          : "hover:bg-[#161616]/50 border-l-2 border-l-transparent"
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <div className="text-[13px] text-[#e0e0e0] font-medium tabular-nums">{row.time}</div>
                        <div className="text-[10px] text-[#555] tabular-nums">{row.endTime} · {row.duration}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#d4af37]/8 border border-[#d4af37]/12 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-[#d4af37]">{row.clientInitials}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] text-[#ccc] font-medium">{row.clientLabel}</span>
                              {row.isVip && (
                                <span className="text-[8px] font-bold text-[#d4af37] uppercase tracking-wider bg-[#d4af37]/10 px-1.5 py-0.5 rounded">VIP</span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#555]">{row.clientPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-[13px] text-[#ccc]">{row.service}</div>
                        <div className="text-[11px] text-[#d4af37]/60 font-medium">{row.price}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#1e1e1e] border border-[#d4af37]/8 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-[#888]">{row.staffInitials}</span>
                          </div>
                          <div>
                            <div className="text-[13px] text-[#999]">{row.staffLabel}</div>
                            <div className="text-[10px] text-[#555]">{row.staffTitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusChip status={row.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:bg-[#1e1e1e] transition-all opacity-0 group-hover/row:opacity-100">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 pb-4">
              <Pagination current={page} total={filtered.length} onChange={setPage} />
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedId && selected && (
            <AppointmentDetailPanel
              appointment={selected}
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}