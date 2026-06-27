"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "./PremiumButton";
import { StatusChip } from "./StatusChip";

// StatusType is declared locally in StatusChip but not exported; mirror it here
type StatusType = "confirmed" | "pending" | "rescheduled" | "cancelled" | "completed" | "arrived";
import {
  useBookingStore,
  formatTime12,
  formatCurrency,
  getDurationMinutes,
} from "@/lib/store";
import type { AppointmentStatus } from "@/lib/types";

/* ─── Constants ─── */

const PER_PAGE = 7;

// 30-minute time slots from 08:00 to 18:00
const TIME_SLOTS: string[] = Array.from({ length: 21 }, (_, i) => {
  const total = 8 * 60 + i * 30;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
});

/* ─── Helpers ─── */

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
}

function formatDateLong(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
}

function toStatusChip(status: AppointmentStatus): StatusType {
  if (status === "no-show") return "cancelled";
  return status as StatusType;
}

/* ─── FilterDropdown (functional) ─── */

function FilterDropdown({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: typeof Calendar;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="premium-btn flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] text-[#ccc] font-medium
          bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#d4af37]/10
          hover:border-[#d4af37]/25 hover:text-[#e0e0e0] transition-all cursor-pointer
          shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)]"
      >
        <Icon className="w-3.5 h-3.5 text-[#d4af37]/60" />
        <span>{selectedLabel}</span>
        <ChevronDown
          className={cn(
            "w-3 h-3 text-[#666] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1.5 w-52 z-50 premium-panel rounded-lg border border-[#d4af37]/15 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          >
            <div className="py-1 max-h-64 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2 text-[13px] transition-colors cursor-pointer",
                    opt.value === value
                      ? "text-[#d4af37] bg-[#d4af37]/8"
                      : "text-[#999] hover:text-[#e0e0e0] hover:bg-[#161616]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SummaryCard ─── */

function SummaryCard({
  label,
  count,
  colorClass,
  icon: Icon,
}: {
  label: string;
  count: number;
  colorClass: string;
  icon: typeof CircleCheckBig;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border", colorClass)}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <div>
        <div className="text-lg font-bold leading-tight">{count}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
          {label}
        </div>
      </div>
    </div>
  );
}

/* ─── Pagination ─── */

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  return (
    <div className="flex items-center justify-between px-1 pt-3">
      <span className="text-[12px] text-[#666]">
        Showing{" "}
        {total === 0
          ? 0
          : current * PER_PAGE - PER_PAGE + 1}
        {" "}to{" "}
        {Math.min(current * PER_PAGE, total)} of {total} appointments
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

function DetailRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-md bg-[#0e0e0e] border border-[#d4af37]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[#d4af37]" strokeWidth={1.8} />
      </div>
      <div>
        <div className="text-[10px] font-medium text-[#555] uppercase tracking-wider">
          {label}
        </div>
        <div className="text-[13px] text-[#e0e0e0] font-medium mt-0.5">{value}</div>
        {sub && <div className="text-[10px] text-[#666]">{sub}</div>}
      </div>
    </div>
  );
}

function AppointmentDetailPanel({
  appointmentId,
  onClose,
}: {
  appointmentId: string;
  onClose: () => void;
}) {
  const appointment = useBookingStore(
    (s) => s.appointments.find((a) => a.id === appointmentId)
  );
  const getClient = useBookingStore((s) => s.getClient);
  const getService = useBookingStore((s) => s.getService);
  const getStaff = useBookingStore((s) => s.getStaff);
  const getResource = useBookingStore((s) => s.getResource);
  const updateAppointmentStatus = useBookingStore(
    (s) => s.updateAppointmentStatus
  );

  if (!appointment) return null;

  const client = getClient(appointment.clientId);
  const service = getService(appointment.serviceId);
  const staffMember = getStaff(appointment.staffId);
  const resource = getResource(appointment.resourceId);

  const duration = getDurationMinutes(appointment.startTime, appointment.endTime);
  const isVip = client?.tier === "VIP";

  const handleCheckIn = () => {
    updateAppointmentStatus(appointment.id, "arrived");
  };

  const handleCancel = () => {
    updateAppointmentStatus(appointment.id, "cancelled");
  };

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
            <span className="text-xs font-semibold text-[#999] uppercase tracking-widest">
              Appointment Details
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Client info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center">
                <span className="text-lg font-bold text-[#d4af37]">
                  {client?.initials ?? "??"}
                </span>
              </div>
              {isVip && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-b from-[#d4af37] to-[#b8960b] rounded-md px-1 py-0.5">
                  <Diamond className="w-2.5 h-2.5 text-[#0a0a0a]" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e0e0e0]">
                {client?.name ?? "Unknown Client"}
              </div>
              {isVip && (
                <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                  VIP Member
                </span>
              )}
              <div className="text-[11px] text-[#666] mt-0.5">
                Booking {appointment.bookingId}
              </div>
            </div>
          </div>

          {/* Status + Booking ID */}
          <div className="flex items-center gap-3">
            <StatusChip status={toStatusChip(appointment.status)} />
            <span className="text-[11px] text-[#666] tabular-nums">
              {appointment.bookingId}
            </span>
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
            <DetailRow
              icon={FileText}
              label="Date"
              value={formatDateLong(appointment.date)}
            />
            <DetailRow
              icon={Clock}
              label="Time"
              value={`${formatTime12(appointment.startTime)} — ${formatTime12(appointment.endTime)}`}
              sub={`${duration} min`}
            />
            <DetailRow
              icon={Layers}
              label="Service"
              value={service?.name ?? "Unknown Service"}
              sub={service ? formatCurrency(service.price) : undefined}
            />
            <DetailRow
              icon={User}
              label="Staff"
              value={
                staffMember
                  ? `${staffMember.name} — ${staffMember.role}`
                  : "Unknown Staff"
              }
            />
            <DetailRow
              icon={MapPin}
              label="Location"
              value={resource?.location ?? "No location"}
              sub={resource?.name}
            />
            <DetailRow
              icon={Phone}
              label="Contact"
              value={client?.phone ?? "No phone"}
            />
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="pt-3 border-t border-[#d4af37]/8">
              <div className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-2">
                Notes
              </div>
              <p className="text-xs text-[#888] leading-relaxed">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* Created */}
          <div className="text-[10px] text-[#444]">
            Created: {formatDateTime(appointment.createdDate)}
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
          <PremiumButton
            variant="primary"
            className="w-full"
            onClick={handleCheckIn}
            disabled={
              appointment.status === "arrived" ||
              appointment.status === "completed" ||
              appointment.status === "cancelled"
            }
          >
            <UserCheck className="w-4 h-4" />
            Check In Client
          </PremiumButton>
          <PremiumButton
            variant="secondary"
            className="w-full !text-red-400 !border-red-500/15 hover:!bg-red-500/5"
            onClick={handleCancel}
            disabled={
              appointment.status === "cancelled" ||
              appointment.status === "completed"
            }
          >
            Cancel Appointment
          </PremiumButton>
        </div>
      </div>
    </motion.aside>
  );
}

/* ─── New Booking Modal ─── */

function NewBookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const clients = useBookingStore((s) => s.clients);
  const services = useBookingStore((s) => s.services);
  const staff = useBookingStore((s) => s.staff);
  const resources = useBookingStore((s) => s.resources);
  const addAppointment = useBookingStore((s) => s.addAppointment);

  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setClientId("");
      setServiceId("");
      setStaffId("");
      setResourceId("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setNotes("");
    }
  }, [open]);

  // Auto-calculate endTime when startTime or service changes
  useEffect(() => {
    if (startTime && serviceId) {
      const svc = services.find((s) => s.id === serviceId);
      if (svc) {
        setEndTime(addMinutesToTime(startTime, svc.duration));
      }
    }
  }, [startTime, serviceId, services]);

  // Filtered staff based on selected service
  const availableStaff = serviceId
    ? staff.filter((s) => {
        const svc = services.find((sv) => sv.id === serviceId);
        return svc ? svc.staffIds.includes(s.id) : true;
      })
    : staff;

  // Reset staff when service changes
  useEffect(() => {
    setStaffId("");
  }, [serviceId]);

  const canCreate =
    clientId &&
    serviceId &&
    staffId &&
    resourceId &&
    date &&
    startTime &&
    endTime;

  const handleCreate = () => {
    if (!canCreate) return;
    addAppointment({
      clientId,
      serviceId,
      staffId,
      resourceId,
      date,
      startTime,
      endTime,
      status: "pending",
      notes,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-lg premium-panel rounded-xl border border-[#d4af37]/15 shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4af37]/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#e0e0e0]">
                    New Booking
                  </h2>
                  <p className="text-[11px] text-[#666]">
                    Schedule a new appointment
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Client */}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                  Client
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                    focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                    [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                >
                  <option value="">Select a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.tier === "VIP" ? " (VIP)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service */}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                  Service
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                    focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                    [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                >
                  <option value="">Select a service…</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {formatCurrency(s.price)} · {s.duration} min
                    </option>
                  ))}
                </select>
              </div>

              {/* Staff */}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                  Staff
                </label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                    focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                    [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                >
                  <option value="">
                    Select staff{serviceId ? " (filtered by service)" : "…"}
                  </option>
                  {availableStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource */}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                  Resource
                </label>
                <select
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                    focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                    [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                >
                  <option value="">Select a resource…</option>
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code}) — {r.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time row */}
              <div className="grid grid-cols-3 gap-3">
                {/* Date */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                      focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                      [color-scheme:dark]"
                  />
                </div>

                {/* Start Time */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                    Start
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                      focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                      [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                  >
                    <option value="">Time…</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime12(t)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* End Time */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                    End
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                      focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                      [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                  >
                    <option value="">Time…</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime12(t)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional notes for this booking…"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                    placeholder:text-[#444] focus:outline-none focus:border-[#d4af37]/40 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#d4af37]/8 flex items-center justify-end gap-3">
              <PremiumButton variant="secondary" onClick={onClose}>
                Cancel
              </PremiumButton>
              <PremiumButton
                variant="primary"
                onClick={handleCreate}
                disabled={!canCreate}
              >
                <Plus className="w-4 h-4" />
                Create Booking
              </PremiumButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Page ─── */

export function AppointmentsPage() {
  // Store data
  const appointments = useBookingStore((s) => s.appointments);
  const clients = useBookingStore((s) => s.clients);
  const services = useBookingStore((s) => s.services);
  const staff = useBookingStore((s) => s.staff);
  const getClient = useBookingStore((s) => s.getClient);
  const getService = useBookingStore((s) => s.getService);
  const getStaff = useBookingStore((s) => s.getStaff);

  // UI State
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>("ap-3");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterStaff, setFilterStaff] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewBooking, setShowNewBooking] = useState(false);

  // Sort by date + startTime
  const sorted = [...appointments].sort((a, b) => {
    const dc = a.date.localeCompare(b.date);
    if (dc !== 0) return dc;
    return a.startTime.localeCompare(b.startTime);
  });

  // Apply filters
  const filtered = sorted.filter((a) => {
    if (filterStaff !== "all" && a.staffId !== filterStaff) return false;
    if (filterService !== "all" && a.serviceId !== filterService) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterStaff, filterService, filterStatus]);

  // Summary counts from filtered data
  const counts = {
    total: filtered.length,
    confirmed: filtered.filter((a) => a.status === "confirmed").length,
    arrived: filtered.filter((a) => a.status === "arrived").length,
    pending: filtered.filter((a) => a.status === "pending").length,
    completed: filtered.filter((a) => a.status === "completed").length,
  };

  // Date range for display
  const dates = appointments
    .map((a) => a.date)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort();
  const dateRangeText =
    dates.length > 0
      ? `${formatDateShort(dates[0]!)} – ${formatDateShort(dates[dates.length - 1]!)}`
      : "No appointments";

  // Filter options
  const staffOptions = [
    { value: "all", label: "All Staff" },
    ...staff.map((s) => ({ value: s.id, label: s.name })),
  ];

  const serviceOptions = [
    { value: "all", label: "All Services" },
    ...services.map((s) => ({ value: s.id, label: s.name })),
  ];

  const statusOptions: { value: string; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "confirmed", label: "Confirmed" },
    { value: "arrived", label: "Arrived" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "no-show", label: "No Show" },
  ];

  return (
    <div className="p-6 space-y-5 animate-fade-in-up">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-[#e0e0e0] tracking-tight">
          Appointments
        </h1>
        <p className="text-[13px] text-[#666] mt-1">
          View and manage all appointments.
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date display (non-interactive) */}
        <div
          className="premium-btn flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] text-[#666] font-medium
          bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#d4af37]/6
          shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)]"
        >
          <Calendar className="w-3.5 h-3.5 text-[#d4af37]/40" />
          <span>{dateRangeText}</span>
        </div>

        {/* Staff filter */}
        <FilterDropdown
          label="All Staff"
          icon={User}
          options={staffOptions}
          value={filterStaff}
          onChange={setFilterStaff}
        />

        {/* Service filter */}
        <FilterDropdown
          label="All Services"
          icon={Layers}
          options={serviceOptions}
          value={filterService}
          onChange={setFilterService}
        />

        {/* Status filter */}
        <FilterDropdown
          label="All Status"
          icon={CircleCheckBig}
          options={statusOptions}
          value={filterStatus}
          onChange={setFilterStatus}
        />

        <PremiumButton variant="secondary" size="sm">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </PremiumButton>

        {/* New Booking button */}
        <PremiumButton
          variant="primary"
          size="sm"
          onClick={() => setShowNewBooking(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          New Booking
        </PremiumButton>

        <div className="ml-auto flex items-center gap-1 bg-[#0e0e0e] rounded-lg p-0.5 border border-[#d4af37]/8">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 rounded-md transition-all cursor-pointer",
              viewMode === "grid"
                ? "bg-gradient-to-b from-[#d4af37] via-[#c9a227] to-[#b8960b] text-[#0a0a0a]"
                : "text-[#555] hover:text-[#999]"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-1.5 rounded-md transition-all cursor-pointer",
              viewMode === "list"
                ? "bg-gradient-to-b from-[#d4af37] via-[#c9a227] to-[#b8960b] text-[#0a0a0a]"
                : "text-[#555] hover:text-[#999]"
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="flex flex-wrap gap-3">
        <SummaryCard
          label="Total"
          count={counts.total}
          colorClass="bg-[#1a1a1a] border-[#d4af37]/10 text-[#e0e0e0]"
          icon={CircleCheckBig}
        />
        <SummaryCard
          label="Confirmed"
          count={counts.confirmed}
          colorClass="bg-emerald-500/8 border-emerald-500/15 text-emerald-400"
          icon={CheckCircle2}
        />
        <SummaryCard
          label="Arrived"
          count={counts.arrived}
          colorClass="bg-teal-500/8 border-teal-500/15 text-teal-400"
          icon={UserCheck}
        />
        <SummaryCard
          label="Pending"
          count={counts.pending}
          colorClass="bg-amber-500/8 border-amber-500/15 text-amber-400"
          icon={Hourglass}
        />
        <SummaryCard
          label="Completed"
          count={counts.completed}
          colorClass="bg-white/4 border-white/8 text-[#999]"
          icon={CircleCheckBig}
        />
      </div>

      {/* Main content: table + detail panel */}
      <div className="flex gap-5 min-h-[460px]">
        <div
          className={cn(
            "flex-1 min-w-0",
            selectedId && "max-w-[calc(100%-340px)]"
          )}
        >
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
                          <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest">
                            {col.label}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row, i) => {
                    const client = getClient(row.clientId);
                    const service = getService(row.serviceId);
                    const staffMember = getStaff(row.staffId);
                    const duration = getDurationMinutes(
                      row.startTime,
                      row.endTime
                    );

                    return (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        onClick={() =>
                          setSelectedId(
                            row.id === selectedId ? null : row.id
                          )
                        }
                        className={cn(
                          "border-b border-[#d4af37]/5 last:border-b-0 transition-all cursor-pointer group/row",
                          selectedId === row.id
                            ? "bg-[#d4af37]/5 border-l-2 border-l-[#d4af37]"
                            : "hover:bg-[#161616]/50 border-l-2 border-l-transparent"
                        )}
                      >
                        <td className="px-4 py-3.5">
                          <div className="text-[13px] text-[#e0e0e0] font-medium tabular-nums">
                            {formatTime12(row.startTime)}
                          </div>
                          <div className="text-[10px] text-[#555] tabular-nums">
                            {formatTime12(row.endTime)} · {duration} min
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/8 border border-[#d4af37]/12 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-[#d4af37]">
                                {client?.initials ?? "??"}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] text-[#ccc] font-medium">
                                  {client?.name ?? "Unknown"}
                                </span>
                                {client?.tier === "VIP" && (
                                  <span className="text-[8px] font-bold text-[#d4af37] uppercase tracking-wider bg-[#d4af37]/10 px-1.5 py-0.5 rounded">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#555]">
                                {client?.phone ?? ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-[13px] text-[#ccc]">
                            {service?.name ?? "—"}
                          </div>
                          <div className="text-[11px] text-[#d4af37]/60 font-medium">
                            {service ? formatCurrency(service.price) : ""}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-[#1e1e1e] border border-[#d4af37]/8 flex items-center justify-center">
                              <span className="text-[8px] font-bold text-[#888]">
                                {staffMember?.initials ?? "??"}
                              </span>
                            </div>
                            <div>
                              <div className="text-[13px] text-[#999]">
                                {staffMember?.name ?? "—"}
                              </div>
                              <div className="text-[10px] text-[#555]">
                                {staffMember?.role ?? ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusChip status={toStatusChip(row.status)} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:bg-[#1e1e1e] transition-all opacity-0 group-hover/row:opacity-100">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 pb-4">
              <Pagination
                current={safePage}
                total={filtered.length}
                onChange={setPage}
              />
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedId && (
            <AppointmentDetailPanel
              appointmentId={selectedId}
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* New Booking Modal */}
      <NewBookingModal
        open={showNewBooking}
        onClose={() => setShowNewBooking(false)}
      />
    </div>
  );
}