"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/dashboard/PremiumButton";
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
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────

type Priority = "High" | "Medium" | "Low";
type WLStatus = "Waiting" | "Contacted" | "Offered Slot" | "Expired";

interface WaitingClient {
  id: string;
  name: string;
  initials: string;
  tier: "VIP" | "Regular";
  service: string;
  preferredDate: string;
  dayOfWeek: string;
  timeWindow: string;
  waitDuration: string;
  addedDate: string;
  priority: Priority;
  status: WLStatus;
  email: string;
  phone: string;
  contactPreference: string;
  notes: string;
  tags: string[];
  activityLog: { action: string; date: string; time: string }[];
}

// ── Data ─────────────────────────────────────────────────────────────────

const waitingClients: WaitingClient[] = [
  {
    id: "wl1",
    name: "Client 07",
    initials: "C7",
    tier: "VIP",
    service: "Strategy Session",
    preferredDate: "May 20, 2024",
    dayOfWeek: "Mon",
    timeWindow: "10:00 AM – 12:00 PM",
    waitDuration: "24.6h",
    addedDate: "May 15, 2024",
    priority: "High",
    status: "Waiting",
    email: "client07@example.com",
    phone: "(252) 555-0718",
    contactPreference: "Email & SMS",
    notes: "Prefers an earlier slot if available. Open to email or SMS updates.",
    tags: ["VIP", "Regular Client", "Business"],
    activityLog: [
      { action: "Added to waiting list", date: "May 15, 2024", time: "2:47 PM" },
      { action: "Contacted via SMS", date: "May 16, 2024", time: "11:20 AM" },
      { action: "Client viewed message", date: "May 16, 2024", time: "11:45 AM" },
    ],
  },
  {
    id: "wl2",
    name: "Client 12",
    initials: "C12",
    tier: "Regular",
    service: "Product Demo",
    preferredDate: "May 21, 2024",
    dayOfWeek: "Tue",
    timeWindow: "2:00 PM – 4:00 PM",
    waitDuration: "1d 4h",
    addedDate: "May 16, 2024",
    priority: "Medium",
    status: "Contacted",
    email: "client12@example.com",
    phone: "(252) 555-1218",
    contactPreference: "Phone",
    notes: "Interested in afternoon slots. Needs product demo for team.",
    tags: ["New Client", "Corporate"],
    activityLog: [
      { action: "Added to waiting list", date: "May 16, 2024", time: "9:15 AM" },
      { action: "Contacted via phone", date: "May 17, 2024", time: "3:00 PM" },
    ],
  },
  {
    id: "wl3",
    name: "Client 18",
    initials: "C18",
    tier: "Regular",
    service: "Onboarding Session",
    preferredDate: "May 22, 2024",
    dayOfWeek: "Wed",
    timeWindow: "11:00 AM – 1:00 PM",
    waitDuration: "3d 2h",
    addedDate: "May 14, 2024",
    priority: "High",
    status: "Offered Slot",
    email: "client18@example.com",
    phone: "(252) 555-1818",
    contactPreference: "Email",
    notes: "New team member onboarding. Prefers morning sessions.",
    tags: ["Corporate", "Onboarding"],
    activityLog: [
      { action: "Added to waiting list", date: "May 14, 2024", time: "10:00 AM" },
      { action: "Contacted via email", date: "May 15, 2024", time: "9:00 AM" },
      { action: "Slot offered – May 22, 11 AM", date: "May 17, 2024", time: "1:30 PM" },
    ],
  },
  {
    id: "wl4",
    name: "Investor A",
    initials: "IA",
    tier: "VIP",
    service: "Support Call",
    preferredDate: "May 23, 2024",
    dayOfWeek: "Thu",
    timeWindow: "9:00 AM – 11:00 AM",
    waitDuration: "5d 1h",
    addedDate: "May 12, 2024",
    priority: "High",
    status: "Contacted",
    email: "investor.a@email.com",
    phone: "(252) 555-0401",
    contactPreference: "SMS",
    notes: "Requires priority handling. Long-standing partner.",
    tags: ["VIP", "Investor", "Priority"],
    activityLog: [
      { action: "Added to waiting list", date: "May 12, 2024", time: "4:00 PM" },
      { action: "Contacted via SMS", date: "May 13, 2024", time: "10:00 AM" },
    ],
  },
  {
    id: "wl5",
    name: "Client 21",
    initials: "C21",
    tier: "Regular",
    service: "Planning Review",
    preferredDate: "May 24, 2024",
    dayOfWeek: "Fri",
    timeWindow: "3:00 PM – 5:00 PM",
    waitDuration: "6d 3h",
    addedDate: "May 11, 2024",
    priority: "Medium",
    status: "Waiting",
    email: "client21@example.com",
    phone: "(252) 555-2121",
    contactPreference: "Email",
    notes: "Quarterly planning session. Flexible on exact date.",
    tags: ["Regular Client", "Quarterly"],
    activityLog: [
      { action: "Added to waiting list", date: "May 11, 2024", time: "11:30 AM" },
    ],
  },
  {
    id: "wl6",
    name: "Client 25",
    initials: "C25",
    tier: "Regular",
    service: "Workspace Tour",
    preferredDate: "May 25, 2024",
    dayOfWeek: "Sat",
    timeWindow: "10:00 AM – 12:00 PM",
    waitDuration: "7d 5h",
    addedDate: "May 10, 2024",
    priority: "Low",
    status: "Waiting",
    email: "client25@example.com",
    phone: "(252) 555-2525",
    contactPreference: "Phone",
    notes: "Prospective client interested in workspace rental options.",
    tags: ["Prospect", "Tour"],
    activityLog: [
      { action: "Added to waiting list", date: "May 10, 2024", time: "2:00 PM" },
    ],
  },
  {
    id: "wl7",
    name: "Client 29",
    initials: "C29",
    tier: "Regular",
    service: "Equipment Booking",
    preferredDate: "May 27, 2024",
    dayOfWeek: "Mon",
    timeWindow: "1:00 PM – 3:00 PM",
    waitDuration: "8d 1h",
    addedDate: "May 9, 2024",
    priority: "Low",
    status: "Expired",
    email: "client29@example.com",
    phone: "(252) 555-2929",
    contactPreference: "Email & SMS",
    notes: "No response after multiple contact attempts.",
    tags: ["Unresponsive"],
    activityLog: [
      { action: "Added to waiting list", date: "May 9, 2024", time: "3:15 PM" },
      { action: "Contacted via email", date: "May 10, 2024", time: "9:00 AM" },
      { action: "Second contact attempt (SMS)", date: "May 13, 2024", time: "2:00 PM" },
      { action: "Marked as expired", date: "May 17, 2024", time: "10:00 AM" },
    ],
  },
  {
    id: "wl8",
    name: "Client 33",
    initials: "C33",
    tier: "Regular",
    service: "Review Meeting",
    preferredDate: "May 28, 2024",
    dayOfWeek: "Tue",
    timeWindow: "2:00 PM – 4:00 PM",
    waitDuration: "9d 2h",
    addedDate: "May 8, 2024",
    priority: "Medium",
    status: "Waiting",
    email: "client33@example.com",
    phone: "(252) 555-3333",
    contactPreference: "Email",
    notes: "Annual review meeting. Not urgent but would like to schedule soon.",
    tags: ["Annual", "Review"],
    activityLog: [
      { action: "Added to waiting list", date: "May 8, 2024", time: "10:45 AM" },
    ],
  },
];

