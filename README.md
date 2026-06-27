# Obsidian Booking

A premium appointment booking and client management system with a polished black/gold design.

## Features

### Public Booking Page
- Service selection with pricing and duration
- Date and time slot picker (next 30 days)
- Client details form
- Booking confirmation with reference number
- Responsive mobile-friendly design

### Admin Dashboard
- **Dashboard** — Today's schedule, key metrics, upcoming appointments
- **Calendar** — Weekly calendar view with all appointments
- **Appointments** — Full appointment list with filters, detail panel, and status management
- **Clients** — Client management with booking history and lifetime value
- **Services** — Service management with pricing, duration, and categories
- **Settings** — Business information, booking rules, hours, and notification preferences

### Key Capabilities
- Local browser persistence (localStorage) — bookings survive page refresh
- Real appointment creation from both admin and public booking flows
- Status management: pending → confirmed → arrived → completed (or cancelled)
- Auto-assignment of staff and resources when creating bookings
- Coherent seed data for immediate demo experience

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4 + custom premium design system
- **State**: Zustand with localStorage persistence
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives + custom premium components
- **Icons**: Lucide React
- **Type Safety**: TypeScript throughout

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app runs on `http://localhost:3000` by default.

## Deployment

Deploy to Vercel with zero configuration:

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Demo Data

The app loads with seed data for immediate demo use:
- 10 services across consulting, advisory, and support categories
- 4 staff members with schedules and roles
- 10 clients including VIP and returning customers
- 12 appointments spread across today and tomorrow
- 7 resources (meeting rooms, studios, equipment)
- Sample waiting list entries and reports

All appointment dates are generated dynamically relative to the current date, so the demo always feels current.

## Known Limitations

- **No backend authentication** — This is a demo/prototype. Do not use as-is for production without adding proper auth.
- **LocalStorage persistence only** — Data is stored in the browser. Clearing browser data will reset all bookings and changes.
- **No real payment processing** — Payment settings exist in the UI but no payment flow is implemented.
- **No email/SMS notifications** — Notification toggles exist in settings but no actual delivery is wired.
- **No team collaboration** — Single-user demo with no multi-user sync.
- **No calendar sync** — External calendar integrations are shown as sample data but not functional.

For production use, you would need to add a backend database (e.g., Supabase, PlanetScale, PostgreSQL), authentication (e.g., NextAuth.js, Clerk), and integrate real notification providers (e.g., SendGrid, Twilio).

## Project Structure

```
src/
  app/
    page.tsx          # Main app with public/admin mode switch
    layout.tsx        # Root layout with metadata
    globals.css       # Global styles and premium design system
  components/
    dashboard/       # All admin dashboard components
    public/           # Public booking page components
  lib/
    store.ts          # Zustand store with all entities and actions
    types.ts          # TypeScript type definitions
    utils.ts         # Utility functions (cn, etc.)
```

## License

This is a demonstration project. No license is provided for production use.
