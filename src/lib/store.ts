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

export const SERVICES: Service[] = [
  { id: "svc-1", name: "Consultation", category: "Consulting", categoryColor: "purple", duration: 60, price: 120, availability: "Active", staffIds: ["st-1", "st-2", "st-3"], bookings: 96, description: "Initial consultation to understand client needs and recommend tailored solutions.", featured: true },
  { id: "svc-2", name: "Strategy Session", category: "Consulting", categoryColor: "purple", duration: 90, price: 250, availability: "Active", staffIds: ["st-1", "st-2", "st-3"], bookings: 72, description: "In-depth strategic planning session for business growth and operational alignment.", featured: true },
  { id: "svc-3", name: "Team Workshop", category: "Training", categoryColor: "blue", duration: 120, price: 350, availability: "Active", staffIds: ["st-3", "st-4"], bookings: 48, description: "Collaborative workshop for team alignment, skill building, and planning.", featured: false },
  { id: "svc-4", name: "Full Consultation", category: "Consulting", categoryColor: "purple", duration: 60, price: 180, availability: "Active", staffIds: ["st-2", "st-3"], bookings: 64, description: "Comprehensive consultation covering all aspects of client requirements.", featured: false },
  { id: "svc-5", name: "Quick Sync", category: "Support", categoryColor: "green", duration: 30, price: 75, availability: "Active", staffIds: ["st-1", "st-2", "st-4"], bookings: 110, description: "Brief check-in call for status updates and quick decisions.", featured: false },
  { id: "svc-6", name: "Extended Session", category: "Consulting", categoryColor: "purple", duration: 90, price: 220, availability: "Active", staffIds: ["st-2", "st-3"], bookings: 38, description: "Extended planning session for complex projects requiring deep work.", featured: false },
  { id: "svc-7", name: "Follow-up Call", category: "Support", categoryColor: "green", duration: 30, price: 85, availability: "Active", staffIds: ["st-1", "st-2"], bookings: 82, description: "Post-session follow-up to track progress and address questions.", featured: false },
  { id: "svc-8", name: "Portfolio Review", category: "Advisory", categoryColor: "amber", duration: 60, price: 200, availability: "Active", staffIds: ["st-2", "st-3"], bookings: 44, description: "Detailed portfolio analysis with actionable recommendations.", featured: false },
  { id: "svc-9", name: "Onboarding Call", category: "Support", categoryColor: "green", duration: 60, price: 100, availability: "Active", staffIds: ["st-1", "st-4"], bookings: 56, description: "New client onboarding — welcome pack, process walkthrough, and Q&A.", featured: false },
  { id: "svc-10", name: "Deep Dive Session", category: "Consulting", categoryColor: "purple", duration: 60, price: 250, availability: "Limited", staffIds: ["st-3"], bookings: 28, description: "Deep financial review and analysis session with senior consultant.", featured: true },
];

