import "../dashboard/vendor-dashboard.css";
import { VendorDashboardThemeProvider } from "../dashboard/VendorDashboardThemeContext";

export const metadata = {
  title: "StaffSync — Support",
  description: "Get help with your candidates, opportunities, and submissions.",
};

export default function VendorSupportLayout({
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
