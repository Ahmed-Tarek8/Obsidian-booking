"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatCard } from "./StatCard";
import { PremiumButton } from "./PremiumButton";

import {
  FileText,
  Clock,
  Download,
  HardDrive,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  X,
  Star,
  CalendarClock,
  Share2,
  Trash2,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type ReportStatus = "completed" | "scheduled" | "generating" | "failed";
type ViewMode = "grid" | "list";

interface Report {
  id: string;
  name: string;
  starred: boolean;
  category: string;
  dateRange: string;
  format: string;
  owner: string;
  lastGenerated: string;
  schedule: string;
  status: ReportStatus;
}

// ── Static Data ──────────────────────────────────────────────────────────────

const reports: Report[] = [
  {
    id: "1",
    name: "Executive Summary",
    starred: true,
    category: "Business",
    dateRange: "Apr 1-30 2024",
    format: "PDF",
    owner: "SA",
    lastGenerated: "May 1 2024 8:12 AM",
    schedule: "Monthly",
    status: "completed",
  },
  {
    id: "2",
    name: "Client Activity Report",
    starred: false,
    category: "Clients",
    dateRange: "Apr 1-30 2024",
    format: "PDF",
    owner: "JB",
    lastGenerated: "Apr 30 2024 10:45 AM",
    schedule: "Weekly",
    status: "completed",
  },
  {
    id: "3",
    name: "Booking Utilization",
    starred: false,
    category: "Operations",
    dateRange: "Apr 1-30 2024",
    format: "XLSX",
    owner: "MG",
    lastGenerated: "Apr 30 2024 6:15 PM",
    schedule: "Weekly",
    status: "completed",
  },
  {
    id: "4",
    name: "Revenue Report",
    starred: false,
    category: "Finance",
    dateRange: "Mar 1-31 2024",
    format: "PDF",
    owner: "SA",
    lastGenerated: "Apr 1 2024 9:22 AM",
    schedule: "Monthly",
    status: "completed",
  },
  {
    id: "5",
    name: "Staff Performance",
    starred: false,
    category: "Team",
    dateRange: "Apr 1-30 2024",
    format: "PDF",
    owner: "HR",
    lastGenerated: "Apr 30 2024 2:22 PM",
    schedule: "Monthly",
    status: "completed",
  },
  {
    id: "6",
    name: "No Show & Cancellations",
    starred: false,
    category: "Operations",
    dateRange: "Apr 1-30 2024",
    format: "CSV",
    owner: "MG",
    lastGenerated: "Apr 30 2024 1:05 PM",
    schedule: "Weekly",
    status: "completed",
  },
  {
    id: "7",
    name: "Service Performance",
    starred: false,
    category: "Analytics",
    dateRange: "Apr 1-30 2024",
    format: "PDF",
    owner: "MG",
    lastGenerated: "—",
    schedule: "Weekly",
    status: "scheduled",
  },
  {
    id: "8",
    name: "Client Feedback Summary",
    starred: false,
    category: "Clients",
    dateRange: "Mar 1-31 2024",
    format: "PDF",
    owner: "JB",
    lastGenerated: "Apr 1 2024 11:30 AM",
    schedule: "Monthly",
    status: "completed",
  },
];

const reportHistory = [
  { date: "May 1, 2024 8:12 AM", status: "Completed", format: "PDF", size: "2.4 MB" },
  { date: "Apr 1, 2024 8:05 AM", status: "Completed", format: "PDF", size: "2.1 MB" },
  { date: "Mar 1, 2024 8:10 AM", status: "Completed", format: "PDF", size: "1.9 MB" },
];

const keyMetrics = [
  { label: "Total Revenue", value: "$32,450", change: "+12.5%", icon: DollarSign },
  { label: "Total Bookings", value: "487", change: "+8.2%", icon: BarChart3 },
  { label: "Active Clients", value: "156", change: "+5.1%", icon: Users },
  { label: "Avg. Booking Value", value: "$66.60", change: "+4.1%", icon: TrendingUp },
];

// ── Badge Configs ────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Business: "text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/20",
  Clients: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Operations: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Finance: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Team: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Analytics: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

const formatColors: Record<string, string> = {
  PDF: "text-red-400 bg-red-500/10 border-red-500/20",
  XLSX: "text-green-400 bg-green-500/10 border-green-500/20",
  CSV: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

// ── Report Status Badge ──────────────────────────────────────────────────────

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const config = {
    completed: { label: "Completed", cls: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-500" },
    scheduled: { label: "Scheduled", cls: "text-blue-400 border-blue-500/20 bg-blue-500/5", dot: "bg-blue-500" },
    generating: { label: "Generating", cls: "text-amber-400 border-amber-500/20 bg-amber-500/5", dot: "bg-amber-500" },
    failed: { label: "Failed", cls: "text-red-400 border-red-500/20 bg-red-500/5", dot: "bg-red-500" },
  };
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", c.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>("1");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage] = useState(1);

  const selectedReport = reports.find((r) => r.id === selectedReportId) ?? reports[0];

  return (
    <div className="space-y-5">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[#e0e0e0] tracking-tight">Reports</h1>
        <p className="text-sm text-[#666] mt-1">Generate, export, and schedule business reports.</p>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value="42"
          icon={FileText}
          change="18 this month"
          changeType="neutral"
          delay={0}
        />
        <StatCard
          title="Scheduled Reports"
          value="12"
          icon={Clock}
          change="2 this month"
          changeType="neutral"
          delay={0.05}
        />
        <StatCard
          title="Exports This Month"
          value="29"
          icon={Download}
          change="+55% last month"
          changeType="up"
          delay={0.1}
        />
        <StatCard
          title="Storage Used"
          value="68 GB"
          icon={HardDrive}
          change="42% of 160 GB"
          changeType="neutral"
          delay={0.15}
        />
      </div>

      {/* ── Search & Filters ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="premium-input w-full rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2">
          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[140px]">
            <option>All Categories</option>
            <option>Business</option>
            <option>Clients</option>
            <option>Operations</option>
            <option>Finance</option>
            <option>Team</option>
            <option>Analytics</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[120px]">
            <option>All Status</option>
            <option>Completed</option>
            <option>Scheduled</option>
            <option>Generating</option>
            <option>Failed</option>
          </select>
          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[120px]">
            <option>All Owners</option>
            <option>SA</option>
            <option>JB</option>
            <option>MG</option>
            <option>HR</option>
          </select>

          {/* Filters button */}
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

      {/* ── Main Content + Detail Panel ───────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Left: Table */}
        <div className="flex-1 min-w-0">
          <div className="premium-panel rounded-xl overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#d4af37]/8">
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">Report Name</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">Date Range</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">Format</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">Owner</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">Last Generated</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">Schedule</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider w-10" />
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, i) => {
                    const isSelected = selectedReportId === report.id;
                    return (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={() => setSelectedReportId(isSelected ? null : report.id)}
                        className={cn(
                          "border-b border-[#d4af37]/5 cursor-pointer transition-colors duration-150 group",
                          "bg-[#141414] hover:bg-[#1a1a1a]",
                          isSelected && "border-l-2 border-l-[#d4af37]/40 bg-[#1a1a1a]"
                        )}
                      >
                        {/* Report Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {report.starred && (
                              <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37] shrink-0" />
                            )}
                            <span className="text-sm text-white font-medium whitespace-nowrap">
                              {report.name}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-block px-2 py-0.5 rounded text-[10px] font-medium border",
                              categoryColors[report.category] ?? "bg-white/5 text-[#888] border-white/8"
                            )}
                          >
                            {report.category}
                          </span>
                        </td>

                        {/* Date Range */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#aaa] whitespace-nowrap">{report.dateRange}</span>
                        </td>

                        {/* Format */}
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-block px-2 py-0.5 rounded text-[10px] font-medium border",
                              formatColors[report.format] ?? "bg-white/5 text-[#888] border-white/8"
                            )}
                          >
                            {report.format}
                          </span>
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#ccc] font-medium">{report.owner}</span>
                        </td>

                        {/* Last Generated */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#888] whitespace-nowrap">{report.lastGenerated}</span>
                        </td>

                        {/* Schedule */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#888]">{report.schedule}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <ReportStatusBadge status={report.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <ChevronRight className="w-4 h-4 text-[#555] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#d4af37]/8">
              <span className="text-xs text-[#666]">
                Showing 1 to 8 of 42 reports
              </span>
              <div className="flex items-center gap-1">
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </PremiumButton>

                <div className="flex items-center gap-0.5 mx-1">
                  <button
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
                    className={cn(
                      "w-7 h-7 rounded-md text-xs font-medium transition-all duration-200",
                      currentPage === 6
                        ? "bg-[#d4af37] text-[#0a0a0a]"
                        : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                    )}
                  >
                    6
                  </button>
                </div>

                <PremiumButton
                  variant="ghost"
                  size="sm"
                  disabled={currentPage >= 6}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Report Detail Panel ──────────────────────────────────── */}
        <div className="w-[380px] shrink-0 hidden lg:block">
          <AnimatePresence mode="wait">
            {selectedReport && (
              <motion.div
                key={selectedReport.id}
                initial={{ x: 380, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 380, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="premium-panel rounded-xl overflow-hidden h-full max-h-[calc(100vh-220px)] flex flex-col"
              >
                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1">
                  {/* Header */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <div className="flex items-start justify-between">
                      <h2 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                        Report Details
                      </h2>
                      <button
                        onClick={() => setSelectedReportId(null)}
                        className="p-1 rounded-md text-[#666] hover:text-white hover:bg-[#252525] transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {selectedReport.starred && (
                        <Star className="w-4 h-4 text-[#d4af37] fill-[#d4af37] shrink-0" />
                      )}
                      <h3 className="text-base font-bold text-white">
                        {selectedReport.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mt-2.5">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded text-[10px] font-medium border",
                          categoryColors[selectedReport.category] ?? "bg-white/5 text-[#888] border-white/8"
                        )}
                      >
                        {selectedReport.category}
                      </span>
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded text-[10px] font-medium border",
                          formatColors[selectedReport.format] ?? "bg-white/5 text-[#888] border-white/8"
                        )}
                      >
                        {selectedReport.format}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-xs text-[#777]">Date Range:</span>
                      <span className="text-xs text-[#ccc]">{selectedReport.dateRange}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <div className="flex items-center gap-2">
                      <PremiumButton variant="primary" size="sm" className="flex-1">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </PremiumButton>
                      <PremiumButton variant="secondary" size="sm" className="flex-1">
                        <CalendarClock className="w-3.5 h-3.5" />
                        Schedule
                      </PremiumButton>
                      <PremiumButton variant="icon" size="sm">
                        <Share2 className="w-3.5 h-3.5" />
                      </PremiumButton>
                      <PremiumButton variant="icon" size="sm">
                        <Trash2 className="w-3.5 h-3.5" />
                      </PremiumButton>
                    </div>
                  </div>

                  {/* Report Summary / Key Metrics */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Report Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {keyMetrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="bg-[#141414] rounded-lg p-3 border border-[#d4af37]/5"
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <metric.icon className="w-3 h-3 text-[#555]" />
                            <span className="text-[10px] text-[#666] uppercase tracking-wide">
                              {metric.label}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-[#e0e0e0]">{metric.value}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400 font-medium">{metric.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Section */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-2">
                      Schedule
                    </h3>
                    <div className="flex items-center gap-2">
                      <CalendarClock className="w-3.5 h-3.5 text-[#555] shrink-0" />
                      <span className="text-xs text-[#ccc]">
                        Runs {selectedReport.schedule.toLowerCase()} on the 1st at 8:00 AM
                      </span>
                    </div>
                  </div>

                  {/* History */}
                  <div className="p-5">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Generation History
                    </h3>
                    <div className="space-y-3">
                      {reportHistory.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="text-xs text-[#ccc] font-medium whitespace-nowrap">
                              {entry.date}
                            </div>
                            <div className="text-[10px] text-[#666]">
                              {entry.format} · {entry.size}
                            </div>
                          </div>
                          <ReportStatusBadge status="completed" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}