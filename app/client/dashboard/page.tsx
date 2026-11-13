"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Activity, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import { DashButton } from "@/app/components/ui/dash-button";
import { DashPageHeader } from "@/app/components/ui/dash-page-header";
import TopMatchedCandidates from "./components/TopMatchedCandidates";
import LiveActivity from "./components/LiveActivity";
import TopRequirements from "./components/TopRequirements";
import DashboardSkeleton from "./components/DashboardSkeleton";
import { useSidebar } from "@/app/components/SidebarContext";


const StatCardsRow2 = dynamic(() => import("./components/StatCardsRow2"), {
  ssr: false,
});

export default function DashboardPage() {
  const router = useRouter();
  const { collapsed: sidebarCollapsed, isHovered, toggleCollapse, mobileOpen, setMobileOpen, toggleMobile } = useSidebar();
  const isVisualCollapsed = sidebarCollapsed && !isHovered;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        loading={loading}
      />

      <main
        className={`dash-main ${isVisualCollapsed ? "dash-main-collapsed" : ""}`}
      >
        <DashboardHeader onMobileToggle={() => toggleMobile()} />

        <div className="dash-content">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <div className="sk-page-content-enter">
              {/* Page Header */}
              <DashPageHeader
                title={
                  <>
                    Dashboard
                    <span className="dash-live-badge">Live</span>
                  </>
                }
                subtitle="Welcome back, John. Here's your recruitment overview."
                actions={
                  <>
                    <DashButton variant="ghost" onClick={() => router.push("/client/submissions")}>
                      <Activity className="w-4 h-4" />
                      Review Matches
                    </DashButton>
                    <DashButton variant="primary" onClick={() => router.push("/client/requirements?openJD=true")}>
                      <Plus className="w-4 h-4" />
                      Post Requirement
                    </DashButton>
                  </>
                }
              />

              <StatCardsRow2 />

              {/* Content Grid: Top Matched + Smart Insights */}
              <div className="dash-content-grid">
                <TopMatchedCandidates />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  <TopRequirements />
                </div>
              </div>

              {/* Live Activity */}
              <div className="dash-bottom-half">
                <LiveActivity />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
