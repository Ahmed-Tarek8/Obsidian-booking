"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatCard } from "./StatCard";
import { PremiumButton } from "./PremiumButton";
import { useBookingStore } from "@/lib/store";
import type { ReportStatus, Report } from "@/lib/types";

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

// ── Badge Configs ────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Business: "text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/20",
  Clients: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Operations: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Finance: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Team: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Analytics: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Custom: "text-pink-400 bg-pink-500/10 border-pink-500/20",
};

const formatColors: Record<string, string> = {
  PDF: "text-red-400 bg-red-500/10 border-red-500/20",
  XLSX: "text-green-400 bg-green-500/10 border-green-500/20",
  CSV: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

// ── Report Status Badge ──────────────────────────────────────────────────────

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const config: Record<ReportStatus, { label: string; cls: string; dot: string }> = {
    Completed: { label: "Completed", cls: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", dot: "bg-emerald-500" },
    Scheduled: { label: "Scheduled", cls: "text-blue-400 border-blue-500/20 bg-blue-500/5", dot: "bg-blue-500" },
    Draft: { label: "Draft", cls: "text-amber-400 border-amber-500/20 bg-amber-500/5", dot: "bg-amber-500" },
    Failed: { label: "Failed", cls: "text-red-400 border-red-500/20 bg-red-500/5", dot: "bg-red-500" },
  };
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", c.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateRange(dr: { start: string; end: string }): string {
  const s = new Date(dr.start);
  const e = new Date(dr.end);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = s.getFullYear();
  return `${fmt(s)}–${fmt(e)} ${year}`;
}

function formatLastGenerated(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function resolveOwnerName(ownerId: string, staff: { id: string; name: string }[]): string {
  const member = staff.find((s) => s.id === ownerId);
  if (!member) return ownerId;
  return member.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ── Component ────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const reports = useBookingStore((s) => s.reports);
  const staff = useBookingStore((s) => s.staff);

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // ── Computed stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = reports.length;
    const scheduled = reports.filter((r) => r.status === "Scheduled").length;
    const completedThisMonth = reports.filter((r) => {
      if (r.status !== "Completed" || !r.lastGenerated) return false;
      const now = new Date();
      const d = new Date(r.lastGenerated);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total, scheduled, completedThisMonth };
  }, [reports]);

  // ── Filtered reports ────────────────────────────────────────────────────
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (categoryFilter !== "All Categories" && r.category !== categoryFilter) return false;
      if (statusFilter !== "All Status" && r.status !== statusFilter) return false;
      return true;
    });
  }, [reports, searchQuery, categoryFilter, statusFilter]);

  // ── Unique categories for filter ────────────────────────────────────────
  const categories = useMemo(() => {
    const set = new Set(reports.map((r) => r.category));
    return Array.from(set);
  }, [reports]);

  const statuses: ReportStatus[] = ["Completed", "Scheduled", "Draft", "Failed"];

  const selectedReport = reports.find((r) => r.id === selectedReportId);

  return (
    <div className="space-y-5">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[#e0e0e0] tracking-tight">Reports</h1>
        <p className="text-sm text-[#666] mt-1">Generate, export, and schedule business reports.</p>
      </div>

      {/* ── Stats Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Reports"
          value={String(stats.total)}
          icon={FileText}
          change={`${stats.total} total`}
          changeType="neutral"
          delay={0}
        />
        <StatCard
          title="Scheduled Reports"
          value={String(stats.scheduled)}
          icon={Clock}
          change={stats.scheduled > 0 ? `${stats.scheduled} need attention` : "None scheduled"}
          changeType="neutral"
          delay={0.05}
        />
        <StatCard
          title="Completed This Month"
          value={String(stats.completedThisMonth)}
          icon={Download}
          change={reports.length > 0 ? `${reports.length} total reports` : "No reports yet"}
          changeType="neutral"
          delay={0.1}
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
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[140px]"
          >
            <option>All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[120px]"
          >
            <option>All Status</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[120px]">
            <option>All Owners</option>
            {staff.map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
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
                  {filteredReports.map((report, i) => {
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
                          <span className="text-xs text-[#aaa] whitespace-nowrap">{formatDateRange(report.dateRange)}</span>
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
                          <span className="text-xs text-[#ccc] font-medium">{resolveOwnerName(report.ownerId, staff)}</span>
                        </td>

                        {/* Last Generated */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#888] whitespace-nowrap">{formatLastGenerated(report.lastGenerated)}</span>
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
                Showing {filteredReports.length} of {reports.length} reports
              </span>
              <div className="flex items-center gap-1">
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  disabled={true}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </PremiumButton>

                <div className="flex items-center gap-0.5 mx-1">
                  <button
                    className="w-7 h-7 rounded-md text-xs font-medium transition-all duration-200 bg-[#d4af37] text-[#0a0a0a]"
                  >
                    1
                  </button>
                </div>

                <PremiumButton
                  variant="ghost"
                  size="sm"
                  disabled={true}
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
                      <ReportStatusBadge status={selectedReport.status} />
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-xs text-[#777]">Date Range:</span>
                      <span className="text-xs text-[#ccc]">{formatDateRange(selectedReport.dateRange)}</span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-xs text-[#777]">Owner:</span>
                      <span className="text-xs text-[#ccc]">{staff.find((s) => s.id === selectedReport.ownerId)?.name ?? selectedReport.ownerId}</span>
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

                  {/* Report Info Grid */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Report Info
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#141414] rounded-lg p-3 border border-[#d4af37]/5">
                        <div className="text-[10px] text-[#666] uppercase tracking-wide mb-1">Size</div>
                        <div className="text-sm font-bold text-[#e0e0e0]">{selectedReport.size}</div>
                      </div>
                      <div className="bg-[#141414] rounded-lg p-3 border border-[#d4af37]/5">
                        <div className="text-[10px] text-[#666] uppercase tracking-wide mb-1">Schedule</div>
                        <div className="text-sm font-bold text-[#e0e0e0]">{selectedReport.schedule}</div>
                      </div>
                      <div className="bg-[#141414] rounded-lg p-3 border border-[#d4af37]/5">
                        <div className="text-[10px] text-[#666] uppercase tracking-wide mb-1">Last Generated</div>
                        <div className="text-sm font-bold text-[#e0e0e0]">{formatLastGenerated(selectedReport.lastGenerated)}</div>
                      </div>
                      <div className="bg-[#141414] rounded-lg p-3 border border-[#d4af37]/5">
                        <div className="text-[10px] text-[#666] uppercase tracking-wide mb-1">Recipients</div>
                        <div className="text-sm font-bold text-[#e0e0e0]">{selectedReport.recipients.length}</div>
                      </div>
                    </div>
                  </div>

                  {/* Sections */}
                  {selectedReport.sections.length > 0 && (
                    <div className="p-5 border-b border-[#d4af37]/8">
                      <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                        Sections
                      </h3>
                      <div className="space-y-1.5">
                        {selectedReport.sections.map((section) => (
                          <div key={section} className="flex items-center gap-2 bg-[#141414] rounded-lg px-3 py-2 border border-[#d4af37]/5">
                            <BarChart3 className="w-3 h-3 text-[#555] shrink-0" />
                            <span className="text-xs text-[#ccc]">{section}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recipients */}
                  {selectedReport.recipients.length > 0 && (
                    <div className="p-5 border-b border-[#d4af37]/8">
                      <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                        Recipients
                      </h3>
                      <div className="space-y-1.5">
                        {selectedReport.recipients.map((rid) => {
                          const member = staff.find((s) => s.id === rid);
                          return (
                            <div key={rid} className="flex items-center gap-2 bg-[#141414] rounded-lg px-3 py-2 border border-[#d4af37]/5">
                              <Users className="w-3 h-3 text-[#555] shrink-0" />
                              <span className="text-xs text-[#ccc]">{member?.name ?? rid}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

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

                  {/* Generation History (single entry for this report) */}
                  {selectedReport.lastGenerated && (
                    <div className="p-5">
                      <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                        Generation History
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="space-y-0.5 min-w-0">
                            <div className="text-xs text-[#ccc] font-medium whitespace-nowrap">
                              {formatLastGenerated(selectedReport.lastGenerated)}
                            </div>
                            <div className="text-[10px] text-[#666]">
                              {selectedReport.format} · {selectedReport.size}
                            </div>
                          </div>
                          <ReportStatusBadge status="Completed" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
