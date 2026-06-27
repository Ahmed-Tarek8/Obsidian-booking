"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/dashboard/PremiumButton";
import {
  Users,
  Crown,
  UserPlus,
  TrendingUp,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  CalendarDays,
  MessageSquare,
  Bell,
  X,
  Diamond,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type ClientStatus = "Active" | "Returning" | "Inactive";
type ViewMode = "grid" | "list";

interface Client {
  id: string;
  name: string;
  initials: string;
  tier: "VIP" | "Regular";
  phone: string;
  email: string;
  lastBooking: string;
  totalBookings: number;
  lifetimeValue: string;
  status: ClientStatus;
  tags: string[];
}

// ── Static Data ──────────────────────────────────────────────────────────────

const clients: Client[] = [
  {
    id: "1",
    name: "Investor A",
    initials: "IA",
    tier: "VIP",
    phone: "+1 555-123-4567",
    email: "investor.a@email.com",
    lastBooking: "May 15, 2024 10:00 AM",
    totalBookings: 18,
    lifetimeValue: "$2,460",
    status: "Active",
    tags: ["VIP", "High Value"],
  },
  {
    id: "2",
    name: "Client 01",
    initials: "C1",
    tier: "Regular",
    phone: "+1 555-234-5678",
    email: "client01@email.com",
    lastBooking: "May 14, 2024 2:00 PM",
    totalBookings: 8,
    lifetimeValue: "$960",
    status: "Active",
    tags: ["Regular"],
  },
  {
    id: "3",
    name: "Client 03",
    initials: "C3",
    tier: "Regular",
    phone: "+1 555-345-6789",
    email: "client03@email.com",
    lastBooking: "May 13, 2024 11:00 AM",
    totalBookings: 12,
    lifetimeValue: "$1,440",
    status: "Returning",
    tags: ["Preferred"],
  },
  {
    id: "4",
    name: "Client 05",
    initials: "C5",
    tier: "VIP",
    phone: "+1 555-456-7890",
    email: "client05@email.com",
    lastBooking: "May 12, 2024 9:00 AM",
    totalBookings: 22,
    lifetimeValue: "$3,180",
    status: "Active",
    tags: ["VIP", "High Value"],
  },
  {
    id: "5",
    name: "Client 07",
    initials: "C7",
    tier: "VIP",
    phone: "+1 555-567-8901",
    email: "client07@email.com",
    lastBooking: "May 11, 2024 3:00 PM",
    totalBookings: 15,
    lifetimeValue: "$1,890",
    status: "Active",
    tags: ["VIP"],
  },
  {
    id: "6",
    name: "Client 09",
    initials: "C9",
    tier: "Regular",
    phone: "+1 555-678-9012",
    email: "client09@email.com",
    lastBooking: "May 10, 2024 1:00 PM",
    totalBookings: 5,
    lifetimeValue: "$600",
    status: "Inactive",
    tags: ["Regular"],
  },
  {
    id: "7",
    name: "Client B",
    initials: "CB",
    tier: "Regular",
    phone: "+1 555-789-0123",
    email: "client.b@email.com",
    lastBooking: "May 9, 2024 4:00 PM",
    totalBookings: 9,
    lifetimeValue: "$1,080",
    status: "Returning",
    tags: ["Returning"],
  },
  {
    id: "8",
    name: "Client 04",
    initials: "C4",
    tier: "Regular",
    phone: "+1 555-890-1234",
    email: "client04@email.com",
    lastBooking: "May 8, 2024 10:30 AM",
    totalBookings: 6,
    lifetimeValue: "$720",
    status: "Active",
    tags: ["Regular"],
  },
];

const recentBookings = [
  { date: "May 15, 2024", service: "Premium Consultation", status: "Completed" },
  { date: "May 10, 2024", service: "Standard Session", status: "Completed" },
  { date: "May 5, 2024", service: "VIP Experience", status: "Completed" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const statusStyles: Record<ClientStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Returning: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  Inactive: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const tagStyles: Record<string, string> = {
  VIP: "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20",
  "High Value": "bg-[#d4af37]/8 text-[#d4af37]/80 border border-[#d4af37]/15",
  Regular: "bg-white/5 text-[#888] border border-white/8",
  Preferred: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  Returning: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

const bookingStatusStyles: Record<string, string> = {
  Completed: "text-emerald-400",
};

// ── Stat Cards Data ──────────────────────────────────────────────────────────

const statCards = [
  {
    title: "Total Clients",
    value: "1,248",
    icon: Users,
    change: "+12% vs last month",
    changeType: "up" as const,
  },
  {
    title: "VIP Clients",
    value: "128",
    icon: Crown,
    change: "+8% vs last month",
    changeType: "neutral" as const,
    isGold: true,
  },
  {
    title: "New This Week",
    value: "46",
    icon: UserPlus,
    change: "+15% vs last week",
    changeType: "up" as const,
  },
  {
    title: "Returning Rate",
    value: "68%",
    icon: TrendingUp,
    change: "+6% vs last month",
    changeType: "up" as const,
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export function ClientsPage() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? null;
  const totalPages = 156;

  return (
    <div className="animate-fade-in-up p-6 space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-white">Clients</h1>
        <p className="text-sm text-[#888] mt-1">
          View client profiles, loyalty, and booking history.
        </p>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const isGold = "isGold" in card && card.isGold;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="premium-panel stat-glow rounded-xl p-4 relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center border",
                    isGold
                      ? "bg-[#d4af37]/15 border-[#d4af37]/15"
                      : "bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 border-[#d4af37]/10"
                  )}
                >
                  <Icon
                    className="w-[18px] h-[18px]"
                    style={{
                      color: isGold ? "#d4af37" : "#d4af37",
                    }}
                    strokeWidth={1.8}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-md",
                    card.changeType === "up" &&
                      "text-emerald-400 bg-emerald-500/8 border border-emerald-500/10",
                    card.changeType === "neutral" &&
                      isGold &&
                      "text-[#d4af37] bg-[#d4af37]/8 border border-[#d4af37]/10",
                    card.changeType === "neutral" &&
                      !isGold &&
                      "text-[#888] bg-white/3 border border-white/5"
                  )}
                >
                  {card.change}
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-bold text-white tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs text-[#888] font-medium uppercase tracking-wider">
                  {card.title}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            type="text"
            placeholder="Search clients by name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="premium-input w-full rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2">
          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[120px]">
            <option>All Status</option>
            <option>Active</option>
            <option>Returning</option>
            <option>Inactive</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[110px]">
            <option>All Tags</option>
            <option>VIP</option>
            <option>High Value</option>
            <option>Regular</option>
            <option>Preferred</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[120px]">
            <option>First Visit</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[130px]">
            <option>Last Booking</option>
            <option>Today</option>
            <option>This week</option>
            <option>This month</option>
            <option>This quarter</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <PremiumButton variant="secondary" size="sm">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </PremiumButton>

          {/* View toggle */}
          <div className="flex items-center bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                viewMode === "grid"
                  ? "bg-[#d4af37]/10 text-[#d4af37]"
                  : "text-[#666] hover:text-[#999]"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                viewMode === "list"
                  ? "bg-[#d4af37]/10 text-[#d4af37]"
                  : "text-[#666] hover:text-[#999]"
              )}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content + Sidebar ─────────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Left: Table */}
        <div className="flex-1 min-w-0">
          <div className="premium-panel rounded-xl overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#d4af37]/8">
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                      Last Booking
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                      Total Bookings
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                      Lifetime Value
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider w-10" />
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => {
                    const isSelected = selectedClientId === client.id;
                    return (
                      <tr
                        key={client.id}
                        onClick={() =>
                          setSelectedClientId(isSelected ? null : client.id)
                        }
                        className={cn(
                          "border-b border-[#d4af37]/5 cursor-pointer transition-colors duration-150 group",
                          "bg-[#141414] hover:bg-[#1a1a1a]",
                          isSelected && "border-l-2 border-l-[#d4af37]/40 bg-[#1a1a1a]"
                        )}
                      >
                        {/* Client */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0">
                              {client.initials}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm text-white font-medium whitespace-nowrap">
                                {client.name}
                              </span>
                              {client.tier === "VIP" && (
                                <Diamond className="w-3 h-3 text-[#d4af37] shrink-0" />
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            <div className="text-xs text-[#ccc] whitespace-nowrap">
                              {client.phone}
                            </div>
                            <div className="text-xs text-[#777] whitespace-nowrap">
                              {client.email}
                            </div>
                          </div>
                        </td>

                        {/* Last Booking */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#aaa] whitespace-nowrap">
                            {client.lastBooking}
                          </span>
                        </td>

                        {/* Total Bookings */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#ccc] font-medium">
                            {client.totalBookings}
                          </span>
                        </td>

                        {/* Lifetime Value */}
                        <td className="px-4 py-3">
                          <span className="text-sm text-[#d4af37] font-medium">
                            {client.lifetimeValue}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-block px-2 py-0.5 rounded text-[10px] font-medium",
                              statusStyles[client.status]
                            )}
                          >
                            {client.status}
                          </span>
                        </td>

                        {/* Tags */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {client.tags.map((tag) => (
                              <span
                                key={tag}
                                className={cn(
                                  "inline-block px-2 py-0.5 rounded text-[10px] font-medium",
                                  tagStyles[tag] ?? "bg-white/5 text-[#888] border border-white/8"
                                )}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <ChevronRight className="w-4 h-4 text-[#555] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#d4af37]/8">
              <span className="text-xs text-[#666]">
                Showing 1 to 8 of 1,248 clients
              </span>
              <div className="flex items-center gap-1">
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </PremiumButton>

                <div className="flex items-center gap-0.5 mx-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={cn(
                      "w-7 h-7 rounded-md text-xs font-medium transition-all duration-200",
                      currentPage === 1
                        ? "bg-[#d4af37] text-[#0a0a0a]"
                        : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                    )}
                  >
                    1
                  </button>
                  <button
                    onClick={() => setCurrentPage(2)}
                    className={cn(
                      "w-7 h-7 rounded-md text-xs font-medium transition-all duration-200",
                      currentPage === 2
                        ? "bg-[#d4af37] text-[#0a0a0a]"
                        : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                    )}
                  >
                    2
                  </button>
                  <button
                    onClick={() => setCurrentPage(3)}
                    className={cn(
                      "w-7 h-7 rounded-md text-xs font-medium transition-all duration-200",
                      currentPage === 3
                        ? "bg-[#d4af37] text-[#0a0a0a]"
                        : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                    )}
                  >
                    3
                  </button>
                  <span className="text-[#555] text-xs px-1">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={cn(
                      "w-7 h-7 rounded-md text-xs font-medium transition-all duration-200",
                      currentPage === totalPages
                        ? "bg-[#d4af37] text-[#0a0a0a]"
                        : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                    )}
                  >
                    156
                  </button>
                </div>

                <PremiumButton
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage >= totalPages}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Client Detail Sidebar ──────────────────────────────────── */}
        <div className="w-[320px] shrink-0 hidden lg:block">
          <AnimatePresence mode="wait">
            {selectedClient && (
              <motion.div
                key={selectedClient.id}
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="premium-panel rounded-xl overflow-hidden h-full max-h-[calc(100vh-220px)] flex flex-col"
              >
                {/* Sidebar scrollable content */}
                <div className="overflow-y-auto flex-1">
                  {/* Header */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-sm font-bold shrink-0">
                          {selectedClient.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h2 className="text-lg font-bold text-white">
                              {selectedClient.name}
                            </h2>
                            {selectedClient.tier === "VIP" && (
                              <Diamond className="w-3.5 h-3.5 text-[#d4af37]" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                selectedClient.status === "Active" &&
                                  "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
                                selectedClient.status === "Returning" &&
                                  "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]",
                                selectedClient.status === "Inactive" &&
                                  "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                              )}
                            />
                            <span className="text-xs text-[#999]">
                              {selectedClient.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedClientId(null)}
                        className="p-1 rounded-md text-[#666] hover:text-white hover:bg-[#252525] transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Contact Info
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <span className="text-xs text-[#ccc]">
                          {selectedClient.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <span className="text-xs text-[#ccc]">
                          {selectedClient.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <span className="text-xs text-[#ccc]">
                          New York, NY
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Preferences
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <div>
                          <div className="text-[10px] text-[#555]">Preferred Time</div>
                          <div className="text-xs text-[#ccc]">Morning (9 AM - 12 PM)</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <CalendarDays className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <div>
                          <div className="text-[10px] text-[#555]">Booking Window</div>
                          <div className="text-xs text-[#ccc]">1-2 weeks in advance</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <div>
                          <div className="text-[10px] text-[#555]">Communication</div>
                          <div className="text-xs text-[#ccc]">Email & SMS</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Bell className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <div>
                          <div className="text-[10px] text-[#555]">Reminder</div>
                          <div className="text-xs text-[#ccc]">24 hours before</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Recent Bookings
                    </h3>
                    <div className="space-y-3">
                      {recentBookings.map((booking, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs text-[#ccc] font-medium">
                              {booking.service}
                            </div>
                            <div className="text-[10px] text-[#666]">
                              {booking.date}
                            </div>
                          </div>
                          <span
                            className={cn(
                              "text-[10px] font-medium shrink-0 mt-0.5",
                              bookingStatusStyles[booking.status] ?? "text-[#888]"
                            )}
                          >
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="p-5">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Notes
                    </h3>
                    <p className="text-xs text-[#888] leading-relaxed">
                      {selectedClient.tier === "VIP"
                        ? "High-value client. Prefers premium services and early morning slots. Always arrives on time."
                        : "Regular client. Prefers standard sessions. Responsive to email and SMS reminders."}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-[#d4af37]/8 space-y-2 bg-[#141414]/50">
                  <PremiumButton variant="primary" size="md" className="w-full">
                    Book Appointment
                  </PremiumButton>
                  <PremiumButton variant="secondary" size="md" className="w-full">
                    View History
                  </PremiumButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}