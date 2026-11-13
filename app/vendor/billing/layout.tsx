import "../dashboard/vendor-dashboard.css";
import { VendorDashboardThemeProvider } from "../dashboard/VendorDashboardThemeContext";

export const metadata = {
  title: "StaffSync — Vendor Billing",
  description: "Manage your invoices, earnings, and payment methods.",
};

export default function BillingLayout({
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
