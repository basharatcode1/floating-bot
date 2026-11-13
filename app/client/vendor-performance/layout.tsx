import "../dashboard/dashboard.css";
import { DashboardThemeProvider } from "../dashboard/DashboardThemeContext";

export const metadata = {
  title: "StaffSync — Vendor Performance",
  description: "Track vendor success rates, response times, and effectiveness.",
};

export default function VendorPerformanceLayout({
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
