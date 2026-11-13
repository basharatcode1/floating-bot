import * as Highcharts from "highcharts";

export type ChartThemeMode = "light" | "dark";

export const STAFFSYNC_CHART_COLORS = {
  primary: "#005A9C", // Deep Ocean Blue
  secondary: "#06B6D4", // Cyan
  success: "#10B981", // Emerald
  warning: "#F59E0B", // Amber
  danger: "#F43F5E", // Red
  textPrimary: "#F1F5F9", // Near White
  textSecondary: "#94A3B8", // Muted Slate
  grid: "rgba(148, 163, 184, 0.08)", // Very low-opacity slate
  tooltipBg: "rgba(15, 23, 42, 0.95)",
  tooltipBorder: "rgba(255, 255, 255, 0.1)",
  cardBg: "#0E1524" // Matches the CSS var(--dash-card-bg-solid)
};

export function getChartColors(mode: ChartThemeMode = "dark") {
  const isLight = mode === "light";
  return {
    primary: isLight ? "#005A9C" : "#0284C7",
    primaryDark: isLight ? "#004A82" : "#005A9C",
    primaryLight: isLight ? "#0077CC" : "#38BDF8",
    secondary: "#06B6D4",
    success: isLight ? "#059669" : "#10B981",
    warning: "#F59E0B",
    danger: "#F43F5E",
    textPrimary: isLight ? "#0F172A" : "#F1F5F9",
    textSecondary: isLight ? "#475569" : "#94A3B8",
    textMuted: "#64748B",
    grid: isLight ? "rgba(15, 23, 42, 0.06)" : "rgba(148, 163, 184, 0.08)",
    tooltipBg: isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(15, 23, 42, 0.95)",
    tooltipBorder: isLight ? "#CEE1F1" : "rgba(255, 255, 255, 0.1)",
    cardBg: isLight ? "#FFFFFF" : "#0E1524",
  };
}

export const StaffSyncHighchartsTheme: Partial<Highcharts.ChartOptions> = {
  backgroundColor: "transparent",
  style: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
  animation: {
    duration: 800,
  }
};

export const getSharedChartOptions = (mode: ChartThemeMode = "dark"): Highcharts.Options => {
  const colors = getChartColors(mode);
  return {
    chart: {
      ...StaffSyncHighchartsTheme,
    },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: {
      backgroundColor: colors.tooltipBg,
      borderColor: colors.tooltipBorder,
      borderRadius: 12,
      borderWidth: 1,
      shadow: mode === "light",
      padding: 12,
      useHTML: true,
      style: {
        color: colors.textPrimary,
        fontSize: "12px",
        fontWeight: "500",
      }
    }
  };
};

// Helper for horizontal line gradients (purple -> cyan -> success)
export const getHorizontalGradient = (colors: string[]): Highcharts.GradientColorObject => {
  const stops: [number, string][] = colors.map((col, idx) => [
    idx / (colors.length - 1),
    col
  ]);
  return {
    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
    stops
  };
};

// Helper for vertical gradients (useful for area fills or funnel slices)
export const getVerticalGradient = (startColor: string, endColor: string): Highcharts.GradientColorObject => ({
  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
  stops: [
    [0, startColor],
    [1, endColor],
  ] as [number, string][],
});

// Helper for soft area fills
export const getAreaGradient = (color: string): Highcharts.GradientColorObject => ({
  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
  stops: [
    [0, `${color}35`], // 20% opacity
    [1, `${color}00`], // 0% opacity
  ] as [number, string][],
});
