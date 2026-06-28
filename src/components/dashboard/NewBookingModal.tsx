"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "./PremiumButton";
import { useBookingStore, formatTime12, formatCurrency } from "@/lib/store";

// 30-minute time slots from 08:00 to 18:00
const TIME_SLOTS: string[] = Array.from({ length: 21 }, (_, i) => {
  const total = 8 * 60 + i * 30;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
});

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
}

interface NewBookingModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewBookingModal({ open, onClose }: NewBookingModalProps) {
  const clients = useBookingStore((s) => s.clients);
  const services = useBookingStore((s) => s.services);
  const staff = useBookingStore((s) => s.staff);
  const resources = useBookingStore((s) => s.resources);
  const addAppointment = useBookingStore((s) => s.addAppointment);
  const addClient = useBookingStore((s) => s.addClient);

  const [isNewClient, setIsNewClient] = useState(false);
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  // New client fields
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientNotes, setNewClientNotes] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setIsNewClient(false);
      setClientId("");
      setServiceId("");
      setStaffId("");
      setResourceId("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setNotes("");
      setNewClientName("");
      setNewClientEmail("");
      setNewClientPhone("");
      setNewClientNotes("");
    }
  }, [open]);

  // Auto-calculate endTime when startTime or service changes
  useEffect(() => {
    if (startTime && serviceId) {
      const svc = services.find((s) => s.id === serviceId);
      if (svc) {
        setEndTime(addMinutesToTime(startTime, svc.duration));
      }
    }
  }, [startTime, serviceId, services]);

  // Filtered staff based on selected service
  const availableStaff = serviceId
    ? staff.filter((s) => {
        const svc = services.find((sv) => sv.id === serviceId);
        return svc ? svc.staffIds.includes(s.id) : true;
      })
    : staff;

  // Reset staff when service changes
  useEffect(() => {
    setStaffId("");
  }, [serviceId]);

  const canCreateFromExisting =
    clientId &&
    serviceId &&
    staffId &&
    resourceId &&
    date &&
    startTime &&
    endTime;

  const canCreateNewClient =
    isNewClient &&
    newClientName.trim() &&
    newClientEmail.trim() &&
    serviceId &&
    staffId &&
    resourceId &&
    date &&
    startTime &&
    endTime;

  const canCreate = canCreateFromExisting || canCreateNewClient;

  const handleCreate = () => {
    if (!canCreate) return;

    let finalClientId = clientId;

    if (isNewClient) {
      addClient({
        name: newClientName.trim(),
        email: newClientEmail.trim(),
        phone: newClientPhone.trim(),
        notes: newClientNotes.trim(),
        tier: "Regular",
        status: "Active",
        tags: [],
      });
      // Use the most recently added client (last in array)
      finalClientId = `cl-${Date.now()}`;
    }

    addAppointment({
      clientId: finalClientId,
      serviceId,
      staffId,
      resourceId,
      date,
      startTime,
      endTime,
      status: "pending",
      notes,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-lg premium-panel rounded-xl border border-[#d4af37]/15 shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4af37]/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#d4af37]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#e0e0e0]">
                    New Booking
                  </h2>
                  <p className="text-[11px] text-[#666]">
                    Schedule a new appointment
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Client selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                    Client
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewClient(!isNewClient);
                      setClientId("");
                    }}
                    className="flex items-center gap-1 text-[11px] text-[#d4af37] hover:text-[#e0c55a] transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3" />
                    {isNewClient ? "Select existing" : "New client"}
                  </button>
                </div>

                {isNewClient ? (
                  <div className="space-y-3 p-3 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/10">
                    <input
                      type="text"
                      placeholder="Client name"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#1a1a1a] border border-[#d4af37]/10 text-[#e0e0e0] text-[13px] placeholder:text-[#444] focus:outline-none focus:border-[#d4af37]/40"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#1a1a1a] border border-[#d4af37]/10 text-[#e0e0e0] text-[13px] placeholder:text-[#444] focus:outline-none focus:border-[#d4af37]/40"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number (optional)"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#1a1a1a] border border-[#d4af37]/10 text-[#e0e0e0] text-[13px] placeholder:text-[#444] focus:outline-none focus:border-[#d4af37]/40"
                    />
                  </div>
                ) : (
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                      focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                      [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                  >
                    <option value="">Select a client…</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.tier === "VIP" ? " (VIP)" : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Service */}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                  Service
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                    focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                    [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                >
                  <option value="">Select a service…</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {formatCurrency(s.price)} · {s.duration} min
                    </option>
                  ))}
                </select>
              </div>

              {/* Staff */}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                  Staff
                </label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                    focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                    [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                >
                  <option value="">
                    Select staff{serviceId ? " (filtered by service)" : "…"}
                  </option>
                  {availableStaff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource */}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                  Resource
                </label>
                <select
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                    focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                    [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                >
                  <option value="">Select a resource…</option>
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code}) — {r.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time row */}
              <div className="grid grid-cols-3 gap-3">
                {/* Date */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                      focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                      [color-scheme:dark]"
                  />
                </div>

                {/* Start Time */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                    Start
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                      focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                      [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                  >
                    <option value="">Time…</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime12(t)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* End Time */}
                <div className="col-span-1">
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                    End
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                      focus:outline-none focus:border-[#d4af37]/40 cursor-pointer
                      [&>option]:bg-[#0e0e0e] [&>option]:text-[#ccc]"
                  >
                    <option value="">Time…</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime12(t)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional notes for this booking…"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e0e0e] border border-[#d4af37]/15 text-[#e0e0e0] text-[13px]
                    placeholder:text-[#444] focus:outline-none focus:border-[#d4af37]/40 resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#d4af37]/8 flex items-center justify-end gap-3">
              <PremiumButton variant="secondary" onClick={onClose}>
                Cancel
              </PremiumButton>
              <PremiumButton
                variant="primary"
                onClick={handleCreate}
                disabled={!canCreate}
              >
                <Plus className="w-4 h-4" />
                Create Booking
              </PremiumButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}