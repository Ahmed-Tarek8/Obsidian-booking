"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Activity,
  CheckCircle,
  Wrench,
  Search,
  Filter,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Sparkles,
  User,
  Clock,
  Edit3,
  MoreHorizontal,
  ArrowUpDown,
  StickyNote,
  BookmarkPlus,
  Settings2,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { PremiumButton } from "./PremiumButton";
import { SectionPanel } from "./SectionPanel";
import { cn } from "@/lib/utils";

/* ─── Data ─── */

type ResourceStatus = "available" | "in-use" | "maintenance";

interface ResourceRow {
  id: string;
  name: string;
  code: string;
  type: string;
  location: string;
  availability: string;
  nextBooking: string;
  capacity: string;
  status: ResourceStatus;
  // detail panel fields
  amenities: string[];
  manager: string;
  managerTitle: string;
  managerInitials: string;
  timeSlots: { time: string; available: boolean }[];
  upcomingBookings: {
    date: string;
    time: string;
    title: string;
    booker: string;
    status: "confirmed" | "pending";
  }[];
  notes: string;
}

const allResources: ResourceRow[] = [
  {
    id: "r1",
    name: "Meeting Room A",
    code: "MR-A",
    type: "Meeting Room",
    location: "Executive Suite Floor 2",
    availability: "Available",
    nextBooking: "Today 12:00 PM — Client Strategy Call",
    capacity: "8",
    status: "available",
    amenities: ["Projector", "Whiteboard", "Video Conferencing", "Coffee Machine"],
    manager: "James Smith",
    managerTitle: "Facility Manager",
    managerInitials: "JS",
    timeSlots: [
      { time: "8 AM", available: true },
      { time: "9 AM", available: true },
      { time: "10 AM", available: true },
      { time: "11 AM", available: true },
      { time: "12 PM", available: false },
      { time: "1 PM", available: false },
      { time: "2 PM", available: true },
      { time: "3 PM", available: true },
      { time: "4 PM", available: true },
      { time: "5 PM", available: true },
      { time: "6 PM", available: true },
      { time: "7 PM", available: true },
      { time: "8 PM", available: true },
    ],
    upcomingBookings: [
      { date: "May 15", time: "12:00 PM – 1:30 PM", title: "Client Strategy Call", booker: "Smith & Co • James Smith", status: "confirmed" },
      { date: "May 16", time: "9:00 AM – 10:30 AM", title: "Team Planning Session", booker: "Staff A • Emily Davis", status: "confirmed" },
      { date: "May 17", time: "3:00 PM – 4:00 PM", title: "Product Roadmap Review", booker: "Staff B • Michael Chen", status: "pending" },
    ],
    notes: "Newly renovated in April. Equipped with 4K display and surround sound.",
  },
  {
    id: "r2",
    name: "Studio B",
    code: "ST-B",
    type: "Studio",
    location: "Executive Suite Floor 1",
    availability: "In Use",
    nextBooking: "Today 1:30 PM — Product Photoshoot",
    capacity: "12",
    status: "in-use",
    amenities: ["Lighting Rig", "Backdrops", "Sound Booth", "Green Screen"],
    manager: "Emily Davis",
    managerTitle: "Studio Coordinator",
    managerInitials: "ED",
    timeSlots: [
      { time: "8 AM", available: true },
      { time: "9 AM", available: true },
      { time: "10 AM", available: true },
      { time: "11 AM", available: true },
      { time: "12 PM", available: false },
      { time: "1 PM", available: false },
      { time: "2 PM", available: false },
      { time: "3 PM", available: true },
      { time: "4 PM", available: true },
      { time: "5 PM", available: true },
      { time: "6 PM", available: true },
      { time: "7 PM", available: false },
      { time: "8 PM", available: false },
    ],
    upcomingBookings: [
      { date: "May 15", time: "1:30 PM – 4:00 PM", title: "Product Photoshoot", booker: "Marketing • Sarah Lee", status: "confirmed" },
      { date: "May 16", time: "10:00 AM – 12:00 PM", title: "Video Shoot — Ad Campaign", booker: "External • Agency X", status: "confirmed" },
    ],
    notes: "Green screen needs recalibration. Scheduled for next week.",
  },
  {
    id: "r3",
    name: "Conference Suite",
    code: "CS-1",
    type: "Conference Room",
    location: "Executive Suite Floor 3",
    availability: "Available",
    nextBooking: "Today 2:00 PM — Quarterly Review",
    capacity: "20",
    status: "available",
    amenities: ["Projector", "Microphone System", "Video Conferencing", "Podium"],
    manager: "Michael Chen",
    managerTitle: "Operations Lead",
    managerInitials: "MC",
    timeSlots: [
      { time: "8 AM", available: true },
      { time: "9 AM", available: true },
      { time: "10 AM", available: true },
      { time: "11 AM", available: true },
      { time: "12 PM", available: true },
      { time: "1 PM", available: true },
      { time: "2 PM", available: false },
      { time: "3 PM", available: false },
      { time: "4 PM", available: true },
      { time: "5 PM", available: true },
      { time: "6 PM", available: true },
      { time: "7 PM", available: true },
      { time: "8 PM", available: true },
    ],
    upcomingBookings: [
      { date: "May 15", time: "2:00 PM – 4:00 PM", title: "Quarterly Review", booker: "Leadership • CEO Office", status: "confirmed" },
    ],
    notes: "Largest meeting space. Prioritize executive bookings.",
  },
  {
    id: "r4",
    name: "Projector Kit",
    code: "PK-01",
    type: "Equipment",
    location: "Equipment Storage Floor 1",
    availability: "Available",
    nextBooking: "Tomorrow 9:00 AM — Team Presentation",
    capacity: "N/A",
    status: "available",
    amenities: ["4K Projector", "HDMI Cables", "Remote Control", "Carry Case"],
    manager: "Alex Turner",
    managerTitle: "Equipment Manager",
    managerInitials: "AT",
    timeSlots: [
      { time: "8 AM", available: true },
      { time: "9 AM", available: false },
      { time: "10 AM", available: false },
      { time: "11 AM", available: true },
      { time: "12 PM", available: true },
      { time: "1 PM", available: true },
      { time: "2 PM", available: true },
      { time: "3 PM", available: true },
      { time: "4 PM", available: true },
      { time: "5 PM", available: true },
      { time: "6 PM", available: true },
      { time: "7 PM", available: true },
      { time: "8 PM", available: true },
    ],
    upcomingBookings: [
      { date: "May 16", time: "9:00 AM – 11:00 AM", title: "Team Presentation", booker: "Staff A • Emily Davis", status: "confirmed" },
    ],
    notes: "Bulb has 200 hours remaining. Replacement ordered.",
  },
  {
    id: "r5",
    name: "VIP Lounge",
    code: "VL-1",
    type: "Lounge",
    location: "Executive Suite Floor 2",
    availability: "In Use",
    nextBooking: "Today 5:00 PM — VIP Client Meeting",
    capacity: "10",
    status: "in-use",
    amenities: ["Premium Seating", "Mini Bar", "Entertainment System", "Private Restroom"],
    manager: "James Smith",
    managerTitle: "Facility Manager",
    managerInitials: "JS",
    timeSlots: [
      { time: "8 AM", available: true },
      { time: "9 AM", available: true },
      { time: "10 AM", available: true },
      { time: "11 AM", available: true },
      { time: "12 PM", available: true },
      { time: "1 PM", available: true },
      { time: "2 PM", available: true },
      { time: "3 PM", available: true },
      { time: "4 PM", available: true },
      { time: "5 PM", available: false },
      { time: "6 PM", available: false },
      { time: "7 PM", available: false },
      { time: "8 PM", available: false },
    ],
    upcomingBookings: [
      { date: "May 15", time: "5:00 PM – 7:00 PM", title: "VIP Client Meeting", booker: "VIP • Investor Group", status: "confirmed" },
    ],
    notes: "Refreshments restocked daily. Always confirm catering 24h ahead.",
  },
  {
    id: "r6",
    name: "Mobile Setup",
    code: "MS-01",
    type: "Equipment",
    location: "Mobile",
    availability: "Available",
    nextBooking: "Tomorrow 8:00 AM — Off-site Event",
    capacity: "N/A",
    status: "available",
    amenities: ["Portable Display", "Wireless Mic", "Speaker System", "Tablet Stand"],
    manager: "Alex Turner",
    managerTitle: "Equipment Manager",
    managerInitials: "AT",
    timeSlots: [
      { time: "8 AM", available: true },
      { time: "9 AM", available: true },
      { time: "10 AM", available: true },
      { time: "11 AM", available: true },
      { time: "12 PM", available: true },
      { time: "1 PM", available: true },
      { time: "2 PM", available: true },
      { time: "3 PM", available: true },
      { time: "4 PM", available: true },
      { time: "5 PM", available: true },
      { time: "6 PM", available: true },
      { time: "7 PM", available: true },
      { time: "8 PM", available: true },
    ],
    upcomingBookings: [
      { date: "May 16", time: "8:00 AM – 12:00 PM", title: "Off-site Event", booker: "Events • Sarah Lee", status: "confirmed" },
    ],
    notes: "Fully charged and ready. Check GPS tracker before dispatch.",
  },
  {
    id: "r7",
    name: "Vehicle 01",
    code: "VH-01",
    type: "Vehicle",
    location: "Main Location Garage",
    availability: "Maintenance",
    nextBooking: "No upcoming",
    capacity: "4",
    status: "maintenance",
    amenities: ["GPS Navigation", "Leather Interior", "WiFi", "Refreshments"],
    manager: "Michael Chen",
    managerTitle: "Operations Lead",
    managerInitials: "MC",
    timeSlots: [
      { time: "8 AM", available: false },
      { time: "9 AM", available: false },
      { time: "10 AM", available: false },
      { time: "11 AM", available: false },
      { time: "12 PM", available: false },
      { time: "1 PM", available: false },
      { time: "2 PM", available: false },
      { time: "3 PM", available: false },
      { time: "4 PM", available: false },
      { time: "5 PM", available: false },
      { time: "6 PM", available: false },
      { time: "7 PM", available: false },
      { time: "8 PM", available: false },
    ],
    upcomingBookings: [],
    notes: "Scheduled maintenance — oil change and tire rotation. ETA: May 18.",
  },
];

