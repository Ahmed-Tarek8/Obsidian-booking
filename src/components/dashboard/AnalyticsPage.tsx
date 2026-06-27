"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Activity,
  Repeat,
  XCircle,
  Calendar,
  SlidersHorizontal,
  Star,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StatCard } from "./StatCard";
import { PremiumButton } from "./PremiumButton";
import { SectionPanel } from "./SectionPanel";
import { cn } from "@/lib/utils";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const bookingVsCancelData = [
  { day: "May 6", bookings: 42, cancellations: 1, noShows: 2 },
  { day: "May 7", bookings: 38, cancellations: 2, noShows: 1 },
  { day: "May 8", bookings: 58, cancellations: 3, noShows: 2 },
  { day: "May 9", bookings: 65, cancellations: 1, noShows: 3 },
  { day: "May 10", bookings: 52, cancellations: 4, noShows: 1 },
  { day: "May 11", bookings: 48, cancellations: 2, noShows: 2 },
  { day: "May 12", bookings: 39, cancellations: 1, noShows: 1 },
];

const bookingsByDayData = [
  { day: "May 6", bookings: 42 },
  { day: "May 7", bookings: 38 },
  { day: "May 8", bookings: 58 },
  { day: "May 9", bookings: 65 },
  { day: "May 10", bookings: 52 },
  { day: "May 11", bookings: 48 },
  { day: "May 12", bookings: 39 },
];

const serviceMixData = [
  { name: "Consultation", value: 28 },
  { name: "Strategy Session", value: 21 },
  { name: "Premium Meeting Room", value: 16 },
  { name: "Virtual Session", value: 14 },
  { name: "On-site Visit", value: 10 },
  { name: "Other", value: 11 },
];

const SERVICE_COLORS = ["#d4af37", "#8B5CF6", "#3B82F6", "#22C55E", "#F97316", "#555"];

const topServicesData = [
  { service: "Strategy Session", bookings: 72, revenue: "$10,800", rating: 4.8, trend: "+12%" },
  { service: "Consultation", bookings: 96, revenue: "$6,720", rating: 4.7, trend: "+8%" },
  { service: "Premium Meeting Room", bookings: 55, revenue: "$8,250", rating: 4.9, trend: "+15%" },
  { service: "Virtual Session", bookings: 48, revenue: "$2,880", rating: 4.5, trend: "+22%" },
  { service: "On-site Visit", bookings: 34, revenue: "$3,400", rating: 4.6, trend: "-3%" },
  { service: "Quick Sync", bookings: 37, revenue: "$1,850", rating: 4.4, trend: "+5%" },
];

const peakHoursData = [
  { slot: "8-10 AM", mon: 5, tue: 8, wed: 6, thu: 12, fri: 9, sat: 3, sun: 1 },
  { slot: "10-12 PM", mon: 8, tue: 10, wed: 9, thu: 14, fri: 11, sat: 5, sun: 2 },
  { slot: "12-2 PM", mon: 3, tue: 5, wed: 4, thu: 7, fri: 6, sat: 8, sun: 4 },
  { slot: "2-4 PM", mon: 7, tue: 9, wed: 8, thu: 11, fri: 10, sat: 6, sun: 3 },
  { slot: "4-6 PM", mon: 10, tue: 12, wed: 11, thu: 15, fri: 13, sat: 9, sun: 5 },
  { slot: "6-8 PM", mon: 6, tue: 8, wed: 7, thu: 10, fri: 8, sat: 12, sun: 7 },
];

const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ─── Recharts tooltip style (shared) ──────────────────────────────────── */

const tooltipStyle: React.CSSProperties = {
  background: "#1a1a1a",
  border: "1px solid rgba(212,175,55,0.15)",
  borderRadius: "8px",
  color: "#e0e0e0",
  fontSize: "12px",
};

const tooltipLabelStyle: React.CSSProperties = {
  color: "#888",
};

/* ─── Custom Pie label for center text ─────────────────────────────────── */

