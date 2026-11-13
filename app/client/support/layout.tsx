import "../dashboard/dashboard.css";
import { DashboardThemeProvider } from "../dashboard/DashboardThemeContext";

export const metadata = {
  title: "StaffSync — Support",
  description: "Get help with your account, requirements, and placements.",
};

export default function SupportLayout({
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
