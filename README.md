# Obsidian Booking

A focused appointment booking and management interface for private advisory-style service businesses.

## Features

- Public booking flow with service selection, date/time picker, and booking reference generation
- Admin dashboard with appointment management, client records, and service management
- Business settings for profile, hours, booking rules, and notifications
- Local browser persistence (localStorage) for demo persistence

## Demo Persistence

This version uses browser localStorage for demo persistence. It is suitable for prototype review and client-facing demos, but production delivery should connect a database, authentication, and email/SMS services.

## Production Requirements

Before using this as a real business system, add:

- Backend database (e.g., Supabase, PostgreSQL)
- Authentication
- Server-side validation
- Email/SMS confirmations
- Role-based access
- Backup/export
- Deployment environment configuration

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

## Demo Data

The app loads with seed data for immediate demo use:
- 10 services across advisory and onboarding categories
- 4 staff members with role-based labels
- 10 anonymized client accounts
- 12 appointments spread across today and tomorrow
- 7 resources

All appointment dates are generated dynamically relative to the current date, so the demo always feels current.

## Known Limitations

- **No backend authentication** — This is a demo/prototype. Do not use as-is for production without adding proper auth.
- **LocalStorage persistence only** — Data is stored in the browser. Clearing browser data will reset all bookings and changes.
- **No real payment processing** — Payment settings exist in the UI but no payment flow is implemented.
- **No email/SMS notifications** — Notification toggles exist in settings but no actual delivery is wired.
- **No team collaboration** — Single-user demo with no multi-user sync.

## License

This is a demonstration project. No license is provided for production use.
