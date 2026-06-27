"use client";

import { useState, useCallback } from "react";
import { PremiumButton } from "./PremiumButton";
import { SectionPanel } from "./SectionPanel";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/store";
import {
  Settings,
  Calendar,
  Clock,
  Bell,
  ExternalLink,
  Sparkles,
  BookOpen,
  Wallet,
  Plus,
  ChevronDown,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────
type TabId = "general" | "booking" | "hours" | "notifications";

// ── Tab Config ───────────────────────────────────────────────────────────
const settingTabs: { id: TabId; label: string; icon: typeof Settings }[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "booking", label: "Booking Rules", icon: Calendar },
  { id: "hours", label: "Hours", icon: Clock },
  { id: "notifications", label: "Notifications", icon: Bell },
];

// ── Time options ─────────────────────────────────────────────────────────
const timeOptions = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
];

const slotDurationOptions = ["15 min", "30 min", "45 min", "60 min", "90 min", "120 min"];

const noticeOptions = ["1 hour", "2 hours", "4 hours", "12 hours", "24 hours"];

const advanceOptions = ["7 days", "14 days", "30 days", "60 days", "90 days"];

const cancellationNoticeOptions = ["1 hour", "2 hours", "4 hours", "12 hours", "24 hours", "48 hours"];

const timezoneOptions = [
  "(GMT-08:00) Pacific Time (US & Canada)",
  "(GMT-07:00) Mountain Time (US & Canada)",
  "(GMT-06:00) Central Time (US & Canada)",
  "(GMT-05:00) Eastern Time (US & Canada)",
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
  const settings = useBookingStore((s) => s.settings);
  const updateSettings = useBookingStore((s) => s.updateSettings);
  const notifications = settings.notifications;

  const activeDaysCount = settings.businessHours.filter((h) => h.active).length;

  const handleFieldChange = useCallback(
    (field: string, value: string | number) => {
      updateSettings({ [field]: value } as any);
    },
    [updateSettings]
  );

  const handleToggleNotification = useCallback(
    (field: "email" | "sms" | "push" | "marketing") => {
      updateSettings({
        notifications: { ...notifications, [field]: !notifications[field] },
      });
    },
    [notifications, updateSettings]
  );

  const handleBusinessHourToggle = useCallback(
    (index: number) => {
      const updated = settings.businessHours.map((h, i) =>
        i === index ? { ...h, active: !h.active } : h
      );
      updateSettings({ businessHours: updated });
    },
    [settings.businessHours, updateSettings]
  );

  const handleBusinessHourTime = useCallback(
    (index: number, field: "start" | "end", value: string) => {
      const updated = settings.businessHours.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      );
      updateSettings({ businessHours: updated });
    },
    [settings.businessHours, updateSettings]
  );

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
          value={activeDaysCount}
          subtitle="Active days"
          icon={BookOpen}
        />
        <ProfileCard
          title="Notification Channels"
          value={Object.values(notifications).filter(Boolean).length}
          subtitle="Channels active"
          icon={Bell}
        />
        <ProfileCard
          title="Slot Duration"
          value={`${settings.defaultSlotDuration} min`}
          subtitle="Default booking"
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
              value={settings.studioName}
              onChange={(e) => handleFieldChange("studioName", e.target.value)}
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Business Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Timezone
            </label>
            <div className="relative">
              <select
                value={settings.timezone}
                onChange={(e) => handleFieldChange("timezone", e.target.value)}
                className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none"
              >
                {timezoneOptions.map((tz) => (
                  <option key={tz}>{tz}</option>
                ))}
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
              value={settings.location}
              onChange={(e) => handleFieldChange("location", e.target.value)}
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
              {settings.businessHours.map((bh, i) => (
                <tr
                  key={bh.day}
                  className="border-b border-white/[0.03] last:border-0"
                >
                  <td className="py-2.5">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bh.active}
                        onChange={() => handleBusinessHourToggle(i)}
                        className="w-3.5 h-3.5 rounded border-[#333] bg-[#1a1a1a] text-[#d4af37] focus:ring-[#d4af37]/30 focus:ring-offset-0 cursor-pointer accent-[#d4af37]"
                      />
                      <span
                        className={cn(
                          "text-[13px]",
                          bh.active
                            ? "text-[#e0e0e0]"
                            : "text-[#444]"
                        )}
                      >
                        {bh.day}
                      </span>
                    </label>
                  </td>
                  <td className="py-2.5">
                    <div className="relative w-[140px]">
                      <select
                        disabled={!bh.active}
                        value={bh.start || timeOptions[0]}
                        onChange={(e) => handleBusinessHourTime(i, "start", e.target.value)}
                        className={cn(
                          "premium-input w-full rounded-lg px-3 py-1.5 text-[13px] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none",
                          !bh.active && "opacity-30 cursor-not-allowed"
                        )}
                      >
                        {timeOptions.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-2.5">
                    <div className="relative w-[140px]">
                      <select
                        disabled={!bh.active}
                        value={bh.end || timeOptions[10]}
                        onChange={(e) => handleBusinessHourTime(i, "end", e.target.value)}
                        className={cn(
                          "premium-input w-full rounded-lg px-3 py-1.5 text-[13px] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none",
                          !bh.active && "opacity-30 cursor-not-allowed"
                        )}
                      >
                        {timeOptions.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
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
                value={`${settings.defaultSlotDuration} min`}
                onChange={(e) =>
                  updateSettings({
                    defaultSlotDuration: parseInt(e.target.value),
                  })
                }
                className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none"
              >
                {slotDurationOptions.map((opt) => (
                  <option key={opt} value={opt.split(" ")[0]}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Buffer Time
            </label>
            <div className="relative">
              <select
                value={`${settings.bufferTime} min`}
                onChange={(e) =>
                  updateSettings({
                    bufferTime: parseInt(e.target.value),
                  })
                }
                className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none"
              >
                {slotDurationOptions.map((opt) => (
                  <option key={opt} value={opt.split(" ")[0]}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Currency
            </label>
            <input
              type="text"
              value={settings.currency}
              onChange={(e) => handleFieldChange("currency", e.target.value)}
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
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Cancellation Notice
            </label>
            <div className="relative">
              <select
                value={`${settings.cancellationPolicyHours} hours`}
                onChange={(e) =>
                  updateSettings({
                    cancellationPolicyHours: parseInt(e.target.value),
                  })
                }
                className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] appearance-none bg-[#1a1a1a] cursor-pointer pr-8 focus:outline-none"
              >
                {cancellationNoticeOptions.map((opt) => (
                  <option key={opt} value={opt.split(" ")[0]}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-1.5">
              Tax Rate
            </label>
            <input
              type="number"
              value={settings.taxRate}
              onChange={(e) => updateSettings({ taxRate: parseFloat(e.target.value) || 0 })}
              step="0.01"
              className="premium-input w-full rounded-lg px-3 py-2 text-[13px] text-[#e0e0e0] placeholder:text-[#555] focus:outline-none"
            />
          </div>
          <div />
        </div>
      </SectionPanel>

      {/* ── Notification Preferences ─────────────────────────────────── */}
      <SectionPanel>
        <h3 className="text-sm font-semibold text-[#e0e0e0] mb-4">
          Notification Preferences
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-[#b0b0b0]">Email Notifications</label>
            <Toggle
              checked={notifications.email}
              onChange={() => handleToggleNotification("email")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-[#b0b0b0]">SMS Notifications</label>
            <Toggle
              checked={notifications.sms}
              onChange={() => handleToggleNotification("sms")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-[#b0b0b0]">Push Notifications</label>
            <Toggle
              checked={notifications.push}
              onChange={() => handleToggleNotification("push")}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-[#b0b0b0]">Marketing Emails</label>
            <Toggle
              checked={notifications.marketing}
              onChange={() => handleToggleNotification("marketing")}
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
  const settings = useBookingStore((s) => s.settings);

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
              {settings.studioName}
            </h4>
            <p className="text-[11px] text-[#666] truncate">
              {settings.email}
            </p>
            <p className="text-[11px] text-[#666]">{settings.phone}</p>
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
            onClick={() => window.open("/", "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Page
          </PremiumButton>
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
      {/* ── Header ─────────────────────────────────────────────────────── */}
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
          {activeTab !== "general" && <GeneralTab />}
        </div>

        {/* Right Column — Always visible */}
        <div className="space-y-4">
          <RightColumn />
        </div>
      </div>
    </div>
  );
}
