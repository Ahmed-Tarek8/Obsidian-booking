import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Service,
  StaffMember,
  Client,
  Resource,
  Appointment,
  WaitingListEntry,
  Report,
  Integration,
  StudioSettings,
  AppointmentStatus,
  ClientTier,
  ClientStatus,
  ResourceType,
  ResourceStatus,
  WLPriority,
  WLStatus,
} from "./types";

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA — Test/demo data for development and demos.
// All pages read from the store; no inline hardcoded arrays allowed.
// ═══════════════════════════════════════════════════════════════════════════════

/* ── Dynamic date helpers ── */
function seedDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function seedCreated(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

/* ── Staff ── */
export const STAFF: StaffMember[] = [
  {
    id: "st-001",
    initials: "EV",
    name: "Elena Vasquez",
    role: "Manager",
    email: "elena@studio.com",
    phone: "+1 (555) 201-0001",
    location: "Main Office",
    status: "Active",
    rating: 4.9,
    reviewCount: 87,
    revenueMTD: 12450,
    hoursWorked: "32h",
    skills: ["Consultation", "Client Relations", "Strategic Planning", "Team Coordination"],
    weeklyHours: [
      { day: "Monday",    start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Tuesday",   start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Wednesday", start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Thursday",  start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Friday",    start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Saturday",  start: "",         end: "",         active: false },
      { day: "Sunday",    start: "",         end: "",         active: false },
    ],
  },
  {
    id: "st-002",
    initials: "JC",
    name: "James Chen",
    role: "Senior Consultant",
    email: "james@studio.com",
    phone: "+1 (555) 201-0002",
    location: "Main Office",
    status: "Active",
    rating: 4.8,
    reviewCount: 64,
    revenueMTD: 9820,
    hoursWorked: "28h",
    skills: ["Financial Analysis", "Tax Planning", "Client Relations", "Risk Assessment"],
    weeklyHours: [
      { day: "Monday",    start: "10:00 AM", end: "7:00 PM", active: true },
      { day: "Tuesday",   start: "10:00 AM", end: "7:00 PM", active: true },
      { day: "Wednesday", start: "10:00 AM", end: "7:00 PM", active: true },
      { day: "Thursday",  start: "10:00 AM", end: "7:00 PM", active: true },
      { day: "Friday",    start: "10:00 AM", end: "6:00 PM", active: true },
      { day: "Saturday",  start: "",         end: "",         active: false },
      { day: "Sunday",    start: "",         end: "",         active: false },
    ],
  },
  {
    id: "st-003",
    initials: "PS",
    name: "Priya Sharma",
    role: "Associate",
    email: "priya@studio.com",
    phone: "+1 (555) 201-0003",
    location: "Main Office",
    status: "Active",
    rating: 4.7,
    reviewCount: 31,
    revenueMTD: 5650,
    hoursWorked: "24h",
    skills: ["Data Analysis", "Client Onboarding", "Documentation", "Scheduling"],
    weeklyHours: [
      { day: "Monday",    start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Tuesday",   start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Wednesday", start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Thursday",  start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Friday",    start: "9:00 AM", end: "4:00 PM", active: true },
      { day: "Saturday",  start: "",         end: "",         active: false },
      { day: "Sunday",    start: "",         end: "",         active: false },
    ],
  },
];

/* ── Services ── */
export const SERVICES: Service[] = [
  {
    id: "svc-001",
    name: "Initial Consultation",
    category: "Advisory",
    categoryColor: "blue",
    duration: 60,
    price: 150,
    availability: "Active",
    staffIds: ["st-001", "st-002"],
    bookings: 28,
    description: "First-time client intake and needs assessment session.",
    featured: true,
  },
  {
    id: "svc-002",
    name: "Financial Review",
    category: "Analysis",
    categoryColor: "purple",
    duration: 90,
    price: 250,
    availability: "Active",
    staffIds: ["st-002", "st-003"],
    bookings: 19,
    description: "Comprehensive review of financial goals and current portfolio.",
    featured: true,
  },
  {
    id: "svc-003",
    name: "Tax Planning Session",
    category: "Tax",
    categoryColor: "amber",
    duration: 60,
    price: 175,
    availability: "Active",
    staffIds: ["st-001", "st-002"],
    bookings: 22,
    description: "Strategic tax planning and optimization session.",
    featured: false,
  },
  {
    id: "svc-004",
    name: "Investment Advisory",
    category: "Advisory",
    categoryColor: "green",
    duration: 120,
    price: 350,
    availability: "Active",
    staffIds: ["st-001"],
    bookings: 11,
    description: "Deep-dive investment strategy and portfolio construction session.",
    featured: false,
  },
];

/* ── Resources ── */
export const RESOURCES: Resource[] = [
  {
    id: "res-001",
    name: "Meeting Room A",
    code: "MR-A",
    type: "Meeting Room",
    location: "Floor 2",
    capacity: 4,
    status: "Available",
    amenities: ["Projector", "Whiteboard", "Video Conference"],
    manager: "st-001",
    notes: "",
  },
  {
    id: "res-002",
    name: "Conference Room B",
    code: "CF-B",
    type: "Conference Room",
    location: "Floor 2",
    capacity: 10,
    status: "Available",
    amenities: ["Video Conference", "Display Screen", "Whiteboard"],
    manager: "st-001",
    notes: "",
  },
  {
    id: "res-003",
    name: "Studio Space C",
    code: "ST-C",
    type: "Studio",
    location: "Floor 1",
    capacity: 2,
    status: "Available",
    amenities: ["Recording Lights", "Backdrop", "Sound Treatment"],
    manager: "st-003",
    notes: "",
  },
];

/* ── Clients ── */
export const CLIENTS: Client[] = [
  {
    id: "cl-001",
    name: "Alexandra Sterling",
    initials: "AS",
    tier: "VIP",
    phone: "+1 (555) 310-0001",
    email: "alexandra.sterling@email.com",
    totalBookings: 8,
    lifetimeValue: 2050,
    status: "Returning",
    tags: ["VIP", "High Value", "Long-term"],
    lastBookingDate: seedDate(-2),
    notes: "Prefers morning appointments. Interested in investment advisory.",
    createdDate: seedCreated(120),
  },
  {
    id: "cl-002",
    name: "Marcus Webb",
    initials: "MW",
    tier: "Regular",
    phone: "+1 (555) 310-0002",
    email: "marcus.webb@email.com",
    totalBookings: 4,
    lifetimeValue: 700,
    status: "Returning",
    tags: ["Returning", "Preferred"],
    lastBookingDate: seedDate(-5),
    notes: "",
    createdDate: seedCreated(90),
  },
  {
    id: "cl-003",
    name: "Daniel Kim",
    initials: "DK",
    tier: "VIP",
    phone: "+1 (555) 310-0003",
    email: "daniel.kim@email.com",
    totalBookings: 11,
    lifetimeValue: 3300,
    status: "Returning",
    tags: ["VIP", "High Value", "Enterprise"],
    lastBookingDate: seedDate(-1),
    notes: "Enterprise client — always confirm bookings 24h in advance.",
    createdDate: seedCreated(200),
  },
  {
    id: "cl-004",
    name: "Olivia Park",
    initials: "OP",
    tier: "Regular",
    phone: "+1 (555) 310-0004",
    email: "olivia.park@email.com",
    totalBookings: 2,
    lifetimeValue: 300,
    status: "Active",
    tags: ["New", "Preferred"],
    lastBookingDate: seedDate(-10),
    notes: "New client — referred by Marcus Webb.",
    createdDate: seedCreated(45),
  },
  {
    id: "cl-005",
    name: "Sophia Martinez",
    initials: "SM",
    tier: "Regular",
    phone: "+1 (555) 310-0005",
    email: "sophia.martinez@email.com",
    totalBookings: 6,
    lifetimeValue: 1075,
    status: "Returning",
    tags: ["Returning", "Preferred"],
    lastBookingDate: seedDate(-3),
    notes: "Prefers afternoon slots.",
    createdDate: seedCreated(110),
  },
  {
    id: "cl-006",
    name: "David Park",
    initials: "DP",
    tier: "Regular",
    phone: "+1 (555) 310-0006",
    email: "david.park@email.com",
    totalBookings: 1,
    lifetimeValue: 150,
    status: "Active",
    tags: ["New"],
    lastBookingDate: seedDate(-15),
    notes: "",
    createdDate: seedCreated(30),
  },
  {
    id: "cl-007",
    name: "Benjamin Brooks",
    initials: "BB",
    tier: "Regular",
    phone: "+1 (555) 310-0007",
    email: "ben.brooks@email.com",
    totalBookings: 3,
    lifetimeValue: 525,
    status: "Returning",
    tags: ["Returning"],
    lastBookingDate: seedDate(-7),
    notes: "Prefers video consultations.",
    createdDate: seedCreated(60),
  },
];

/* ── Appointments ── */
// Spread across: today, tomorrow, next few days, past week
export const APPOINTMENTS: Appointment[] = [
  // Today — confirmed
  {
    id: "ap-001",
    bookingId: "#0001",
    clientId: "cl-001",
    serviceId: "svc-001",
    staffId: "st-001",
    resourceId: "res-001",
    date: seedDate(0),
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
    notes: "Initial intake — VIP client",
    createdDate: seedCreated(5),
  },
  // Today — pending
  {
    id: "ap-002",
    bookingId: "#0002",
    clientId: "cl-003",
    serviceId: "svc-004",
    staffId: "st-001",
    resourceId: "res-002",
    date: seedDate(0),
    startTime: "11:00",
    endTime: "13:00",
    status: "pending",
    notes: "Investment advisory — confirm room setup",
    createdDate: seedCreated(2),
  },
  // Today — confirmed
  {
    id: "ap-003",
    bookingId: "#0003",
    clientId: "cl-005",
    serviceId: "svc-003",
    staffId: "st-002",
    resourceId: "res-001",
    date: seedDate(0),
    startTime: "14:00",
    endTime: "15:00",
    status: "confirmed",
    notes: "",
    createdDate: seedCreated(3),
  },
  // Tomorrow — confirmed
  {
    id: "ap-004",
    bookingId: "#0004",
    clientId: "cl-002",
    serviceId: "svc-002",
    staffId: "st-002",
    resourceId: "res-002",
    date: seedDate(1),
    startTime: "10:00",
    endTime: "11:30",
    status: "confirmed",
    notes: "Financial review — bring latest statements",
    createdDate: seedCreated(7),
  },
  // Tomorrow — pending
  {
    id: "ap-005",
    bookingId: "#0005",
    clientId: "cl-007",
    serviceId: "svc-001",
    staffId: "st-003",
    resourceId: "res-001",
    date: seedDate(1),
    startTime: "13:00",
    endTime: "14:00",
    status: "pending",
    notes: "",
    createdDate: seedCreated(1),
  },
  // Day +2 — confirmed
  {
    id: "ap-006",
    bookingId: "#0006",
    clientId: "cl-004",
    serviceId: "svc-001",
    staffId: "st-001",
    resourceId: "res-001",
    date: seedDate(2),
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
    notes: "New client intake — referred by Marcus Webb",
    createdDate: seedCreated(10),
  },
  // Day +3 — confirmed
  {
    id: "ap-007",
    bookingId: "#0007",
    clientId: "cl-006",
    serviceId: "svc-003",
    staffId: "st-002",
    resourceId: "res-001",
    date: seedDate(3),
    startTime: "11:00",
    endTime: "12:00",
    status: "confirmed",
    notes: "",
    createdDate: seedCreated(14),
  },
  // Day +5 — pending
  {
    id: "ap-008",
    bookingId: "#0008",
    clientId: "cl-001",
    serviceId: "svc-004",
    staffId: "st-001",
    resourceId: "res-002",
    date: seedDate(5),
    startTime: "14:00",
    endTime: "16:00",
    status: "pending",
    notes: "VIP — confirm availability",
    createdDate: seedCreated(6),
  },
  // Day +7 — confirmed
  {
    id: "ap-009",
    bookingId: "#0009",
    clientId: "cl-005",
    serviceId: "svc-002",
    staffId: "st-002",
    resourceId: "res-002",
    date: seedDate(7),
    startTime: "10:00",
    endTime: "11:30",
    status: "confirmed",
    notes: "",
    createdDate: seedCreated(8),
  },
  // Past week — completed
  {
    id: "ap-010",
    bookingId: "#0010",
    clientId: "cl-003",
    serviceId: "svc-003",
    staffId: "st-001",
    resourceId: "res-001",
    date: seedDate(-3),
    startTime: "09:00",
    endTime: "10:00",
    status: "completed",
    notes: "Tax planning follow-up",
    createdDate: seedCreated(15),
  },
  // Past week — completed
  {
    id: "ap-011",
    bookingId: "#0011",
    clientId: "cl-002",
    serviceId: "svc-001",
    staffId: "st-003",
    resourceId: "res-001",
    date: seedDate(-5),
    startTime: "14:00",
    endTime: "15:00",
    status: "completed",
    notes: "",
    createdDate: seedCreated(20),
  },
  // Past week — cancelled
  {
    id: "ap-012",
    bookingId: "#0012",
    clientId: "cl-007",
    serviceId: "svc-002",
    staffId: "st-002",
    resourceId: "res-002",
    date: seedDate(-4),
    startTime: "11:00",
    endTime: "12:30",
    status: "cancelled",
    notes: "Client rescheduled",
    createdDate: seedCreated(18),
  },
  // Past week — no-show
  {
    id: "ap-013",
    bookingId: "#0013",
    clientId: "cl-004",
    serviceId: "svc-003",
    staffId: "st-001",
    resourceId: "res-001",
    date: seedDate(-6),
    startTime: "10:00",
    endTime: "11:00",
    status: "no-show",
    notes: "Client did not show — contacted next day",
    createdDate: seedCreated(20),
  },
  // Past week — completed (arrived then completed)
  {
    id: "ap-014",
    bookingId: "#0014",
    clientId: "cl-001",
    serviceId: "svc-002",
    staffId: "st-002",
    resourceId: "res-002",
    date: seedDate(-2),
    startTime: "09:00",
    endTime: "10:30",
    status: "completed",
    notes: "Financial review",
    createdDate: seedCreated(25),
  },
  // Past week — completed
  {
    id: "ap-015",
    bookingId: "#0015",
    clientId: "cl-005",
    serviceId: "svc-001",
    staffId: "st-003",
    resourceId: "res-001",
    date: seedDate(-7),
    startTime: "15:00",
    endTime: "16:00",
    status: "completed",
    notes: "",
    createdDate: seedCreated(22),
  },
];

/* ── Waiting List ── */
export const WAITING_LIST: WaitingListEntry[] = [
  {
    id: "wl-001",
    clientId: "cl-006",
    serviceId: "svc-004",
    preferredDate: seedDate(10),
    timeWindow: "Morning",
    priority: "High",
    status: "Waiting",
    notes: "Wants investment advisory — flexible on day",
    addedDate: seedCreated(3),
  },
  {
    id: "wl-002",
    clientId: "cl-007",
    serviceId: "svc-002",
    preferredDate: seedDate(14),
    timeWindow: "Afternoon",
    priority: "Medium",
    status: "Waiting",
    notes: "",
    addedDate: seedCreated(1),
  },
];

/* ── Reports & Integrations — empty (real features, not demo data) ── */
export const REPORTS: Report[] = [];
export const INTEGRATIONS: Integration[] = [];

export const DEFAULT_SETTINGS: StudioSettings = {
  studioName: "",
  email: "",
  phone: "",
  location: "",
  timezone: "",
  businessHours: [
    { day: "Monday",    active: false, start: "", end: "" },
    { day: "Tuesday",   active: false, start: "", end: "" },
    { day: "Wednesday", active: false, start: "", end: "" },
    { day: "Thursday",  active: false, start: "", end: "" },
    { day: "Friday",    active: false, start: "", end: "" },
    { day: "Saturday",  active: false, start: "", end: "" },
    { day: "Sunday",    active: false, start: "", end: "" },
  ],
  defaultSlotDuration: 60,
  bufferTime: 0,
  cancellationPolicyHours: 24,
  taxRate: 0,
  currency: "USD ($)",
  notifications: { email: false, sms: false, push: false, marketing: false },
  primaryColor: "#D4AF37",
  secondaryColor: "#1F1F1F",
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: format time "HH:mm" → "h:mm AM/PM"
// ═══════════════════════════════════════════════════════════════════════════════

export function formatTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatCurrency(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function getDurationMinutes(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZUSTAND STORE
// ═══════════════════════════════════════════════════════════════════════════════

interface BookingStore {
  // Data
  services: Service[];
  staff: StaffMember[];
  clients: Client[];
  resources: Resource[];
  appointments: Appointment[];
  waitingList: WaitingListEntry[];
  reports: Report[];
  integrations: Integration[];
  settings: StudioSettings;

  // Computed lookups
  getService: (id: string) => Service | undefined;
  getStaff: (id: string) => StaffMember | undefined;
  getClient: (id: string) => Client | undefined;
  getResource: (id: string) => Resource | undefined;

  // Appointment CRUD
  addAppointment: (a: Omit<Appointment, "id" | "bookingId" | "createdDate">) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;

  // Client CRUD
  addClient: (c: Omit<Client, "id" | "initials" | "totalBookings" | "lifetimeValue" | "createdDate">) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;

  // Service CRUD
  addService: (s: Omit<Service, "id" | "bookings">) => void;
  updateService: (id: string, updates: Partial<Service>) => void;

  // Resource CRUD
  updateResourceStatus: (id: string, status: ResourceStatus) => void;

  // Waiting List
  addWaitingListEntry: (e: Omit<WaitingListEntry, "id" | "addedDate">) => void;
  updateWaitingListStatus: (id: string, status: WLStatus) => void;
  removeFromWaitingList: (id: string) => void;

  // Settings
  updateSettings: (updates: Partial<StudioSettings>) => void;

  // Workspace reset
  resetWorkspace: () => void;

  // Booking counter
  _nextBookingNum: number;
}

// Persisted state keys
type PersistedKeys = "appointments" | "clients" | "services" | "settings" | "waitingList" | "_nextBookingNum";

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      services: SERVICES,
      staff: STAFF,
      clients: CLIENTS,
      resources: RESOURCES,
      appointments: APPOINTMENTS,
      waitingList: WAITING_LIST,
      reports: REPORTS,
      integrations: INTEGRATIONS,
      settings: DEFAULT_SETTINGS,
      _nextBookingNum: 1,

      getService: (id) => get().services.find((s) => s.id === id),
      getStaff: (id) => get().staff.find((s) => s.id === id),
      getClient: (id) => get().clients.find((c) => c.id === id),
      getResource: (id) => get().resources.find((r) => r.id === id),

      addAppointment: (a) => {
        const num = get()._nextBookingNum;
        const newAppt: Appointment = {
          ...a,
          id: `ap-${Date.now()}`,
          bookingId: `#${num.toString().padStart(4, "0")}`,
          createdDate: new Date().toISOString(),
        };
        set((s) => ({
          appointments: [...s.appointments, newAppt],
          _nextBookingNum: num + 1,
          clients: s.clients.map((c) =>
            c.id === a.clientId
              ? { ...c, totalBookings: c.totalBookings + 1, lastBookingDate: a.date, lifetimeValue: c.lifetimeValue + (s.services.find((sv) => sv.id === a.serviceId)?.price ?? 0) }
              : c
          ),
          services: s.services.map((sv) =>
            sv.id === a.serviceId ? { ...sv, bookings: sv.bookings + 1 } : sv
          ),
        }));
      },

      updateAppointmentStatus: (id, status) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),

      cancelAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status: "cancelled" as AppointmentStatus } : a
          ),
        })),

      addClient: (c) => {
        const id = `cl-${Date.now()}`;
        const initials = c.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
        set((s) => ({
          clients: [...s.clients, { ...c, id, initials, totalBookings: 0, lifetimeValue: 0, createdDate: new Date().toISOString() }],
        }));
      },

      updateClient: (id, updates) =>
        set((s) => ({
          clients: s.clients.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      addService: (s) => {
        const id = `svc-${Date.now()}`;
        set((state) => ({
          services: [...state.services, { ...s, id, bookings: 0 }],
        }));
      },

      updateService: (id, updates) =>
        set((s) => ({
          services: s.services.map((sv) =>
            sv.id === id ? { ...sv, ...updates } : sv
          ),
        })),

      updateResourceStatus: (id, status) =>
        set((s) => ({
          resources: s.resources.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      addWaitingListEntry: (e) => {
        const id = `wl-${Date.now()}`;
        set((s) => ({
          waitingList: [...s.waitingList, { ...e, id, addedDate: new Date().toISOString() }],
        }));
      },

      updateWaitingListStatus: (id, status) =>
        set((s) => ({
          waitingList: s.waitingList.map((w) =>
            w.id === id ? { ...w, status } : w
          ),
        })),

      removeFromWaitingList: (id) =>
        set((s) => ({
          waitingList: s.waitingList.filter((w) => w.id !== id),
        })),

      updateSettings: (updates) =>
        set((s) => ({
          settings: { ...s.settings, ...updates },
        })),

      resetWorkspace: () =>
        set({
          services: SERVICES,
          staff: STAFF,
          clients: CLIENTS,
          resources: RESOURCES,
          appointments: APPOINTMENTS,
          waitingList: WAITING_LIST,
          reports: REPORTS,
          integrations: INTEGRATIONS,
          settings: DEFAULT_SETTINGS,
          _nextBookingNum: APPOINTMENTS.length + 1,
        }),
    }),
    {
      name: "obsidian-booking-store-v4-empty-shell",
      storage: createJSONStorage(() => localStorage),
      version: 4,
      migrate: (_persistedState, _schemaVersion) => {
        // Load seed demo data on first mount of this version
        return {
          services: SERVICES,
          staff: STAFF,
          clients: CLIENTS,
          resources: RESOURCES,
          appointments: APPOINTMENTS,
          waitingList: WAITING_LIST,
          reports: REPORTS,
          integrations: INTEGRATIONS,
          settings: DEFAULT_SETTINGS,
          _nextBookingNum: APPOINTMENTS.length + 1,
        };
      },
      partialize: (state) => ({
        appointments: state.appointments,
        clients: state.clients,
        services: state.services,
        settings: state.settings,
        waitingList: state.waitingList,
        _nextBookingNum: state._nextBookingNum,
      }),
    }
  )
);