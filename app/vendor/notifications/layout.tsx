import "../dashboard/vendor-dashboard.css";
import { VendorDashboardThemeProvider } from "../dashboard/VendorDashboardThemeContext";

export const metadata = {
  title: "StaffSync — Vendor Notifications",
  description: "View and manage all your vendor alerts, new opportunities, and shortlisted candidate notifications.",
};

export default function VendorNotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VendorDashboardThemeProvider>
      {children}
    </VendorDashboardThemeProvider>
  );
}