/* ─── Sub-components ─── */

function ResourceStatusBadge({ status }: { status: ResourceStatus }) {
  const config = {
    available: { label: "Available", dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]", cls: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
    "in-use": { label: "In Use", dot: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]", cls: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
    maintenance: { label: "Maintenance", dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]", cls: "text-red-400 border-red-500/20 bg-red-500/5" },
  };
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", c.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="text-[11px] font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
      {type}
    </span>
  );
}

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

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const perPage = 7;
  const pages = Math.ceil(total / perPage);
  return (
    <div className="flex items-center justify-between px-1 pt-3">
      <span className="text-[12px] text-[#666]">
        Showing {current * perPage - perPage + 1} to {Math.min(current * perPage, total)} of {total} resources
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

function ResourceDetailPanel({ resource, onClose }: { resource: ResourceRow; onClose: () => void }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-[340px] flex-shrink-0 h-full"
    >
      <div className="premium-panel rounded-xl h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4af37]/8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
            <span className="text-xs font-semibold text-[#999] uppercase tracking-widest">Resource Details</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Resource name & code */}
          <div>
            <div className="text-sm font-semibold text-[#e0e0e0]">{resource.name}</div>
            <div className="text-[11px] text-[#666] mt-0.5">
              {resource.code} &bull; {resource.type}
            </div>
            <div className="mt-2">
              <ResourceStatusBadge status={resource.status} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <PremiumButton variant="primary" size="sm">
              <BookmarkPlus className="w-3.5 h-3.5" />
              Reserve
            </PremiumButton>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#161616] border border-[#d4af37]/8 text-[#888] hover:text-[#d4af37] hover:border-[#d4af37]/20 transition-all cursor-pointer">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#161616] border border-[#d4af37]/8 text-[#888] hover:text-[#d4af37] hover:border-[#d4af37]/20 transition-all cursor-pointer">
              <Settings2 className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#161616] border border-[#d4af37]/8 text-[#888] hover:text-[#d4af37] hover:border-[#d4af37]/20 transition-all cursor-pointer">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Availability Today */}
          <div className="pt-3 border-t border-[#d4af37]/8">
            <div className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-3">Availability Today</div>
            <div className="space-y-1.5">
              {resource.timeSlots.map((slot) => (
                <div key={slot.time} className="flex items-center gap-2.5">
                  <span className="text-[10px] text-[#666] w-10 text-right tabular-nums">{slot.time}</span>
                  <div className="flex-1 h-3 rounded-full bg-[#0e0e0e] border border-[#d4af37]/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                      className={cn(
                        "h-full rounded-full",
                        slot.available
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
                          : "bg-gradient-to-r from-red-600 to-red-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-[#666]">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[10px] text-[#666]">Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#444]" />
                <span className="text-[10px] text-[#666]">Maintenance</span>
              </div>
            </div>

            {/* Current time indicator */}
            <div className="mt-2 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#d4af37]" />
              <span className="text-[10px] text-[#d4af37] font-medium">Current Time: 10:45 AM</span>
            </div>
          </div>

          {/* Resource Information */}
          <div className="pt-3 border-t border-[#d4af37]/8">
            <div className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-3">Resource Information</div>
            <div className="space-y-3.5">
              <DetailRow icon={MapPin} label="Location" value={resource.location} />
              <DetailRow icon={Users} label="Capacity" value={resource.capacity === "N/A" ? "Not Applicable" : `${resource.capacity} persons`} />
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-[#0e0e0e] border border-[#d4af37]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-[10px] font-medium text-[#555] uppercase tracking-wider">Amenities</div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {resource.amenities.map((a) => (
                      <span key={a} className="text-[10px] font-medium text-[#999] bg-[#1a1a1a] border border-[#d4af37]/8 px-2 py-0.5 rounded-md">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <DetailRow icon={User} label="Resource Manager" value={`${resource.manager} — ${resource.managerTitle}`} />
            </div>
          </div>

          {/* Upcoming Bookings */}
          {resource.upcomingBookings.length > 0 && (
            <div className="pt-3 border-t border-[#d4af37]/8">
              <div className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-3">Upcoming Bookings</div>
              <div className="space-y-2.5">
                {resource.upcomingBookings.map((booking, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0e0e0e] border border-[#d4af37]/8 rounded-lg p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[#e0e0e0] font-medium">{booking.title}</span>
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                          booking.status === "confirmed"
                            ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                            : "text-amber-400 border-amber-500/20 bg-amber-500/5"
                        )}
                      >
                        {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#666]">
                      {booking.date} &bull; {booking.time}
                    </div>
                    <div className="text-[10px] text-[#888]">{booking.booker}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="pt-3 border-t border-[#d4af37]/8">
            <div className="flex items-center gap-1.5 mb-2">
              <StickyNote className="w-3 h-3 text-[#555]" />
              <div className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">Notes</div>
            </div>
            <p className="text-xs text-[#888] leading-relaxed">{resource.notes}</p>
          </div>

          {/* Gold divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent" />
            <div className="w-1 h-1 rotate-45 bg-[#d4af37]/25" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent" />
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

/* ─── Main Page ─── */

export function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>("r1");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filtered = allResources;
  const perPage = 7;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const selected = allResources.find((r) => r.id === selectedId);

  const columns: { key: string; label: string; sortable?: boolean }[] = [
    { key: "resource", label: "RESOURCE", sortable: true },
    { key: "type", label: "TYPE" },
    { key: "location", label: "LOCATION" },
    { key: "availability", label: "AVAILABILITY" },
    { key: "nextBooking", label: "NEXT BOOKING" },
    { key: "capacity", label: "CAPACITY" },
    { key: "status", label: "STATUS" },
  ];

  return (
    <div className="p-6 space-y-5 animate-fade-in-up">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-[#e0e0e0] tracking-tight">Resources</h1>
        <p className="text-[13px] text-[#666] mt-1">Manage and monitor all booking resources.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="TOTAL RESOURCES" value="22" change="12 new this month" changeType="up" icon={Calendar} delay={0} />
        <StatCard title="IN USE NOW" value="8" change="36% of total" changeType="neutral" icon={Activity} delay={0.05} />
        <StatCard title="AVAILABLE" value="11" change="50% of total" changeType="neutral" icon={CheckCircle} delay={0.1} />
        <StatCard title="MAINTENANCE" value="3" change="14% of total" changeType="down" icon={Wrench} delay={0.15} />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="premium-input pl-9 pr-4 py-2 rounded-lg w-64 text-[13px] text-[#e0e0e0] placeholder-[#555]
              bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#d4af37]/10
              focus:border-[#d4af37]/30 focus:outline-none transition-all"
          />
        </div>

        <FilterDropdown label="All Types" icon={Calendar} />
        <FilterDropdown label="All Locations" icon={MapPin} />
        <FilterDropdown label="All Status" icon={Activity} />

        <PremiumButton variant="secondary" size="sm">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </PremiumButton>

        <div className="ml-auto flex items-center gap-1 bg-[#0e0e0e] rounded-lg p-0.5 border border-[#d4af37]/8">
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
        </div>
      </div>

      {/* Main content: table + detail panel */}
      <div className="flex gap-5 min-h-[460px]">
        <div className={cn("flex-1 min-w-0", selectedId && "max-w-[calc(100%-360px)]")}>
          <div className="premium-panel rounded-xl overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#d4af37]/8">
                    {columns.map((col) => (
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
                      {/* RESOURCE */}
                      <td className="px-4 py-3.5">
                        <div className="text-[13px] text-[#e0e0e0] font-medium">{row.name}</div>
                        <div className="text-[10px] text-[#555]">{row.code}</div>
                      </td>
                      {/* TYPE */}
                      <td className="px-4 py-3.5">
                        <TypeBadge type={row.type} />
                      </td>
                      {/* LOCATION */}
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] text-[#999]">{row.location}</span>
                      </td>
                      {/* AVAILABILITY */}
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "text-[12px] font-medium",
                          row.status === "available" && "text-emerald-400",
                          row.status === "in-use" && "text-blue-400",
                          row.status === "maintenance" && "text-red-400"
                        )}>
                          {row.availability}
                        </span>
                      </td>
                      {/* NEXT BOOKING */}
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "text-[12px]",
                          row.nextBooking === "No upcoming" ? "text-[#555]" : "text-[#ccc]"
                        )}>
                          {row.nextBooking}
                        </span>
                      </td>
                      {/* CAPACITY */}
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "text-[13px] tabular-nums",
                          row.capacity === "N/A" ? "text-[#555]" : "text-[#999]"
                        )}>
                          {row.capacity}
                        </span>
                      </td>
                      {/* STATUS */}
                      <td className="px-4 py-3.5">
                        <ResourceStatusBadge status={row.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 pb-4">
              <Pagination current={page} total={22} onChange={setPage} />
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedId && selected && (
            <ResourceDetailPanel resource={selected} onClose={() => setSelectedId(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}