import "./dashboard.css";
import { DashboardThemeProvider } from "./DashboardThemeContext";

export const metadata = {
  title: "StaffSync — Dashboard",
  description:
    "Your recruitment overview. Track requirements, candidates, vendor performance, and real-time activity in one place.",
};

export default function DashboardLayout({
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
