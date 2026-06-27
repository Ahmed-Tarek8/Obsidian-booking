"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/dashboard/PremiumButton";
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
  MoreHorizontal,
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

// ── Types ────────────────────────────────────────────────────────────────

type StaffStatus = "Active" | "On Leave" | "Day Off";
type StaffRole = "Manager" | "Consultant" | "Specialist" | "Support" | "Coordinator";

interface StaffMember {
  id: string;
  initials: string;
  name: string;
  role: StaffRole;
  availableToday: string;
  upcomingBookings: number;
  nextBookingTime: string;
  rating: number;
  reviewCount: number;
  revenueMTD: string;
  hoursWorked: string;
  status: StaffStatus;
  skills: string[];
  assignedServices: { name: string; price: string }[];
  email: string;
  phone: string;
  location: string;
  weeklyHours: { day: string; hours: string; active: boolean }[];
}

// ── Data ─────────────────────────────────────────────────────────────────

const staffMembers: StaffMember[] = [
  {
    id: "sc",
    initials: "SC",
    name: "Staff C",
    role: "Manager",
    availableToday: "8:00 AM – 6:00 PM",
    upcomingBookings: 6,
    nextBookingTime: "10:30 AM",
    rating: 4.9,
    reviewCount: 124,
    revenueMTD: "$6,420",
    hoursWorked: "12.4 hrs",
    status: "Active",
    skills: ["Consultation", "Client Relations", "Problem Solving"],
    assignedServices: [
      { name: "Executive Consultation", price: "$150" },
      { name: "Premium Consultation", price: "$120" },
      { name: "Strategic Session", price: "$130" },
      { name: "Project Review", price: "$130" },
    ],
    email: "staff.c@obsidian.com",
    phone: "+1 (555) 123-4567",
    location: "Studio A – Executive Suite",
    weeklyHours: [
      { day: "MON", hours: "8–6", active: true },
      { day: "TUE", hours: "9–7", active: true },
      { day: "WED", hours: "8–6", active: true },
      { day: "THU", hours: "8–6", active: true },
      { day: "FRI", hours: "9–5", active: true },
      { day: "SAT", hours: "9–5", active: true },
      { day: "SUN", hours: "9–5", active: false },
    ],
  },
  {
    id: "sa",
    initials: "SA",
    name: "Staff A",
    role: "Consultant",
    availableToday: "9:00 AM – 7:00 PM",
    upcomingBookings: 5,
    nextBookingTime: "11:15 AM",
    rating: 4.8,
    reviewCount: 98,
    revenueMTD: "$4,980",
    hoursWorked: "10.1 hrs",
    status: "Active",
    skills: ["Strategic Planning", "Data Analysis", "Presentation"],
    assignedServices: [
      { name: "Consultation", price: "$120" },
      { name: "Strategy Session", price: "$250" },
      { name: "Review Meeting", price: "$130" },
    ],
    email: "staff.a@obsidian.com",
    phone: "+1 (555) 234-5678",
    location: "Studio B – Consultation Room",
    weeklyHours: [
      { day: "MON", hours: "9–7", active: true },
      { day: "TUE", hours: "9–7", active: true },
      { day: "WED", hours: "9–7", active: true },
      { day: "THU", hours: "9–5", active: true },
      { day: "FRI", hours: "9–5", active: true },
      { day: "SAT", hours: "10–4", active: true },
      { day: "SUN", hours: "—", active: false },
    ],
  },
  {
    id: "sb",
    initials: "SB",
    name: "Staff B",
    role: "Specialist",
    availableToday: "10:00 AM – 8:00 PM",
    upcomingBookings: 7,
    nextBookingTime: "12:00 PM",
    rating: 4.7,
    reviewCount: 108,
    revenueMTD: "$4,215",
    hoursWorked: "9.3 hrs",
    status: "Active",
    skills: ["Technical Assessment", "Implementation", "Quality Assurance"],
    assignedServices: [
      { name: "Deep Dive Session", price: "$180" },
      { name: "Technical Review", price: "$140" },
      { name: "Equipment Booking", price: "$90" },
    ],
    email: "staff.b@obsidian.com",
    phone: "+1 (555) 345-6789",
    location: "Studio C – Specialist Bay",
    weeklyHours: [
      { day: "MON", hours: "10–8", active: true },
      { day: "TUE", hours: "10–8", active: true },
      { day: "WED", hours: "10–8", active: true },
      { day: "THU", hours: "10–8", active: true },
      { day: "FRI", hours: "10–6", active: true },
      { day: "SAT", hours: "10–4", active: true },
      { day: "SUN", hours: "—", active: false },
    ],
  },
  {
    id: "sd",
    initials: "SD",
    name: "Staff D",
    role: "Support",
    availableToday: "9:00 AM – 6:00 PM",
    upcomingBookings: 3,
    nextBookingTime: "2:00 PM",
    rating: 4.6,
    reviewCount: 96,
    revenueMTD: "$2,310",
    hoursWorked: "6.8 hrs",
    status: "Active",
    skills: ["Customer Support", "Scheduling", "Documentation"],
    assignedServices: [
      { name: "Onboarding Session", price: "$80" },
      { name: "Support Call", price: "$60" },
    ],
    email: "staff.d@obsidian.com",
    phone: "+1 (555) 456-7890",
    location: "Studio A – Front Desk",
    weeklyHours: [
      { day: "MON", hours: "9–6", active: true },
      { day: "TUE", hours: "9–6", active: true },
      { day: "WED", hours: "9–6", active: true },
      { day: "THU", hours: "9–6", active: true },
      { day: "FRI", hours: "9–6", active: true },
      { day: "SAT", hours: "10–2", active: false },
      { day: "SUN", hours: "—", active: false },
    ],
  },
  {
    id: "se",
    initials: "SE",
    name: "Staff E",
    role: "Coordinator",
    availableToday: "8:30 AM – 5:30 PM",
    upcomingBookings: 2,
    nextBookingTime: "1:30 PM",
    rating: 4.8,
    reviewCount: 72,
    revenueMTD: "$2,880",
    hoursWorked: "7.2 hrs",
    status: "Active",
    skills: ["Event Planning", "Team Coordination", "Logistics"],
    assignedServices: [
      { name: "Planning Review", price: "$100" },
      { name: "Workspace Tour", price: "$50" },
      { name: "Team Workshop", price: "$200" },
    ],
    email: "staff.e@obsidian.com",
    phone: "+1 (555) 567-8901",
    location: "Studio B – Coordination Office",
    weeklyHours: [
      { day: "MON", hours: "8:30–5:30", active: true },
      { day: "TUE", hours: "8:30–5:30", active: true },
      { day: "WED", hours: "8:30–5:30", active: true },
      { day: "THU", hours: "8:30–5:30", active: true },
      { day: "FRI", hours: "8:30–5:30", active: true },
      { day: "SAT", hours: "—", active: false },
      { day: "SUN", hours: "—", active: false },
    ],
  },
  {
    id: "sf",
    initials: "SF",
    name: "Staff F",
    role: "Specialist",
    availableToday: "12:00 PM – 9:00 PM",
    upcomingBookings: 4,
    nextBookingTime: "3:30 PM",
    rating: 4.7,
    reviewCount: 51,
    revenueMTD: "$2,880",
    hoursWorked: "6.2 hrs",
    status: "Active",
    skills: ["Creative Direction", "Brand Strategy", "Visual Design"],
    assignedServices: [
      { name: "Creative Session", price: "$160" },
      { name: "Brand Consultation", price: "$130" },
    ],
    email: "staff.f@obsidian.com",
    phone: "+1 (555) 678-9012",
    location: "Studio D – Creative Lab",
    weeklyHours: [
      { day: "MON", hours: "12–9", active: true },
      { day: "TUE", hours: "12–9", active: true },
      { day: "WED", hours: "12–9", active: true },
      { day: "THU", hours: "12–9", active: true },
      { day: "FRI", hours: "12–9", active: true },
      { day: "SAT", hours: "—", active: false },
      { day: "SUN", hours: "—", active: false },
    ],
  },
  {
    id: "sg",
    initials: "SG",
    name: "Staff G",
    role: "Consultant",
    availableToday: "Day Off",
    upcomingBookings: 0,
    nextBookingTime: "—",
    rating: 4.5,
    reviewCount: 38,
    revenueMTD: "$1,250",
    hoursWorked: "3.1 hrs",
    status: "On Leave",
    skills: ["Financial Analysis", "Risk Assessment", "Compliance"],
    assignedServices: [
      { name: "Financial Review", price: "$150" },
      { name: "Risk Assessment", price: "$120" },
    ],
    email: "staff.g@obsidian.com",
    phone: "+1 (555) 789-0123",
    location: "Studio A – Executive Suite",
    weeklyHours: [
      { day: "MON", hours: "—", active: false },
      { day: "TUE", hours: "—", active: false },
      { day: "WED", hours: "—", active: false },
      { day: "THU", hours: "—", active: false },
      { day: "FRI", hours: "—", active: false },
      { day: "SAT", hours: "—", active: false },
      { day: "SUN", hours: "—", active: false },
    ],
  },
  {
    id: "sh",
    initials: "SH",
    name: "Staff H",
    role: "Support",
    availableToday: "9:00 AM – 6:00 PM",
    upcomingBookings: 1,
    nextBookingTime: "4:15 PM",
    rating: 4.6,
    reviewCount: 29,
    revenueMTD: "$1,050",
    hoursWorked: "2.7 hrs",
    status: "Active",
    skills: ["Client Onboarding", "Admin Support", "Data Entry"],
    assignedServices: [
      { name: "Onboarding Session", price: "$80" },
      { name: "General Inquiry", price: "$40" },
    ],
    email: "staff.h@obsidian.com",
    phone: "+1 (555) 890-1234",
    location: "Studio A – Front Desk",
    weeklyHours: [
      { day: "MON", hours: "9–6", active: true },
      { day: "TUE", hours: "9–6", active: true },
      { day: "WED", hours: "9–6", active: true },
      { day: "THU", hours: "9–6", active: true },
      { day: "FRI", hours: "9–6", active: true },
      { day: "SAT", hours: "9–1", active: true },
      { day: "SUN", hours: "—", active: false },
    ],
  },
];

