"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "./StatCard";
import { PremiumButton } from "./PremiumButton";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────
type IntegrationStatus = "Connected" | "Setup Required" | "Disconnected";

interface Integration {
  id: string;
  name: string;
  icon: any;
  status: IntegrationStatus;
  lastSync: string;
  permissions: string;
  description: string;
}

interface SyncEvent {
  id: string;
  action: string;
  time: string;
  details: string;
}

// ── Data ─────────────────────────────────────────────────────────────────
const integrations: Integration[] = [
  {
    id: "int-1",
    name: "Calendar Sync",
    icon: CalendarDays,
    status: "Connected",
    lastSync: "2 min ago",
    permissions: "Read/Write",
    description:
      "Sync your booking calendar with Google Calendar, Outlook, and other calendar providers. Automatically create, update, and cancel events across platforms in real time.",
  },
  {
    id: "int-2",
    name: "Payments Gateway",
    icon: CreditCard,
    status: "Connected",
    lastSync: "5 min ago",
    permissions: "Read/Write",
    description:
      "Process payments securely through Stripe, PayPal, and other gateways. Supports recurring billing, refunds, and multi-currency transactions.",
  },
  {
    id: "int-3",
    name: "Video Meetings",
    icon: Video,
    status: "Connected",
    lastSync: "1 hr ago",
    permissions: "Read/Write",
    description:
      "Automatically generate Zoom, Google Meet, or Microsoft Teams links for virtual appointments. Handles meeting creation and updates.",
  },
  {
    id: "int-4",
    name: "Email Marketing",
    icon: Mail,
    status: "Connected",
    lastSync: "15 min ago",
    permissions: "Read/Write",
    description:
      "Connect with Mailchimp, ConvertKit, or SendGrid to automate email campaigns, confirmations, and follow-ups based on booking activity.",
  },
  {
    id: "int-5",
    name: "CRM System",
    icon: Users,
    status: "Connected",
    lastSync: "30 min ago",
    permissions: "Read, Write",
    description:
      "Sync client data with Salesforce, HubSpot, or Pipedrive. Keep customer profiles, interaction history, and pipeline data in sync.",
  },
  {
    id: "int-6",
    name: "Analytics",
    icon: BarChart3,
    status: "Connected",
    lastSync: "10 min ago",
    permissions: "Read Only",
    description:
      "Connect Google Analytics, Mixpanel, or Amplitude to track booking funnels, conversion rates, and user behavior across your platform.",
  },
  {
    id: "int-7",
    name: "SMS Notifications",
    icon: MessageSquare,
    status: "Setup Required",
    lastSync: "Not configured",
    permissions: "Read/Write",
    description:
      "Send SMS reminders, confirmations, and alerts via Twilio or Vonage. Reduce no-shows with automated text notifications.",
  },
  {
    id: "int-8",
    name: "Social Media",
    icon: Share2,
    status: "Disconnected",
    lastSync: "3 days ago",
    permissions: "Read/Write",
    description:
      "Auto-post booking availability to Facebook, Instagram, and Twitter. Sync social engagement data back to client profiles.",
  },
];

const syncHistory: SyncEvent[] = [
  {
    id: "sh-1",
    action: "Sync completed",
    time: "2 min ago",
    details: "12 bookings synced",
  },
  {
    id: "sh-2",
    action: "Sync completed",
    time: "17 min ago",
    details: "8 bookings synced",
  },
  {
    id: "sh-3",
    action: "Sync completed",
    time: "32 min ago",
    details: "5 bookings synced",
  },
];

// ── Icon Color Map ───────────────────────────────────────────────────────
const iconColors: Record<string, string> = {
  "Calendar Sync": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "Payments Gateway": "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "Video Meetings": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Email Marketing": "text-green-400 bg-green-500/10 border-green-500/20",
  "CRM System": "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "Analytics": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  "SMS Notifications": "text-pink-400 bg-pink-500/10 border-pink-500/20",
  "Social Media": "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
};

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
  "Setup Required": {
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
function FilterDropdown({ label, icon: Icon }: { label: string; icon: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="premium-btn flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] text-[#ccc] font-medium bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#d4af37]/10 hover:border-[#d4af37]/25 hover:text-[#e0e0e0] transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)]"
      >
        <Icon className="w-3.5 h-3.5 text-[#d4af37]/60" />
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "w-3 h-3 text-[#666] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────
export function IntegrationsPage() {
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>(
    "int-1"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        <div className="grid grid-cols-4 gap-4 mb-5">
          <StatCard
            title="Connected Apps"
            value="24"
            change="4 new this month"
            changeType="up"
            icon={RefreshCw}
            delay={0}
          />
          <StatCard
            title="Pending Setups"
            value="3"
            change="Requires attention"
            changeType="down"
            icon={Clock}
            delay={0.05}
          />
          <StatCard
            title="Sync Health"
            value="98%"
            change="All systems operational"
            changeType="up"
            icon={Activity}
            delay={0.1}
          />
          <StatCard
            title="API Usage"
            value="42%"
            change="420K/1.0M calls"
            changeType="neutral"
            icon={Gauge}
            delay={0.15}
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
              className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#555] w-64 outline-none focus:border-[#d4af37]/30 transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          <FilterDropdown label="All Categories" icon={Filter} />
          <FilterDropdown label="All Status" icon={Activity} />
          <FilterDropdown label="All Connections" icon={RefreshCw} />

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
          {integrations.map((integration, index) => {
            const IconComp = integration.icon;
            const colors = iconColors[integration.name] ?? "";
            const status = statusStyles[integration.status];

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
                onClick={() =>
                  setSelectedIntegrationId(
                    selectedIntegrationId === integration.id
                      ? integration.id
                      : integration.id
                  )
                }
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
                        colors
                      )}
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
                      Permissions
                    </span>
                    <span className="text-xs text-[#999]">
                      {integration.permissions}
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
                        const IconComp = selectedIntegration.icon;
                        const colors =
                          iconColors[selectedIntegration.name] ?? "";
                        return (
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center border",
                              colors
                            )}
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
                          Sync Direction
                        </div>
                        <div className="text-sm text-white font-medium mt-0.5">
                          Two-way
                        </div>
                      </div>
                      <ArrowRightLeft className="w-4 h-4 text-[#666]" />
                    </div>
                    <div className="bg-[#0e0e0e] rounded-lg px-3 py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#666] uppercase">
                          Sync Interval
                        </div>
                        <div className="text-sm text-white font-medium mt-0.5">
                          15 min
                        </div>
                      </div>
                      <Clock className="w-4 h-4 text-[#666]" />
                    </div>
                    <div className="bg-[#0e0e0e] rounded-lg px-3 py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#666] uppercase">
                          Calendar ID
                        </div>
                        <div className="text-sm text-white font-medium mt-0.5">
                          primary@obsidian.app
                        </div>
                      </div>
                      <CalendarDays className="w-4 h-4 text-[#666]" />
                    </div>
                  </div>
                </div>

                {/* Sync History */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#666] uppercase">
                      Sync History
                    </h3>
                    <PremiumButton variant="ghost" size="sm">
                      View All
                    </PremiumButton>
                  </div>
                  <div className="space-y-2">
                    {syncHistory.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 bg-[#0e0e0e] rounded-lg px-3 py-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white font-medium">
                              {event.action}
                            </span>
                            <span className="text-[10px] text-[#666] flex-shrink-0 ml-2">
                              {event.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#888] mt-0.5">
                            {event.details}
                          </p>
                        </div>
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