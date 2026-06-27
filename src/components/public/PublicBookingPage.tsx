"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Calendar, Clock, User, Mail, Phone, FileText,
  ArrowRight, Diamond, ArrowLeft, Zap, Shield, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumButton } from "@/components/dashboard/PremiumButton";
import { useBookingStore, formatTime12, formatCurrency } from "@/lib/store";
import { ObsidianSchedulingCore } from "./ObsidianSchedulingCore";

type BookingStep = "service" | "datetime" | "details" | "confirm" | "success";

const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 8; h <= 17; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    slots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return slots;
})();

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${Math.floor(total / 60).toString().padStart(2, "0")}:${(total % 60).toString().padStart(2, "0")}`;
}

export function PublicBookingPage({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  const services = useBookingStore((s) => s.services);
  const staff = useBookingStore((s) => s.staff);
  const resources = useBookingStore((s) => s.resources);
  const settings = useBookingStore((s) => s.settings);
  const addAppointment = useBookingStore((s) => s.addAppointment);
  const addClient = useBookingStore((s) => s.addClient);
  const clients = useBookingStore((s) => s.clients);

  const [step, setStep] = useState<BookingStep>("service");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [createdBooking, setCreatedBooking] = useState<{ id: string; bookingId: string } | null>(null);

  const activeServices = services.filter((s) => s.availability !== "Inactive");
  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [services, selectedServiceId]
  );

  const availableDates = useMemo(() => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === 0) continue;
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }, []);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return TIME_SLOTS;
    const booked = useBookingStore
      .getState()
      .appointments.filter(
        (a) => a.date === selectedDate && a.status !== "cancelled"
      )
      .map((a) => a.startTime);
    return TIME_SLOTS.filter((t) => !booked.includes(t));
  }, [selectedDate]);

  const canProceedToDateTime = !!selectedServiceId;
  const canProceedToDetails = !!selectedDate && !!selectedTime;
  const canBook = clientName.trim() && clientEmail.trim() && clientPhone.trim();

  const handleBook = () => {
    if (!canBook || !selectedServiceId || !selectedDate || !selectedTime || !selectedService) return;
    let client = clients.find(
      (c) => c.email.toLowerCase() === clientEmail.toLowerCase()
    );
    if (!client) {
      addClient({
        name: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        tier: "Regular",
        status: "Active",
        tags: [],
        lastBookingDate: selectedDate,
        notes: "",
      });
      client = useBookingStore
        .getState()
        .clients.find((c) => c.email.toLowerCase() === clientEmail.toLowerCase());
    }
    if (!client) return;
    const availableStaff = staff.find((s) => {
      const svc = services.find((sv) => sv.id === selectedServiceId);
      return svc ? svc.staffIds.includes(s.id) : false;
    });
    const availableResource =
      resources.find((r) => r.status === "Available") || resources[0];
    const endTime = addMinutesToTime(selectedTime, selectedService.duration);
    addAppointment({
      clientId: client.id,
      serviceId: selectedServiceId,
      staffId: availableStaff?.id || staff[0]?.id || "",
      resourceId: availableResource?.id || "",
      date: selectedDate,
      startTime: selectedTime,
      endTime,
      status: "pending",
      notes: notes.trim(),
    });
    const allAppts = useBookingStore.getState().appointments;
    const latest = allAppts[allAppts.length - 1];
    setCreatedBooking({ id: latest.id, bookingId: latest.bookingId });
    setStep("success");
  };

  const handleReset = () => {
    setStep("service");
    setSelectedServiceId(null);
    setSelectedDate("");
    setSelectedTime("");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setNotes("");
    setCreatedBooking(null);
  };

  const inputCls =
    "w-full bg-[#141414] border border-[#d4af37]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#e0e0e0] placeholder:text-[#555] focus:outline-none focus:border-[#d4af37]/40 transition-colors";

  // ── Success step (full-width) ────────────────────────────────
  if (step === "success") {
    return (
      <div className="obsidian-page-bg">
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="ambient-particle" />
        <div className="booking-stage">
          <header className="border-b border-[#d4af37]/8 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Obsidian Booking" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#e0e0e0] tracking-wide">OBSIDIAN</div>
                <div className="text-[9px] tracking-[0.2em] text-[#d4af37]/60 font-medium uppercase">Booking</div>
              </div>
            </div>
            <PremiumButton variant="secondary" size="sm" onClick={onOpenDashboard}>
              Open Dashboard
            </PremiumButton>
          </header>
          <main className="flex items-start justify-center px-4 py-12 overflow-y-auto">
            <div className="w-full max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-[#888] text-sm mb-8">Your appointment has been submitted for review.</p>
                <div className="premium-panel rounded-xl p-6 mb-8 text-left">
                  <div className="text-center mb-5 pb-5 border-b border-[#d4af37]/8">
                    <div className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Booking Reference</div>
                    <div className="text-2xl font-bold text-[#d4af37]">{createdBooking?.bookingId}</div>
                  </div>
                  {selectedService && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#888]">Service</span>
                        <span className="text-[#ccc] font-medium">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888]">Date</span>
                        <span className="text-[#ccc]">
                          {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888]">Time</span>
                        <span className="text-[#ccc]">{formatTime12(selectedTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888]">Status</span>
                        <span className="text-amber-400 font-medium">Pending Confirmation</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#555] mb-8">
                  A confirmation will be sent to <span className="text-[#888]">{clientEmail}</span>.
                  You will be notified once your booking is confirmed.
                </p>
                <div className="flex gap-3 justify-center">
                  <PremiumButton variant="secondary" onClick={handleReset}>Book Another</PremiumButton>
                  <PremiumButton variant="ghost" onClick={onOpenDashboard}>
                    View Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </PremiumButton>
                </div>
              </motion.div>
            </div>
          </main>
          <footer className="border-t border-[#d4af37]/6 px-6 py-4 text-center">
            <p className="text-[11px] text-[#444]">{settings.studioName} · {settings.phone}</p>
          </footer>
        </div>
      </div>
    );
  }

  // ── Main booking flow (two-column) ───────────────────────────
  return (
    <div className="obsidian-page-bg">
      <div className="ambient-particle" />
      <div className="ambient-particle" />
      <div className="ambient-particle" />
      <div className="ambient-particle" />
      <div className="ambient-particle" />
      <div className="ambient-particle" />
      <div className="ambient-particle" />
      <div className="ambient-particle" />
      <div className="booking-stage">
        {/* Header */}
        <header className="border-b border-[#d4af37]/8 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src="/logo.png" alt="Obsidian Booking" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#e0e0e0] tracking-wide">OBSIDIAN</div>
              <div className="text-[9px] tracking-[0.2em] text-[#d4af37]/60 font-medium uppercase">Booking</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#444] hidden sm:block">Premium appointment studio</span>
            <PremiumButton variant="secondary" size="sm" onClick={onOpenDashboard}>
              Open Dashboard
            </PremiumButton>
          </div>
        </header>

        {/* Two-column hero */}
        <div className="booking-hero-grid">
          {/* Left: hero copy + booking card */}
          <div className="flex flex-col justify-center py-12 pr-8">
            <div className="mb-8">
              <div className="text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.3em] mb-3 opacity-70">
                Premium Scheduling
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
                Book a private appointment
                <br />
                <span className="text-[#d4af37]">with Obsidian</span>
              </h1>
              <p className="text-[#888] text-sm leading-relaxed mb-6">
                Choose a service, reserve a time, and receive a booking reference instantly.
                Your appointment will be confirmed by our team.
              </p>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#d4af37]/60" />
                  <span className="text-[11px] text-[#666]">Live availability</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#d4af37]/60" />
                  <span className="text-[11px] text-[#666]">Private record</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#d4af37]/60" />
                  <span className="text-[11px] text-[#666]">Pending confirmation</span>
                </div>
              </div>
            </div>

            {/* Booking card */}
            <div className="premium-panel rounded-xl overflow-hidden">
              <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
              <div className="p-5">
                {/* Progress steps */}
                <div className="flex items-center gap-2 mb-6">
                  {(["service", "datetime", "details", "confirm"] as const).map((s, i) => {
                    const stepOrder = ["service", "datetime", "details", "confirm"] as const;
                    const currentIdx = stepOrder.indexOf(step);
                    const isActive = step === s;
                    const isPast = currentIdx > i;
                    return (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 transition-all",
                            isActive
                              ? "bg-[#d4af37] text-[#0a0a0a]"
                              : isPast
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-[#1e1e1e] text-[#555] border border-[#333]"
                          )}
                        >
                          {isPast ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                        </div>
                        <div
                          className={cn(
                            "text-[10px] font-medium hidden sm:block flex-1",
                            isActive ? "text-[#d4af37]" : "text-[#555]"
                          )}
                        >
                          {s === "service" && "Service"}
                          {s === "datetime" && "Schedule"}
                          {s === "details" && "Details"}
                          {s === "confirm" && "Confirm"}
                        </div>
                        {i < 3 && (
                          <div
                            className={cn(
                              "flex-1 h-px",
                              isPast ? "bg-emerald-500/20" : "bg-[#333]"
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {/* ── Step: Service ──────────────────────────────── */}
                  {step === "service" && (
                    <motion.div
                      key="service"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-sm font-semibold text-[#e0e0e0] mb-3">
                        Select a Service
                      </h3>
                      <div className="space-y-2 mb-5 max-h-[320px] overflow-y-auto pr-1">
                        {activeServices.map((svc) => (
                          <button
                            key={svc.id}
                            onClick={() => setSelectedServiceId(svc.id)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg border transition-all",
                              selectedServiceId === svc.id
                                ? "border-[#d4af37]/50 bg-[#d4af37]/8"
                                : "border-[#d4af37]/10 bg-[#141414] hover:border-[#d4af37]/25"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-sm font-medium text-[#e0e0e0]">
                                    {svc.name}
                                  </span>
                                  {svc.featured && (
                                    <span className="text-[7px] font-bold text-[#d4af37] uppercase tracking-wider bg-[#d4af37]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                      <Diamond className="w-2 h-2" />
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#777] leading-relaxed line-clamp-1">
                                  {svc.description}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-sm font-bold text-[#d4af37]">
                                  {formatCurrency(svc.price)}
                                </div>
                                <div className="text-[10px] text-[#666]">
                                  {svc.duration} min
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <PremiumButton
                          variant="primary"
                          disabled={!canProceedToDateTime}
                          onClick={() => setStep("datetime")}
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </PremiumButton>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step: Date & Time ─────────────────────────── */}
                  {step === "datetime" && (
                    <motion.div
                      key="datetime"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-sm font-semibold text-[#e0e0e0] mb-3">
                        {selectedService?.name} — {selectedService?.duration} min
                      </h3>
                      <div className="mb-4">
                        <label className="block text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-2">
                          Pick a Date
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {availableDates.map((d) => {
                            const dateObj = new Date(d + "T12:00:00");
                            const isSelected = selectedDate === d;
                            return (
                              <button
                                key={d}
                                onClick={() => {
                                  setSelectedDate(d);
                                  setSelectedTime("");
                                }}
                                className={cn(
                                  "flex flex-col items-center py-2 rounded-lg border text-center transition-all",
                                  isSelected
                                    ? "border-[#d4af37]/50 bg-[#d4af37]/10 text-[#d4af37]"
                                    : "border-[#d4af37]/10 bg-[#141414] hover:border-[#d4af37]/25 text-[#ccc]"
                                )}
                              >
                                <span className="text-[9px] font-medium uppercase tracking-wider">
                                  {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
                                </span>
                                <span className="text-base font-bold leading-tight">
                                  {dateObj.getDate()}
                                </span>
                                <span className="text-[9px] text-[#555]">
                                  {dateObj.toLocaleDateString("en-US", { month: "short" })}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {selectedDate && (
                        <div className="mb-5">
                          <label className="block text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-2">
                            Available Times
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {availableSlots.map((t) => {
                              const isSelected = selectedTime === t;
                              return (
                                <button
                                  key={t}
                                  onClick={() => setSelectedTime(t)}
                                  className={cn(
                                    "py-1.5 rounded-lg border text-[11px] font-medium text-center transition-all",
                                    isSelected
                                      ? "border-[#d4af37]/50 bg-[#d4af37]/10 text-[#d4af37]"
                                      : "border-[#d4af37]/10 bg-[#141414] hover:border-[#d4af37]/25 text-[#ccc]"
                                  )}
                                >
                                  {formatTime12(t)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <PremiumButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setStep("service")}
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          Back
                        </PremiumButton>
                        <PremiumButton
                          variant="primary"
                          disabled={!canProceedToDetails}
                          onClick={() => setStep("details")}
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </PremiumButton>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step: Details ─────────────────────────────── */}
                  {step === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-sm font-semibold text-[#e0e0e0] mb-3">
                        Your Details
                      </h3>
                      <div className="space-y-3 mb-5">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-1">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
                            <input
                              type="text"
                              placeholder="Your full name"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              className={cn(inputCls, "pl-9 text-xs")}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-1">
                            Email *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
                            <input
                              type="email"
                              placeholder="you@example.com"
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              className={cn(inputCls, "pl-9 text-xs")}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-1">
                            Phone *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
                            <input
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              className={cn(inputCls, "pl-9 text-xs")}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#888] uppercase tracking-wider mb-1">
                            Notes
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-[#555]" />
                            <textarea
                              placeholder="Any special requests…"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              rows={2}
                              className={cn(inputCls, "pl-9 resize-none text-xs")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <PremiumButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setStep("datetime")}
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          Back
                        </PremiumButton>
                        <PremiumButton
                          variant="primary"
                          disabled={!canBook}
                          onClick={() => setStep("confirm")}
                        >
                          Review
                          <ArrowRight className="w-4 h-4" />
                        </PremiumButton>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step: Confirm ────────────────────────────── */}
                  {step === "confirm" && selectedService && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-sm font-semibold text-[#e0e0e0] mb-3">
                        Review Booking
                      </h3>
                      <div className="space-y-3 mb-5">
                        <div className="flex items-start gap-3 pb-3 border-b border-[#d4af37]/8">
                          <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                            <Diamond className="w-3.5 h-3.5 text-[#d4af37]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#e0e0e0]">
                              {selectedService.name}
                            </div>
                            <div className="text-[11px] text-[#d4af37]">
                              {formatCurrency(selectedService.price)} · {selectedService.duration} min
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#d4af37]/50" />
                            <div>
                              <div className="text-[9px] text-[#555] uppercase tracking-wider">
                                Date
                              </div>
                              <div className="text-[11px] text-[#ccc]">
                                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#d4af37]/50" />
                            <div>
                              <div className="text-[9px] text-[#555] uppercase tracking-wider">
                                Time
                              </div>
                              <div className="text-[11px] text-[#ccc]">
                                {formatTime12(selectedTime)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 text-[11px]">
                          <User className="w-3.5 h-3.5 text-[#555] mt-0.5" />
                          <div>
                            <div className="text-[9px] text-[#555] uppercase tracking-wider">
                              Contact
                            </div>
                            <div className="text-[#ccc]">{clientName}</div>
                            <div className="text-[#777]">{clientEmail}</div>
                          </div>
                        </div>
                        {notes && (
                          <div className="text-[11px] text-[#777] pl-5">{notes}</div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <PremiumButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setStep("details")}
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          Back
                        </PremiumButton>
                        <PremiumButton variant="primary" onClick={handleBook}>
                          <CheckCircle2 className="w-4 h-4" />
                          Confirm Booking
                        </PremiumButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: animated visual */}
          <div className="flex items-center justify-center">
            <ObsidianSchedulingCore />
          </div>
        </div>

        <footer className="border-t border-[#d4af37]/6 px-6 py-4 text-center">
          <p className="text-[11px] text-[#444]">
            {settings.studioName} · {settings.phone}
          </p>
        </footer>
      </div>
    </div>
  );
}