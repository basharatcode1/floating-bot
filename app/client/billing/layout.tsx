import "../dashboard/dashboard.css";
import { DashboardThemeProvider } from "../dashboard/DashboardThemeContext";

export const metadata = {
  title: "StaffSync — Client Billing",
  description: "Manage your invoices, subscription plan, and billing options.",
};

export default function BillingLayout({
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
