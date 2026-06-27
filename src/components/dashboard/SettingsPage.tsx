"use client";

import { useState } from "react";
import { PremiumButton } from "./PremiumButton";
import { SectionPanel } from "./SectionPanel";
import { cn } from "@/lib/utils";
import {
  Settings,
  Calendar,
  Clock,
  CreditCard,
  Bell,
  Palette,
  Shield,
  BookOpen,
  Wallet,
  Lightbulb,
  Plus,
  Users,
  ExternalLink,
  Download,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────
type TabId =
  | "general"
  | "booking"
  | "hours"
  | "payments"
  | "notifications"
  | "branding"
  | "security";

// ── Tab Config ───────────────────────────────────────────────────────────
const settingTabs: { id: TabId; label: string; icon: typeof Settings }[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "booking", label: "Booking", icon: Calendar },
  { id: "hours", label: "Hours", icon: Clock },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
];

// ── Helpers ──────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0",
        checked
          ? "bg-[#d4af37]"
          : "bg-[#2a2a2a] border border-[#d4af37]/20"
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5"
        )}
      />
    </button>
  );
}

function ProfileCard({
  title,
  value,
  subtitle,
  icon: Icon,
  progress,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof Settings;
  progress?: number;
}) {
  return (
    <div className="premium-panel rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#d4af37]" />
        <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="text-xl font-bold text-[#e0e0e0]">{value}</div>
      <div className="text-[11px] text-[#666] mt-1">{subtitle}</div>
      {progress !== undefined && (
        <div className="w-full h-1.5 bg-[#1e1e1e] rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#d4af37] to-[#b8960b] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ── General Tab ──────────────────────────────────────────────────────────
function GeneralTab() {
  const [sameDay, setSameDay] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [allowCancel, setAllowCancel] = useState(true);
  const [daysEnabled, setDaysEnabled] = useState<boolean[]>(
    Array(7).fill(true) as boolean[]
  );

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="space-y-6">
      {/* ── Profile Completion Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <ProfileCard
          title="Profile Completeness"
          value="92%"
          subtitle="Expand"
          icon={Sparkles}
          progress={92}
        />
        <ProfileCard
          title="Booking Rules"
          value={6}
          subtitle="Active rules"
          icon={BookOpen}
        />
        <ProfileCard
          title="Notification Channels"
          value={4}
          subtitle="Channels connected"
          icon={Bell}
        />
        <ProfileCard
          title="Payment Methods"
          value={3}
          subtitle="Active methods"
          icon={Wallet}
        />
      </div>

      {/* ── Studio Information ───────────────────────────────────────── */}
      <SectionPanel>
        <h3 className="text-sm font-semibold text-[#e0e0e0] mb-4">
          Studio Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Studio Name
            </label>
            <input
              type="text"
              defaultValue="Studio A"
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Business Email
            </label>
            <input
              type="email"
              defaultValue="hello@studioa.com"
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="(555) 123-4567"
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Timezone
            </label>
            <div className="relative">
              <select className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none">
                <option>(GMT-08:00) Pacific Time</option>
                <option>(GMT-07:00) Mountain Time</option>
                <option>(GMT-06:00) Central Time</option>
                <option>(GMT-05:00) Eastern Time</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Location
            </label>
            <input
              type="text"
              defaultValue="123 Creative Way, Suite 300, Los Angeles, CA 9012, USA"
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
        </div>
      </SectionPanel>

      {/* ── Business Hours ───────────────────────────────────────────── */}
      <SectionPanel>
        <h3 className="text-sm font-semibold text-[#e0e0e0] mb-4">
          Business Hours
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[10px] font-semibold text-[#555] uppercase tracking-wider pb-3 w-[140px]">
                  Day
                </th>
                <th className="text-left text-[10px] font-semibold text-[#555] uppercase tracking-wider pb-3">
                  Start Time
                </th>
                <th className="text-left text-[10px] font-semibold text-[#555] uppercase tracking-wider pb-3">
                  End Time
                </th>
                <th className="text-right text-[10px] font-semibold text-[#555] uppercase tracking-wider pb-3 w-[50px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {days.map((day, i) => (
                <tr
                  key={day}
                  className="border-b border-white/[0.03] last:border-0"
                >
                  <td className="py-2.5">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={daysEnabled[i]}
                        onChange={() => {
                          const next = [...daysEnabled];
                          next[i] = !next[i];
                          setDaysEnabled(next);
                        }}
                        className="w-3.5 h-3.5 rounded border-[#333] bg-[#1a1a1a] text-[#d4af37] focus:ring-[#d4af37]/30 focus:ring-offset-0 cursor-pointer accent-[#d4af37]"
                      />
                      <span
                        className={cn(
                          "text-[13px]",
                          daysEnabled[i]
                            ? "text-[#e0e0e0]"
                            : "text-[#444]"
                        )}
                      >
                        {day}
                      </span>
                    </label>
                  </td>
                  <td className="py-2.5">
                    <div className="relative w-[140px]">
                      <select
                        disabled={!daysEnabled[i]}
                        defaultValue="9:00 AM"
                        className={cn(
                          "premium-input w-full rounded-lg px-3 py-1.5 text-[13px] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none",
                          !daysEnabled[i] && "opacity-30 cursor-not-allowed"
                        )}
                      >
                        <option>8:00 AM</option>
                        <option>8:30 AM</option>
                        <option>9:00 AM</option>
                        <option>9:30 AM</option>
                        <option>10:00 AM</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-2.5">
                    <div className="relative w-[140px]">
                      <select
                        disabled={!daysEnabled[i]}
                        defaultValue="6:00 PM"
                        className={cn(
                          "premium-input w-full rounded-lg px-3 py-1.5 text-[13px] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none",
                          !daysEnabled[i] && "opacity-30 cursor-not-allowed"
                        )}
                      >
                        <option>5:00 PM</option>
                        <option>5:30 PM</option>
                        <option>6:00 PM</option>
                        <option>6:30 PM</option>
                        <option>7:00 PM</option>
                        <option>8:00 PM</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      className="w-6 h-6 rounded-md border border-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mx-auto hover:bg-[#d4af37]/10 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionPanel>

      {/* ── Booking Settings ─────────────────────────────────────────── */}
      <SectionPanel>
        <h3 className="text-sm font-semibold text-[#e0e0e0] mb-4">
          Booking Settings
        </h3>
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Default Slot Duration
            </label>
            <div className="relative">
              <select
                defaultValue="60 min"
                className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none"
              >
                <option>15 min</option>
                <option>30 min</option>
                <option>45 min</option>
                <option>60 min</option>
                <option>90 min</option>
                <option>120 min</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Minimum Notice
            </label>
            <div className="relative">
              <select
                defaultValue="2 hours"
                className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none"
              >
                <option>1 hour</option>
                <option>2 hours</option>
                <option>4 hours</option>
                <option>12 hours</option>
                <option>24 hours</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Maximum Advance Booking
            </label>
            <div className="relative">
              <select
                defaultValue="30 days"
                className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none"
              >
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center justify-between col-span-1">
            <label className="text-[13px] text-[#b0b0b0]">
              Allow Same-Day Booking
            </label>
            <Toggle checked={sameDay} onChange={setSameDay} />
          </div>
          <div className="flex items-center justify-between col-span-1">
            <label className="text-[13px] text-[#b0b0b0]">
              Auto-Confirm Bookings
            </label>
            <Toggle checked={autoConfirm} onChange={setAutoConfirm} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Max Bookings Per Day
            </label>
            <input
              type="number"
              defaultValue={8}
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
        </div>
      </SectionPanel>

      {/* ── Cancellation Policy ──────────────────────────────────────── */}
      <SectionPanel>
        <h3 className="text-sm font-semibold text-[#e0e0e0] mb-4">
          Cancellation Policy
        </h3>
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          <div className="flex items-center justify-between col-span-1">
            <label className="text-[13px] text-[#b0b0b0]">
              Allow Cancellations
            </label>
            <Toggle checked={allowCancel} onChange={setAllowCancel} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Minimum Notice
            </label>
            <div className="relative">
              <select
                defaultValue="24 hours"
                className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none"
              >
                <option>1 hour</option>
                <option>2 hours</option>
                <option>4 hours</option>
                <option>12 hours</option>
                <option>24 hours</option>
                <option>48 hours</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
            </div>
          </div>
          <div />
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Late Cancellation Fee
            </label>
            <input
              type="text"
              defaultValue="$25"
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              No-Show Fee
            </label>
            <input
              type="text"
              defaultValue="$50"
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
        </div>
      </SectionPanel>
    </div>
  );
}

// ── Placeholder Tab ──────────────────────────────────────────────────────
function PlaceholderTab({ tabId }: { tabId: TabId }) {
  const tab = settingTabs.find((t) => t.id === tabId);
  const Icon = tab?.icon ?? Settings;
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] border border-[#d4af37]/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#d4af37]" />
      </div>
      <h3 className="text-sm font-semibold text-[#e0e0e0] mb-1">
        {tab?.label ?? "Settings"} Settings
      </h3>
      <p className="text-[13px] text-[#555] max-w-sm">
        Configure your {tab?.label?.toLowerCase() ?? "settings"} preferences
        here. This section is coming soon.
      </p>
    </div>
  );
}

// ── Right Column ─────────────────────────────────────────────────────────
function RightColumn() {
  return (
    <div className="space-y-4">
      {/* ── Studio Summary Card ─────────────────────────────────────── */}
      <SectionPanel>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
            <Settings className="w-4.5 h-4.5 text-[#d4af37]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-[#e0e0e0] truncate">
              Studio A
            </h4>
            <p className="text-[11px] text-[#666] truncate">
              hello@studioa.com
            </p>
            <p className="text-[11px] text-[#666]">(555) 123-4567</p>
          </div>
        </div>
        <PremiumButton variant="secondary" size="sm" className="w-full">
          Edit Profile
        </PremiumButton>
      </SectionPanel>

      {/* ── Quick Actions ────────────────────────────────────────────── */}
      <SectionPanel>
        <h4 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3">
          Quick Actions
        </h4>
        <div className="space-y-2">
          <PremiumButton
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Service
          </PremiumButton>
          <PremiumButton
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2.5"
          >
            <Users className="w-3.5 h-3.5" />
            Manage Staff
          </PremiumButton>
          <PremiumButton
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Page
          </PremiumButton>
          <PremiumButton
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Data
          </PremiumButton>
        </div>
      </SectionPanel>

      {/* ── Tips Section ─────────────────────────────────────────────── */}
      <SectionPanel>
        <h4 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3">
          Tips
        </h4>
        <div className="space-y-3">
          {[
            "Enable online payments to reduce no-shows by 35%",
            "Set up automated reminders to decrease cancellations",
            "Connect your calendar for real-time availability sync",
          ].map((tip, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-md bg-[#d4af37]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-3 h-3 text-[#d4af37]" />
              </div>
              <p className="text-[12px] text-[#888] leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </SectionPanel>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────
export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");

  return (
    <div className="h-full overflow-y-auto px-6 py-6 space-y-5">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-[#e0e0e0]">Studio Settings</h1>
        <p className="text-[13px] text-[#666] mt-1">
          Manage your profile, hours, booking rules, payments, and
          notifications.
        </p>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-white/5 pb-0 overflow-x-auto">
        {settingTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-px",
                isActive
                  ? "text-[#d4af37] border-[#d4af37]"
                  : "text-[#555] border-transparent hover:text-[#888] hover:border-[#333]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "text-[#d4af37]" : "text-[#555]"
                )}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Two-Column Layout ────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_280px] gap-5">
        {/* Left Column — Tab Content */}
        <div>
          {activeTab === "general" && <GeneralTab />}
          {activeTab !== "general" && <PlaceholderTab tabId={activeTab} />}
        </div>

        {/* Right Column — Always visible */}
        <div className="space-y-4">
          <RightColumn />
        </div>
      </div>
    </div>
  );
}