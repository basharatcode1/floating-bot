import "../dashboard/dashboard.css";
import { DashboardThemeProvider } from "../dashboard/DashboardThemeContext";

export const metadata = {
  title: "StaffSync — Notifications",
  description: "View and manage all your recruitment alerts and matches.",
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardThemeProvider>
      {children}
    </DashboardThemeProvider>
  );
}
