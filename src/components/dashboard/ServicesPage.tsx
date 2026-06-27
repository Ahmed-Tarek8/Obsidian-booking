"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/dashboard/PremiumButton";
import {
  CalendarRange,
  Layers,
  FileText,
  Clock,
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  X,
  Pencil,
  Copy,
  Trash2,
  Crown,
  Plus,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────
interface Service {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  duration: string;
  price: string;
  priceLabel?: string;
  availability: "Active" | "Limited";
  staff: string[];
  staffCount: number;
  bookings: number;
  description: string;
  featured?: boolean;
}

// ── Data ─────────────────────────────────────────────────────────────────
const services: Service[] = [
  {
    id: "s1",
    name: "Consultation",
    category: "Consulting",
    categoryColor: "purple",
    duration: "60 min",
    price: "$120",
    availability: "Active",
    staff: ["SA", "SB", "SC"],
    staffCount: 2,
    bookings: 342,
    description:
      "Initial consultation to understand needs and recommend tailored solutions.",
    featured: true,
  },
  {
    id: "s2",
    name: "Strategy Session",
    category: "Consulting",
    categoryColor: "purple",
    duration: "90 min",
    price: "$250",
    availability: "Active",
    staff: ["SA", "SB", "SC"],
    staffCount: 3,
    bookings: 218,
    description: "Deep-dive analysis and planning session.",
    featured: true,
  },
  {
    id: "s3",
    name: "Premium Meeting Room",
    category: "Space",
    categoryColor: "blue",
    duration: "60 min",
    price: "$85/hr",
    priceLabel: "Starting at",
    availability: "Active",
    staff: ["SA", "SB", "SC"],
    staffCount: 4,
    bookings: 156,
    description: "Fully-equipped room with premium amenities.",
  },
  {
    id: "s4",
    name: "Virtual Session",
    category: "Virtual",
    categoryColor: "teal",
    duration: "45 min",
    price: "$100",
    availability: "Active",
    staff: ["SA", "SB", "SC"],
    staffCount: 3,
    bookings: 128,
    description: "Online meeting via video conference.",
  },
  {
    id: "s5",
    name: "On-site Visit",
    category: "On-site",
    categoryColor: "orange",
    duration: "120 min",
    price: "$300",
    availability: "Limited",
    staff: ["SA", "SB", "SC"],
    staffCount: 2,
    bookings: 84,
    description: "We come to your location.",
  },
  {
    id: "s6",
    name: "Workshop Slot",
    category: "Training",
    categoryColor: "emerald",
    duration: "180 min",
    price: "$400",
    availability: "Active",
    staff: ["SA", "SB", "SC"],
    staffCount: 5,
    bookings: 63,
    description: "Group training and workshop sessions.",
  },
  {
    id: "s7",
    name: "Follow-up Call",
    category: "Support",
    categoryColor: "amber",
    duration: "30 min",
    price: "$75",
    availability: "Active",
    staff: ["SA", "SB", "SC"],
    staffCount: 2,
    bookings: 59,
    description: "Short follow-up to review progress and next steps.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────
const categoryBadge: Record<string, string> = {
  purple: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  blue: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  teal: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  orange: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  amber: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

// ── Component ────────────────────────────────────────────────────────────
export function ServicesPage() {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="animate-fade-in-up p-6 flex gap-6">
      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-white">Services</h1>
          <p className="text-sm text-[#888] mt-0.5">
            Manage services, pricing, duration, and categories.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="premium-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/10">
                <CalendarRange className="w-4 h-4 text-[#d4af37]" strokeWidth={1.8} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#e0e0e0] tracking-tight">
              18
            </div>
            <div className="text-xs text-[#777] font-medium uppercase tracking-wider mt-1">
              TOTAL SERVICES
            </div>
            <div className="text-xs text-[#666] mt-2">2 vs last month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="premium-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/10">
                <Layers className="w-4 h-4 text-[#d4af37]" strokeWidth={1.8} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#e0e0e0] tracking-tight">
              15
            </div>
            <div className="text-xs text-[#777] font-medium uppercase tracking-wider mt-1">
              ACTIVE SERVICES
            </div>
            <div className="text-xs text-[#666] mt-2">83% of total</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="premium-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/10">
                <FileText className="w-4 h-4 text-[#d4af37]" strokeWidth={1.8} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#e0e0e0] tracking-tight">
              Consultation
            </div>
            <div className="text-xs text-[#777] font-medium uppercase tracking-wider mt-1">
              MOST BOOKED
            </div>
            <div className="text-xs text-[#666] mt-2">342 bookings</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="premium-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/10">
                <Clock className="w-4 h-4 text-[#d4af37]" strokeWidth={1.8} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#e0e0e0] tracking-tight">
              60 min
            </div>
            <div className="text-xs text-[#777] font-medium uppercase tracking-wider mt-1">
              AVG DURATION
            </div>
            <div className="text-xs text-[#666] mt-2">5 min vs last month</div>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mt-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              type="text"
              placeholder="Search services..."
              className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#555] w-64 outline-none focus:border-[#d4af37]/30 transition-colors"
            />
          </div>

          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#aaa] w-36 outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer transition-colors">
            <option>All Categories</option>
          </select>

          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#aaa] w-36 outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer transition-colors">
            <option>All Status</option>
          </select>

          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#aaa] w-36 outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer transition-colors">
            <option>All Staff</option>
          </select>

          <PremiumButton variant="secondary" size="sm">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </PremiumButton>

          <div className="flex items-center border border-[#d4af37]/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-[#d4af37]/15 text-[#d4af37]"
                  : "text-[#666] hover:text-[#aaa]"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-[#d4af37]/15 text-[#d4af37]"
                  : "text-[#666] hover:text-[#aaa]"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Services Table */}
        <div className="premium-panel rounded-xl overflow-hidden mt-4">
          <table className="w-full">
            <thead>
              <tr className="bg-[#161616]">
                <th className="text-[10px] font-semibold tracking-widest text-[#666] uppercase py-3 px-4 text-left border-b border-[#d4af37]/8">
                  Service Name
                </th>
                <th className="text-[10px] font-semibold tracking-widest text-[#666] uppercase py-3 px-4 text-left border-b border-[#d4af37]/8">
                  Category
                </th>
                <th className="text-[10px] font-semibold tracking-widest text-[#666] uppercase py-3 px-4 text-left border-b border-[#d4af37]/8">
                  Duration
                </th>
                <th className="text-[10px] font-semibold tracking-widest text-[#666] uppercase py-3 px-4 text-left border-b border-[#d4af37]/8">
                  Price
                </th>
                <th className="text-[10px] font-semibold tracking-widest text-[#666] uppercase py-3 px-4 text-left border-b border-[#d4af37]/8">
                  Availability
                </th>
                <th className="text-[10px] font-semibold tracking-widest text-[#666] uppercase py-3 px-4 text-left border-b border-[#d4af37]/8">
                  Staff
                </th>
                <th className="text-[10px] font-semibold tracking-widest text-[#666] uppercase py-3 px-4 text-right border-b border-[#d4af37]/8">
                  Bookings
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  onClick={() =>
                    setSelectedServiceId(
                      selectedServiceId === service.id ? null : service.id
                    )
                  }
                  className={cn(
                    "border-b border-[#d4af37]/5 hover:bg-[#1a1a1a] cursor-pointer transition-colors",
                    selectedServiceId === service.id &&
                      "bg-[#1a1a1a] border-l-2 border-l-[#d4af37]/40"
                  )}
                >
                  {/* Service Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-white">
                        {service.name}
                      </span>
                      {service.featured && (
                        <Star className="w-3 h-3 text-purple-400 fill-purple-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#777] truncate max-w-[220px] mt-0.5">
                      {service.description}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "inline-block rounded px-2 py-0.5 text-[10px] font-medium border",
                        categoryBadge[service.categoryColor]
                      )}
                    >
                      {service.category}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#ccc]">
                      <Clock className="w-3 h-3 text-[#888]" />
                      {service.duration}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    <div className="text-sm font-semibold text-white">
                      {service.price}
                    </div>
                    {service.priceLabel && (
                      <div className="text-[10px] text-[#666]">
                        {service.priceLabel}
                      </div>
                    )}
                  </td>

                  {/* Availability */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          service.availability === "Active"
                            ? "bg-emerald-400"
                            : "bg-orange-400"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs",
                          service.availability === "Active"
                            ? "text-emerald-400"
                            : "text-orange-400"
                        )}
                      >
                        {service.availability}
                      </span>
                    </div>
                  </td>

                  {/* Staff */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {service.staff.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold px-1.5 py-0.5"
                        >
                          {s}
                        </span>
                      ))}
                      {service.staffCount > 0 && (
                        <span className="text-[10px] text-[#666]">
                          +{service.staffCount}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Bookings */}
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm text-[#ccc] font-medium">
                      {service.bookings}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-[#666]">
            Showing 1 to 7 of 18 services
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-md bg-gradient-to-b from-[#d4af37] to-[#b8960b] text-black text-xs font-semibold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-md bg-[#1a1a1a] border border-[#d4af37]/10 text-[#888] text-xs font-medium flex items-center justify-center hover:border-[#d4af37]/25 transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded-md bg-[#1a1a1a] border border-[#d4af37]/10 text-[#888] text-xs font-medium flex items-center justify-center hover:border-[#d4af37]/25 transition-colors">
              3
            </button>
          </div>
        </div>
      </div>

      {/* ── Service Detail Sidebar ───────────────────────────────────── */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            key="detail-panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-[340px] flex-shrink-0"
          >
            <div className="premium-panel rounded-xl overflow-hidden">
              <div className="p-5 max-h-[calc(100vh-3rem)] overflow-y-auto">
                {/* Header */}
                <div className="relative mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">
                      {selectedService.name}
                    </h2>
                    {selectedService.featured && (
                      <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedServiceId(null)}
                    className="absolute top-0 right-0 w-7 h-7 rounded-lg bg-[#1e1e1e] border border-[#d4af37]/10 flex items-center justify-center text-[#888] hover:text-white hover:border-[#d4af37]/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-[#999] italic mb-5">
                  {selectedService.description}
                </p>

                {/* Service Details */}
                <div className="mb-5">
                  <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase mb-3">
                    Service Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Duration", value: selectedService.duration },
                      { label: "Price", value: selectedService.price },
                      { label: "Buffer Time", value: "15 min" },
                      { label: "Min. Notice", value: "2 hrs" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-[#0e0e0e] rounded-lg p-3"
                      >
                        <div className="text-[10px] text-[#666] uppercase mb-1">
                          {item.label}
                        </div>
                        <div className="text-sm text-white font-medium">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Tiers */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase">
                      Pricing Tiers
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-[#0e0e0e] rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">
                          Standard
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-white font-semibold">
                          $120
                        </span>
                        <span className="text-[10px] text-[#666] ml-2">
                          60 min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#0e0e0e] rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="text-sm text-white font-medium">
                          Priority
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-white font-semibold">
                          $180
                        </span>
                        <span className="text-[10px] text-[#666] ml-2">
                          60 min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#0e0e0e] rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="text-sm text-white font-medium">
                          Executive
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-white font-semibold">
                          $250
                        </span>
                        <span className="text-[10px] text-[#666] ml-2">
                          60 min
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs text-[#d4af37] cursor-pointer hover:text-[#ebd08f] transition-colors py-1">
                      <Plus className="w-3.5 h-3.5" />
                      Add Tier
                    </button>
                  </div>
                </div>

                {/* Assigned Staff */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase">
                      Assigned Staff
                    </h3>
                    <PremiumButton variant="ghost" size="sm">
                      Manage
                    </PremiumButton>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["SA", "SB", "SC", "SD", "SE"].map((s) => (
                      <span
                        key={s}
                        className="rounded bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold px-1.5 py-0.5"
                      >
                        {s}
                      </span>
                    ))}
                    <button className="rounded bg-[#1a1a1a] border border-[#d4af37]/10 text-[#666] text-[10px] font-medium px-1.5 py-0.5 hover:border-[#d4af37]/25 hover:text-[#d4af37] transition-colors cursor-pointer">
                      <Plus className="w-3 h-3 inline-block" />
                    </button>
                  </div>
                </div>

                {/* Resources */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase">
                      Resources
                    </h3>
                    <PremiumButton variant="ghost" size="sm">
                      Manage
                    </PremiumButton>
                  </div>
                  <div className="space-y-1.5">
                    {["Conference Room A", "Projector", "Whiteboard"].map(
                      (r) => (
                        <div
                          key={r}
                          className="text-xs text-[#aaa] bg-[#0e0e0e] rounded-md px-3 py-2"
                        >
                          {r}
                        </div>
                      )
                    )}
                    <span className="text-xs text-[#666]">+2 more</span>
                  </div>
                </div>

                {/* Available Hours */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase">
                      Available Hours
                    </h3>
                    <PremiumButton variant="ghost" size="sm">
                      Edit
                    </PremiumButton>
                  </div>
                  <div className="bg-[#0e0e0e] rounded-lg px-3 py-2.5">
                    <p className="text-sm text-white">
                      Mon — Fri, 9:00 AM – 6:00 PM
                    </p>
                    <button className="text-xs text-[#d4af37] mt-1 cursor-pointer hover:text-[#ebd08f] transition-colors">
                      Custom
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-[#d4af37]/8">
                  <PremiumButton variant="primary" size="md" className="w-full">
                    <Pencil className="w-4 h-4" />
                    Edit Service
                  </PremiumButton>
                  <PremiumButton variant="secondary" size="md" className="w-full">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </PremiumButton>
                  <PremiumButton
                    variant="ghost"
                    size="md"
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Archive
                  </PremiumButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}