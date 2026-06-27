"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Activity, CheckCircle2, Wrench, Search, Filter,
  LayoutGrid, List, X, ChevronDown, ChevronLeft, ChevronRight,
  MapPin, Users, Clock, Edit3, MoreHorizontal, ArrowUpDown,
  StickyNote, BookmarkPlus, CalendarPlus, User, Phone,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { PremiumButton } from "./PremiumButton";
import { SectionPanel } from "./SectionPanel";
import { cn } from "@/lib/utils";
import { useBookingStore, formatTime12 } from "@/lib/store";
import type { Resource, ResourceStatus, Appointment } from "@/lib/types";

const PER_PAGE = 7;
const SLOTS = ["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM"];

const TYPE_COLORS: Record<string, string> = {
  "Meeting Room": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "Studio": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Conference Room": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "Equipment": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "Lounge": "bg-green-500/15 text-green-400 border-green-500/20",
  "Vehicle": "bg-red-500/15 text-red-400 border-red-500/20",
};

const STATUS_MAP: Record<string, { dot: string; label: string; badge: string }> = {
  "Available": { dot: "bg-emerald-400", label: "Available", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  "In Use": { dot: "bg-blue-400", label: "In Use", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  "Maintenance": { dot: "bg-red-400", label: "Maintenance", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const RES_ICONS: Record<string, typeof Calendar> = {
  "Meeting Room": Calendar, "Studio": Edit3, "Conference Room": Users,
  "Equipment": Activity, "Lounge": BookmarkPlus, "Vehicle": MapPin,
};

function FilterDropdown({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="premium-btn flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] text-[#ccc] font-medium bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#d4af37]/10 hover:border-[#d4af37]/25 transition-all cursor-pointer">
        <span>{value || label}</span>
        <ChevronDown className={cn("w-3 h-3 text-[#666] transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 min-w-[160px] bg-[#1a1a1a] border border-[#d4af37]/15 rounded-lg shadow-xl py-1">
          {options.map((o) => (
            <button key={o} onClick={() => { onChange(o === label ? "" : o); setOpen(false); }}
              className={cn("w-full text-left px-3 py-2 text-[13px] hover:bg-[#d4af37]/5 transition-colors cursor-pointer",
                value === o ? "text-[#d4af37]" : "text-[#ccc]")}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / PER_PAGE);
  return (
    <div className="flex items-center justify-between px-1 pt-3">
      <span className="text-[12px] text-[#666]">
        Showing {current * PER_PAGE - PER_PAGE + 1} to {Math.min(current * PER_PAGE, total)} of {total} resources
      </span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-[#d4af37] hover:bg-[#1e1e1e] disabled:opacity-30 transition-all cursor-pointer">
          <ChevronLeft className="w-4 h-4" /></button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onChange(p)}
            className={cn("w-8 h-8 rounded-lg text-[12px] font-semibold transition-all cursor-pointer",
              p === current ? "bg-gradient-to-b from-[#d4af37] via-[#c9a227] to-[#b8960b] text-[#0a0a0a]" : "text-[#666] hover:text-[#d4af37] hover:bg-[#1e1e1e]")}>{p}</button>
        ))}
        <button onClick={() => onChange(Math.min(pages, current + 1))} disabled={current === pages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-[#d4af37] hover:bg-[#1e1e1e] disabled:opacity-30 transition-all cursor-pointer">
          <ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

/* ── Reserve Modal ── */
function ReserveModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const { clients, services, staff, addAppointment } = useBookingStore();
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const selectedService = services.find(s => s.id === serviceId);
  const endTime = useMemo(() => {
    if (!startTime || !selectedService) return "";
    const [h, m] = startTime.split(":").map(Number);
    const total = (h * 60 + m) + selectedService.duration;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }, [startTime, selectedService]);

  const handleCreate = () => {
    if (!clientId || !serviceId || !date || !startTime || !endTime) return;
    const svc = services.find(s => s.id === serviceId)!;
    const validStaff = staff.filter(s => svc.staffIds.includes(s.id));
    addAppointment({
      clientId, serviceId, staffId: validStaff[0]?.id || staff[0].id,
      resourceId: resource.id, date, startTime, endTime,
      status: "pending", notes: `Reserved for ${resource.name}`,
    });
    onClose();
  };

  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const h = 8 + Math.floor(i * 0.5);
    const m = i % 2 === 0 ? "00" : "30";
    return `${String(h).padStart(2, "0")}:${m}`;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="premium-panel rounded-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#e0e0e0]">Reserve {resource.name}</h3>
          <button onClick={onClose} className="text-[#555] hover:text-[#e0e0e0] transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-medium text-[#555] uppercase tracking-wider">Client</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)}
              className="w-full mt-1 premium-input rounded-lg px-3 py-2 text-[13px] text-[#ccc] bg-[#0e0e0e] border border-[#d4af37]/10">
              <option value="">Select client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}{c.tier === "VIP" ? " (VIP)" : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#555] uppercase tracking-wider">Service</label>
            <select value={serviceId} onChange={e => setServiceId(e.target.value)}
              className="w-full mt-1 premium-input rounded-lg px-3 py-2 text-[13px] text-[#ccc] bg-[#0e0e0e] border border-[#d4af37]/10">
              <option value="">Select service...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} — ${s.price} ({s.duration} min)</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#555] uppercase tracking-wider">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full mt-1 premium-input rounded-lg px-3 py-2 text-[13px] text-[#ccc] bg-[#0e0e0e] border border-[#d4af37]/10" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#555] uppercase tracking-wider">Start Time</label>
              <select value={startTime} onChange={e => setStartTime(e.target.value)}
                className="w-full mt-1 premium-input rounded-lg px-3 py-2 text-[13px] text-[#ccc] bg-[#0e0e0e] border border-[#d4af37]/10">
                <option value="">Select...</option>
                {timeSlots.map(t => (
                  <option key={t} value={t}>{formatTime12(t)}</option>
                ))}
              </select>
            </div>
          </div>
          {endTime && <p className="text-[11px] text-[#888]">End time: {formatTime12(endTime)}</p>}
        </div>
        <PremiumButton variant="primary" className="w-full" onClick={handleCreate}>
          <CalendarPlus className="w-4 h-4" /> Create Reservation
        </PremiumButton>
      </motion.div>
    </div>
  );
}

/* ── Detail Panel ── */
function ResourceDetailPanel({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const { appointments, clients, services, staff, updateResourceStatus } = useBookingStore();
  const [showReserve, setShowReserve] = useState(false);
  const st = STATUS_MAP[resource.status] || STATUS_MAP["Available"];
  const Icon = RES_ICONS[resource.type] || Calendar;

  const upcomingBookings = useMemo(() =>
    appointments
      .filter(a => a.resourceId === resource.id && (a.status === "confirmed" || a.status === "pending"))
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
      .slice(0, 3)
      .map(a => {
        const client = clients.find(c => c.id === a.clientId);
        const service = services.find(s => s.id === a.serviceId);
        const staffMember = staff.find(s => s.id === a.staffId);
        return {
          id: a.id, date: a.date, startTime: a.startTime, endTime: a.endTime,
          title: service?.name || "Unknown", clientName: client?.name || "Unknown",
          staffName: staffMember?.name || "Unknown", status: a.status,
        };
      }),
    [appointments, resource.id, clients, services, staff]
  );

  const timeSlots = useMemo(() => {
    const todayAppts = appointments.filter(a => a.resourceId === resource.id && a.date === "2024-05-15");
    return SLOTS.map(slot => {
      const hour = slot.includes("PM") ? (parseInt(slot) + 12) : parseInt(slot);
      const booked = todayAppts.some(a => {
        const startH = parseInt(a.startTime.split(":")[0]);
        const endH = parseInt(a.endTime.split(":")[0]);
        return hour >= startH && hour < endH;
      });
      return { time: slot, available: !booked };
    });
  }, [appointments, resource.id]);

  const manager = staff.find(s => s.name === resource.manager);

  return (
    <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.3 }} className="w-[340px] flex-shrink-0 h-full">
      <div className="premium-panel rounded-xl h-full flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4af37]/8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
            <span className="text-xs font-semibold text-[#999] uppercase tracking-widest">Resource Details</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all cursor-pointer">
            <X className="w-3.5 h-3.5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#d4af37]" /></div>
            <div>
              <div className="text-sm font-semibold text-[#e0e0e0]">{resource.name}</div>
              <div className="text-[11px] text-[#666]">{resource.code} • {resource.type}</div>
            </div>
          </div>

          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border", st.badge)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />{st.label}</span>

          <div className="flex items-center gap-2">
            <PremiumButton variant="primary" size="sm" onClick={() => setShowReserve(true)}>
              <BookmarkPlus className="w-3.5 h-3.5" /> Reserve</PremiumButton>
            {resource.status === "Available" && (
              <button onClick={() => updateResourceStatus(resource.id, "Maintenance")}
                className="premium-btn px-3 py-1.5 rounded-lg text-[12px] text-[#ccc] bg-[#161616] border border-[#d4af37]/10 hover:border-[#d4af37]/25 transition-all cursor-pointer flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#d4af37]/60" /> Mark Maintenance</button>
            )}
            {resource.status === "Maintenance" && (
              <button onClick={() => updateResourceStatus(resource.id, "Available")}
                className="premium-btn px-3 py-1.5 rounded-lg text-[12px] text-[#ccc] bg-[#161616] border border-[#d4af37]/10 hover:border-[#d4af37]/25 transition-all cursor-pointer flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mark Available</button>
            )}
          </div>

          {/* Availability Today */}
          <div>
            <div className="text-[10px] font-semibold text-[#555] uppercase tracking-widest mb-3">Availability Today</div>
            <div className="flex gap-1 flex-wrap">
              {timeSlots.map((slot, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className={cn("w-7 h-3 rounded-sm", slot.available ? "bg-emerald-500/40" : "bg-red-500/40")} />
                  <span className="text-[8px] text-[#555]">{slot.time}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[10px] text-[#666]">Available</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[10px] text-[#666]">Booked</span></span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#0e0e0e] border border-[#d4af37]/8 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" strokeWidth={1.8} /></div>
              <div>
                <div className="text-[10px] text-[#555] uppercase tracking-wider">Location</div>
                <div className="text-[13px] text-[#e0e0e0] mt-0.5">{resource.location}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#0e0e0e] border border-[#d4af37]/8 flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5 text-[#d4af37]" strokeWidth={1.8} /></div>
              <div>
                <div className="text-[10px] text-[#555] uppercase tracking-wider">Capacity</div>
                <div className="text-[13px] text-[#e0e0e0] mt-0.5">{resource.capacity ? `${resource.capacity} people` : "N/A"}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#0e0e0e] border border-[#d4af37]/8 flex items-center justify-center flex-shrink-0">
                <StickyNote className="w-3.5 h-3.5 text-[#d4af37]" strokeWidth={1.8} /></div>
              <div>
                <div className="text-[10px] text-[#555] uppercase tracking-wider">Amenities</div>
                <div className="text-[13px] text-[#e0e0e0] mt-0.5">{resource.amenities.join(", ")}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-[#0e0e0e] border border-[#d4af37]/8 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-[#d4af37]" strokeWidth={1.8} /></div>
              <div>
                <div className="text-[10px] text-[#555] uppercase tracking-wider">Manager</div>
                <div className="text-[13px] text-[#e0e0e0] mt-0.5">{manager?.name || resource.manager}</div>
              </div>
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-semibold text-[#555] uppercase tracking-widest">Upcoming Bookings</div>
            </div>
            {upcomingBookings.length === 0 ? (
              <p className="text-[12px] text-[#555]">No upcoming bookings</p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map(b => {
                  const dur = (() => {
                    const [sh, sm] = b.startTime.split(":").map(Number);
                    const [eh, em] = b.endTime.split(":").map(Number);
                    return (eh * 60 + em) - (sh * 60 + sm);
                  })();
                  return (
                    <div key={b.id} className="p-3 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/6">
                      <div className="text-[12px] text-[#e0e0e0] font-medium">{b.title}</div>
                      <div className="text-[11px] text-[#666] mt-0.5">
                        {formatTime12(b.startTime)} – {formatTime12(b.endTime)} ({dur} min)
                      </div>
                      <div className="text-[11px] text-[#555]">{b.clientName} • {b.staffName}</div>
                      <span className={cn("inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-medium border",
                        b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20")}>
                        {b.status === "confirmed" ? "Confirmed" : "Pending"}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          {resource.notes && (
            <div className="pt-3 border-t border-[#d4af37]/8">
              <div className="text-[10px] font-semibold text-[#555] uppercase tracking-widest mb-2">Notes</div>
              <p className="text-xs text-[#888] leading-relaxed">{resource.notes}</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showReserve && <ReserveModal resource={resource} onClose={() => setShowReserve(false)} />}
      </AnimatePresence>
    </motion.aside>
  );
}

/* ── Main Page ── */
export function ResourcesPage() {
  const { resources, appointments, clients, services, staff } = useBookingStore();
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const types = useMemo(() => Array.from(new Set(resources.map(r => r.type))), [resources]);
  const statuses = ["Available", "In Use", "Maintenance"];

  const filtered = useMemo(() => {
    let result = resources;
    if (search) result = result.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter) result = result.filter(r => r.type === typeFilter);
    if (statusFilter) result = result.filter(r => r.status === statusFilter);
    return result;
  }, [resources, search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selected = resources.find(r => r.id === selectedId);

  const stats = useMemo(() => ({
    total: resources.length, inUse: resources.filter(r => r.status === "In Use").length,
    available: resources.filter(r => r.status === "Available").length,
    maintenance: resources.filter(r => r.status === "Maintenance").length,
  }), [resources]);

  const getNextBooking = (resId: string) => {
    const next = appointments
      .filter(a => a.resourceId === resId && (a.status === "confirmed" || a.status === "pending"))
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))[0];
    if (!next) return "No upcoming";
    const client = clients.find(c => c.id === next.clientId);
    const service = services.find(s => s.id === next.serviceId);
    return `${next.date === "2024-05-15" ? "Today" : next.date}, ${formatTime12(next.startTime)} — ${service?.name || "Booking"} (${client?.name || ""})`;
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-[#e0e0e0] tracking-tight">Resources</h1>
        <p className="text-[13px] text-[#666] mt-1">Manage equipment, assets, and booking availability.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Resources" value={String(stats.total)} change="12 new this month" changeType="up" icon={Calendar} delay={0} />
        <StatCard title="In Use Now" value={String(stats.inUse)} change={`${Math.round(stats.inUse / stats.total * 100)}% of total`} changeType="neutral" icon={Activity} delay={0.06} />
        <StatCard title="Available" value={String(stats.available)} change={`${Math.round(stats.available / stats.total * 100)}% of total`} changeType="up" icon={CheckCircle2} delay={0.12} />
        <StatCard title="Maintenance" value={String(stats.maintenance)} change={`${Math.round(stats.maintenance / stats.total * 100)}% of total`} changeType="neutral" icon={Wrench} delay={0.18} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
          <input type="text" placeholder="Search resources..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full premium-input pl-9 pr-3 py-2 rounded-lg text-[13px] text-[#ccc] bg-[#0e0e0e] border border-[#d4af37]/10 placeholder:text-[#555]" />
        </div>
        <FilterDropdown label="All Types" options={types} value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }} />
        <FilterDropdown label="All Status" options={statuses} value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} />
        <PremiumButton variant="secondary" size="sm"><Filter className="w-3.5 h-3.5" /> Filters</PremiumButton>
        <div className="ml-auto flex items-center gap-1 bg-[#0e0e0e] rounded-lg p-0.5 border border-[#d4af37]/8">
          <button onClick={() => setViewMode("grid")} className={cn("p-1.5 rounded-md transition-all cursor-pointer", viewMode === "grid" ? "bg-gradient-to-b from-[#d4af37] to-[#b8960b] text-[#0a0a0a]" : "text-[#555] hover:text-[#999]")}>
            <LayoutGrid className="w-3.5 h-3.5" /></button>
          <button onClick={() => setViewMode("list")} className={cn("p-1.5 rounded-md transition-all cursor-pointer", viewMode === "list" ? "bg-gradient-to-b from-[#d4af37] to-[#b8960b] text-[#0a0a0a]" : "text-[#555] hover:text-[#999]")}>
            <List className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="flex gap-5 min-h-[460px]">
        <div className={cn("flex-1 min-w-0", selectedId && "max-w-[calc(100%-360px)]")}>
          <div className="premium-panel rounded-xl overflow-hidden">
            {viewMode === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#d4af37]/8">
                      {[{ key: "name", label: "RESOURCE" }, { key: "type", label: "TYPE" }, { key: "location", label: "LOCATION" },
                        { key: "availability", label: "AVAILABILITY" }, { key: "next", label: "NEXT BOOKING" }, { key: "capacity", label: "CAPACITY" },
                        { key: "status", label: "STATUS" }, { key: "action", label: "" }].map(col => (
                          <th key={col.key} className="px-4 py-3 text-left">
                            {col.key === "name" ? (
                              <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#555] uppercase tracking-widest hover:text-[#d4af37] cursor-pointer">
                                {col.label} <ArrowUpDown className="w-3 h-3 text-[#333]" /></button>
                            ) : (
                              <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest">{col.label}</span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((row, i) => {
                        const Icon = RES_ICONS[row.type] || Calendar;
                        const st = STATUS_MAP[row.status] || STATUS_MAP["Available"];
                        return (
                          <motion.tr key={row.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.03 }}
                            onClick={() => setSelectedId(row.id === selectedId ? null : row.id)}
                            className={cn("border-b border-[#d4af37]/5 last:border-b-0 transition-all cursor-pointer group/row",
                              selectedId === row.id ? "bg-[#d4af37]/5 border-l-2 border-l-[#d4af37]" : "hover:bg-[#161616]/50 border-l-2 border-l-transparent")}>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/8 border border-[#d4af37]/12 flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-4 h-4 text-[#d4af37]" /></div>
                                <div>
                                  <div className="text-[13px] text-[#ccc] font-medium">{row.name}</div>
                                  <div className="text-[10px] text-[#555]">{row.code}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5"><span className={cn("inline-flex px-2 py-0.5 rounded text-[10px] font-medium border", TYPE_COLORS[row.type] || TYPE_COLORS["Equipment"])}>{row.type}</span></td>
                            <td className="px-4 py-3.5"><div className="text-[13px] text-[#888]">{row.location}</div></td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5"><span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} /><span className="text-[13px] text-[#ccc]">{st.label}</span></div>
                            </td>
                            <td className="px-4 py-3.5"><div className="text-[11px] text-[#666] max-w-[200px] truncate">{getNextBooking(row.id)}</div></td>
                            <td className="px-4 py-3.5"><div className="text-[13px] text-[#888]">{row.capacity || "N/A"}</div></td>
                            <td className="px-4 py-3.5"><span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border", st.badge)}><span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />{st.label}</span></td>
                            <td className="px-4 py-3.5">
                              <div className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:bg-[#1e1e1e] transition-all opacity-0 group-hover/row:opacity-100">
                                <ChevronRight className="w-4 h-4" /></div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-4">
                  {paged.map((row, i) => {
                    const Icon = RES_ICONS[row.type] || Calendar;
                    const st = STATUS_MAP[row.status] || STATUS_MAP["Available"];
                    return (
                      <motion.div key={row.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        onClick={() => setSelectedId(row.id)}
                        className={cn("p-4 rounded-lg border cursor-pointer transition-all",
                          selectedId === row.id ? "bg-[#d4af37]/5 border-[#d4af37]/20" : "bg-[#0e0e0e] border-[#d4af37]/6 hover:border-[#d4af37]/15")}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-[#d4af37]/8 border border-[#d4af37]/12 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[#d4af37]" /></div>
                          <div>
                            <div className="text-[13px] text-[#e0e0e0] font-medium">{row.name}</div>
                            <div className="text-[10px] text-[#555]">{row.code}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border", st.badge)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />{st.label}</span>
                          <span className="text-[11px] text-[#555]">{row.capacity ? `${row.capacity} cap` : "—"}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              <div className="px-5 pb-4"><Pagination current={page} total={filtered.length} onChange={setPage} /></div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {selectedId && selected && <ResourceDetailPanel resource={selected} onClose={() => setSelectedId(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}