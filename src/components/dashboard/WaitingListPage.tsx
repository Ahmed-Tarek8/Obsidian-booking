"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/dashboard/PremiumButton";
import { useBookingStore } from "@/lib/store";
import { toast } from "sonner";
import type { WaitingListEntry, WLPriority, WLStatus } from "@/lib/types";
import {
  Clock,
  AlertTriangle,
  PhoneCall,
  ArrowRightLeft,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  Bell,
  MoreHorizontal,
  Crown,
  Download,
  ChevronDown,
  Calendar,
  Clock3,
  MessageSquare,
  Tag,
  History,
  CalendarPlus,
  UserMinus,
  MapPin,
  Check,
} from "lucide-react";

// ── Chip configs ─────────────────────────────────────────────────────────

const priorityConfig: Record<WLPriority, { chipClass: string }> = {
  High: { chipClass: "text-orange-400 border-orange-500/25 bg-orange-500/8" },
  Medium: { chipClass: "text-amber-400 border-amber-500/25 bg-amber-500/8" },
  Low: { chipClass: "text-[#888] border-[#555]/25 bg-[#555]/8" },
};

const wlStatusConfig: Record<WLStatus, { dotClass: string; chipClass: string }> = {
  Waiting: {
    dotClass: "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.4)]",
    chipClass: "text-orange-400 border-orange-500/20 bg-orange-500/5",
  },
  Contacted: {
    dotClass: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]",
    chipClass: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  },
  "Offered Slot": {
    dotClass: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    chipClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  },
  Expired: {
    dotClass: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]",
    chipClass: "text-red-400 border-red-500/20 bg-red-500/5",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function computeWaitDuration(addedDate: string): string {
  const now = Date.now();
  const added = new Date(addedDate).getTime();
  const diffMs = now - added;
  const totalHours = diffMs / (1000 * 60 * 60);
  if (totalHours < 24) return `${totalHours.toFixed(1)}h`;
  const days = Math.floor(totalHours / 24);
  const hours = Math.round(totalHours % 24);
  return `${days}d ${hours}h`;
}

