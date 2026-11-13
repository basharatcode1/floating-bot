"use client";

import { useState, useEffect } from "react";
import { Mail, BookOpen, Briefcase, Wrench, ExternalLink } from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import { Button } from "@/app/components/ui/button";
import { SkeletonLine, SkeletonBlock } from "../shared/skeletons/SkeletonBase";
import { useSidebar } from "@/app/components/SidebarContext";


export default function SupportPage() {
  const { collapsed: sidebarCollapsed, toggleCollapse, mobileOpen, setMobileOpen, toggleMobile } = useSidebar();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const supportChannels = [
    {
      id: "email",
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours.",
      icon: Mail,
      buttonText: "Send Email",
      href: "mailto:support@staffsync.com",
    },
    {
      id: "help-center",
      title: "Help Center",
      description: "Browse our knowledge base, FAQs, and guides.",
      icon: BookOpen,
      buttonText: "Browse Articles",
      href: "#",
    },
    {
      id: "hiring",
      title: "Hiring Assistance",
      description: "Need help with JD creation, candidate matching, or vendor management?",
      icon: Briefcase,
      buttonText: "Get Help",
      href: "#",
    },
    {
      id: "technical",
      title: "Technical Issues",
      description: "Report bugs, performance issues, or integration problems.",
      icon: Wrench,
      buttonText: "Report Issue",
      href: "#",
    },
  ];

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
        className={`dash-main ${sidebarCollapsed ? "dash-main-collapsed" : ""}`}
        
      >
        <DashboardHeader onMobileToggle={() => toggleMobile()} />

        <div className="dash-content">
          {loading ? (
            // Skeleton Loader
            <div className="sk-page-content-enter">
              {/* Page Header Skeleton */}
              <div className="sk-page-header">
                <div className="sk-page-header-left">
                  <SkeletonLine style={{ width: 180, height: 28, marginBottom: 8 }} />
                  <SkeletonLine style={{ width: 340, height: 16 }} />
                </div>
              </div>

              {/* Grid Skeleton */}
              <div className="support-grid">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="support-card" style={{ cursor: "default" }}>
                    <div className="support-card-content">
                      <SkeletonBlock style={{ width: 48, height: 48, borderRadius: 12 }} />
                      <div className="support-card-info" style={{ flex: 1 }}>
                        <SkeletonLine style={{ width: 130, height: 20, marginBottom: 8 }} />
                        <SkeletonLine style={{ width: "90%", height: 14, marginBottom: 6 }} />
                        <SkeletonLine style={{ width: "60%", height: 14 }} />
                      </div>
                    </div>
                    <div className="support-card-actions">
                      <SkeletonBlock style={{ width: 120, height: 38, borderRadius: 10 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="sk-page-content-enter">
              {/* Page Header */}
              <div className="dash-page-header">
                <div>
                  <h1 className="dash-page-title">Support</h1>
                  <p className="dash-page-subtitle">
                    Get help with your account, requirements, and placements.
                  </p>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="support-grid">
                {supportChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div key={channel.id} className="support-card">
                      <div className="support-card-content">
                        <div className="support-card-icon-wrapper">
                          <Icon size={28} />
                        </div>
                        <div className="support-card-info">
                          <h3 className="support-card-title">{channel.title}</h3>
                          <p className="support-card-desc">{channel.description}</p>
                        </div>
                      </div>
                      <div className="support-card-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[var(--dash-card-border)] hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] font-medium rounded-lg text-xs h-8 px-3"
                          asChild
                        >
                          <a href={channel.href} target="_blank" rel="noopener noreferrer">
                            {channel.buttonText}
                            <ExternalLink size={14} className="ml-1.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
