"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "./StatCard";
import { PremiumButton } from "./PremiumButton";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/store";
import type { IntegrationStatus } from "@/lib/types";
import {
  RefreshCw,
  Clock,
  Activity,
  Gauge,
  Search,
  Filter,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  MoreHorizontal,
  CalendarDays,
  CreditCard,
  Video,
  Mail,
  Users,
  BarChart3,
  MessageSquare,
  Share2,
  ArrowRightLeft,
  CheckCircle2,
  Unplug,
  Settings2,
  Zap,
  Webhook,
  Workflow,
} from "lucide-react";

// ── Icon mapping by integration name ──────────────────────────────────────
const iconMap: Record<string, any> = {
  "Calendar Sync": CalendarDays,
  "Payments Gateway": CreditCard,
  "Video Meetings": Video,
  "Messaging": MessageSquare,
  "Email Marketing": Mail,
  Automation: Workflow,
  "CRM Sync": Users,
  Webhooks: Webhook,
};

function getIcon(name: string) {
  return iconMap[name] ?? BarChart3;
}

// ── Status Badge Styles ──────────────────────────────────────────────────
const statusStyles: Record<
  IntegrationStatus,
  { dot: string; text: string; badge: string }
> = {
  Connected: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
  },
  Active: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
  },
  Warning: {
    dot: "bg-orange-400",
    text: "text-orange-400",
    badge: "bg-orange-500/15 border-orange-500/20 text-orange-400",
  },
  Pending: {
    dot: "bg-orange-400",
    text: "text-orange-400",
    badge: "bg-orange-500/15 border-orange-500/20 text-orange-400",
  },
  Disconnected: {
    dot: "bg-red-400",
    text: "text-red-400",
    badge: "bg-red-500/15 border-red-500/20 text-red-400",
  },
};

