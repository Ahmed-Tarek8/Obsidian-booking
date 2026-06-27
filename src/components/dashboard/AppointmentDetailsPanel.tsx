"use client";

import { motion } from "framer-motion";
import {
  X,
  Clock,
  MapPin,
  Layers,
  User,
  FileText,
  Diamond,
} from "lucide-react";
import { PremiumButton } from "./PremiumButton";
import { StatusChip } from "./StatusChip";
import { useBookingStore } from "@/lib/store";
import { toast } from "sonner";

interface AppointmentDetails {
  id: string;
  clientInitials: string;
  clientLabel: string;
  clientType?: string;
  service: string;
  staffInitials: string;
  staffLabel: string;
  date: string;
  time: string;
  endTime: string;
  duration: string;
  location: string;
  status: "confirmed" | "pending" | "rescheduled" | "cancelled" | "completed";
  notes?: string;
  bookingId: string;
}

const defaultDetails: AppointmentDetails = {
  id: "",
  clientInitials: "??",
  clientLabel: "Unknown",
  service: "—",
  staffInitials: "??",
  staffLabel: "—",
  date: "—",
  time: "—",
  endTime: "—",
  duration: "—",
  location: "—",
  status: "pending",
  bookingId: "#0000",
};

interface AppointmentDetailsPanelProps {
  details?: AppointmentDetails;
  onClose?: () => void;
  isOpen: boolean;
}

export function AppointmentDetailsPanel({ details = defaultDetails, onClose, isOpen }: AppointmentDetailsPanelProps) {
  const cancelAppointment = useBookingStore((s) => s.cancelAppointment);
  const updateAppointmentStatus = useBookingStore((s) => s.updateAppointmentStatus);

  const handleCancel = () => {
    if (!details?.id) return;
    cancelAppointment(details.id);
    toast.success("Booking cancelled");
    onClose?.();
  };

  const handleCheckIn = () => {
    if (!details?.id) return;
    updateAppointmentStatus(details.id, "arrived");
    toast.success("Client checked in");
  };

  const handleConfirm = () => {
    if (!details?.id) return;
    updateAppointmentStatus(details.id, "confirmed");
    toast.success("Booking confirmed");
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-[300px] flex-shrink-0 h-full overflow-hidden"
    >
      <div className="premium-panel rounded-xl h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d4af37]/8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
            <span className="text-xs font-semibold text-[#999] uppercase tracking-widest">
              Appointment Details
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#e0e0e0] hover:bg-[#1e1e1e] transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Client monogram & info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center">
                <span className="text-lg font-bold text-[#d4af37]">{details.clientInitials}</span>
              </div>
              {details.clientType && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-b from-[#d4af37] to-[#b8960b] rounded-md px-1 py-0.5">
                  <Diamond className="w-2.5 h-2.5 text-[#0a0a0a]" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e0e0e0]">{details.clientLabel}</div>
              {details.clientType && (
                <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                  {details.clientType} Member
                </span>
              )}
              <div className="text-[11px] text-[#666] mt-0.5">Booking {details.bookingId}</div>
            </div>
          </div>

          {/* Status */}
          <div>
            <StatusChip status={details.status} />
          </div>

          {/* Details grid */}
          <div className="space-y-3.5">
            <DetailRow icon={Layers} label="Service" value={details.service} />
            <DetailRow icon={User} label="Staff" value={details.staffLabel} />
            <DetailRow icon={Clock} label="Time" value={`${details.time} — ${details.endTime}`} sub={details.duration} />
            <DetailRow icon={MapPin} label="Location" value={details.location} />
            <DetailRow icon={FileText} label="Date" value={details.date} />
          </div>

          {/* Notes */}
          {details.notes && (
            <div className="pt-3 border-t border-[#d4af37]/8">
              <div className="text-[10px] font-semibold text-[#555] uppercase tracking-wider mb-2">
                Notes
              </div>
              <p className="text-xs text-[#888] leading-relaxed">
                {details.notes}
              </p>
            </div>
          )}

          {/* Gold decorative divider */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent" />
            <div className="w-1 h-1 rotate-45 bg-[#d4af37]/25" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent" />
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-[#d4af37]/8 space-y-2">
          {details.status === "pending" && (
            <PremiumButton variant="primary" className="w-full" onClick={handleConfirm}>
              <FileText className="w-4 h-4" />
              Confirm Booking
            </PremiumButton>
          )}
          {details.status === "confirmed" && (
            <PremiumButton variant="primary" className="w-full" onClick={handleCheckIn}>
              <FileText className="w-4 h-4" />
              Check In Client
            </PremiumButton>
          )}
          {details.status !== "cancelled" && details.status !== "completed" && (
            <PremiumButton
              variant="ghost"
              className="w-full !text-red-400 hover:!bg-red-500/10"
              onClick={handleCancel}
            >
              Cancel Booking
            </PremiumButton>
          )}
          {details.status === "cancelled" && (
            <p className="text-xs text-red-400 text-center py-2">This booking has been cancelled.</p>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

function DetailRow({ icon: Icon, label, value, sub }: { icon: typeof Clock; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-md bg-[#0e0e0e] border border-[#d4af37]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[#d4af37]" strokeWidth={1.8} />
      </div>
      <div>
        <div className="text-[10px] font-medium text-[#555] uppercase tracking-wider">{label}</div>
        <div className="text-[13px] text-[#e0e0e0] font-medium mt-0.5">{value}</div>
        {sub && <div className="text-[10px] text-[#666]">{sub}</div>}
      </div>
    </div>
  );
}