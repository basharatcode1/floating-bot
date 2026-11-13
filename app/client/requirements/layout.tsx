import "../dashboard/dashboard.css";
import { DashboardThemeProvider } from "../dashboard/DashboardThemeContext";

export const metadata = {
  title: "StaffSync — My Requirements",
  description: "Manage your job descriptions and hiring needs.",
};

export default function RequirementsLayout({
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