function timeToHHmm(time12: string): string {
  const [timePart, ampm] = time12.split(" ");
  const [h, m] = timePart.split(":").map(Number);
  let hour = h;
  if (ampm === "PM" && h !== 12) hour += 12;
  if (ampm === "AM" && h === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// ── Component ────────────────────────────────────────────────────────────

export function WaitingListPage() {
  const {
    waitingList,
    clients,
    services,
    updateWaitingListStatus,
    removeFromWaitingList,
    addAppointment,
  } = useBookingStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPriority, setFilterPriority] = useState<WLPriority | "All">("All");
  const [filterStatus, setFilterStatus] = useState<WLStatus | "All">("All");
  const [filterService, setFilterService] = useState<string>("All");
  const [showPriorityDrop, setShowPriorityDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showServiceDrop, setShowServiceDrop] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("09:00");

  const perPage = 8;

  // ── Resolve lookups ──────────────────────────────────────────────────

  const clientMap = useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients]
  );
  const serviceMap = useMemo(
    () => new Map(services.map((s) => [s.id, s])),
    [services]
  );

  const selected = useMemo(
    () => (selectedId ? waitingList.find((w) => w.id === selectedId) ?? null : null),
    [selectedId, waitingList]
  );
  const selectedClient = selected ? clientMap.get(selected.clientId) : undefined;
  const selectedService = selected ? serviceMap.get(selected.serviceId) : undefined;

  // ── Stats computed from store ────────────────────────────────────────

  const stats = useMemo(() => {
    const total = waitingList.length;
    const waiting = waitingList.filter((w) => w.status === "Waiting").length;
    const contacted = waitingList.filter((w) => w.status === "Contacted").length;
    const offered = waitingList.filter((w) => w.status === "Offered Slot").length;
    const expired = waitingList.filter((w) => w.status === "Expired").length;
    const highPriority = waitingList.filter((w) => w.priority === "High").length;
    return [
      {
        label: "TOTAL WAITING",
        value: String(total),
        trend: `${waiting} active`,
        icon: Clock,
        color: "text-emerald-400",
        bgIcon: "bg-emerald-500/10",
      },
      {
        label: "HIGH PRIORITY",
        value: String(highPriority),
        trend: `${waiting} awaiting action`,
        icon: AlertTriangle,
        color: "text-orange-400",
        bgIcon: "bg-orange-500/10",
      },
      {
        label: "CONTACTED",
        value: String(contacted),
        trend: `${offered} offered slot`,
        icon: PhoneCall,
        color: "text-blue-400",
        bgIcon: "bg-blue-500/10",
      },
      {
        label: "EXPIRED",
        value: String(expired),
        trend: `${offered} offered slot`,
        icon: ArrowRightLeft,
        color: "text-red-400",
        bgIcon: "bg-red-500/10",
      },
    ];
  }, [waitingList]);

  // ── Filtering ────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return waitingList.filter((entry) => {
      const client = clientMap.get(entry.clientId);
      const service = serviceMap.get(entry.serviceId);
      const name = client?.name.toLowerCase() ?? "";
      const svcName = service?.name.toLowerCase() ?? "";
      const matchesSearch =
        searchQuery === "" ||
        name.includes(searchQuery.toLowerCase()) ||
        svcName.includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === "All" || entry.priority === filterPriority;
      const matchesStatus = filterStatus === "All" || entry.status === filterStatus;
      const matchesService = filterService === "All" || entry.serviceId === filterService;
      return matchesSearch && matchesPriority && matchesStatus && matchesService;
    });
  }, [waitingList, clientMap, serviceMap, searchQuery, filterPriority, filterStatus, filterService]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Reset page when filters change
  const handleSearch = (v: string) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };

  // ── Actions ──────────────────────────────────────────────────────────

  const handleContact = (id: string) => {
    updateWaitingListStatus(id, "Contacted");
    toast.success("Client marked as contacted");
  };

  const handleOfferSlot = (id: string) => {
    updateWaitingListStatus(id, "Offered Slot");
    toast.success("Slot offered — status updated");
  };

  const handleRemove = (id: string) => {
    removeFromWaitingList(id);
    setSelectedId(null);
    toast.success("Removed from waiting list");
  };

  const handleBookNow = () => {
    if (!selected || !selectedService) return;
    if (!bookDate || !bookTime) {
      toast.error("Please select a date and time");
      return;
    }

    // Compute end time from service duration
    const startH = parseInt(bookTime.split(":")[0], 10);
    const startM = parseInt(bookTime.split(":")[1], 10);
    const endTotalMin = startH * 60 + startM + selectedService.duration;
    const endH = Math.floor(endTotalMin / 60);
    const endM = endTotalMin % 60;
    const endTime = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

    // Pick first staff member from the service
    const staffId = selectedService.staffIds[0] ?? "st-1";

    addAppointment({
      clientId: selected.clientId,
      serviceId: selected.serviceId,
      staffId,
      resourceId: "res-1",
      date: bookDate,
      startTime: bookTime,
      endTime,
      status: "pending",
      notes: selected.notes,
    });

    removeFromWaitingList(selected.id);
    setSelectedId(null);
    setBookModalOpen(false);
    toast.success("Appointment booked and removed from waiting list");
  };

  const openBookModal = () => {
    if (!selected) return;
    // Pre-fill with preferred date
    setBookDate(selected.preferredDate);
    // Parse time window to get a reasonable default start time
    const tw = selected.timeWindow;
    const match = tw.match(/(\d{1,2}:\d{2}\s*[AP]M)/i);
    if (match) {
      setBookTime(timeToHHmm(match[1]));
    } else {
      setBookTime("09:00");
    }
    setBookModalOpen(true);
  };

  // ── Animation variants ───────────────────────────────────────────────

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };
  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // ── Unique service list for filter ───────────────────────────────────

  const uniqueServiceIds = useMemo(
    () => [...new Set(waitingList.map((w) => w.serviceId))],
    [waitingList]
  );

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e0e0e0] tracking-wide">Waiting List</h1>
          <p className="text-sm text-[#777] mt-0.5">Manage clients waiting for the next available slot.</p>
        </div>
        <PremiumButton variant="secondary" size="sm">
          <Download className="w-3.5 h-3.5" />
          Export
        </PremiumButton>
      </div>

      {/* Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="premium-panel stat-glow rounded-xl p-4 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-[#e0e0e0] mt-1.5">{stat.value}</p>
              </div>
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", stat.bgIcon)}>
                <stat.icon className={cn("w-4.5 h-4.5", stat.color)} />
              </div>
            </div>
            <p className={cn("text-xs mt-2.5 flex items-center gap-1", stat.color)}>
              <PhoneCall className="w-3 h-3" />
              {stat.trend}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search & Filters */}
      <div className="premium-panel rounded-xl p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[180px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              placeholder="Search waiting list..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="premium-input w-full pl-9 pr-4 py-2 rounded-lg text-sm text-[#e0e0e0] placeholder:text-[#555] outline-none"
            />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <button
              onClick={() => { setShowPriorityDrop(!showPriorityDrop); setShowStatusDrop(false); setShowServiceDrop(false); }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-[#888] bg-[#161616] border border-[#d4af37]/8 hover:border-[#d4af37]/20 hover:text-[#b0b0b0] transition-all duration-200 cursor-pointer"
            >
              {filterPriority === "All" ? "All Priorities" : filterPriority}
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showPriorityDrop && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1 left-0 z-30 min-w-[140px] premium-panel rounded-lg border border-[#d4af37]/10 py-1 shadow-xl"
                >
                  {(["All", "High", "Medium", "Low"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setFilterPriority(p); setShowPriorityDrop(false); setCurrentPage(1); }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer",
                        filterPriority === p ? "text-[#d4af37] bg-[#d4af37]/8" : "text-[#b0b0b0] hover:text-[#e0e0e0] hover:bg-[#161616]"
                      )}
                    >
                      {p === "All" ? "All Priorities" : p}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusDrop(!showStatusDrop); setShowPriorityDrop(false); setShowServiceDrop(false); }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-[#888] bg-[#161616] border border-[#d4af37]/8 hover:border-[#d4af37]/20 hover:text-[#b0b0b0] transition-all duration-200 cursor-pointer"
            >
              {filterStatus === "All" ? "All Statuses" : filterStatus}
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showStatusDrop && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1 left-0 z-30 min-w-[150px] premium-panel rounded-lg border border-[#d4af37]/10 py-1 shadow-xl"
                >
                  {(["All", "Waiting", "Contacted", "Offered Slot", "Expired"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setFilterStatus(s); setShowStatusDrop(false); setCurrentPage(1); }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer",
                        filterStatus === s ? "text-[#d4af37] bg-[#d4af37]/8" : "text-[#b0b0b0] hover:text-[#e0e0e0] hover:bg-[#161616]"
                      )}
                    >
                      {s === "All" ? "All Statuses" : s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Service Filter */}
          <div className="relative">
            <button
              onClick={() => { setShowServiceDrop(!showServiceDrop); setShowPriorityDrop(false); setShowStatusDrop(false); }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-[#888] bg-[#161616] border border-[#d4af37]/8 hover:border-[#d4af37]/20 hover:text-[#b0b0b0] transition-all duration-200 cursor-pointer"
            >
              {filterService === "All" ? "All Services" : (serviceMap.get(filterService)?.name ?? "All Services")}
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showServiceDrop && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1 left-0 z-30 min-w-[160px] max-h-60 overflow-y-auto premium-panel rounded-lg border border-[#d4af37]/10 py-1 shadow-xl"
                >
                  <button
                    onClick={() => { setFilterService("All"); setShowServiceDrop(false); setCurrentPage(1); }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer",
                      filterService === "All" ? "text-[#d4af37] bg-[#d4af37]/8" : "text-[#b0b0b0] hover:text-[#e0e0e0] hover:bg-[#161616]"
                    )}
                  >
                    All Services
                  </button>
                  {uniqueServiceIds.map((sid) => {
                    const svc = serviceMap.get(sid);
                    if (!svc) return null;
                    return (
                      <button
                        key={sid}
                        onClick={() => { setFilterService(sid); setShowServiceDrop(false); setCurrentPage(1); }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer",
                          filterService === sid ? "text-[#d4af37] bg-[#d4af37]/8" : "text-[#b0b0b0] hover:text-[#e0e0e0] hover:bg-[#161616]"
                        )}
                      >
                        {svc.name}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="p-2 rounded-lg text-[#888] bg-[#161616] border border-[#d4af37]/8 hover:border-[#d4af37]/20 hover:text-[#d4af37] transition-all duration-200 cursor-pointer">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table + Detail Panel */}
      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 min-w-0">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="premium-panel rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#d4af37]/8">
                    {["Client", "Requested Service", "Preferred Date", "Time Window", "Wait Duration", "Priority", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-semibold tracking-[0.12em] text-[#555] uppercase px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-[#555]">
                        No entries match your filters.
                      </td>
                    </tr>
                  )}
                  {paginated.map((entry) => {
                    const client = clientMap.get(entry.clientId);
                    const service = serviceMap.get(entry.serviceId);
                    const isSelected = selectedId === entry.id;
                    const pConf = priorityConfig[entry.priority];
                    const sConf = wlStatusConfig[entry.status];
                    return (
                      <motion.tr
                        key={entry.id}
                        variants={item}
                        onClick={() => setSelectedId(entry.id)}
                        className={cn(
                          "border-b border-[#d4af37]/5 last:border-0 cursor-pointer transition-all duration-200",
                          isSelected ? "bg-[#d4af37]/5" : "hover:bg-[#161616]/80"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
                                  client?.tier === "VIP"
                                    ? "bg-gradient-to-br from-[#d4af37]/20 to-[#b8960b]/10 text-[#d4af37] border-[#d4af37]/30"
                                    : "bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] text-[#888] border-[#d4af37]/10"
                                )}
                              >
                                {client?.initials ?? "?"}
                              </div>
                              {client?.tier === "VIP" && (
                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d4af37] flex items-center justify-center">
                                  <Crown className="w-2 h-2 text-[#0a0a0a]" />
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-[#e0e0e0] whitespace-nowrap">
                                {client?.name ?? "Unknown"}
                              </span>
                              {client?.tier === "VIP" && (
                                <p className="text-[9px] font-bold tracking-wider text-[#d4af37]/70 uppercase">
                                  VIP Member
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">{service?.name ?? entry.serviceId}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-[#b0b0b0]">{formatDate(entry.preferredDate)}</div>
                          <div className="text-[10px] text-[#555]">{formatDayOfWeek(entry.preferredDate)}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">{entry.timeWindow}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-[#e0e0e0] font-medium">{computeWaitDuration(entry.addedDate)}</div>
                          <div className="text-[10px] text-[#555]">Added {formatDate(entry.addedDate)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                              pConf.chipClass
                            )}
                          >
                            {entry.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                              sConf.chipClass
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", sConf.dotClass)} />
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-1 rounded-md text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all duration-200 cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#d4af37]/8">
              <p className="text-xs text-[#555]">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} results
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md text-[#555] hover:text-[#d4af37] hover:bg-[#161616] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      "w-7 h-7 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer",
                      currentPage === p
                        ? "bg-gradient-to-b from-[#d4af37] to-[#b8960b] text-[#0a0a0a] font-bold"
                        : "text-[#666] hover:text-[#d4af37] hover:bg-[#161616]"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md text-[#555] hover:text-[#d4af37] hover:bg-[#161616] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && selectedClient && selectedService && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-[340px] flex-shrink-0 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]"
            >
              {/* Header Card */}
              <div className="premium-panel rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border",
                          selectedClient.tier === "VIP"
                            ? "bg-gradient-to-br from-[#d4af37]/20 to-[#b8960b]/10 text-[#d4af37] border-[#d4af37]/30"
                            : "bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] text-[#888] border-[#d4af37]/10"
                        )}
                      >
                        {selectedClient.initials}
                      </div>
                      {selectedClient.tier === "VIP" && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4af37] flex items-center justify-center">
                          <Crown className="w-2.5 h-2.5 text-[#0a0a0a]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#e0e0e0]">{selectedClient.name}</h3>
                      {selectedClient.tier === "VIP" && (
                        <p className="text-[9px] font-bold tracking-wider text-[#d4af37]/70 uppercase">
                          VIP Member
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-1 rounded-md text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all duration-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      wlStatusConfig[selected.status].chipClass
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", wlStatusConfig[selected.status].dotClass)} />
                    {selected.status}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      priorityConfig[selected.priority].chipClass
                    )}
                  >
                    {selected.priority} Priority
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="premium-panel rounded-xl p-5">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-3">
                  Contact Information
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">{selectedClient.totalBookings} total bookings</span>
                  </div>
                </div>
              </div>

              {/* Preferred Schedule */}
              <div className="premium-panel rounded-xl p-5">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-3">
                  Preferred Schedule
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-3.5 h-3.5 text-[#555]" />
                    <div>
                      <span className="text-xs text-[#b0b0b0]">{formatDate(selected.preferredDate)}</span>
                      <span className="text-xs text-[#555] ml-1">({formatDayOfWeek(selected.preferredDate)})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock3 className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">{selected.timeWindow}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#666]">Flexible +/- 1 day</span>
                  </div>
                </div>
              </div>

              {/* Service & Notes */}
              <div className="premium-panel rounded-xl p-5">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-2">
                  Service
                </p>
                <div className="flex items-center gap-2.5 mb-1 px-3 py-2 rounded-lg bg-[#0e0e0e]/60 border border-[#d4af37]/5">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="text-xs text-[#b0b0b0]">{selectedService.name}</span>
                </div>
                <p className="text-[10px] text-[#555] ml-5.5 mb-3">
                  {selectedService.duration} min &middot; ${selectedService.price}
                </p>
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-2">
                  Notes
                </p>
                <p className="text-xs text-[#888] leading-relaxed">{selected.notes}</p>
              </div>

              {/* Tags */}
              <div className="premium-panel rounded-xl p-5">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-3">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedClient.tags.length > 0 ? selectedClient.tags : [selectedClient.tier]).map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-medium border",
                        tag === "VIP" || tag === "VIP Member"
                          ? "text-[#d4af37] border-[#d4af37]/20 bg-[#d4af37]/5"
                          : "text-[#888] border-[#555]/20 bg-[#555]/8"
                      )}
                    >
                      <Tag className="w-2.5 h-2.5 inline mr-1 -mt-0.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Added & Wait Duration */}
              <div className="premium-panel rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase">
                      Added
                    </p>
                    <p className="text-xs text-[#b0b0b0] mt-1">{formatDate(selected.addedDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase">
                      Wait Duration
                    </p>
                    <p className="text-xs text-[#e0e0e0] font-medium mt-1">{computeWaitDuration(selected.addedDate)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <PremiumButton
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleContact(selected.id)}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Contact Client
                  </PremiumButton>
                  <PremiumButton
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOfferSlot(selected.id)}
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Offer Slot
                  </PremiumButton>
                </div>
                <PremiumButton
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={openBookModal}
                >
                  <History className="w-3.5 h-3.5" />
                  Book Now
                </PremiumButton>
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/5 hover:border-red-500/10 border border-transparent"
                  onClick={() => handleRemove(selected.id)}
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  Remove from Waiting List
                </PremiumButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Book Now Modal */}
      <AnimatePresence>
        {bookModalOpen && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setBookModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md mx-4 premium-panel rounded-xl p-6 border border-[#d4af37]/15 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-[#e0e0e0]">Book Appointment</h3>
                <button
                  onClick={() => setBookModalOpen(false)}
                  className="p-1 rounded-md text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all duration-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Client & Service Info */}
                <div className="rounded-lg bg-[#0e0e0e]/60 border border-[#d4af37]/5 p-3 space-y-1">
                  <p className="text-xs text-[#b0b0b0]">
                    <span className="text-[#555]">Client:</span> {selectedClient?.name}
                  </p>
                  <p className="text-xs text-[#b0b0b0]">
                    <span className="text-[#555]">Service:</span> {selectedService?.name} ({selectedService?.duration} min)
                  </p>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="premium-input w-full px-3 py-2 rounded-lg text-sm text-[#e0e0e0] outline-none"
                  />
                </div>

                {/* Time Picker */}
                <div>
                  <label className="block text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="premium-input w-full px-3 py-2 rounded-lg text-sm text-[#e0e0e0] outline-none"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  <PremiumButton
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => setBookModalOpen(false)}
                  >
                    Cancel
                  </PremiumButton>
                  <PremiumButton
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={handleBookNow}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Confirm Booking
                  </PremiumButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}