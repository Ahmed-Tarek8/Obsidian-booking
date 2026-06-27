"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusChip } from "./StatusChip";
import { PremiumButton } from "./PremiumButton";
import type { StatusType } from "./StatusChip";

interface BookingRow {
  id: string;
  time: string;
  clientInitials: string;
  clientLabel: string;
  service: string;
  staffInitials: string;
  staffLabel: string;
  status: StatusType;
  location: string;
}

const bookings: BookingRow[] = [
  { id: "r1", time: "11:45 AM", clientInitials: "C7", clientLabel: "Client 07", service: "Team Workshop", staffInitials: "SC", staffLabel: "Staff C", status: "confirmed", location: "Suite A" },
  { id: "r2", time: "1:00 PM", clientInitials: "IA", clientLabel: "Investor A", service: "Strategy Session", staffInitials: "SB", staffLabel: "Staff B", status: "confirmed", location: "Suite B" },
  { id: "r3", time: "2:00 PM", clientInitials: "C3", clientLabel: "Client 03", service: "Full Consultation", staffInitials: "SA", staffLabel: "Staff A", status: "pending", location: "Suite A" },
  { id: "r4", time: "3:00 PM", clientInitials: "C9", clientLabel: "Client 09", service: "Deep Dive Session", staffInitials: "SC", staffLabel: "Staff C", status: "rescheduled", location: "Suite C" },
  { id: "r5", time: "4:00 PM", clientInitials: "C1", clientLabel: "Client 01", service: "Onboarding Call", staffInitials: "SB", staffLabel: "Staff B", status: "confirmed", location: "Suite A" },
  { id: "r6", time: "5:00 PM", clientInitials: "B2", clientLabel: "Client B", service: "Quick Sync", staffInitials: "SA", staffLabel: "Staff A", status: "pending", location: "Suite B" },
];

const columns = [
  { key: "time", label: "TIME", sortable: true },
  { key: "client", label: "CLIENT", sortable: true },
  { key: "service", label: "SERVICE" },
  { key: "staff", label: "STAFF" },
  { key: "status", label: "STATUS" },
  { key: "location", label: "LOCATION" },
  { key: "action", label: "ACTION" },
];

export function BookingTable() {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="premium-panel rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#d4af37]/8">
        <div>
          <h3 className="text-sm font-semibold text-[#e0e0e0]">Upcoming Bookings</h3>
          <p className="text-[11px] text-[#666] mt-0.5">Today&apos;s remaining schedule</p>
        </div>
        <PremiumButton variant="ghost" size="sm">
          View All
        </PremiumButton>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d4af37]/8">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-[#555] uppercase tracking-widest hover:text-[#d4af37] transition-colors cursor-pointer"
                    >
                      {col.label}
                      <ArrowUpDown className={cn(
                        "w-3 h-3 transition-colors",
                        sortCol === col.key ? "text-[#d4af37]" : "text-[#333]"
                      )} />
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest">
                      {col.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="border-b border-[#d4af37]/5 last:border-b-0 hover:bg-[#161616]/50 transition-colors group/row"
              >
                <td className="px-4 py-3">
                  <span className="text-[13px] text-[#e0e0e0] font-medium tabular-nums">
                    {row.time}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-[#d4af37]/8 border border-[#d4af37]/12 flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-[#d4af37]">{row.clientInitials}</span>
                    </div>
                    <span className="text-[13px] text-[#ccc] font-medium">{row.clientLabel}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] text-[#999]">{row.service}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#1e1e1e] border border-[#d4af37]/8 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-[#888]">{row.staffInitials}</span>
                    </div>
                    <span className="text-[13px] text-[#999]">{row.staffLabel}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusChip status={row.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-[13px] text-[#777]">{row.location}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="w-7 h-7 rounded-md flex items-center justify-center text-[#555] hover:text-[#d4af37] hover:bg-[#1e1e1e] transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


