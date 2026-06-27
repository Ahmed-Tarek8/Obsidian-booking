"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { AppointmentsPage } from "@/components/dashboard/AppointmentsPage";
import { CalendarPage } from "@/components/dashboard/CalendarPage";
import { ClientsPage } from "@/components/dashboard/ClientsPage";
import { ServicesPage } from "@/components/dashboard/ServicesPage";
import { StaffPage } from "@/components/dashboard/StaffPage";
import { WaitingListPage } from "@/components/dashboard/WaitingListPage";
import { ResourcesPage } from "@/components/dashboard/ResourcesPage";
import { AnalyticsPage } from "@/components/dashboard/AnalyticsPage";
import { ReportsPage } from "@/components/dashboard/ReportsPage";
import { SettingsPage } from "@/components/dashboard/SettingsPage";
import { IntegrationsPage } from "@/components/dashboard/IntegrationsPage";

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
};

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [calendarBookingId, setCalendarBookingId] = useState<string | null>("cb17");

  const renderPage = () => {
    switch (activeNav) {
      case "calendar":
        return (
          <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
            <CalendarPage onSelectBooking={setCalendarBookingId} selectedBookingId={calendarBookingId} />
          </motion.div>
        );
      case "appointments":
        return (
          <motion.div key="appointments" {...pageTransition}>
            <AppointmentsPage />
          </motion.div>
        );
      case "clients":
        return (
          <motion.div key="clients" {...pageTransition}>
            <ClientsPage />
          </motion.div>
        );
      case "services":
        return (
          <motion.div key="services" {...pageTransition}>
            <ServicesPage />
          </motion.div>
        );
      case "waiting-list":
        return (
          <motion.div key="waiting-list" {...pageTransition}>
            <WaitingListPage />
          </motion.div>
        );
      case "staff":
        return (
          <motion.div key="staff" {...pageTransition}>
            <StaffPage />
          </motion.div>
        );
      case "resources":
        return (
          <motion.div key="resources" {...pageTransition}>
            <ResourcesPage />
          </motion.div>
        );
      case "analytics":
        return (
          <motion.div key="analytics" {...pageTransition}>
            <AnalyticsPage />
          </motion.div>
        );
      case "reports":
        return (
          <motion.div key="reports" {...pageTransition}>
            <ReportsPage />
          </motion.div>
        );
      case "settings":
        return (
          <motion.div key="settings" {...pageTransition}>
            <SettingsPage />
          </motion.div>
        );
      case "integrations":
        return (
          <motion.div key="integrations" {...pageTransition}>
            <IntegrationsPage />
          </motion.div>
        );
      default:
        return (
          <motion.div key="dashboard" {...pageTransition}>
            <DashboardView />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0e0e0e]">
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}