// ── Filter Dropdown Component ────────────────────────────────────────────
function FilterDropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="premium-btn flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] text-[#ccc] font-medium bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#d4af37]/10 hover:border-[#d4af37]/25 hover:text-[#e0e0e0] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)]"
      >
        <span>{value === "__all__" ? label : value}</span>
        <ChevronDown
          className={cn(
            "w-3 h-3 text-[#666] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 premium-panel rounded-lg border border-[#d4af37]/10 shadow-lg py-1 min-w-[140px]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 text-[13px] transition-colors cursor-pointer",
                value === opt
                  ? "text-[#d4af37] bg-[#d4af37]/5"
                  : "text-[#ccc] hover:bg-[#1a1a1a] hover:text-white"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────
export function IntegrationsPage() {
  const integrations = useBookingStore((s) => s.integrations);

  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>(
    integrations[0]?.id ?? ""
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("__all__");
  const [statusFilter, setStatusFilter] = useState("__all__");

  // ── Computed stats ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    const connectedApps = integrations.filter(
      (i) => i.status === "Connected" || i.status === "Active"
    ).length;
    const pendingSetups = integrations.filter(
      (i) => i.status === "Pending" || i.status === "Warning"
    ).length;
    const totalIntegrations = integrations.length;
    return { connectedApps, pendingSetups, totalIntegrations };
  }, [integrations]);

  // ── Filtered integrations ──────────────────────────────────────────
  const filteredIntegrations = useMemo(() => {
    return integrations.filter((i) => {
      if (
        searchQuery &&
        !i.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !i.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (categoryFilter !== "__all__" && i.category !== categoryFilter)
        return false;
      if (statusFilter !== "__all__" && i.status !== statusFilter)
        return false;
      return true;
    });
  }, [integrations, searchQuery, categoryFilter, statusFilter]);

  // ── Unique filter options ───────────────────────────────────────────
  const categories = useMemo(() => {
    const set = new Set(integrations.map((i) => i.category));
    return Array.from(set);
  }, [integrations]);

  const statuses: IntegrationStatus[] = [
    "Connected",
    "Active",
    "Warning",
    "Disconnected",
    "Pending",
  ];

  const selectedIntegration = integrations.find(
    (i) => i.id === selectedIntegrationId
  );

  return (
    <div className="animate-fade-in-up p-6 flex gap-6">
      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-white">Integrations</h1>
          <p className="text-sm text-[#888] mt-0.5">
            Connect apps, sync data, and automate workflows.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          <StatCard
            title="Connected Apps"
            value={String(stats.connectedApps)}
            change={`${stats.totalIntegrations} total integrations`}
            changeType="neutral"
            icon={RefreshCw}
            delay={0}
          />
          <StatCard
            title="Pending Setups"
            value={String(stats.pendingSetups)}
            change={stats.pendingSetups > 0 ? `${stats.pendingSetups} need attention` : "All clear"}
            changeType="neutral"
            icon={Clock}
            delay={0.05}
          />
          <StatCard
            title="Total Integrations"
            value={String(stats.totalIntegrations)}
            change={stats.connectedApps > 0 ? `${stats.connectedApps} active` : "Add your first integration"}
            changeType="neutral"
            icon={Activity}
            delay={0.1}
          />
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#555] w-64 outline-none focus:border-[#d4af37]/30 transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          <FilterDropdown
            label="All Categories"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={["__all__", "All Categories", ...categories]}
          />
          <FilterDropdown
            label="All Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={["__all__", "All Status", ...statuses]}
          />
          <FilterDropdown
            label="All Connections"
            value="__all__"
            onChange={() => {}}
            options={["__all__", "All Connections"]}
          />

          {/* Filters Button */}
          <PremiumButton variant="secondary" size="sm">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </PremiumButton>

          {/* Grid/List Toggle */}
          <div className="flex items-center border border-[#d4af37]/10 rounded-lg overflow-hidden ml-auto">
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

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredIntegrations.map((integration, index) => {
            const IconComp = getIcon(integration.name);
            const status = statusStyles[integration.status];

            // Parse iconColor to Tailwind classes
            const colorBase = integration.iconColor.replace("text-", "");
            const iconBg = `bg-${colorBase}/10 border-${colorBase}/20`;
            const iconText = integration.iconColor;

            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.04,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                onClick={() => setSelectedIntegrationId(integration.id)}
                className={cn(
                  "premium-panel rounded-xl p-4 cursor-pointer transition-all group relative",
                  selectedIntegrationId === integration.id
                    ? "border-[#d4af37]/30 shadow-[0_0_20px_rgba(212,175,55,0.06)]"
                    : "hover:border-[#d4af37]/15"
                )}
              >
                {/* Top Row: Icon + Status + Menu */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center border",
                        iconBg,
                        iconText
                      )}
                      style={{
                        backgroundColor:
                          integration.iconColor === "text-yellow-500"
                            ? "rgba(234,179,8,0.1)"
                            : integration.iconColor === "text-purple-500"
                              ? "rgba(168,85,247,0.1)"
                              : integration.iconColor === "text-blue-500"
                                ? "rgba(59,130,246,0.1)"
                                : integration.iconColor === "text-green-500"
                                  ? "rgba(34,197,94,0.1)"
                                  : integration.iconColor === "text-purple-400"
                                    ? "rgba(168,85,247,0.08)"
                                    : integration.iconColor === "text-yellow-400"
                                      ? "rgba(234,179,8,0.08)"
                                    : integration.iconColor === "text-blue-400"
                                      ? "rgba(96,165,250,0.08)"
                                      : integration.iconColor === "text-red-400"
                                        ? "rgba(248,113,113,0.1)"
                                        : "rgba(255,255,255,0.05)",
                        borderColor:
                          integration.iconColor === "text-yellow-500"
                            ? "rgba(234,179,8,0.2)"
                            : integration.iconColor === "text-purple-500"
                              ? "rgba(168,85,247,0.2)"
                              : integration.iconColor === "text-blue-500"
                                ? "rgba(59,130,246,0.2)"
                                : integration.iconColor === "text-green-500"
                                  ? "rgba(34,197,94,0.2)"
                                  : integration.iconColor === "text-purple-400"
                                    ? "rgba(168,85,247,0.15)"
                                    : integration.iconColor === "text-yellow-400"
                                      ? "rgba(234,179,8,0.15)"
                                      : integration.iconColor === "text-blue-400"
                                        ? "rgba(96,165,250,0.15)"
                                        : integration.iconColor === "text-red-400"
                                          ? "rgba(248,113,113,0.2)"
                                          : "rgba(255,255,255,0.08)",
                      }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#e0e0e0]">
                        {integration.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            status.dot
                          )}
                        />
                        <span
                          className={cn(
                            "text-[10px] font-medium px-1.5 py-0.5 rounded-md border",
                            status.badge
                          )}
                        >
                          {integration.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#666] hover:text-[#aaa] hover:bg-[#1e1e1e] transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#666] uppercase tracking-wider font-medium">
                      Last Sync
                    </span>
                    <span className="text-xs text-[#999]">
                      {integration.lastSync}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#666] uppercase tracking-wider font-medium">
                      Records Synced
                    </span>
                    <span className="text-xs text-[#999]">
                      {integration.recordsSynced}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#666] uppercase tracking-wider font-medium">
                      Sync Frequency
                    </span>
                    <span className="text-xs text-[#999]">
                      {integration.syncFrequency}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <PremiumButton
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Configure
                </PremiumButton>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Integration Detail Sidebar ──────────────────────────────── */}
      <AnimatePresence>
        {selectedIntegration && (
          <motion.div
            key="detail-panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-[360px] flex-shrink-0"
          >
            <div className="premium-panel rounded-xl overflow-hidden">
              <div className="p-5 max-h-[calc(100vh-3rem)] overflow-y-auto">
                {/* Header */}
                <div className="relative mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase">
                      Integration Details
                    </h2>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {(() => {
                        const IconComp = getIcon(selectedIntegration.name);
                        const colorBase =
                          selectedIntegration.iconColor.replace("text-", "");
                        return (
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center border",
                              `bg-${colorBase}/10 border-${colorBase}/20`,
                              selectedIntegration.iconColor
                            )}
                            style={{
                              backgroundColor: "rgba(255,255,255,0.05)",
                              borderColor: "rgba(212,175,55,0.15)",
                            }}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                        );
                      })()}
                      <h3 className="text-lg font-bold text-white">
                        {selectedIntegration.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedIntegrationId("")}
                      className="w-7 h-7 rounded-lg bg-[#1e1e1e] border border-[#d4af37]/10 flex items-center justify-center text-[#888] hover:text-white hover:border-[#d4af37]/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Status Badge */}
                  <div className="mt-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border",
                        statusStyles[selectedIntegration.status].badge
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          statusStyles[selectedIntegration.status].dot
                        )}
                      />
                      {selectedIntegration.status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#999] italic mb-5">
                  {selectedIntegration.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-5">
                  <PremiumButton
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    Configure
                  </PremiumButton>
                  <PremiumButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Test Connection
                  </PremiumButton>
                </div>
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 mb-6"
                >
                  <Unplug className="w-3.5 h-3.5" />
                  Disconnect
                </PremiumButton>

                {/* Settings Section */}
                <div className="mb-5">
                  <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase mb-3">
                    Settings
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-[#0e0e0e] rounded-lg px-3 py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#666] uppercase">
                          Category
                        </div>
                        <div className="text-sm text-white font-medium mt-0.5">
                          {selectedIntegration.category}
                        </div>
                      </div>
                      <BarChart3 className="w-4 h-4 text-[#666]" />
                    </div>
                    <div className="bg-[#0e0e0e] rounded-lg px-3 py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#666] uppercase">
                          Sync Frequency
                        </div>
                        <div className="text-sm text-white font-medium mt-0.5">
                          {selectedIntegration.syncFrequency}
                        </div>
                      </div>
                      <Clock className="w-4 h-4 text-[#666]" />
                    </div>
                    <div className="bg-[#0e0e0e] rounded-lg px-3 py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#666] uppercase">
                          Records Synced
                        </div>
                        <div className="text-sm text-white font-medium mt-0.5">
                          {selectedIntegration.recordsSynced}
                        </div>
                      </div>
                      <ArrowRightLeft className="w-4 h-4 text-[#666]" />
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mb-5">
                  <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase mb-3">
                    Permissions
                  </h3>
                  <div className="space-y-1.5">
                    {selectedIntegration.permissions.map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center gap-2 bg-[#0e0e0e] rounded-lg px-3 py-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-[#ccc]">{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Health Indicator */}
                <div className="mt-5 pt-4 border-t border-[#d4af37]/8">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">
                      Healthy
                    </span>
                    <span className="text-[10px] text-[#666]">— No errors in the last 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
