"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/dashboard/PremiumButton";
import { useBookingStore, formatCurrency, formatTime12 } from "@/lib/store";
import type { StaffRole, StaffStatus } from "@/lib/types";
import {
  Users,
  UserCheck,
  TrendingUp,
  Star,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  MessageSquare,
  UserPlus,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Clock,
  Zap,
  Handshake,
  Puzzle,
  ChevronDown,
  Eye,
  Briefcase,
} from "lucide-react";

// ── Status chip config ──────────────────────────────────────────────────

const staffStatusConfig: Record<StaffStatus, { dotClass: string; chipClass: string }> = {
  Active: {
    dotClass: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    chipClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  },
  "On Leave": {
    dotClass: "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.4)]",
    chipClass: "text-orange-400 border-orange-500/20 bg-orange-500/5",
  },
  "Day Off": {
    dotClass: "bg-[#888] shadow-[0_0_4px_rgba(136,136,136,0.3)]",
    chipClass: "text-[#888] border-[#555]/30 bg-[#555]/10",
  },
};

// ── Skill icon map ───────────────────────────────────────────────────────

const skillIconMap: Record<string, React.ElementType> = {
  Consultation: Zap,
  "Client Relations": Handshake,
  "Problem Solving": Puzzle,
  "Strategic Planning": TrendingUp,
  "Data Analysis": Eye,
  Presentation: Eye,
  "Technical Assessment": Briefcase,
  Implementation: Pencil,
  "Quality Assurance": Star,
  "Customer Support": MessageSquare,
  Support: MessageSquare,
  Scheduling: Calendar,
  Documentation: Pencil,
  "Event Planning": Calendar,
  "Team Coordination": Users,
  Logistics: Briefcase,
  "Creative Direction": Star,
  "Brand Strategy": TrendingUp,
  "Visual Design": Eye,
  "Financial Analysis": TrendingUp,
  "Risk Assessment": Star,
  Compliance: Briefcase,
  "Client Onboarding": Users,
  Onboarding: Users,
  "Admin Support": MessageSquare,
  Admin: MessageSquare,
  "Data Entry": Pencil,
  Strategy: TrendingUp,
  Leadership: Users,
  "Project Management": Briefcase,
  Consulting: Zap,
  Finance: TrendingUp,
  Analysis: Eye,
  "Portfolio Review": Briefcase,
  "Quick Sync": Zap,
};

// ── Helpers ──────────────────────────────────────────────────────────────

function compactTime(t: string): string {
  const match = t.match(/^(\d+):/);
  return match ? match[1] : t;
}

// ── Filter Dropdown ─────────────────────────────────────────────────────

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-[#888] bg-[#161616] border border-[#d4af37]/8 hover:border-[#d4af37]/20 hover:text-[#b0b0b0] transition-all duration-200 cursor-pointer"
      >
        {value}
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform duration-200",
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
            className="absolute top-full left-0 mt-1 z-50 min-w-[180px] premium-panel rounded-lg overflow-hidden shadow-xl border border-[#d4af37]/10"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onMouseDown={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3.5 py-2 text-xs transition-all duration-150 cursor-pointer",
                  value === opt
                    ? "text-[#d4af37] bg-[#d4af37]/5"
                    : "text-[#888] hover:text-[#b0b0b0] hover:bg-[#161616]"
                )}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Animation variants ──────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ── Component ────────────────────────────────────────────────────────────