function PieCenterLabel() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      <div className="text-xl font-bold text-[#e0e0e0]">342</div>
      <div className="text-[10px] text-[#666] uppercase tracking-wider">Bookings</div>
    </div>
  );
}

/* ─── Trend badge ──────────────────────────────────────────────────────── */

function TrendBadge({ value }: { value: string }) {
  const isUp = value.startsWith("+");
  return (
    <span
      className={cn(
        "text-[11px] font-medium",
        isUp ? "text-emerald-400" : "text-red-400"
      )}
    >
      {value}
    </span>
  );
}

/* ─── Star rating ──────────────────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
      <span className="text-[13px] text-[#ccc] ml-0.5">{rating}</span>
    </div>
  );
}

/* ─── Section title with optional dropdown ─────────────────────────────── */

function SectionTitle({
  title,
  dropdownLabel,
}: {
  title: string;
  dropdownLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[10px] font-bold text-[#555] uppercase tracking-widest">
        {title}
      </h3>
      {dropdownLabel && (
        <button className="text-[11px] text-[#666] hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-1">
          {dropdownLabel}
          <ChevronDown className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-5"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#e0e0e0] tracking-tight">
            Analytics
          </h1>
          <p className="text-[13px] text-[#666] mt-1">
            Overview of service bookings, revenue, and operational trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date range selector */}
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#d4af37]/20 text-[#b0b0b0] text-[13px] hover:border-[#d4af37]/35 hover:text-[#d4af37] transition-all duration-300 cursor-pointer">
            <Calendar className="w-4 h-4" />
            May 6 - May 12, 2024
            <ChevronDown className="w-3 h-3" />
          </button>
          {/* Filters button */}
          <PremiumButton variant="secondary" size="md">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </PremiumButton>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          title="Total Revenue"
          value="$24,830"
          change="+18.6% vs prev week"
          changeType="up"
          icon={DollarSign}
          delay={0}
        />
        <StatCard
          title="Total Bookings"
          value="342"
          change="+14.2% vs prev week"
          changeType="up"
          icon={CalendarCheck}
          delay={0.06}
        />
        <StatCard
          title="Avg Booking Value"
          value="$72.61"
          change="+3.8% vs prev week"
          changeType="up"
          icon={TrendingUp}
          delay={0.12}
        />
        <StatCard
          title="Utilization"
          value="68%"
          change="+5.5pp vs prev week"
          changeType="up"
          icon={Activity}
          delay={0.18}
        />
        <StatCard
          title="Client Return Rate"
          value="41%"
          change="+5.1pp vs prev week"
          changeType="up"
          icon={Repeat}
          delay={0.24}
        />
        <StatCard
          title="Cancellation Rate"
          value="3.2%"
          change="+0.0pp vs prev week"
          changeType="neutral"
          icon={XCircle}
          delay={0.3}
        />
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bookings vs Cancellations */}
        <SectionPanel>
          <SectionTitle title="Bookings vs Issues" dropdownLabel="Daily" />
          <div className="text-[10px] text-[#555] uppercase tracking-wider mb-2">
            Bookings / Cancellations / No-Shows
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bookingVsCancelData} barGap={2} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(212,175,55,0.06)"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={{ stroke: "rgba(212,175,55,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={{ stroke: "rgba(212,175,55,0.1)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "#888", paddingTop: "8px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="bookings" name="Bookings" fill="#d4af37" radius={[3, 3, 0, 0]} />
              <Bar dataKey="cancellations" name="Cancellations" fill="#EF4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="noShows" name="No-Shows" fill="#F97316" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionPanel>

        {/* Bookings by Day */}
        <SectionPanel>
          <SectionTitle title="Bookings by Day" dropdownLabel="Daily" />
          <div className="text-[10px] text-[#555] uppercase tracking-wider mb-2">
            Bookings
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bookingsByDayData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(212,175,55,0.06)"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={{ stroke: "rgba(212,175,55,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={{ stroke: "rgba(212,175,55,0.1)" }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                formatter={(value: number) => [value, "Bookings"]}
              />
              <Bar
                dataKey="bookings"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </SectionPanel>

        {/* Service Mix */}
        <SectionPanel>
          <SectionTitle title="Service Mix" />
          <div className="relative">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={serviceMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {serviceMixData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={SERVICE_COLORS[index % SERVICE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center overlay label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingTop: '0px' }}>
              <div className="text-center">
                <div className="text-xl font-bold text-[#e0e0e0]">342</div>
                <div className="text-[10px] text-[#666] uppercase tracking-wider">
                  Bookings
                </div>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {serviceMixData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: SERVICE_COLORS[i] }}
                />
                <span className="text-[11px] text-[#888] truncate">
                  {item.name}
                  <span className="text-[#555] ml-1">{item.value}%</span>
                </span>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>

      {/* ── Bottom Row: Tables ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Top Services */}
        <SectionPanel className="lg:col-span-3">
          <SectionTitle title="Top Services" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#d4af37]/10">
                  <th className="text-left text-[10px] font-bold text-[#555] uppercase tracking-widest pb-3 pr-4">
                    Service
                  </th>
                  <th className="text-right text-[10px] font-bold text-[#555] uppercase tracking-widest pb-3 px-2">
                    Bookings
                  </th>
                  <th className="text-right text-[10px] font-bold text-[#555] uppercase tracking-widest pb-3 px-2">
                    Revenue
                  </th>
                  <th className="text-right text-[10px] font-bold text-[#555] uppercase tracking-widest pb-3 px-2">
                    Avg Rating
                  </th>
                  <th className="text-right text-[10px] font-bold text-[#555] uppercase tracking-widest pb-3 pl-2">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {topServicesData.map((row, i) => (
                  <tr
                    key={row.service}
                    className={cn(
                      "border-b border-[#d4af37]/5 hover:bg-[#161616]/50 transition-colors",
                      i === topServicesData.length - 1 && "border-b-0"
                    )}
                  >
                    <td className="text-[13px] text-[#ccc] font-medium py-3 pr-4">
                      {row.service}
                    </td>
                    <td className="text-[13px] text-[#ccc] py-3 px-2 text-right tabular-nums">
                      {row.bookings}
                    </td>
                    <td className="text-[13px] text-[#ccc] py-3 px-2 text-right tabular-nums">
                      {row.revenue}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <StarRating rating={row.rating} />
                    </td>
                    <td className="py-3 pl-2 text-right">
                      <TrendBadge value={row.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionPanel>

        {/* Peak Booking Hours */}
        <SectionPanel className="lg:col-span-2">
          <SectionTitle title="Peak Booking Hours" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#d4af37]/10">
                  <th className="text-left text-[10px] font-bold text-[#555] uppercase tracking-widest pb-3 pr-2">
                    Time Slot
                  </th>
                  {dayLabels.map((d) => (
                    <th
                      key={d}
                      className="text-center text-[10px] font-bold text-[#555] uppercase tracking-widest pb-3 px-1"
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peakHoursData.map((row, i) => {
                  const maxVal = Math.max(
                    ...dayKeys.map((k) => row[k])
                  );
                  return (
                    <tr
                      key={row.slot}
                      className={cn(
                        "border-b border-[#d4af37]/5 hover:bg-[#161616]/50 transition-colors",
                        i === peakHoursData.length - 1 && "border-b-0"
                      )}
                    >
                      <td className="text-[13px] text-[#ccc] font-medium py-2.5 pr-2 whitespace-nowrap">
                        {row.slot}
                      </td>
                      {dayKeys.map((key) => {
                        const val = row[key];
                        const isPeak = val === maxVal && maxVal > 0;
                        const intensity = maxVal > 0 ? val / maxVal : 0;
                        return (
                          <td
                            key={key}
                            className="text-center py-2.5 px-1"
                          >
                            <span
                              className={cn(
                                "text-[13px] tabular-nums",
                                isPeak
                                  ? "text-[#d4af37] font-bold"
                                  : intensity > 0.7
                                  ? "text-[#ccc]"
                                  : "text-[#666]"
                              )}
                            >
                              {val}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionPanel>
      </div>
    </motion.div>
  );
}