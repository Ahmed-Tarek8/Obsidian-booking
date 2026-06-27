"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  DollarSign,
  UserPlus,
  Activity,
  TrendingUp,
  Info,
  Diamond,
  Clock,
  MapPin,
  ArrowRight,
  Trophy,
  CheckCircle2,
  Users,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore, formatTime12, formatCurrency, getDurationMinutes } from "@/lib/store";
import { StatCard } from "./StatCard";
import { StatusChip } from "./StatusChip";
import { PremiumButton } from "./PremiumButton";
import { SectionPanel } from "./SectionPanel";

/* ─── Dynamic Date Helpers ─── */

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekStart(today: string) {
  const d = new Date(today + "T12:00:00");
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const TODAY = getTodayStr();
const WEEK_START = getWeekStart(TODAY);
const WEEK_END = addDays(WEEK_START, 4);
const WEEK_DAYS = [WEEK_START, addDays(WEEK_START, 1), addDays(WEEK_START, 2), addDays(WEEK_START, 3), addDays(WEEK_START, 4)];
const EXCLUDED_STATUSES: string[] = ["cancelled", "no-show"];
const DONUT_COLORS = ["#d4af37", "#4a4a4a", "#333333", "#1e1e1e", "#2a2a2a"];

/* ─── SVG Charts ─── */

function RevenueTrendChart({ dailyRevenue }: { dailyRevenue: number[] }) {
  const max = Math.max(...dailyRevenue, 1);
  const points = dailyRevenue.map((v) => (v / max) * 100);
  const w = 100;
  const h = 40;
  const pathD = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - (p / 100) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const areaD = pathD + ` L ${w} ${h} L 0 ${h} Z`;

  // Highlight the peak index
  const peakIndex = points.indexOf(Math.max(...points));
  const peakX = (peakIndex / (points.length - 1)) * w;
  const peakY = h - (points[peakIndex] / 100) * h;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
        <line key={pct} x1="0" y1={h * (1 - pct)} x2={w} y2={h * (1 - pct)} stroke="rgba(212,175,55,0.06)" strokeWidth="0.5" />
      ))}
      <path d={areaD} fill="url(#goldFill)" />
      <path d={pathD} fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Data dots */}
      {points.map((p, i) => {
        const x = (i / (points.length - 1)) * w;
        const y = h - (p / 100) * h;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="2" fill="#0e0e0e" stroke="#d4af37" strokeWidth="1" />
          </g>
        );
      })}
      {/* Highlight peak */}
      <circle cx={peakX} cy={peakY} r="3" fill="#d4af37" />
    </svg>
  );
}