export function StaffPage() {
  const { staff, appointments, services } = useBookingStore();

  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // ── Derive per-staff computed data ───────────────────────────────────

  const staffDerived = useMemo(() => {
    const now = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayName = dayNames[now.getDay()];
    const activeApptStatuses = new Set(["confirmed", "pending", "arrived"]);

    return staff.map((s) => {
      // Upcoming bookings: non-terminal statuses
      const staffAppts = appointments.filter(
        (a) => a.staffId === s.id && activeApptStatuses.has(a.status)
      );

      // Sort by date+startTime to find next booking
      const sorted = [...staffAppts].sort((a, b) => {
        const aTime = new Date(`${a.date}T${a.startTime}`).getTime();
        const bTime = new Date(`${b.date}T${b.startTime}`).getTime();
        return aTime - bTime;
      });

      const upcomingBookings = staffAppts.length;
      const nextBookingTime =
        sorted.length > 0 ? formatTime12(sorted[0].startTime) : "—";

      // Available today from weeklyHours
      const todayEntry = s.weeklyHours.find((w) => w.day === todayName);
      let availableToday: string;
      if (s.status === "On Leave") {
        availableToday = "On Leave";
      } else if (s.status === "Day Off") {
        availableToday = "Day Off";
      } else if (todayEntry?.active) {
        availableToday = `${todayEntry.start} – ${todayEntry.end}`;
      } else {
        availableToday = "Day Off";
      }

      // Assigned services from services array
      const assignedServices = services
        .filter((svc) => svc.staffIds.includes(s.id))
        .map((svc) => ({ name: svc.name, price: formatCurrency(svc.price) }));

      // Weekly hours with display-ready format
      const weeklyDisplay = s.weeklyHours.map((w) => ({
        day: w.day.toUpperCase(),
        hours: w.active
          ? `${compactTime(w.start)}–${compactTime(w.end)}`
          : "—",
        active: w.active,
      }));

      return {
        ...s,
        upcomingBookings,
        nextBookingTime,
        availableToday,
        assignedServices,
        weeklyDisplay,
      };
    });
  }, [staff, appointments, services]);

  // ── Stat cards computed from real data ───────────────────────────────

  const stats = useMemo(() => {
    const activeCount = staff.filter((s) => s.status === "Active").length;
    const avgRating =
      staff.length > 0
        ? (staff.reduce((sum, s) => sum + s.rating, 0) / staff.length).toFixed(1)
        : "0.0";
    const totalRevenue = staff.reduce((sum, s) => sum + s.revenueMTD, 0);
    const totalUpcoming = staffDerived.reduce(
      (sum, s) => sum + s.upcomingBookings,
      0
    );
    const totalReviews = staff.reduce((sum, s) => sum + s.reviewCount, 0);
    const uniqueRoles = new Set(staff.map((s) => s.role)).size;

    return [
      {
        label: "TEAM MEMBERS",
        value: String(staff.length),
        trend: `${uniqueRoles} roles`,
        icon: Users,
        color: "text-amber-500",
        bgIcon: "bg-amber-500/10",
      },
      {
        label: "AVAILABLE TODAY",
        value: String(activeCount),
        trend: `of ${staff.length} total`,
        icon: UserCheck,
        color: "text-[#d4af37]",
        bgIcon: "bg-[#d4af37]/10",
      },
      {
        label: "REVENUE (MTD)",
        value: formatCurrency(totalRevenue),
        trend: `${totalUpcoming} upcoming bookings`,
        icon: TrendingUp,
        color: "text-amber-500",
        bgIcon: "bg-amber-500/10",
      },
      {
        label: "AVG RATING",
        value: avgRating,
        trend: `${totalReviews} total reviews`,
        icon: Star,
        color: "text-[#d4af37]",
        bgIcon: "bg-[#d4af37]/10",
      },
    ];
  }, [staff, staffDerived]);

  // ── Filter options ───────────────────────────────────────────────────

  const uniqueRoles = useMemo(
    () => ["All Roles", ...new Set(staff.map((s) => s.role))],
    [staff]
  );
  const uniqueStatuses = useMemo(
    () => ["All Statuses", ...new Set(staff.map((s) => s.status))],
    [staff]
  );

  // ── Filtered list ────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return staffDerived.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === "" ||
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.skills.some((sk) => sk.toLowerCase().includes(q));
      const matchesRole = roleFilter === "All Roles" || s.role === roleFilter;
      const matchesStatus =
        statusFilter === "All Statuses" || s.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffDerived, searchQuery, roleFilter, statusFilter]);

  // ── Pagination ───────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // ── Selected staff detail data ───────────────────────────────────────

  const selectedStaff = useMemo(
    () =>
      selectedStaffId
        ? staffDerived.find((s) => s.id === selectedStaffId) ?? null
        : null,
    [selectedStaffId, staffDerived]
  );

  // Reset page when filters change
  const handleSearchChange = (v: string) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };
  const handleRoleChange = (v: string) => {
    setRoleFilter(v);
    setCurrentPage(1);
  };
  const handleStatusChange = (v: string) => {
    setStatusFilter(v);
    setCurrentPage(1);
  };

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e0e0e0] tracking-wide">
            Staff
          </h1>
          <p className="text-sm text-[#777] mt-0.5">
            Manage your team members, roles, and schedules.
          </p>
        </div>
        <PremiumButton variant="primary" size="sm">
          <UserPlus className="w-3.5 h-3.5" />
          Add Staff
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
                <p className="text-2xl font-bold text-[#e0e0e0] mt-1.5">
                  {stat.value}
                </p>
              </div>
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  stat.bgIcon
                )}
              >
                <stat.icon className={cn("w-4.5 h-4.5", stat.color)} />
              </div>
            </div>
            <p className="text-xs text-emerald-400 mt-2.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {stat.trend}
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
              placeholder="Search staff by name, role, or skill..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="premium-input w-full pl-9 pr-4 py-2 rounded-lg text-sm text-[#e0e0e0] placeholder:text-[#555] outline-none"
            />
          </div>
          <FilterDropdown
            label="Role"
            options={uniqueRoles}
            value={roleFilter}
            onChange={handleRoleChange}
          />
          <FilterDropdown
            label="Status"
            options={uniqueStatuses}
            value={statusFilter}
            onChange={handleStatusChange}
          />
          <button
            className="p-2 rounded-lg text-[#888] bg-[#161616] border border-[#d4af37]/8 hover:border-[#d4af37]/20 hover:text-[#d4af37] transition-all duration-200 cursor-pointer"
          >
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
                    {[
                      "Staff Member",
                      "Role",
                      "Available Today",
                      "Upcoming",
                      "Rating",
                      "Revenue (MTD)",
                      "Status",
                    ].map((h) => (
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
                  {paginated.map((member) => {
                    const isSelected = selectedStaffId === member.id;
                    const statusConf = staffStatusConfig[member.status];
                    return (
                      <motion.tr
                        key={member.id}
                        variants={item}
                        onClick={() => setSelectedStaffId(member.id)}
                        className={cn(
                          "border-b border-[#d4af37]/5 last:border-0 cursor-pointer transition-all duration-200",
                          isSelected
                            ? "bg-[#d4af37]/5"
                            : "hover:bg-[#161616]/80"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#d4af37]/15 flex items-center justify-center text-xs font-bold text-[#d4af37] flex-shrink-0">
                              {member.initials}
                            </div>
                            <span className="text-sm font-medium text-[#e0e0e0] whitespace-nowrap">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">
                          {member.role}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">
                          {member.status === "On Leave" ||
                          member.status === "Day Off" ||
                          member.availableToday === "Day Off" ? (
                            <span className="text-orange-400/80 italic">
                              Day Off
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-[#555]" />
                              {member.availableToday}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-[#e0e0e0] font-medium">
                            {member.upcomingBookings}
                          </div>
                          {member.nextBookingTime !== "—" && (
                            <div className="text-[10px] text-[#666]">
                              Next: {member.nextBookingTime}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs text-[#e0e0e0] font-medium flex items-center gap-1">
                            {member.rating}
                            <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
                            <span className="text-[#666] font-normal">
                              ({member.reviewCount})
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-[#e0e0e0] font-medium">
                            {formatCurrency(member.revenueMTD)}
                          </div>
                          <div className="text-[10px] text-[#666]">
                            {member.hoursWorked}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                              statusConf.chipClass
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                statusConf.dotClass
                              )}
                            />
                            {member.status}
                          </span>
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
                Showing{" "}
                {filtered.length === 0
                  ? 0
                  : (currentPage - 1) * perPage + 1}{" "}
                to {Math.min(currentPage * perPage, filtered.length)} of{" "}
                {filtered.length} staff members
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md text-[#555] hover:text-[#d4af37] hover:bg-[#161616] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, i) => i + 1
                ).map((p) => (
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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
          {selectedStaff && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-[340px] flex-shrink-0 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]"
            >
              {/* Header Card */}
              <div className="premium-panel rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#d4af37]/20 flex items-center justify-center text-sm font-bold text-[#d4af37]">
                      {selectedStaff.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#e0e0e0]">
                        {selectedStaff.name}
                      </h3>
                      <p className="text-xs text-[#888]">
                        {selectedStaff.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStaffId(null)}
                    className="p-1 rounded-md text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all duration-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-[#d4af37] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                    {selectedStaff.rating} ({selectedStaff.reviewCount}{" "}
                    reviews)
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      staffStatusConfig[selectedStaff.status].chipClass
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        staffStatusConfig[selectedStaff.status].dotClass
                      )}
                    />
                    {selectedStaff.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-1">
                  {[
                    { icon: Calendar, label: "View Schedule" },
                    { icon: MessageSquare, label: "Message" },
                    { icon: UserPlus, label: "Assign" },
                  ].map((btn) => (
                    <PremiumButton
                      key={btn.label}
                      variant="ghost"
                      size="sm"
                      className="flex-col gap-1 py-2.5 text-[10px]"
                    >
                      <btn.icon className="w-3.5 h-3.5" />
                      {btn.label}
                    </PremiumButton>
                  ))}
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="premium-panel rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase">
                    Weekly Schedule
                  </p>
                  <PremiumButton
                    variant="ghost"
                    size="sm"
                    className="text-[10px]"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </PremiumButton>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {selectedStaff.weeklyDisplay.map((day) => (
                    <div
                      key={day.day}
                      className={cn(
                        "text-center rounded-md py-2 transition-all duration-200",
                        day.active
                          ? "bg-[#d4af37]/5 border border-[#d4af37]/10"
                          : "bg-[#0e0e0e] border border-transparent opacity-40"
                      )}
                    >
                      <p className="text-[9px] font-semibold text-[#666] uppercase">
                        {day.day}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] font-medium mt-0.5",
                          day.active ? "text-[#d4af37]" : "text-[#555]"
                        )}
                      >
                        {day.hours}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[10px] text-[#666]">
                    {selectedStaff.upcomingBookings} bookings &middot;{" "}
                    {selectedStaff.upcomingBookings > 5
                      ? "87"
                      : selectedStaff.upcomingBookings > 3
                        ? "72"
                        : "45"}
                    % booked
                  </p>
                  <button className="text-[10px] text-[#d4af37] hover:text-[#ebd08f] transition-colors duration-200 cursor-pointer flex items-center gap-0.5">
                    View Full Schedule
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="premium-panel rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase">
                    Skills
                  </p>
                  <PremiumButton
                    variant="ghost"
                    size="sm"
                    className="text-[10px]"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </PremiumButton>
                </div>
                <div className="space-y-2">
                  {selectedStaff.skills.map((skill) => {
                    const SkillIcon = skillIconMap[skill] || Zap;
                    return (
                      <div
                        key={skill}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0e0e0e]/60 border border-[#d4af37]/5"
                      >
                        <SkillIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="text-xs text-[#b0b0b0]">{skill}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Services */}
              <div className="premium-panel rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase">
                    Assigned Services
                  </p>
                  <PremiumButton
                    variant="ghost"
                    size="sm"
                    className="text-[10px]"
                  >
                    Manage
                  </PremiumButton>
                </div>
                <div className="space-y-2">
                  {selectedStaff.assignedServices.map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0e0e0e]/60 border border-[#d4af37]/5"
                    >
                      <span className="text-xs text-[#b0b0b0]">
                        {service.name}
                      </span>
                      <span className="text-xs font-medium text-[#d4af37]">
                        {service.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="premium-panel rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-[#666] uppercase">
                    Contact Information
                  </p>
                  <PremiumButton
                    variant="ghost"
                    size="sm"
                    className="text-[10px]"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </PremiumButton>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">
                      {selectedStaff.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">
                      {selectedStaff.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">
                      {selectedStaff.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex gap-2">
                <PremiumButton
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Assign Booking
                </PremiumButton>
                <PremiumButton
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Profile
                </PremiumButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}