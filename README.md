# Obsidian Booking

A premium appointment booking frontend prototype built with Next.js, Tailwind CSS, Zustand, and Framer Motion.

## Overview

Obsidian Booking includes a public booking flow and an admin workspace for managing appointments, clients, services, and calendar scheduling.

## Features

- Public booking page
- Service selection
- Date/time selection
- Booking reference generation
- Admin dashboard
- Appointment list with filters
- Client records
- Service management
- Weekly calendar view
- Settings page
- Local browser persistence
- Premium black/gold interface

## Demo Notes

This is a portfolio frontend prototype. Data is stored locally in the browser using Zustand persistence/localStorage.

It does not include production authentication, database storage, email/SMS delivery, or payment processing.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- Lucide Icons

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Production Upgrade Path

To make this a real client system, add:

- authentication
- database
- server-side validation
- email/SMS confirmations
- role-based access
- backup/export
- deployment environment configuration

Do not claim it is a production SaaS.

## Demo Data

The app loads with seed data for immediate demo use:
- 10 services across advisory and onboarding categories
- 4 staff members with role-based labels
- 10 anonymized client accounts
- 12 appointments spread across today and tomorrow
- 7 resources

All appointment dates are generated dynamically relative to the current date, so the demo always feels current.

## License

This is a demonstration project. No license is provided for production use.
