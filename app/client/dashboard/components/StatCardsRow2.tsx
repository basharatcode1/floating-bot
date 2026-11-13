"use client";

import Highcharts from "../lib/highcharts-init";
import HighchartsReact from "highcharts-react-official";
import { Briefcase, TrendingUp, Users } from "lucide-react";

import {
  getChartColors,
  getSharedChartOptions,
  getAreaGradient,
  getHorizontalGradient,
  getVerticalGradient,
} from "../../../lib/highcharts-theme";
import { useDashboardTheme } from "../DashboardThemeContext";
import { SectionHeading } from "@/app/components/ui/section-heading";

export default function StatCardsRow2() {
  const { mode } = useDashboardTheme();
  const chartColors = getChartColors(mode);
  const sharedChartOptions = getSharedChartOptions(mode);

  /* ---------- FUNNEL – Candidates (Pipeline View) ---------- */
  const funnelOptions: any = {
    ...sharedChartOptions,
    chart: {
      ...sharedChartOptions.chart,
      type: "funnel",
      height: 180,
      spacing: [0, 0, 0, 0],
    },
    tooltip: {
      ...sharedChartOptions.tooltip,
      pointFormat: "<b>{point.count}</b> Candidates ({point.percentageStr})",
    },
    plotOptions: {
      funnel: {
        neckWidth: "30%",
        neckHeight: "25%",
        width: "90%",
        borderWidth: mode === "light" ? 0 : 4,
        borderColor: mode === "light" ? "transparent" : chartColors.cardBg,
        shadow: {
          color: "rgba(0,0,0,0.5)",
          width: 8,
          offsetX: 0,
          offsetY: 2,
          opacity: 0.15,
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          inside: true,
          align: "center",
          color: "#FFFFFF",
          style: {
            textOutline: "none",
            fontWeight: "600",
            fontSize: "11px",
            textAlign: "center",
          },
        } as any,
      },
    },
    series: [
      {
        type: "funnel",
        name: "Pipeline",
        data: [
          {
            name: "Pending Review",
            y: 1, // equal height
            count: 78,
            percentageStr: "50%",
            color: getVerticalGradient("#0077CC", "#005A9C"), // Ocean Blue gradient
          },
          {
            name: "Selected for<br/>the Next Round",
            y: 1,
            count: 52,
            percentageStr: "33%",
            color: getVerticalGradient("#22D3EE", "#0891B2"), // Cyan/Blue gradient
          },
          {
            name: "Rejected",
            y: 1,
            count: 26,
            percentageStr: "17%",
            color: getVerticalGradient("#F43F5E", "#BE123C"), // Danger gradient
          },
        ],
      },
    ],
    credits: { enabled: false },
    legend: { enabled: false },
  };

  /* ---------- AREA – Vendor Performance ---------- */
  const vendorOptions: Highcharts.Options = {
    ...sharedChartOptions,
    chart: {
      ...sharedChartOptions.chart,
      type: "areaspline",
      height: 140,
      spacing: [12, 0, 0, 0],
    },
    xAxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      lineColor: "transparent",
      tickLength: 0,
      labels: {
        style: {
          color: chartColors.textSecondary,
          fontSize: "11px",
          fontWeight: "500",
        },
      },
    },
    yAxis: {
      visible: false,
      min: 70,
    },
    tooltip: {
      ...sharedChartOptions.tooltip,
      valueSuffix: "%",
    },
    plotOptions: {
      areaspline: {
        color: getHorizontalGradient([
          chartColors.primary,
          "#06B6D4",
          "#10B981",
        ]), // Ocean Blue -> Cyan -> Emerald
        fillColor: getAreaGradient("#10B981"),
        lineWidth: 3.5,
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 4,
          fillColor: "#10B981",
          lineColor: chartColors.cardBg,
          lineWidth: 2,
          states: { hover: { enabled: true, radius: 6 } },
        },
        states: { hover: { lineWidth: 4 } },
        shadow: {
          color: "#10B981",
          width: 10,
          offsetX: 0,
          offsetY: 4,
          opacity: 0.25,
        },
      },
    },
    series: [
      {
        type: "areaspline",
        name: "Score",
        data: [78, 81, 85, 84, 87, 89],
        showInLegend: false,
      },
    ],
  };

  return (
    <div className="dash-stats-grid">
      {/* ─── Requirements ─── */}
      <div className="dash-stat-card dash-stat-card--donut">
        <SectionHeading
          title="Requirements"
          icon={<Briefcase />}
          action={<span className="dash-stat-card-badge">Overview</span>}
        />

        <div className="dash-stat-hero-row">
          <span className="dash-stat-hero-value">24</span>
          <span className="dash-stat-hero-sub">Total Requirements</span>
        </div>

        <div
          className="dash-progress-rows"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            padding: "16px 8px 24px",
          }}
        >
          {[
            {
              label: "Active",
              value: 13,
              pct: 54,
              fill: chartColors.primary,
              track:
                mode === "dark"
                  ? "rgba(56, 189, 248, 0.16)"
                  : "rgba(0, 90, 156, 0.12)",
            },
            {
              label: "Closed",
              value: 7,
              pct: 29,
              fill: chartColors.secondary,
              track: "rgba(6, 182, 212, 0.12)",
            },
            {
              label: "On Hold",
              value: 4,
              pct: 17,
              fill: chartColors.warning,
              track: "rgba(245, 158, 11, 0.12)",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              {/* Label */}
              <div className="dash-progress-label" style={{ width: "55px" }}>
                {item.label}
              </div>
              {/* Progress Track */}
              <div
                style={{
                  flex: 1,
                  height: "22px",
                  background: item.track,
                  borderRadius: "6px",
                  overflow: "hidden",
                  margin: "0 10px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${item.pct}%`,
                    height: "100%",
                    background: item.fill,
                    borderRadius: "6px",
                  }}
                />
              </div>
              {/* Values */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "60px",
                  justifyContent: "flex-end",
                }}
              >
                <span className="dash-progress-value">{item.value}</span>
                <span className="dash-progress-pct">{item.pct}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-stat-trend">
          <span className="dash-trend-arrow">↑</span> 15 new this week ·{" "}
          <span className="dash-trend-up">+11% from last week</span>
        </div>
      </div>

      {/* ─── Candidates ─── */}
      <div className="dash-stat-card dash-stat-card--bar">
        <SectionHeading
          title="Candidate Pipeline"
          icon={<Users />}
          action={<span className="dash-stat-card-badge">Funnel</span>}
        />

        <div className="dash-stat-hero-row">
          <span className="dash-stat-hero-value">156</span>
          <span className="dash-stat-hero-sub">Total Submissions</span>
        </div>

        <div
          className="dash-funnel-layout"
          style={{
            display: "flex",
            alignItems: "center",
            height: 180,
            overflow: "hidden",
            marginTop: 6,
          }}
        >
          <div style={{ width: "65%", overflow: "hidden" }}>
            <HighchartsReact highcharts={Highcharts} options={funnelOptions} />
          </div>
          <div
            style={{
              width: "35%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "82%", // matches the funnel height excluding margins
              paddingLeft: 10,
            }}
          >
            {[
              { count: 78, pct: "50%" },
              { count: 52, pct: "33%" },
              { count: 26, pct: "17%" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  height: "33.33%",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--dash-text-primary)",
                }}
              >
                {item.count}
                <span
                  style={{
                    color: "var(--dash-text-muted)",
                    fontWeight: "400",
                    marginLeft: 4,
                  }}
                >
                  ({item.pct})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-stat-trend">
          <span className="dash-trend-arrow">↑</span> 12 submissions this week
        </div>
      </div>

      {/* ─── Vendor Performance ─── */}
      <div className="dash-stat-card dash-stat-card--vendor">
        <SectionHeading
          title="Vendor Performance"
          icon={<TrendingUp />}
          action={
            <span className="dash-stat-card-badge dash-stat-card-badge--green">
              89%
            </span>
          }
        />

        <div className="dash-vendor-kpi-row">
          <div className="dash-vendor-kpi">
            <span className="dash-stat-hero-value">5</span>
            <span className="dash-vendor-kpi-label">Active Vendors</span>
          </div>
          <div className="dash-vendor-kpi-divider" />
          <div className="dash-vendor-kpi">
            <span className="dash-stat-hero-value">2.7d</span>
            <span className="dash-vendor-kpi-label">Avg Response</span>
          </div>
          <div className="dash-vendor-kpi-divider" />
          <div className="dash-vendor-kpi">
            <span className="dash-stat-hero-value">92%</span>
            <span className="dash-vendor-kpi-label">Top Vendor</span>
          </div>
        </div>

        <div className="dash-chart-fill">
          <HighchartsReact highcharts={Highcharts} options={vendorOptions} />
        </div>

        <div className="dash-stat-trend">
          <TrendingUp
            size={13}
            style={{ flexShrink: 0, color: "var(--dash-success-text)" }}
          />
          Top:{" "}
          <strong style={{ color: "var(--dash-text-primary)" }}>
            TechHire Solutions
          </strong>{" "}
          — 92%
        </div>
      </div>
    </div>
  );
}
