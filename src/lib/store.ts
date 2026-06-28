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
// SEED DATA — Single source of truth for every entity.
// Every page must read from the store; no inline hardcoded arrays allowed.
// ═══════════════════════════════════════════════════════════════════════════════

export const SERVICES: Service[] = [];

export const STAFF: StaffMember[] = [];

export const CLIENTS: Client[] = [];

export const RESOURCES: Resource[] = [];

export const APPOINTMENTS: Appointment[] = [];
export const WAITING_LIST: WaitingListEntry[] = [];
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
          _nextBookingNum: 1,
        }),
    }),
    {
      name: "obsidian-booking-store-v4-empty-shell",
      storage: createJSONStorage(() => localStorage),
      version: 4,
      migrate: (_persistedState, _schemaVersion) => {
        // Always clear old data on migration — start completely fresh
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
          _nextBookingNum: 1,
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