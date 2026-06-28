"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useBookingStore, formatCurrency } from "@/lib/store";
import { PremiumButton } from "@/components/dashboard/PremiumButton";
import { StatusChip } from "@/components/dashboard/StatusChip";
import {
  CalendarRange,
  Layers,
  FileText,
  Clock,
  Search,
  LayoutGrid,
  List,
  Star,
  X,
  Pencil,
  Copy,
  Trash2,
  Crown,
  Plus,
  Users,
  Filter,
} from "lucide-react";

// ── Category Color Mapping ─────────────────────────────────────────────
const categoryBadge: Record<string, string> = {
  purple:
    "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  blue: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  green:
    "bg-green-500/15 text-green-400 border border-green-500/20",
  amber:
    "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  red: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const availabilityDot: Record<string, string> = {
  Active: "bg-emerald-400",
  Limited: "bg-orange-400",
  Inactive: "bg-red-400",
};

const availabilityText: Record<string, string> = {
  Active: "text-emerald-400",
  Limited: "text-orange-400",
  Inactive: "text-red-400",
};

// ── Component ───────────────────────────────────────────────────────────
export function ServicesPage() {
  const services = useBookingStore((s) => s.services);
  const staff = useBookingStore((s) => s.staff);
  const appointments = useBookingStore((s) => s.appointments);
  const updateService = useBookingStore((s) => s.updateService);
  const addService = useBookingStore((s) => s.addService);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editDuration, setEditDuration] = useState(0);
  const [editAvailability, setEditAvailability] = useState<"Active" | "Limited" | "Inactive">("Active");

  const handleEditService = (svc: typeof services[0]) => {
    setEditName(svc.name);
    setEditDescription(svc.description);
    setEditPrice(svc.price);
    setEditDuration(svc.duration);
    setEditAvailability(svc.availability as "Active" | "Limited" | "Inactive");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedServiceId) return;
    updateService(selectedServiceId, {
      name: editName,
      description: editDescription,
      price: editPrice,
      duration: editDuration,
      availability: editAvailability,
    });
    setIsEditing(false);
  };

  const handleDuplicate = () => {
    if (!selectedServiceId) return;
    const svc = services.find((s) => s.id === selectedServiceId);
    if (!svc) return;
    addService({
      name: `${svc.name} Copy`,
      category: svc.category,
      categoryColor: svc.categoryColor,
      description: svc.description,
      duration: svc.duration,
      price: svc.price,
      availability: "Active",
      staffIds: svc.staffIds,
      featured: false,
    });
  };

  const handleArchive = () => {
    if (!selectedServiceId) return;
    updateService(selectedServiceId, { availability: "Inactive" });
    setSelectedServiceId(null);
  };

  // ── Computed: categories for filter dropdown ────────────────────────
  const categories = useMemo(
    () => [...new Set(services.map((s) => s.category))],
    [services]
  );

  // ── Computed: filtered services ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = services;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }

    if (categoryFilter !== "all") {
      list = list.filter((s) => s.category === categoryFilter);
    }

    if (availabilityFilter !== "all") {
      list = list.filter((s) => s.availability === availabilityFilter);
    }

    return list;
  }, [services, search, categoryFilter, availabilityFilter]);

  // ── Computed: stat cards ────────────────────────────────────────────
  const totalServices = services.length;
  const activeServices = services.filter(
    (s) => s.availability === "Active"
  ).length;
  const avgPrice =
    services.length > 0
      ? services.reduce((sum, s) => sum + s.price, 0) / services.length
      : 0;
  const totalBookings = services.reduce((sum, s) => sum + s.bookings, 0);

  // ── Most booked service ─────────────────────────────────────────────
  const mostBooked = useMemo(
    () =>
      services.reduce(
        (best, s) => (s.bookings > (best?.bookings ?? 0) ? s : best),
        services[0]
      ),
    [services]
  );

  // ── Selected service with resolved staff ────────────────────────────
  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [services, selectedServiceId]
  );

  const resolvedStaff = useMemo(() => {
    if (!selectedService) return [];
    return selectedService.staffIds
      .map((id) => staff.find((m) => m.id === id))
      .filter(Boolean) as (typeof staff)[number][];
  }, [selectedService, staff]);

  // ── Staff map for table ─────────────────────────────────────────────
  const staffMap = useMemo(() => {
    const m = new Map<string, (typeof staff)[number]>();
    staff.forEach((s) => m.set(s.id, s));
    return m;
  }, [staff]);

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
            transition={{
              duration: 0.5,
              delay: 0,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="premium-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/10">
                <CalendarRange
                  className="w-4 h-4 text-[#d4af37]"
                  strokeWidth={1.8}
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#e0e0e0] tracking-tight">
              {totalServices}
            </div>
            <div className="text-xs text-[#777] font-medium uppercase tracking-wider mt-1">
              TOTAL SERVICES
            </div>
            <div className="text-xs text-[#666] mt-2">
              Across {categories.length} categories
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="premium-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/10">
                <Layers
                  className="w-4 h-4 text-[#d4af37]"
                  strokeWidth={1.8}
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#e0e0e0] tracking-tight">
              {activeServices}
            </div>
            <div className="text-xs text-[#777] font-medium uppercase tracking-wider mt-1">
              ACTIVE SERVICES
            </div>
            <div className="text-xs text-[#666] mt-2">
              {totalServices > 0
                ? `${Math.round((activeServices / totalServices) * 100)}% of total`
                : "—"}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="premium-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/10">
                <FileText
                  className="w-4 h-4 text-[#d4af37]"
                  strokeWidth={1.8}
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#e0e0e0] tracking-tight">
              {formatCurrency(avgPrice)}
            </div>
            <div className="text-xs text-[#777] font-medium uppercase tracking-wider mt-1">
              AVG PRICE
            </div>
            <div className="text-xs text-[#666] mt-2">Per session</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="premium-panel rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/10">
                <Clock
                  className="w-4 h-4 text-[#d4af37]"
                  strokeWidth={1.8}
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#e0e0e0] tracking-tight">
              {totalBookings.toLocaleString()}
            </div>
            <div className="text-xs text-[#777] font-medium uppercase tracking-wider mt-1">
              TOTAL BOOKINGS
            </div>
            <div className="text-xs text-[#666] mt-2">
              {mostBooked
                ? `Top: ${mostBooked.name} (${mostBooked.bookings})`
                : "—"}
            </div>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mt-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#555] w-64 outline-none focus:border-[#d4af37]/30 transition-colors"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#aaa] w-40 outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#aaa] w-36 outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Limited">Limited</option>
            <option value="Inactive">Inactive</option>
          </select>

          <PremiumButton variant="secondary" size="sm">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </PremiumButton>

          <div className="ml-auto flex items-center border border-[#d4af37]/10 rounded-lg overflow-hidden">
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

        {/* ── List View ───────────────────────────────────────────────── */}
        {viewMode === "list" && (
          <>
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
                  {filtered.map((service) => (
                    <tr
                      key={service.id}
                      onClick={() =>
                        setSelectedServiceId(
                          selectedServiceId === service.id
                            ? null
                            : service.id
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
                            categoryBadge[service.categoryColor] ??
                              "bg-[#333]/30 text-[#888] border-[#333]/30"
                          )}
                        >
                          {service.category}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#ccc]">
                          <Clock className="w-3 h-3 text-[#888]" />
                          {service.duration} min
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="text-sm font-semibold text-white">
                          {formatCurrency(service.price)}
                        </div>
                      </td>

                      {/* Availability */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              availabilityDot[service.availability] ??
                                "bg-[#888]"
                            )}
                          />
                          <span
                            className={cn(
                              "text-xs",
                              availabilityText[service.availability] ??
                                "text-[#888]"
                            )}
                          >
                            {service.availability}
                          </span>
                        </div>
                      </td>

                      {/* Staff */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {service.staffIds.slice(0, 3).map((sid) => {
                            const member = staffMap.get(sid);
                            return member ? (
                              <span
                                key={sid}
                                className="rounded bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold px-1.5 py-0.5"
                              >
                                {member.initials}
                              </span>
                            ) : null;
                          })}
                          {service.staffIds.length > 3 && (
                            <span className="text-[10px] text-[#666]">
                              +{service.staffIds.length - 3}
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
                Showing {filtered.length} of {totalServices} services
              </span>
            </div>
          </>
        )}

        {/* ── Grid View ───────────────────────────────────────────────── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filtered.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() =>
                  setSelectedServiceId(
                    selectedServiceId === service.id ? null : service.id
                  )
                }
                className={cn(
                  "premium-panel rounded-xl p-5 cursor-pointer transition-colors",
                  "hover:border-[#d4af37]/25",
                  selectedServiceId === service.id &&
                    "border-[#d4af37]/40"
                )}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {service.name}
                    </h3>
                    {service.featured && (
                      <Star className="w-3 h-3 text-purple-400 fill-purple-400" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "inline-block rounded px-2 py-0.5 text-[10px] font-medium border",
                      categoryBadge[service.categoryColor] ??
                        "bg-[#333]/30 text-[#888] border-[#333]/30"
                    )}
                  >
                    {service.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#777] line-clamp-2 mb-4">
                  {service.description}
                </p>

                {/* Meta Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#ccc]">
                      <Clock className="w-3 h-3 text-[#888]" />
                      {service.duration}m
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        availabilityDot[service.availability] ??
                          "bg-[#888]"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[11px]",
                        availabilityText[service.availability] ??
                          "text-[#888]"
                      )}
                    >
                      {service.availability}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#d4af37]/8">
                  <div className="flex items-center gap-1">
                    {service.staffIds.slice(0, 3).map((sid) => {
                      const member = staffMap.get(sid);
                      return member ? (
                        <span
                          key={sid}
                          className="rounded bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold px-1.5 py-0.5"
                        >
                          {member.initials}
                        </span>
                      ) : null;
                    })}
                    {service.staffIds.length > 3 && (
                      <span className="text-[10px] text-[#666]">
                        +{service.staffIds.length - 3}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#888]">
                    {service.bookings} bookings
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Service Detail Sidebar ───────────────────────────────────── */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            key="detail-panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="w-[340px] flex-shrink-0"
          >
            <div className="premium-panel rounded-xl overflow-hidden">
              <div className="p-5 max-h-[calc(100vh-3rem)] overflow-y-auto">
                {/* Header */}
                <div className="relative mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-white">
                      {selectedService.name}
                    </h2>
                    {selectedService.featured && (
                      <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
                    )}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border",
                        selectedService.availability === "Active" &&
                          "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
                        selectedService.availability === "Limited" &&
                          "bg-orange-500/15 border-orange-500/20 text-orange-400",
                        selectedService.availability === "Inactive" &&
                          "bg-red-500/15 border-red-500/20 text-red-400"
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          availabilityDot[selectedService.availability]
                        )}
                      />
                      {selectedService.availability}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedServiceId(null)}
                    className="absolute top-0 right-0 w-7 h-7 rounded-lg bg-[#1e1e1e] border border-[#d4af37]/10 flex items-center justify-center text-[#888] hover:text-white hover:border-[#d4af37]/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                  <span
                    className={cn(
                      "inline-block rounded px-2.5 py-1 text-[11px] font-medium border",
                      categoryBadge[selectedService.categoryColor] ??
                        "bg-[#333]/30 text-[#888] border-[#333]/30"
                    )}
                  >
                    {selectedService.category}
                  </span>
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
                      {
                        label: "Duration",
                        value: `${selectedService.duration} min`,
                      },
                      {
                        label: "Price",
                        value: formatCurrency(selectedService.price),
                      },
                      {
                        label: "Bookings",
                        value: selectedService.bookings.toString(),
                      },
                      {
                        label: "Availability",
                        value: selectedService.availability,
                      },
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

                {/* Pricing Tiers (visual) */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase">
                      Pricing
                    </h3>
                  </div>
                  <div className="flex items-center justify-between bg-[#0e0e0e] rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">
                        Base Price
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-white font-semibold">
                        {formatCurrency(selectedService.price)}
                      </span>
                      <span className="text-[10px] text-[#666] ml-2">
                        {selectedService.duration} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assigned Staff */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase">
                      Assigned Staff
                    </h3>
                    
                  </div>
                  {resolvedStaff.length > 0 ? (
                    <div className="space-y-1.5">
                      {resolvedStaff.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 bg-[#0e0e0e] rounded-lg px-3 py-2.5"
                        >
                          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center text-[10px] font-bold text-[#d4af37]">
                            {member.initials}
                          </span>
                          <div>
                            <div className="text-sm text-white font-medium">
                              {member.name}
                            </div>
                            <div className="text-[11px] text-[#777]">
                              {member.role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-[#666] py-2">
                      No staff assigned
                    </div>
                  )}
                </div>

                {/* Available Hours */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase">
                      Available Hours
                    </h3>
                  </div>
                  <div className="bg-[#0e0e0e] rounded-lg px-3 py-2.5">
                    <p className="text-sm text-white">
                      Mon — Fri, 9:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-[#d4af37]/8">
                  <PremiumButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => handleEditService(selectedService)}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Service
                  </PremiumButton>
                  <PremiumButton
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={handleDuplicate}
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </PremiumButton>
                  <PremiumButton
                    variant="ghost"
                    size="md"
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={handleArchive}
                  >
                    <Trash2 className="w-4 h-4" />
                    Archive
                  </PremiumButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Service Modal */}
        {isEditing && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setIsEditing(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="relative w-full max-w-md premium-panel rounded-xl border border-[#d4af37]/15 shadow-[0_24px_48px_rgba(0,0,0,0.6)] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-[#e0e0e0] mb-4">Edit Service</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1">Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1">Description</label>
                  <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] focus:outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1">Price ($)</label>
                    <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1">Duration (min)</label>
                    <input type="number" value={editDuration} onChange={(e) => setEditDuration(Number(e.target.value))} className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1">Availability</label>
                  <select value={editAvailability} onChange={(e) => setEditAvailability(e.target.value as "Active" | "Limited" | "Inactive")} className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] focus:outline-none">
                    <option value="Active">Active</option>
                    <option value="Limited">Limited</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <PremiumButton variant="secondary" onClick={() => setIsEditing(false)}>Cancel</PremiumButton>
                <PremiumButton variant="primary" onClick={handleSaveEdit}>Save Changes</PremiumButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}