export const STAFF: StaffMember[] = [
  {
    id: "st-3", initials: "SC", name: "Sarah Chen", role: "Manager",
    email: "sarah.chen@obsidianbooking.com", phone: "+1 (555) 100-3001",
    location: "Floor 2, Suite A", status: "Active", rating: 4.9, reviewCount: 127,
    revenueMTD: 4280, hoursWorked: "38h",
    skills: ["Strategy", "Leadership", "Client Relations", "Project Management"],
    weeklyHours: [
      { day: "Mon", start: "8:00 AM", end: "6:00 PM", active: true },
      { day: "Tue", start: "8:00 AM", end: "6:00 PM", active: true },
      { day: "Wed", start: "8:00 AM", end: "6:00 PM", active: true },
      { day: "Thu", start: "8:00 AM", end: "6:00 PM", active: true },
      { day: "Fri", start: "8:00 AM", end: "5:00 PM", active: true },
      { day: "Sat", start: "9:00 AM", end: "1:00 PM", active: true },
      { day: "Sun", start: "", end: "", active: false },
    ],
  },
  {
    id: "st-2", initials: "SB", name: "James Brown", role: "Senior Consultant",
    email: "james.brown@obsidianbooking.com", phone: "+1 (555) 100-3002",
    location: "Floor 1, Suite B", status: "Active", rating: 4.8, reviewCount: 98,
    revenueMTD: 3140, hoursWorked: "36h",
    skills: ["Consulting", "Finance", "Analysis", "Portfolio Review"],
    weeklyHours: [
      { day: "Mon", start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Tue", start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Wed", start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Thu", start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Fri", start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Sat", start: "", end: "", active: false },
      { day: "Sun", start: "", end: "", active: false },
    ],
  },
  {
    id: "st-1", initials: "SA", name: "Emily Davis", role: "Associate",
    email: "emily.davis@obsidianbooking.com", phone: "+1 (555) 100-3003",
    location: "Floor 1, Suite C", status: "Active", rating: 4.5, reviewCount: 62,
    revenueMTD: 1960, hoursWorked: "34h",
    skills: ["Onboarding", "Quick Sync", "Scheduling", "Support"],
    weeklyHours: [
      { day: "Mon", start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Tue", start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Wed", start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Thu", start: "9:00 AM", end: "6:00 PM", active: true },
      { day: "Fri", start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Sat", start: "", end: "", active: false },
      { day: "Sun", start: "", end: "", active: false },
    ],
  },
  {
    id: "st-4", initials: "SD", name: "Michael Chen", role: "Support",
    email: "michael.chen@obsidianbooking.com", phone: "+1 (555) 100-3004",
    location: "Floor 1, Suite C", status: "Active", rating: 4.3, reviewCount: 41,
    revenueMTD: 980, hoursWorked: "30h",
    skills: ["Support", "Admin", "Data Entry", "Scheduling"],
    weeklyHours: [
      { day: "Mon", start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Tue", start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Wed", start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Thu", start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Fri", start: "9:00 AM", end: "5:00 PM", active: true },
      { day: "Sat", start: "", end: "", active: false },
      { day: "Sun", start: "", end: "", active: false },
    ],
  },
];

export const CLIENTS: Client[] = [
  { id: "cl-1", name: "Alexandra Sterling", initials: "AS", tier: "VIP", phone: "+1 (555) 001-0001", email: "a.sterling@sterlingcap.com", totalBookings: 18, lifetimeValue: 4560, status: "Active", tags: ["VIP", "High Value"], lastBookingDate: "2024-05-15T10:00:00", notes: "Key client — quarterly strategy sessions. Prefers morning slots.", createdDate: "2024-01-05T09:00:00" },
  { id: "cl-2", name: "Marcus Webb", initials: "MW", tier: "VIP", phone: "+1 (555) 002-0002", email: "m.webb@webbgroup.com", totalBookings: 14, lifetimeValue: 3280, status: "Active", tags: ["VIP", "Enterprise"], lastBookingDate: "2024-05-14T14:00:00", notes: "Enterprise client. Needs conference room for team sessions.", createdDate: "2024-01-12T10:30:00" },
  { id: "cl-3", name: "Olivia Park", initials: "OP", tier: "Regular", phone: "+1 (555) 003-0003", email: "o.park@email.com", totalBookings: 8, lifetimeValue: 1240, status: "Returning", tags: ["Returning"], lastBookingDate: "2024-05-15T13:00:00", notes: "Returning client interested in team workshops.", createdDate: "2024-02-01T14:00:00" },
  { id: "cl-4", name: "Daniel Kim", initials: "DK", tier: "VIP", phone: "+1 (555) 004-0004", email: "d.kim@kimventures.com", totalBookings: 12, lifetimeValue: 2890, status: "Active", tags: ["VIP", "Investor"], lastBookingDate: "2024-05-16T09:30:00", notes: "Strategy planning for Q3. Prefers Sarah Chen.", createdDate: "2024-01-20T08:00:00" },
  { id: "cl-5", name: "Sophia Martinez", initials: "SM", tier: "Regular", phone: "+1 (555) 005-0005", email: "s.martinez@email.com", totalBookings: 5, lifetimeValue: 780, status: "Active", tags: ["New"], lastBookingDate: "2024-05-15T10:00:00", notes: "Portfolio review client.", createdDate: "2024-03-15T11:00:00" },
  { id: "cl-6", name: "Ryan Thompson", initials: "RT", tier: "Regular", phone: "+1 (555) 006-0006", email: "r.thompson@email.com", totalBookings: 3, lifetimeValue: 450, status: "Active", tags: ["New"], lastBookingDate: "2024-05-16T11:00:00", notes: "Team alignment workshop booking.", createdDate: "2024-04-02T09:00:00" },
  { id: "cl-7", name: "Natalie Green", initials: "NG", tier: "Regular", phone: "+1 (555) 007-0007", email: "n.green@email.com", totalBookings: 6, lifetimeValue: 960, status: "Returning", tags: ["Returning"], lastBookingDate: "2024-05-15T15:00:00", notes: "Prefers afternoon slots. Extended planning sessions.", createdDate: "2024-02-20T13:00:00" },
  { id: "cl-8", name: "James Mitchell", initials: "JM", tier: "Regular", phone: "+1 (555) 008-0008", email: "j.mitchell@email.com", totalBookings: 4, lifetimeValue: 620, status: "Active", tags: [], lastBookingDate: "2024-05-15T15:00:00", notes: "Follow-up from last week's consultation.", createdDate: "2024-03-05T10:00:00" },
  { id: "cl-9", name: "Elena Rodriguez", initials: "ER", tier: "Regular", phone: "+1 (555) 009-0009", email: "e.rodriguez@email.com", totalBookings: 2, lifetimeValue: 300, status: "Active", tags: ["New"], lastBookingDate: "2024-05-15T16:00:00", notes: "Onboarding — new client.", createdDate: "2024-05-01T09:00:00" },
  { id: "cl-10", name: "David Park", initials: "DP", tier: "VIP", phone: "+1 (555) 010-0010", email: "d.park@parkholdings.com", totalBookings: 22, lifetimeValue: 5100, status: "Active", tags: ["VIP", "High Value", "Long-term"], lastBookingDate: "2024-05-15T09:00:00", notes: "Top client — deep dive sessions every 2 weeks.", createdDate: "2024-01-02T08:30:00" },
];

export const RESOURCES: Resource[] = [
  { id: "res-1", name: "Meeting Room A", code: "MR-A", type: "Meeting Room", location: "Executive Suite, Floor 2", capacity: 8, status: "Available", amenities: ["TV", "Whiteboard", "Video Conferencing", "Air Conditioning"], manager: "Sarah Chen", notes: "Best room for client presentations and strategy sessions." },
  { id: "res-2", name: "Studio B", code: "ST-B", type: "Studio", location: "Executive Suite, Floor 1", capacity: 12, status: "In Use", amenities: ["Lighting Rig", "Backdrop", "Audio System", "Green Screen"], manager: "James Brown", notes: "Primary studio for photoshoots and video sessions." },
  { id: "res-3", name: "Conference Suite", code: "CS-1", type: "Conference Room", location: "Executive Suite, Floor 3", capacity: 20, status: "Available", amenities: ["Projector", "Sound System", "Microphones", "Catering Area"], manager: "Sarah Chen", notes: "Large conference room for team events and workshops." },
  { id: "res-4", name: "Projector Kit", code: "PK-1", type: "Equipment", location: "Equipment Storage, Floor 1", capacity: null, status: "Available", amenities: ["4K Projector", "HDMI Cables", "Remote", "Carry Case"], manager: "Michael Chen", notes: "Portable projector kit — must be returned same day." },
  { id: "res-5", name: "VIP Lounge", code: "VL-1", type: "Lounge", location: "Executive Suite, Floor 2", capacity: 10, status: "In Use", amenities: ["Refreshments", "TV", "Sofas", "Privacy Glass"], manager: "Emily Davis", notes: "Reserved for VIP client meetings and entertainment." },
  { id: "res-6", name: "Mobile Setup", code: "MS-1", type: "Equipment", location: "Mobile", capacity: null, status: "Available", amenities: ["Laptop", "Hotspot", "Portable Screen", "Chargers"], manager: "Michael Chen", notes: "Mobile equipment for off-site events." },
  { id: "res-7", name: "Vehicle 01", code: "VH-1", type: "Vehicle", location: "Main Location Garage", capacity: 4, status: "Maintenance", amenities: ["GPS", "Leather Seats", "WiFi"], manager: "Michael Chen", notes: "Scheduled maintenance until May 20." },
];

// Dynamic date helper for seed data
function getSeedDate(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getSeedCreatedDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

// Appointments spread across today and tomorrow
export const APPOINTMENTS: Appointment[] = [
  { id: "ap-1",  bookingId: "#0821", clientId: "cl-10", serviceId: "svc-2", staffId: "st-2", resourceId: "res-1", date: getSeedDate(0), startTime: "09:00", endTime: "10:00", status: "confirmed", notes: "Deep financial review. Prepare Q2 deck.", createdDate: getSeedCreatedDate(5) },
  { id: "ap-2",  bookingId: "#0822", clientId: "cl-5",  serviceId: "svc-8", staffId: "st-2", resourceId: "res-1", date: getSeedDate(0), startTime: "10:00", endTime: "11:00", status: "arrived", notes: "Bring updated portfolio docs.", createdDate: getSeedCreatedDate(4) },
  { id: "ap-3",  bookingId: "#0823", clientId: "cl-2",  serviceId: "svc-3", staffId: "st-3", resourceId: "res-3", date: getSeedDate(0), startTime: "11:00", endTime: "13:00", status: "confirmed", notes: "Team alignment workshop — needs projector.", createdDate: getSeedCreatedDate(6) },
  { id: "ap-4",  bookingId: "#0824", clientId: "cl-3",  serviceId: "svc-5", staffId: "st-1", resourceId: "res-5", date: getSeedDate(0), startTime: "12:00", endTime: "12:30", status: "pending", notes: "Follow-up from last session.", createdDate: getSeedCreatedDate(3) },
  { id: "ap-5",  bookingId: "#0825", clientId: "cl-7",  serviceId: "svc-4", staffId: "st-2", resourceId: "res-1", date: getSeedDate(0), startTime: "13:00", endTime: "14:00", status: "confirmed", notes: "Initial full consultation — needs onboarding package.", createdDate: getSeedCreatedDate(7) },
  { id: "ap-6",  bookingId: "#0826", clientId: "cl-1",  serviceId: "svc-10", staffId: "st-1", resourceId: "res-2", date: getSeedDate(0), startTime: "14:00", endTime: "15:00", status: "completed", notes: "Deep dive session — financial review.", createdDate: getSeedCreatedDate(8) },
  { id: "ap-7",  bookingId: "#0827", clientId: "cl-7",  serviceId: "svc-6", staffId: "st-3", resourceId: "res-1", date: getSeedDate(0), startTime: "15:00", endTime: "16:30", status: "confirmed", notes: "Extended planning session. Block 90 min.", createdDate: getSeedCreatedDate(2) },
  { id: "ap-8",  bookingId: "#0828", clientId: "cl-8",  serviceId: "svc-7", staffId: "st-2", resourceId: "res-5", date: getSeedDate(0), startTime: "15:00", endTime: "15:30", status: "pending", notes: "Quick follow-up from last week.", createdDate: getSeedCreatedDate(1) },
  { id: "ap-9",  bookingId: "#0829", clientId: "cl-9",  serviceId: "svc-9", staffId: "st-3", resourceId: "res-1", date: getSeedDate(0), startTime: "16:00", endTime: "17:00", status: "completed", notes: "New client onboarding — send welcome pack first.", createdDate: getSeedCreatedDate(5) },
  { id: "ap-10", bookingId: "#0830", clientId: "cl-3",  serviceId: "svc-5", staffId: "st-1", resourceId: "res-5", date: getSeedDate(0), startTime: "17:00", endTime: "17:30", status: "completed", notes: "Status update sync.", createdDate: getSeedCreatedDate(4) },
  { id: "ap-11", bookingId: "#0831", clientId: "cl-4",  serviceId: "svc-2", staffId: "st-1", resourceId: "res-1", date: getSeedDate(1), startTime: "09:30", endTime: "11:00", status: "confirmed", notes: "Strategy planning for Q3.", createdDate: getSeedCreatedDate(3) },
  { id: "ap-12", bookingId: "#0832", clientId: "cl-6",  serviceId: "svc-3", staffId: "st-3", resourceId: "res-3", date: getSeedDate(1), startTime: "11:00", endTime: "13:00", status: "pending", notes: "Team alignment workshop.", createdDate: getSeedCreatedDate(2) },
];

export const WAITING_LIST: WaitingListEntry[] = [
  { id: "wl-1", clientId: "cl-5", serviceId: "svc-2", preferredDate: "2024-05-17", timeWindow: "9:00 AM – 12:00 PM", priority: "High", status: "Waiting", addedDate: "2024-05-14T10:00:00", notes: "Needs strategy session, no availability this week." },
  { id: "wl-2", clientId: "cl-6", serviceId: "svc-4", preferredDate: "2024-05-17", timeWindow: "1:00 PM – 4:00 PM", priority: "Medium", status: "Contacted", addedDate: "2024-05-13T14:00:00", notes: "Called on May 14 — awaiting response." },
  { id: "wl-3", clientId: "cl-9", serviceId: "svc-1", preferredDate: "2024-05-20", timeWindow: "10:00 AM – 2:00 PM", priority: "Low", status: "Waiting", addedDate: "2024-05-15T08:00:00", notes: "New client — flexible on timing." },
  { id: "wl-4", clientId: "cl-8", serviceId: "svc-10", preferredDate: "2024-05-17", timeWindow: "2:00 PM – 5:00 PM", priority: "High", status: "Offered Slot", addedDate: "2024-05-12T11:00:00", notes: "Offered May 17 3PM slot — pending confirmation." },
  { id: "wl-5", clientId: "cl-3", serviceId: "svc-6", preferredDate: "2024-05-18", timeWindow: "9:00 AM – 12:00 PM", priority: "Medium", status: "Waiting", addedDate: "2024-05-15T09:30:00", notes: "Wants extended session if possible." },
];

export const REPORTS: Report[] = [
  { id: "rpt-1", name: "Executive Summary", starred: true, category: "Business", dateRange: { start: "2024-04-01", end: "2024-04-30" }, format: "PDF", ownerId: "st-3", lastGenerated: "2024-05-01T08:12:00", schedule: "Monthly", status: "Completed", size: "12.4 MB", sections: ["KPI Overview", "Booking Summary", "Top Services", "Client Overview", "Revenue Breakdown", "Staff Performance"], recipients: ["st-3", "st-2", "st-1"] },
  { id: "rpt-2", name: "Client Activity Report", starred: false, category: "Clients", dateRange: { start: "2024-04-01", end: "2024-04-30" }, format: "PDF", ownerId: "st-2", lastGenerated: "2024-04-30T10:45:00", schedule: "Weekly", status: "Completed", size: "8.2 MB", sections: ["New Clients", "Returning Clients", "Churn Analysis", "Client Revenue"], recipients: ["st-2", "st-3"] },
  { id: "rpt-3", name: "Booking Utilization", starred: false, category: "Operations", dateRange: { start: "2024-04-01", end: "2024-04-30" }, format: "XLSX", ownerId: "st-3", lastGenerated: "2024-04-30T18:15:00", schedule: "Weekly", status: "Completed", size: "4.7 MB", sections: ["Utilization Rates", "Peak Hours", "Room Usage", "Staff Load"], recipients: ["st-3"] },
  { id: "rpt-4", name: "Revenue Report", starred: false, category: "Finance", dateRange: { start: "2024-03-01", end: "2024-03-31" }, format: "PDF", ownerId: "st-3", lastGenerated: "2024-04-01T09:22:00", schedule: "Monthly", status: "Completed", size: "15.1 MB", sections: ["Revenue Breakdown", "Service Revenue", "Client Revenue", "Trends"], recipients: ["st-3", "st-2"] },
  { id: "rpt-5", name: "Staff Performance", starred: false, category: "Team", dateRange: { start: "2024-04-01", end: "2024-04-30" }, format: "PDF", ownerId: "st-1", lastGenerated: "2024-04-30T14:22:00", schedule: "Monthly", status: "Completed", size: "6.8 MB", sections: ["Individual Performance", "Client Ratings", "Revenue per Staff", "Hours Worked"], recipients: ["st-1", "st-3"] },
  { id: "rpt-6", name: "No Show & Cancellations", starred: false, category: "Operations", dateRange: { start: "2024-04-01", end: "2024-04-30" }, format: "CSV", ownerId: "st-3", lastGenerated: "2024-04-30T13:05:00", schedule: "Weekly", status: "Completed", size: "1.2 MB", sections: ["No Shows", "Cancellations", "Reasons", "Trends"], recipients: ["st-3"] },
  { id: "rpt-7", name: "Service Performance", starred: false, category: "Analytics", dateRange: { start: "2024-04-01", end: "2024-04-30" }, format: "PDF", ownerId: "st-2", lastGenerated: null, schedule: "Weekly", status: "Scheduled", size: "—", sections: ["Service Metrics", "Popularity", "Revenue", "Ratings"], recipients: ["st-2"] },
  { id: "rpt-8", name: "Custom Report", starred: false, category: "Custom", dateRange: { start: "2024-04-01", end: "2024-04-30" }, format: "XLSX", ownerId: "st-3", lastGenerated: null, schedule: "On Demand", status: "Draft", size: "—", sections: [], recipients: ["st-3"] },
];

export const INTEGRATIONS: Integration[] = [
  { id: "int-1", name: "Calendar Sync", description: "Keep schedules in sync across platforms.", iconColor: "text-yellow-500", status: "Connected", lastSync: "2 min ago", permissions: ["Read Calendars", "Write Events", "Manage Availability"], category: "Productivity", recordsSynced: "1,248 events", syncFrequency: "Every 5 minutes" },
  { id: "int-2", name: "Payments Gateway", description: "Process payments and manage transactions.", iconColor: "text-purple-500", status: "Connected", lastSync: "5 min ago", permissions: ["Read Transactions", "Process Payments"], category: "Finance", recordsSynced: "3,420 transactions", syncFrequency: "Real-time" },
  { id: "int-3", name: "Video Meetings", description: "Virtual meeting room integration.", iconColor: "text-blue-500", status: "Connected", lastSync: "1 hr ago", permissions: ["Create Meetings", "Manage Participants"], category: "Communication", recordsSynced: "856 meetings", syncFrequency: "Every 15 minutes" },
  { id: "int-4", name: "Messaging", description: "SMS and messaging notifications.", iconColor: "text-green-500", status: "Connected", lastSync: "Just now", permissions: ["Send Messages", "Read Inbox"], category: "Communication", recordsSynced: "2,150 messages", syncFrequency: "Real-time" },
  { id: "int-5", name: "Email Marketing", description: "Email campaigns and newsletters.", iconColor: "text-purple-400", status: "Connected", lastSync: "15 min ago", permissions: ["Send Emails", "Manage Lists"], category: "Marketing", recordsSynced: "12,400 emails", syncFrequency: "Every 30 minutes" },
  { id: "int-6", name: "Automation", description: "Workflow automation engine.", iconColor: "text-yellow-400", status: "Active", lastSync: "5 min ago", permissions: ["Trigger Workflows", "Manage Rules"], category: "Productivity", recordsSynced: "428 automations", syncFrequency: "Real-time" },
  { id: "int-7", name: "CRM Sync", description: "Customer relationship management.", iconColor: "text-blue-400", status: "Connected", lastSync: "30 min ago", permissions: ["Read Contacts", "Write Deals"], category: "Sales", recordsSynced: "1,890 contacts", syncFrequency: "Every 10 minutes" },
  { id: "int-8", name: "Webhooks", description: "Custom webhook endpoints.", iconColor: "text-red-400", status: "Warning", lastSync: "2 hr ago", permissions: ["Read Events"], category: "Developer", recordsSynced: "5,230 events", syncFrequency: "Real-time" },
];

export const DEFAULT_SETTINGS: StudioSettings = {
  studioName: "Studio A",
  email: "hello@obsidianbooking.com",
  phone: "(555) 123-4567",
  location: "123 Creative Way, Suite 300, Los Angeles, CA 9012, USA",
  timezone: "(GMT-08:00) Pacific Time (US & Canada)",
  businessHours: [
    { day: "Monday",    active: true,  start: "9:00 AM", end: "6:00 PM" },
    { day: "Tuesday",   active: true,  start: "9:00 AM", end: "6:00 PM" },
    { day: "Wednesday", active: true,  start: "9:00 AM", end: "6:00 PM" },
    { day: "Thursday",  active: true,  start: "9:00 AM", end: "6:00 PM" },
    { day: "Friday",    active: true,  start: "9:00 AM", end: "5:00 PM" },
    { day: "Saturday",  active: true,  start: "9:00 AM", end: "1:00 PM" },
    { day: "Sunday",    active: false, start: "",         end: "" },
  ],
  defaultSlotDuration: 60,
  bufferTime: 15,
  cancellationPolicyHours: 24,
  taxRate: 8.25,
  currency: "USD ($)",
  notifications: { email: true, sms: true, push: true, marketing: false },
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
      _nextBookingNum: 833,

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
    }),
    {
      name: "obsidian-booking-store",
      storage: createJSONStorage(() => localStorage),
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