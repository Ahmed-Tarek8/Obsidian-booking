"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/dashboard/PremiumButton";
import { useBookingStore, formatCurrency, formatTime12 } from "@/lib/store";
import type { Client, ClientStatus, ClientTier } from "@/lib/types";
import {
  Users,
  Crown,
  UserPlus,
  TrendingUp,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  CalendarDays,
  MessageSquare,
  Bell,
  X,
  Diamond,
  Edit3,
  Save,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list";
type ModalMode = "add" | "edit";
type StatusFilter = "All" | ClientStatus;
type TierFilter = "All" | ClientTier;

interface ClientFormState {
  name: string;
  email: string;
  phone: string;
  tier: ClientTier;
  tags: string;
  notes: string;
}

const EMPTY_FORM: ClientFormState = {
  name: "",
  email: "",
  phone: "",
  tier: "Regular",
  tags: "",
  notes: "",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const statusStyles: Record<ClientStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Returning: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  Inactive: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const tagStyles: Record<string, string> = {
  VIP: "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20",
  "High Value": "bg-[#d4af37]/8 text-[#d4af37]/80 border border-[#d4af37]/15",
  Regular: "bg-white/5 text-[#888] border border-white/8",
  Preferred: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  Returning: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Enterprise: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Investor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  New: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  "Long-term": "bg-violet-500/10 text-violet-400 border border-violet-500/20",
};

const bookingStatusStyles: Record<string, string> = {
  confirmed: "text-blue-400",
  pending: "text-amber-400",
  arrived: "text-emerald-400",
  completed: "text-emerald-400",
  cancelled: "text-red-400",
  "no-show": "text-red-400",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  isGold,
  index,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  changeType: "up" | "neutral";
  isGold?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="premium-panel stat-glow rounded-xl p-4 relative"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center border",
            isGold
              ? "bg-[#d4af37]/15 border-[#d4af37]/15"
              : "bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 border-[#d4af37]/10"
          )}
        >
          <Icon
            className="w-[18px] h-[18px]"
            style={{ color: "#d4af37" }}
            strokeWidth={1.8}
          />
        </div>
        <span
          className={cn(
            "text-[10px] font-medium px-2 py-0.5 rounded-md",
            changeType === "up" &&
              "text-emerald-400 bg-emerald-500/8 border border-emerald-500/10",
            changeType === "neutral" &&
              isGold &&
              "text-[#d4af37] bg-[#d4af37]/8 border border-[#d4af37]/10",
            changeType === "neutral" &&
              !isGold &&
              "text-[#888] bg-white/3 border border-white/5"
          )}
        >
          {change}
        </span>
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl font-bold text-white tracking-tight">
          {value}
        </div>
        <div className="text-xs text-[#888] font-medium uppercase tracking-wider">
          {title}
        </div>
      </div>
    </motion.div>
  );
}

