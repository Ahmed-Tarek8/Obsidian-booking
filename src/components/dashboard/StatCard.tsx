"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconBg?: string;
  delay?: number;
}

export function StatCard({ title, value, change, changeType = "up", icon: Icon, iconBg = "from-[#d4af37]/15 to-[#d4af37]/5", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="premium-panel stat-glow rounded-xl p-5 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center border border-[#d4af37]/10",
            iconBg
          )}
        >
          <Icon className="w-5 h-5 text-[#d4af37]" strokeWidth={1.8} />
        </div>
        {change && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-md",
              changeType === "up" && "text-emerald-400 bg-emerald-500/8 border border-emerald-500/10",
              changeType === "down" && "text-red-400 bg-red-500/8 border border-red-500/10",
              changeType === "neutral" && "text-[#888] bg-white/3 border border-white/5"
            )}
          >
            {change}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-[#e0e0e0] tracking-tight">
          {value}
        </div>
        <div className="text-xs text-[#777] font-medium uppercase tracking-wider">
          {title}
        </div>
      </div>

      {/* Bottom gold accent line */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}