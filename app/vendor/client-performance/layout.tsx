import "../dashboard/vendor-dashboard.css";
import { VendorDashboardThemeProvider } from "../dashboard/VendorDashboardThemeContext";

export const metadata = {
  title: "StaffSync — Client Performance",
  description: "Track performance metrics of client accounts.",
};

export default function ClientPerformanceLayout({
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