// ── Stat Cards ───────────────────────────────────────────────────────────

const stats = [
  {
    label: "TOTAL WAITING",
    value: "42",
    trend: "+ 6 vs yesterday",
    icon: Clock,
    color: "text-emerald-400",
    bgIcon: "bg-emerald-500/10",
  },
  {
    label: "HIGH PRIORITY",
    value: "9",
    trend: "+ 2 vs yesterday",
    icon: AlertTriangle,
    color: "text-orange-400",
    bgIcon: "bg-orange-500/10",
  },
  {
    label: "CONTACTED TODAY",
    value: "7",
    trend: "67% response rate",
    icon: PhoneCall,
    color: "text-blue-400",
    bgIcon: "bg-blue-500/10",
  },
  {
    label: "CONVERTED THIS WEEK",
    value: "5",
    trend: "+ 2 vs last week",
    icon: ArrowRightLeft,
    color: "text-emerald-400",
    bgIcon: "bg-emerald-500/10",
  },
];

// ── Chip configs ─────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, { chipClass: string }> = {
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

// ── Component ────────────────────────────────────────────────────────────

export function WaitingListPage() {
  const [selectedClient, setSelectedClient] = useState<WaitingClient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = waitingClients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };
  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

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
              {stat.label === "CONTACTED TODAY" ? (
                <>
                  <PhoneCall className="w-3 h-3" />
                  {stat.trend}
                </>
              ) : (
                <>{stat.trend}</>
              )}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search & Filters */}
      <div className="premium-panel rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              placeholder="Search waiting list..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="premium-input w-full pl-9 pr-4 py-2 rounded-lg text-sm text-[#e0e0e0] placeholder:text-[#555] outline-none"
            />
          </div>
          {["All Locations", "All Services", "All Priorities", "All Statuses"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-[#888] bg-[#161616] border border-[#d4af37]/8 hover:border-[#d4af37]/20 hover:text-[#b0b0b0] transition-all duration-200 cursor-pointer"
            >
              {filter}
              <ChevronDown className="w-3 h-3" />
            </button>
          ))}
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
                  {paginated.map((client) => {
                    const isSelected = selectedClient?.id === client.id;
                    const pConf = priorityConfig[client.priority];
                    const sConf = wlStatusConfig[client.status];
                    return (
                      <motion.tr
                        key={client.id}
                        variants={item}
                        onClick={() => setSelectedClient(client)}
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
                                  client.tier === "VIP"
                                    ? "bg-gradient-to-br from-[#d4af37]/20 to-[#b8960b]/10 text-[#d4af37] border-[#d4af37]/30"
                                    : "bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] text-[#888] border-[#d4af37]/10"
                                )}
                              >
                                {client.initials}
                              </div>
                              {client.tier === "VIP" && (
                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d4af37] flex items-center justify-center">
                                  <Crown className="w-2 h-2 text-[#0a0a0a]" />
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-[#e0e0e0] whitespace-nowrap">
                                {client.name}
                              </span>
                              {client.tier === "VIP" && (
                                <p className="text-[9px] font-bold tracking-wider text-[#d4af37]/70 uppercase">
                                  VIP Member
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">{client.service}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-[#b0b0b0]">{client.preferredDate}</div>
                          <div className="text-[10px] text-[#555]">{client.dayOfWeek}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">{client.timeWindow}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-[#e0e0e0] font-medium">{client.waitDuration}</div>
                          <div className="text-[10px] text-[#555]">Added {client.addedDate}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                              pConf.chipClass
                            )}
                          >
                            {client.priority}
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
                            {client.status}
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
                Showing {(currentPage - 1) * perPage + 1} to{" "}
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
          {selectedClient && (
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
                    onClick={() => setSelectedClient(null)}
                    className="p-1 rounded-md text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all duration-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      wlStatusConfig[selectedClient.status].chipClass
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", wlStatusConfig[selectedClient.status].dotClass)} />
                    {selectedClient.status}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      priorityConfig[selectedClient.priority].chipClass
                    )}
                  >
                    {selectedClient.priority} Priority
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
                    <span className="text-xs text-[#b0b0b0]">Prefers {selectedClient.contactPreference}</span>
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
                      <span className="text-xs text-[#b0b0b0]">{selectedClient.preferredDate}</span>
                      <span className="text-xs text-[#555] ml-1">({selectedClient.dayOfWeek})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock3 className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">{selectedClient.timeWindow}</span>
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
                <div className="flex items-center gap-2.5 mb-3 px-3 py-2 rounded-lg bg-[#0e0e0e]/60 border border-[#d4af37]/5">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="text-xs text-[#b0b0b0]">{selectedClient.service}</span>
                </div>
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-2">
                  Notes
                </p>
                <p className="text-xs text-[#888] leading-relaxed">{selectedClient.notes}</p>
              </div>

              {/* Tags */}
              <div className="premium-panel rounded-xl p-5">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-3">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedClient.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-medium border",
                        tag === "VIP"
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
                    <p className="text-xs text-[#b0b0b0] mt-1">{selectedClient.addedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase">
                      Wait Duration
                    </p>
                    <p className="text-xs text-[#e0e0e0] font-medium mt-1">{selectedClient.waitDuration}</p>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="premium-panel rounded-xl p-5">
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase mb-3">
                  Activity Log
                </p>
                <div className="space-y-0">
                  {selectedClient.activityLog.map((entry, i) => (
                    <div key={i} className="relative flex gap-3 pb-3 last:pb-0">
                      {i < selectedClient.activityLog.length - 1 && (
                        <div className="absolute left-[5px] top-3 bottom-0 w-px bg-[#d4af37]/10" />
                      )}
                      <div className="w-[11px] h-[11px] rounded-full border-2 border-[#d4af37]/30 bg-[#0e0e0e] flex-shrink-0 mt-0.5 relative z-10" />
                      <div className="min-w-0">
                        <p className="text-xs text-[#b0b0b0]">{entry.action}</p>
                        <p className="text-[10px] text-[#555] mt-0.5">
                          {entry.date}, {entry.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <PremiumButton variant="primary" size="sm" className="flex-1">
                    <Bell className="w-3.5 h-3.5" />
                    Notify Client
                  </PremiumButton>
                  <PremiumButton variant="primary" size="sm" className="flex-1">
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Assign Slot
                  </PremiumButton>
                </div>
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/5 hover:border-red-500/10 border border-transparent"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  Remove from Waiting List
                </PremiumButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