// ── Stat Cards ───────────────────────────────────────────────────────────

const stats = [
  {
    label: "TEAM MEMBERS",
    value: "18",
    trend: "+ 2 vs last month",
    icon: Users,
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
  },
  {
    label: "AVAILABLE TODAY",
    value: "12",
    trend: "+ 3 vs yesterday",
    icon: UserCheck,
    color: "text-[#d4af37]",
    bgIcon: "bg-[#d4af37]/10",
  },
  {
    label: "UTILIZATION (WTD)",
    value: "87%",
    trend: "+ 8% vs last week",
    icon: TrendingUp,
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
  },
  {
    label: "AVG RATING",
    value: "4.8",
    trend: "+ 0.2 vs last week",
    icon: Star,
    color: "text-[#d4af37]",
    bgIcon: "bg-[#d4af37]/10",
  },
];

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
  "Data Analysis": BarChartIcon,
  Presentation: Eye,
  "Technical Assessment": Briefcase,
  Implementation: Pencil,
  "Quality Assurance": Star,
  "Customer Support": MessageSquare,
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
  "Admin Support": MessageSquare,
  "Data Entry": Pencil,
};

function BarChartIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────

export function StaffPage() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = staffMembers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

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

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#e0e0e0] tracking-wide">Staff</h1>
          <p className="text-sm text-[#777] mt-0.5">Manage your team members, roles, and schedules.</p>
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
                <p className="text-2xl font-bold text-[#e0e0e0] mt-1.5">{stat.value}</p>
              </div>
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", stat.bgIcon)}>
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="premium-input w-full pl-9 pr-4 py-2 rounded-lg text-sm text-[#e0e0e0] placeholder:text-[#555] outline-none"
            />
          </div>
          {["All Roles", "All Statuses", "All Locations"].map((filter) => (
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
                  {paginated.map((member, i) => {
                    const isSelected = selectedStaff?.id === member.id;
                    const statusConf = staffStatusConfig[member.status];
                    return (
                      <motion.tr
                        key={member.id}
                        variants={item}
                        onClick={() => setSelectedStaff(member)}
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
                        <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">{member.role}</td>
                        <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">
                          {member.status === "On Leave" ? (
                            <span className="text-orange-400/80 italic">Day Off</span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-[#555]" />
                              {member.availableToday}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-[#e0e0e0] font-medium">{member.upcomingBookings}</div>
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
                            <span className="text-[#666] font-normal">({member.reviewCount})</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-xs text-[#e0e0e0] font-medium">{member.revenueMTD}</div>
                          <div className="text-[10px] text-[#666]">{member.hoursWorked}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                              statusConf.chipClass
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", statusConf.dotClass)} />
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
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} staff members
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
          {selectedStaff && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                      <h3 className="text-base font-bold text-[#e0e0e0]">{selectedStaff.name}</h3>
                      <p className="text-xs text-[#888]">{selectedStaff.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStaff(null)}
                    className="p-1 rounded-md text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all duration-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-[#d4af37] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                    {selectedStaff.rating} ({selectedStaff.reviewCount} reviews)
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      staffStatusConfig[selectedStaff.status].chipClass
                    )}
                  >
                    <span
                      className={cn("w-1.5 h-1.5 rounded-full", staffStatusConfig[selectedStaff.status].dotClass)}
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
                    <PremiumButton key={btn.label} variant="ghost" size="sm" className="flex-col gap-1 py-2.5 text-[10px]">
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
                  <PremiumButton variant="ghost" size="sm" className="text-[10px]">
                    <Pencil className="w-3 h-3" />
                    Edit
                  </PremiumButton>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {selectedStaff.weeklyHours.map((day) => (
                    <div
                      key={day.day}
                      className={cn(
                        "text-center rounded-md py-2 transition-all duration-200",
                        day.active
                          ? "bg-[#d4af37]/5 border border-[#d4af37]/10"
                          : "bg-[#0e0e0e] border border-transparent opacity-40"
                      )}
                    >
                      <p className="text-[9px] font-semibold text-[#666] uppercase">{day.day}</p>
                      <p className={cn("text-[10px] font-medium mt-0.5", day.active ? "text-[#d4af37]" : "text-[#555]")}>
                        {day.hours}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[10px] text-[#666]">
                    {selectedStaff.upcomingBookings} bookings &middot;{" "}
                    {selectedStaff.upcomingBookings > 5 ? "87" : selectedStaff.upcomingBookings > 3 ? "72" : "45"}% booked
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
                  <PremiumButton variant="ghost" size="sm" className="text-[10px]">
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
                  <PremiumButton variant="ghost" size="sm" className="text-[10px]">
                    Manage
                  </PremiumButton>
                </div>
                <div className="space-y-2">
                  {selectedStaff.assignedServices.map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0e0e0e]/60 border border-[#d4af37]/5"
                    >
                      <span className="text-xs text-[#b0b0b0]">{service.name}</span>
                      <span className="text-xs font-medium text-[#d4af37]">{service.price}</span>
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
                  <PremiumButton variant="ghost" size="sm" className="text-[10px]">
                    <Pencil className="w-3 h-3" />
                    Edit
                  </PremiumButton>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">{selectedStaff.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">{selectedStaff.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-[#555]" />
                    <span className="text-xs text-[#b0b0b0]">{selectedStaff.location}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex gap-2">
                <PremiumButton variant="primary" size="sm" className="flex-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  Assign Booking
                </PremiumButton>
                <PremiumButton variant="secondary" size="sm" className="flex-1">
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