function DonutChart({ segments, totalRevenue }: { segments: { label: string; pct: number; amount: number; color: string }[]; totalRevenue: number }) {
  const r = 36;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28 flex-shrink-0">
      {segments.map((seg, i) => {
        const segLength = (seg.pct / 100) * circumference;
        const gap = i < segments.length - 1 ? 2 : 0;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="8"
            strokeDasharray={`${segLength - gap} ${circumference - segLength + gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += segLength;
        return el;
      })}
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#e0e0e0" fontSize="10" fontWeight="700" fontFamily="sans-serif">{formatCurrency(totalRevenue)}</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#666" fontSize="5" fontFamily="sans-serif">THIS WEEK</text>
    </svg>
  );
}

function GaugeChart({ value }: { value: number }) {
  const r = 40;
  const cx = 50;
  const cy = 55;
  const circumference = 2 * Math.PI * r;
  const filled = (value / 100) * circumference;

  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e1e1e" strokeWidth="6" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#d4af37" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeDashoffset={circumference * 0.25}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#e0e0e0" fontSize="16" fontWeight="700" fontFamily="sans-serif">{Math.round(value)}%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#666" fontSize="5" fontFamily="sans-serif">RETURNING CLIENT RATE</text>
    </svg>
  );
}

/* ─── Stat mini card ─── */

function MiniStat({ label, value, trend, gold }: { label: string; value: string; trend?: string; gold?: boolean }) {
  return (
    <div className="bg-[#0e0e0e] rounded-lg p-3 border border-[#d4af37]/6">
      <div className={cn("text-[10px] text-[#555] font-medium uppercase tracking-wider", gold && "text-[#d4af37]/60")}>{label}</div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-sm font-bold text-[#e0e0e0]">{value}</span>
        {trend && <span className="text-[10px] font-medium text-emerald-400">{trend}</span>}
      </div>
    </div>
  );
}

/* ─── Upcoming booking item ─── */

function UpcomingItem({ time, client, isVip, service, duration, location, status }: {
  time: string; client: string; isVip: boolean; service: string; duration: string; location: string; status: "confirmed" | "pending" | "completed";
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#161616]/50 transition-colors cursor-pointer group/item">
      <div className="text-[12px] text-[#e0e0e0] font-medium w-16 flex-shrink-0 tabular-nums">{time}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn("text-[13px] font-medium truncate", isVip ? "text-[#d4af37]" : "text-[#ccc]")}>{client}</span>
          {isVip && (
            <span className="text-[8px] font-bold text-[#d4af37] uppercase tracking-wider bg-[#d4af37]/10 px-1.5 py-0.5 rounded flex-shrink-0">VIP</span>
          )}
        </div>
        <div className="text-[11px] text-[#666] mt-0.5">{service} · {duration}</div>
      </div>
      <div className="text-[10px] text-[#555] hidden lg:block">{location}</div>
      <StatusChip status={status} />
    </div>
  );
}

/* ─── Staff ranking item ─── */

function StaffRankItem({ rank, initials, name, revenue, services }: { rank: number; initials: string; name: string; revenue: string; services: number }) {
  const medals = ["text-[#d4af37]", "text-[#c0c0c0]", "text-[#cd7f32]", "text-[#555]"];
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#161616]/50 transition-colors cursor-pointer">
      <span className={cn("text-sm font-bold w-5 text-center", medals[rank - 1] || "text-[#555]")}>#{rank}</span>
      <div className="w-8 h-8 rounded-full bg-[#d4af37]/8 border border-[#d4af37]/15 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-[#d4af37]">{initials}</span>
      </div>
      <div className="flex-1">
        <div className="text-[13px] text-[#ccc] font-medium">{name}</div>
        <div className="text-[10px] text-[#555]">{services} services</div>
      </div>
      <span className="text-[13px] font-semibold text-[#e0e0e0] tabular-nums">{revenue}</span>
    </div>
  );
}

/* ─── Main Dashboard ─── */

export function DashboardView() {
  const { services, staff, clients, appointments, waitingList, getClient, getService, getStaff, getResource } = useBookingStore();

  // ── Derived data ──

  const todayAppts = useMemo(
    () => appointments.filter((a) => a.date === TODAY && !EXCLUDED_STATUSES.includes(a.status)),
    [appointments],
  );

  const weekAppts = useMemo(
    () => appointments.filter((a) => a.date >= WEEK_START && a.date <= WEEK_END && !EXCLUDED_STATUSES.includes(a.status)),
    [appointments],
  );

  const todayRevenue = useMemo(
    () => todayAppts.reduce((sum, a) => sum + (getService(a.serviceId)?.price ?? 0), 0),
    [todayAppts, services],
  );

  const weekRevenue = useMemo(
    () => weekAppts.reduce((sum, a) => sum + (getService(a.serviceId)?.price ?? 0), 0),
    [weekAppts, services],
  );

  const newClientsCount = useMemo(
    () => clients.filter((c) => c.status === "Active" && c.totalBookings <= 3).length,
    [clients],
  );

  const todayApptCount = todayAppts.length;

  // Daily revenue for the week (May 13-17)
  const dailyRevenue = useMemo(
    () =>
      WEEK_DAYS.map((day) =>
        appointments
          .filter((a) => a.date === day && !EXCLUDED_STATUSES.includes(a.status))
          .reduce((sum, a) => sum + (getService(a.serviceId)?.price ?? 0), 0),
      ),
    [appointments, services],
  );

  // Service Mix — aggregate from services[].bookings
  const serviceMix = useMemo(() => {
    const totalBookings = services.reduce((s, svc) => s + svc.bookings, 0);
    const sorted = [...services].sort((a, b) => b.bookings - a.bookings);
    const top4 = sorted.slice(0, 4);
    const otherBookings = sorted.slice(4).reduce((s, svc) => s + svc.bookings, 0);

    const segments = top4.map((svc) => ({
      label: svc.name,
      pct: totalBookings > 0 ? (svc.bookings / totalBookings) * 100 : 0,
      amount: weekRevenue > 0 ? Math.round((svc.bookings / totalBookings) * weekRevenue) : 0,
      color: DONUT_COLORS[top4.indexOf(svc)],
    }));

    if (otherBookings > 0) {
      segments.push({
        label: "Other Services",
        pct: totalBookings > 0 ? (otherBookings / totalBookings) * 100 : 0,
        amount: weekRevenue > 0 ? Math.round((otherBookings / totalBookings) * weekRevenue) : 0,
        color: DONUT_COLORS[4],
      });
    }

    return segments;
  }, [services, weekRevenue]);

  // Returning clients rate
  const returningRate = useMemo(() => {
    const total = clients.length;
    if (total === 0) return 0;
    const returning = clients.filter((c) => c.totalBookings > 1).length;
    return (returning / total) * 100;
  }, [clients]);

  const returningCount = useMemo(() => clients.filter((c) => c.totalBookings > 1).length, [clients]);
  const newClientsTotal = clients.length - returningCount;

  // Upcoming bookings — next 4 confirmed/pending sorted by date+startTime
  const upcomingBookings = useMemo(() => {
    return appointments
      .filter((a) => (a.status === "confirmed" || a.status === "pending"))
      .sort((a, b) => {
        const dateComp = a.date.localeCompare(b.date);
        return dateComp !== 0 ? dateComp : a.startTime.localeCompare(b.startTime);
      })
      .slice(0, 4)
      .map((a) => {
        const client = getClient(a.clientId);
        const service = getService(a.serviceId);
        const resource = getResource(a.resourceId);
        const durationMins = getDurationMinutes(a.startTime, a.endTime);
        return {
          time: formatTime12(a.startTime),
          client: client?.name ?? "Unknown",
          isVip: client?.tier === "VIP",
          service: service?.name ?? "Unknown",
          duration: `${durationMins} min`,
          location: resource?.name ?? "—",
          status: a.status as "confirmed" | "pending" | "completed",
        };
      });
  }, [appointments, getClient, getService, getResource]);

  // Top staff ranked by revenueMTD, with appointment count for this week
  const topStaff = useMemo(() => {
    const ranked = [...staff]
      .sort((a, b) => b.revenueMTD - a.revenueMTD)
      .slice(0, 4);

    return ranked.map((s, i) => {
      const apptCount = weekAppts.filter((a) => a.staffId === s.id).length;
      return {
        rank: i + 1,
        initials: s.initials,
        name: s.name,
        revenue: formatCurrency(s.revenueMTD),
        services: apptCount,
      };
    });
  }, [staff, weekAppts]);

  // Today at a Glance
  const todayTotalMins = useMemo(
    () => todayAppts.reduce((sum, a) => sum + getDurationMinutes(a.startTime, a.endTime), 0),
    [todayAppts],
  );

  const avgTicket = todayApptCount > 0 ? Math.round(todayRevenue / todayApptCount) : 0;
  const waitingListCount = waitingList.length;

  // Hrs remaining: per-staff average remaining business hours today
  const hrsRemaining = useMemo((): string => {
    if (staff.length === 0) return "0";
    const avgBookedPerStaff = todayTotalMins / staff.length / 60;
    return Math.max(0, 9 - avgBookedPerStaff).toFixed(1);
  }, [todayTotalMins, staff.length]);

  // MTD revenue sum
  const mtdRevenue = useMemo(() => staff.reduce((sum, s) => sum + s.revenueMTD, 0), [staff]);

  return (
    <div className="p-6 space-y-5 animate-fade-in-up">
      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Today's Appointments" value={String(todayApptCount)} change="+3 vs yesterday" changeType="up" icon={CalendarDays} delay={0} />
        <StatCard title="Week Revenue" value={formatCurrency(weekRevenue)} change="+12.5%" changeType="up" icon={DollarSign} delay={0.06} />
        <StatCard title="New Clients" value={String(newClientsCount)} change="+2 this week" changeType="up" icon={UserPlus} delay={0.12} />
        <StatCard title="Utilization" value="87%" change="+5% vs last week" changeType="up" icon={Activity} delay={0.18} />
      </div>

      {/* Middle row: 3 panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Trend */}
        <SectionPanel className="lg:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-widest">Revenue Trend</h3>
              <Info className="w-3 h-3 text-[#555]" />
            </div>
            <button className="text-[11px] text-[#666] hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-1">
              This Week <ChevronDownSmall />
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-[#e0e0e0]">{formatCurrency(weekRevenue)}</span>
            <span className="text-[11px] text-[#666]">This Week</span>
          </div>
          <RevenueTrendChart dailyRevenue={dailyRevenue} />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniStat label="Month to Date" value={formatCurrency(mtdRevenue)} trend="+9.8%" />
            <MiniStat label="Year to Date" value={formatCurrency(mtdRevenue * 3)} trend="+14.6%" />
            <MiniStat label="Avg. Ticket" value={formatCurrency(avgTicket)} trend="+4.3%" />
          </div>
        </SectionPanel>

        {/* Service Mix */}
        <SectionPanel className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-widest">Service Mix</h3>
              <Info className="w-3 h-3 text-[#555]" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <DonutChart segments={serviceMix} totalRevenue={weekRevenue} />
            <div className="flex-1 space-y-2.5">
              {serviceMix.slice(0, 4).map((item, idx) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      idx === 3 ? "bg-[#1e1e1e] border border-white/10" : item.color === "#d4af37" ? "bg-[#d4af37]" : item.color === "#4a4a4a" ? "bg-[#4a4a4a]" : "bg-[#333]",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-[#ccc] font-medium">{item.label}</div>
                    <div className="text-[9px] text-[#555] tabular-nums">{formatCurrency(item.amount)} ({item.pct.toFixed(1)}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-4 w-full text-right text-[11px] text-[#d4af37]/60 hover:text-[#d4af37] transition-colors cursor-pointer">
            View full breakdown <ArrowRight className="w-3 h-3 inline" />
          </button>
        </SectionPanel>

        {/* Returning Clients */}
        <SectionPanel className="lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-widest">Returning Clients</h3>
              <Info className="w-3 h-3 text-[#555]" />
            </div>
          </div>
          <GaugeChart value={returningRate} />
          <p className="text-[10px] text-emerald-400 font-medium text-center mt-1">+6% vs last week</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <MiniStat label="Returning" value={String(returningCount)} />
            <MiniStat label="New Clients" value={String(newClientsTotal)} />
          </div>
        </SectionPanel>
      </div>

      {/* Bottom row: 3 panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upcoming Premium Bookings */}
        <SectionPanel className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-widest">Upcoming Bookings</h3>
            <PremiumButton variant="ghost" size="sm" className="!text-[11px] !py-1 !px-2">View All</PremiumButton>
          </div>
          <div className="space-y-0.5">
            {upcomingBookings.map((b, i) => (
              <UpcomingItem
                key={i}
                time={b.time}
                client={b.client}
                isVip={b.isVip}
                service={b.service}
                duration={b.duration}
                location={b.location}
                status={b.status}
              />
            ))}
          </div>
        </SectionPanel>

        {/* Top Staff */}
        <SectionPanel className="lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-widest">Top Staff This Week</h3>
            <PremiumButton variant="ghost" size="sm" className="!text-[11px] !py-1 !px-2">View All</PremiumButton>
          </div>
          <div className="space-y-1">
            {topStaff.map((s) => (
              <StaffRankItem
                key={s.rank}
                rank={s.rank}
                initials={s.initials}
                name={s.name}
                revenue={s.revenue}
                services={s.services}
              />
            ))}
          </div>
        </SectionPanel>

        {/* Today at a Glance */}
        <SectionPanel className="lg:col-span-1">
          <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-widest mb-3">Today at a Glance</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-[#0e0e0e] rounded-lg p-3 border border-[#d4af37]/6 flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-[#d4af37]/60 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#e0e0e0]">{todayApptCount}</div>
                <div className="text-[9px] text-[#555] uppercase tracking-wider">Appointments</div>
              </div>
            </div>
            <div className="bg-[#0e0e0e] rounded-lg p-3 border border-[#d4af37]/6 flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#d4af37]/60 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#e0e0e0]">3</div>
                <div className="text-[9px] text-[#555] uppercase tracking-wider">Walk-ins</div>
              </div>
            </div>
            <div className="bg-[#0e0e0e] rounded-lg p-3 border border-[#d4af37]/6 flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-[#d4af37]/60 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#e0e0e0]">{formatCurrency(todayRevenue)}</div>
                <div className="text-[9px] text-[#555] uppercase tracking-wider">Projected Rev.</div>
              </div>
            </div>
            <div className="bg-[#0e0e0e] rounded-lg p-3 border border-[#d4af37]/6 flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-[#d4af37]/60 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#e0e0e0]">87%</div>
                <div className="text-[9px] text-[#555] uppercase tracking-wider">Utilization</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <MiniStat label="Hrs Remaining" value={hrsRemaining} />
            <MiniStat label="Waiting List" value={String(waitingListCount)} />
            <MiniStat label="Avg. Ticket" value={formatCurrency(avgTicket)} />
          </div>
          {/* Goal indicator */}
          <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-400">On Track</span>
              </div>
              <span className="text-[9px] text-[#555] ml-5">Daily Goal</span>
            </div>
            <Target className="w-4 h-4 text-emerald-400/40" />
          </div>
        </SectionPanel>
      </div>
    </div>
  );
}

function ChevronDownSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="inline">
      <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}