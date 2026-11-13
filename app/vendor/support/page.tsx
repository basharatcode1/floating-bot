"use client";

import { useState, useEffect } from "react";
import { Mail, MessageSquare, BookOpen, ExternalLink } from "lucide-react";
import VendorSidebar from "../dashboard/components/VendorSidebar";
import VendorDashboardHeader from "../dashboard/components/VendorDashboardHeader";
import { Button } from "@/app/components/ui/button";
import { SkeletonLine, SkeletonBlock } from "@/app/client/shared/skeletons/SkeletonBase";
import { useSidebar } from "@/app/components/SidebarContext";


export default function VendorSupportPage() {
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
      id: "chat",
      title: "Chat Support",
      description: "Chat with our support team in real-time.",
      icon: MessageSquare,
      buttonText: "Start Chat",
      href: "#",
    },
    {
      id: "help-center",
      title: "Help Center Documentation",
      description: "Browse our knowledge base, FAQs, and guides for vendors.",
      icon: BookOpen,
      buttonText: "Browse Articles",
      href: "#",
    },
  ];

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
        className={`dash-main ${sidebarCollapsed ? "dash-main-collapsed" : ""}`}
        
      >
        <VendorDashboardHeader onMobileToggle={() => toggleMobile()} />

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
                {[1, 2, 3].map((item) => (
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
                    Get help with your candidates, opportunities, and submissions.
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
