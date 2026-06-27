import { cn } from "@/lib/utils";

type StatusType = "confirmed" | "pending" | "rescheduled" | "cancelled" | "completed" | "arrived";

interface StatusChipProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; dotClass: string; chipClass: string }> = {
  confirmed: {
    label: "Confirmed",
    dotClass: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    chipClass: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  },
  pending: {
    label: "Pending",
    dotClass: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
    chipClass: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  },
  rescheduled: {
    label: "Rescheduled",
    dotClass: "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.4)]",
    chipClass: "text-orange-400 border-orange-500/20 bg-orange-500/5",
  },
  cancelled: {
    label: "Cancelled",
    dotClass: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]",
    chipClass: "text-red-400 border-red-500/20 bg-red-500/5",
  },
  completed: {
    label: "Completed",
    dotClass: "bg-[#d4af37] shadow-[0_0_6px_rgba(212,175,55,0.4)]",
    chipClass: "text-[#d4af37] border-[#d4af37]/20 bg-[#d4af37]/5",
  },
  arrived: {
    label: "Arrived",
    dotClass: "bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.4)]",
    chipClass: "text-teal-400 border-teal-500/20 bg-teal-500/5",
  },
};

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.chipClass,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}