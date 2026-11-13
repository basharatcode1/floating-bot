import "../dashboard/vendor-dashboard.css";
import { VendorDashboardThemeProvider } from "../dashboard/VendorDashboardThemeContext";

export const metadata = {
  title: "StaffSync — Opportunities",
  description: "View open requirements and submit candidates.",
};

export default function VendorOpportunitiesLayout({
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
