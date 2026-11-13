import "./vendor-dashboard.css";
import { VendorDashboardThemeProvider } from "./VendorDashboardThemeContext";

export const metadata = {
  title: "StaffSync — Vendor Dashboard",
  description:
    "Your vendor overview. Track submissions, active opportunities, and real-time activity in one place.",
};

export default function VendorDashboardLayout({
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
