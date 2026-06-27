// ── Shared Types ──────────────────────────────────────────────────────────────
// Single source of truth for all entity shapes across the entire dashboard.

/* ── Services ── */
export interface Service {
  id: string;
  name: string;
  category: string;
  categoryColor: string; // "purple" | "blue" | "green" | "amber" | "red"
  duration: number;       // minutes
  price: number;          // USD
  availability: "Active" | "Limited" | "Inactive";
  staffIds: string[];
  bookings: number;
  description: string;
  featured: boolean;
}

/* ── Staff ── */
export type StaffRole = "Manager" | "Senior Consultant" | "Associate" | "Specialist" | "Support" | "Coordinator";
export type StaffStatus = "Active" | "On Leave" | "Day Off";

export interface StaffMember {
  id: string;
  initials: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  location: string;
  status: StaffStatus;
  rating: number;
  reviewCount: number;
  revenueMTD: number;
  hoursWorked: string;
  skills: string[];
  weeklyHours: { day: string; start: string; end: string; active: boolean }[];
}

/* ── Clients ── */
export type ClientTier = "VIP" | "Regular";
export type ClientStatus = "Active" | "Returning" | "Inactive";

export interface Client {
  id: string;
  name: string;
  initials: string;
  tier: ClientTier;
  phone: string;
  email: string;
  totalBookings: number;
  lifetimeValue: number;   // USD
  status: ClientStatus;
  tags: string[];
  lastBookingDate: string; // ISO date
  notes: string;
  createdDate: string;     // ISO date
}

/* ── Resources ── */
export type ResourceType = "Meeting Room" | "Studio" | "Conference Room" | "Equipment" | "Lounge" | "Vehicle";
export type ResourceStatus = "Available" | "In Use" | "Maintenance";

export interface Resource {
  id: string;
  name: string;
  code: string;
  type: ResourceType;
  location: string;
  capacity: number | null;
  status: ResourceStatus;
  amenities: string[];
  manager: string;
  notes: string;
}

/* ── Appointments ── */
export type AppointmentStatus = "confirmed" | "pending" | "arrived" | "completed" | "cancelled" | "no-show";

export interface Appointment {
  id: string;
  bookingId: string;      // e.g. "#0821"
  clientId: string;
  serviceId: string;
  staffId: string;
  resourceId: string;
  date: string;            // ISO date string YYYY-MM-DD
  startTime: string;       // HH:mm
  endTime: string;         // HH:mm
  status: AppointmentStatus;
  notes: string;
  createdDate: string;     // ISO date
}

/* ── Waiting List ── */
export type WLPriority = "High" | "Medium" | "Low";
export type WLStatus = "Waiting" | "Contacted" | "Offered Slot" | "Expired";

export interface WaitingListEntry {
  id: string;
  clientId: string;
  serviceId: string;
  preferredDate: string;
  timeWindow: string;
  priority: WLPriority;
  status: WLStatus;
  addedDate: string;
  notes: string;
}

/* ── Reports ── */
export type ReportStatus = "Completed" | "Scheduled" | "Draft" | "Failed";
export type ReportFormat = "PDF" | "XLSX" | "CSV";

export interface Report {
  id: string;
  name: string;
  starred: boolean;
  category: string;
  dateRange: { start: string; end: string };
  format: ReportFormat;
  ownerId: string;
  lastGenerated: string | null;
  schedule: "Weekly" | "Monthly" | "On Demand";
  status: ReportStatus;
  size: string;            // e.g. "12.4 MB"
  sections: string[];
  recipients: string[];    // staff IDs
}

/* ── Integrations ── */
export type IntegrationStatus = "Connected" | "Active" | "Warning" | "Disconnected" | "Pending";

export interface Integration {
  id: string;
  name: string;
  description: string;
  iconColor: string;       // tailwind color class e.g. "text-yellow-500"
  status: IntegrationStatus;
  lastSync: string;
  permissions: string[];
  category: string;
  recordsSynced: string;
  syncFrequency: string;
}

/* ── Settings ── */
export interface StudioSettings {
  studioName: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  businessHours: { day: string; active: boolean; start: string; end: string }[];
  defaultSlotDuration: number;
  bufferTime: number;
  cancellationPolicyHours: number;
  taxRate: number;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  primaryColor: string;
  secondaryColor: string;
}
