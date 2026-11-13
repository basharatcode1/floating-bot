"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FileSearch, Briefcase } from "lucide-react";
import VendorSidebar from "./components/VendorSidebar";
import VendorDashboardHeader from "./components/VendorDashboardHeader";
import { DashButton } from "@/app/components/ui/dash-button";
import { DashPageHeader } from "@/app/components/ui/dash-page-header";
import VendorLiveActivity from "./components/VendorLiveActivity";
import VendorDashboardSkeleton from "./components/VendorDashboardSkeleton";
import TopOpportunities from "./components/TopOpportunities";
import RecentSubmissions from "./components/RecentSubmissions";
import { useSidebar } from "@/app/components/SidebarContext";

const VendorStatCards = dynamic(() => import("./components/VendorStatCards"), {
  ssr: false,
});

export default function VendorDashboardPage() {
  const router = useRouter();
  const {
    collapsed: sidebarCollapsed,
    isHovered,
    toggleCollapse,
    mobileOpen,
    setMobileOpen,
    toggleMobile,
  } = useSidebar();
  const isVisualCollapsed = sidebarCollapsed && !isHovered;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <VendorSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        loading={loading}
      />

      <main
        className={`dash-main ${isVisualCollapsed ? "dash-main-collapsed" : ""}`}
      >
        <VendorDashboardHeader onMobileToggle={() => toggleMobile()} />

        <div className="dash-content">
          {loading ? (
            <VendorDashboardSkeleton />
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
                subtitle="Welcome back, Ravi. Here's your vendor overview."
                actions={
                  <>
                    <DashButton
                      variant="ghost"
                      onClick={() => router.push("/vendor/submissions")}
                    >
                      <FileSearch className="w-4 h-4" />
                      Track Submission
                    </DashButton>
                    <DashButton
                      variant="primary"
                      onClick={() => router.push("/vendor/opportunities")}
                    >
                      <Briefcase className="w-4 h-4" />
                      Browse Opportunities
                    </DashButton>
                  </>
                }
              />

              <VendorStatCards />

              {/* Content Grid: Recent Submissions + Live Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <RecentSubmissions />
                </div>
                <div className="lg:col-span-1">
                  <VendorLiveActivity />
                </div>
              </div>

              {/* Next row: Top Opportunities */}
              <div className="mt-6">
                <TopOpportunities />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