function ClientModal({
  mode,
  form,
  setForm,
  onSave,
  onClose,
}: {
  mode: ModalMode;
  form: ClientFormState;
  setForm: React.Dispatch<React.SetStateAction<ClientFormState>>;
  onSave: () => void;
  onClose: () => void;
}) {
  const inputCls =
    "w-full bg-[#141414] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4af37]/30 transition-colors duration-200";
  const labelCls =
    "text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-1.5 block";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative premium-panel rounded-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4af37]/8">
          <div className="flex items-center gap-2">
            {mode === "add" ? (
              <UserPlus className="w-4 h-4 text-[#d4af37]" />
            ) : (
              <Edit3 className="w-4 h-4 text-[#d4af37]" />
            )}
            <h2 className="text-base font-bold text-white">
              {mode === "add" ? "Add Client" : "Edit Client"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#666] hover:text-white hover:bg-[#252525] transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className={labelCls}>Name *</label>
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputCls}
            />
          </div>

          {/* Email */}
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inputCls}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className={inputCls}
            />
          </div>

          {/* Tier */}
          <div>
            <label className={labelCls}>Tier</label>
            <select
              value={form.tier}
              onChange={(e) =>
                setForm((f) => ({ ...f, tier: e.target.value as ClientTier }))
              }
              className={cn(inputCls, "appearance-none cursor-pointer")}
            >
              <option value="Regular">Regular</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="VIP, High Value, Enterprise"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              className={inputCls}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              placeholder="Any notes about this client..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className={cn(inputCls, "resize-none")}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center gap-2 px-5 py-4 border-t border-[#d4af37]/8 bg-[#141414]/50">
          <PremiumButton
            variant="primary"
            size="md"
            className="flex-1"
            onClick={onSave}
            disabled={!form.name.trim()}
          >
            <Save className="w-3.5 h-3.5" />
            {mode === "add" ? "Add Client" : "Save Changes"}
          </PremiumButton>
          <PremiumButton variant="secondary" size="md" onClick={onClose}>
            Cancel
          </PremiumButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function ClientsPage() {
  const {
    clients,
    appointments,
    addClient,
    updateClient,
    getService,
    getStaff,
  } = useBookingStore();

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [tierFilter, setTierFilter] = useState<TierFilter>("All");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientFormState>(EMPTY_FORM);

  // ── Derived data ──────────────────────────────────────────────────────────

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) ?? null,
    [clients, selectedClientId]
  );

  const clientBookings = useMemo(
    () =>
      selectedClientId
        ? appointments
            .filter((a) => a.clientId === selectedClientId)
            .sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
        : [],
    [appointments, selectedClientId]
  );

  const filteredClients = useMemo(() => {
    let result = clients;
    if (statusFilter !== "All") {
      result = result.filter((c) => c.status === statusFilter);
    }
    if (tierFilter !== "All") {
      result = result.filter((c) => c.tier === tierFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
      );
    }
    return result;
  }, [clients, statusFilter, tierFilter, searchQuery]);

  // Stat cards computed from store
  const stats = useMemo(() => {
    const total = clients.length;
    const vipCount = clients.filter((c) => c.tier === "VIP").length;
    const newThisMonth = clients.filter((c) => {
      const d = new Date(c.createdDate);
      return d.getFullYear() === 2024 && d.getMonth() === 4; // May 2024
    }).length;
    const avgLTV =
      total > 0
        ? clients.reduce((sum, c) => sum + c.lifetimeValue, 0) / total
        : 0;

    return [
      {
        title: "Total Clients",
        value: total.toLocaleString(),
        icon: Users,
        change: "From store",
        changeType: "neutral" as const,
        index: 0,
      },
      {
        title: "VIP Clients",
        value: vipCount.toLocaleString(),
        icon: Crown,
        change: `${total > 0 ? Math.round((vipCount / total) * 100) : 0}% of total`,
        changeType: "neutral" as const,
        isGold: true,
        index: 1,
      },
      {
        title: "New This Month",
        value: newThisMonth.toLocaleString(),
        icon: UserPlus,
        change: "May 2024",
        changeType: "neutral" as const,
        index: 2,
      },
      {
        title: "Avg Lifetime Value",
        value: formatCurrency(Math.round(avgLTV)),
        icon: TrendingUp,
        change: "Per client",
        changeType: "neutral" as const,
        index: 3,
      },
    ];
  }, [clients]);

  // ── Modal handlers ────────────────────────────────────────────────────────

  function openAddModal() {
    setForm(EMPTY_FORM);
    setModalMode("add");
    setEditingClientId(null);
    setModalOpen(true);
  }

  function openEditModal(client: Client) {
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      tier: client.tier,
      tags: client.tags.join(", "),
      notes: client.notes,
    });
    setModalMode("edit");
    setEditingClientId(client.id);
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (modalMode === "add") {
      addClient({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        tier: form.tier,
        status: "Active",
        tags,
        notes: form.notes.trim(),
        lastBookingDate: "",
      });
    } else if (editingClientId) {
      updateClient(editingClientId, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        tier: form.tier,
        tags,
        notes: form.notes.trim(),
      });
    }
    setModalOpen(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="animate-fade-in-up p-6 space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Clients</h1>
          <p className="text-sm text-[#888] mt-1">
            View client profiles, loyalty, and booking history.
          </p>
        </div>
        <PremiumButton variant="primary" size="md" onClick={openAddModal}>
          <UserPlus className="w-4 h-4" />
          Add Client
        </PremiumButton>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            type="text"
            placeholder="Search clients by name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="premium-input w-full rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[120px]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Returning">Returning</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as TierFilter)}
            className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-lg px-3 py-2 text-sm text-[#999] focus:outline-none focus:border-[#d4af37]/30 appearance-none cursor-pointer min-w-[120px]"
          >
            <option value="All">All Tiers</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
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

      {/* ── Main Content + Sidebar ─────────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Left: Client List/Grid */}
        <div className="flex-1 min-w-0">
          <div className="premium-panel rounded-xl overflow-hidden">
            {viewMode === "list" ? (
              /* ── List (Table) View ─────────────────────────────────────────── */
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#d4af37]/8">
                        <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                          Last Booking
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                          Total Bookings
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                          Lifetime Value
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider">
                          Tags
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold text-[#666] uppercase tracking-wider w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => {
                        const isSelected = selectedClientId === client.id;
                        const lastBooking = client.lastBookingDate
                          ? formatDate(client.lastBookingDate)
                          : "—";
                        return (
                          <tr
                            key={client.id}
                            onClick={() =>
                              setSelectedClientId(
                                isSelected ? null : client.id
                              )
                            }
                            className={cn(
                              "border-b border-[#d4af37]/5 cursor-pointer transition-colors duration-150 group",
                              "bg-[#141414] hover:bg-[#1a1a1a]",
                              isSelected &&
                                "border-l-2 border-l-[#d4af37]/40 bg-[#1a1a1a]"
                            )}
                          >
                            {/* Client */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0">
                                  {client.initials}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm text-white font-medium whitespace-nowrap">
                                    {client.name}
                                  </span>
                                  {client.tier === "VIP" && (
                                    <Diamond className="w-3 h-3 text-[#d4af37] shrink-0" />
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Contact */}
                            <td className="px-4 py-3">
                              <div className="space-y-0.5">
                                <div className="text-xs text-[#ccc] whitespace-nowrap">
                                  {client.phone}
                                </div>
                                <div className="text-xs text-[#777] whitespace-nowrap">
                                  {client.email}
                                </div>
                              </div>
                            </td>

                            {/* Last Booking */}
                            <td className="px-4 py-3">
                              <span className="text-xs text-[#aaa] whitespace-nowrap">
                                {lastBooking}
                              </span>
                            </td>

                            {/* Total Bookings */}
                            <td className="px-4 py-3">
                              <span className="text-sm text-[#ccc] font-medium">
                                {client.totalBookings}
                              </span>
                            </td>

                            {/* Lifetime Value */}
                            <td className="px-4 py-3">
                              <span className="text-sm text-[#d4af37] font-medium">
                                {formatCurrency(client.lifetimeValue)}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "inline-block px-2 py-0.5 rounded text-[10px] font-medium",
                                  statusStyles[client.status]
                                )}
                              >
                                {client.status}
                              </span>
                            </td>

                            {/* Tags */}
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {client.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className={cn(
                                      "inline-block px-2 py-0.5 rounded text-[10px] font-medium",
                                      tagStyles[tag] ??
                                        "bg-white/5 text-[#888] border border-white/8"
                                    )}
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {client.tags.length > 2 && (
                                  <span className="text-[10px] text-[#666]">
                                    +{client.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <ChevronRight className="w-4 h-4 text-[#555] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Count */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#d4af37]/8">
                  <span className="text-xs text-[#666]">
                    Showing {filteredClients.length} of {clients.length} clients
                  </span>
                </div>
              </>
            ) : (
              /* ── Grid View ────────────────────────────────────────────────── */
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {filteredClients.map((client) => {
                      const isSelected = selectedClientId === client.id;
                      const lastBooking = client.lastBookingDate
                        ? formatDate(client.lastBookingDate)
                        : "—";
                      return (
                        <motion.div
                          key={client.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onClick={() =>
                            setSelectedClientId(
                              isSelected ? null : client.id
                            )
                          }
                          className={cn(
                            "p-4 rounded-lg cursor-pointer transition-all duration-200 border",
                            "bg-[#141414] hover:bg-[#1a1a1a]",
                            isSelected
                              ? "border-[#d4af37]/40 bg-[#1a1a1a]"
                              : "border-[#d4af37]/5"
                          )}
                        >
                          {/* Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0">
                              {client.initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm text-white font-medium truncate">
                                  {client.name}
                                </span>
                                {client.tier === "VIP" && (
                                  <Diamond className="w-3 h-3 text-[#d4af37] shrink-0" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  "inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mt-0.5",
                                  statusStyles[client.status]
                                )}
                              >
                                {client.status}
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-2 text-[#888]">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span className="truncate">{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#888]">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#d4af37]/5">
                            <div>
                              <div className="text-[10px] text-[#555]">Bookings</div>
                              <div className="text-sm text-[#ccc] font-medium">
                                {client.totalBookings}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-[#555]">LTV</div>
                              <div className="text-sm text-[#d4af37] font-medium">
                                {formatCurrency(client.lifetimeValue)}
                              </div>
                            </div>
                            <div className="ml-auto">
                              <div className="text-[10px] text-[#555]">Last Visit</div>
                              <div className="text-[10px] text-[#888]">
                                {lastBooking}
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          {client.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {client.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className={cn(
                                    "inline-block px-1.5 py-0.5 rounded text-[10px] font-medium",
                                    tagStyles[tag] ??
                                      "bg-white/5 text-[#888] border border-white/8"
                                  )}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
                <div className="mt-3 text-xs text-[#666] text-center">
                  Showing {filteredClients.length} of {clients.length} clients
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Client Detail Sidebar ──────────────────────────────────── */}
        <div className="w-[320px] shrink-0 hidden lg:block">
          <AnimatePresence mode="wait">
            {selectedClient && (
              <motion.div
                key={selectedClient.id}
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="premium-panel rounded-xl overflow-hidden h-full max-h-[calc(100vh-220px)] flex flex-col"
              >
                {/* Sidebar scrollable content */}
                <div className="overflow-y-auto flex-1">
                  {/* Header */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-sm font-bold shrink-0">
                          {selectedClient.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h2 className="text-lg font-bold text-white">
                              {selectedClient.name}
                            </h2>
                            {selectedClient.tier === "VIP" && (
                              <Diamond className="w-3.5 h-3.5 text-[#d4af37]" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                selectedClient.status === "Active" &&
                                  "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
                                selectedClient.status === "Returning" &&
                                  "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]",
                                selectedClient.status === "Inactive" &&
                                  "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                              )}
                            />
                            <span className="text-xs text-[#999]">
                              {selectedClient.status} · {selectedClient.tier}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedClientId(null)}
                        className="p-1 rounded-md text-[#666] hover:text-white hover:bg-[#252525] transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex-1 bg-[#141414] rounded-lg p-2.5 text-center border border-[#d4af37]/5">
                        <div className="text-lg font-bold text-white">
                          {selectedClient.totalBookings}
                        </div>
                        <div className="text-[10px] text-[#666] uppercase tracking-wider">
                          Bookings
                        </div>
                      </div>
                      <div className="flex-1 bg-[#141414] rounded-lg p-2.5 text-center border border-[#d4af37]/5">
                        <div className="text-lg font-bold text-[#d4af37]">
                          {formatCurrency(selectedClient.lifetimeValue)}
                        </div>
                        <div className="text-[10px] text-[#666] uppercase tracking-wider">
                          LTV
                        </div>
                      </div>
                      <div className="flex-1 bg-[#141414] rounded-lg p-2.5 text-center border border-[#d4af37]/5">
                        <div className="text-lg font-bold text-white">
                          {selectedClient.tags.length}
                        </div>
                        <div className="text-[10px] text-[#666] uppercase tracking-wider">
                          Tags
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Contact Info
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <span className="text-xs text-[#ccc]">
                          {selectedClient.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <span className="text-xs text-[#ccc]">
                          {selectedClient.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <CalendarDays className="w-3.5 h-3.5 text-[#555] shrink-0" />
                        <span className="text-xs text-[#ccc]">
                          Client since {formatDate(selectedClient.createdDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedClient.tags.length > 0 && (
                    <div className="p-5 border-b border-[#d4af37]/8">
                      <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedClient.tags.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              "inline-block px-2 py-0.5 rounded text-[10px] font-medium",
                              tagStyles[tag] ??
                                "bg-white/5 text-[#888] border border-white/8"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking History */}
                  <div className="p-5 border-b border-[#d4af37]/8">
                    <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Booking History
                    </h3>
                    {clientBookings.length > 0 ? (
                      <div className="space-y-3">
                        {clientBookings.map((booking) => {
                          const svc = getService(booking.serviceId);
                          const staff = getStaff(booking.staffId);
                          return (
                            <div
                              key={booking.id}
                              className="flex items-start justify-between gap-3"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="text-xs text-[#ccc] font-medium truncate">
                                  {svc?.name ?? booking.serviceId}
                                </div>
                                <div className="text-[10px] text-[#666]">
                                  {formatDate(booking.date)} ·{" "}
                                  {formatTime12(booking.startTime)}
                                </div>
                                {staff && (
                                  <div className="text-[10px] text-[#555]">
                                    with {staff.name}
                                  </div>
                                )}
                              </div>
                              <span
                                className={cn(
                                  "text-[10px] font-medium shrink-0 mt-0.5 capitalize",
                                  bookingStatusStyles[booking.status] ??
                                    "text-[#888]"
                                )}
                              >
                                {booking.status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[#555]">
                        No booking history yet.
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  {selectedClient.notes && (
                    <div className="p-5 border-b border-[#d4af37]/8">
                      <h3 className="text-[10px] font-semibold text-[#666] uppercase tracking-wider mb-3">
                        Notes
                      </h3>
                      <p className="text-xs text-[#888] leading-relaxed">
                        {selectedClient.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-[#d4af37]/8 space-y-2 bg-[#141414]/50">
                  <PremiumButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => openEditModal(selectedClient)}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Client
                  </PremiumButton>
                  <div className="flex gap-2">
                    <PremiumButton variant="secondary" size="md" className="flex-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </PremiumButton>
                    <PremiumButton variant="secondary" size="md" className="flex-1">
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </PremiumButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <ClientModal
            mode={modalMode}
            form={form}
            setForm={setForm}
            onSave={handleSave}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}