"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import VendorSidebar from "../dashboard/components/VendorSidebar";
import VendorDashboardHeader from "../dashboard/components/VendorDashboardHeader";
import { DashButton } from "@/app/components/ui/dash-button";
import { Card } from "@/app/components/ui/card";
import {
  SkeletonContainer,
  SkeletonLine,
} from "@/app/client/shared/skeletons/SkeletonBase";
import { useSidebar } from "@/app/components/SidebarContext";


const initialNotifications = [
  {
    id: 1,
    text: "New opportunity posted: Senior React Developer",
    time: "10 min ago",
    route: "/vendor/opportunities",
    type: "opportunity",
    read: false,
  },
  {
    id: 2,
    text: "Submission for Full Stack Engineer shortlisted",
    time: "45 min ago",
    route: "/vendor/submissions",
    type: "shortlisted",
    read: false,
  },
  {
    id: 3,
    text: "Client requested interview for Arjun Patel — Tomorrow 10:00 AM",
    time: "2 hrs ago",
    route: "/vendor/submissions",
    type: "interview",
    read: false,
  },
  {
    id: 4,
    text: "Opportunity DevOps Lead deadline approaching",
    time: "3 hrs ago",
    route: "/vendor/opportunities",
    type: "deadline",
    read: true,
  },
  {
    id: 5,
    text: "Submission feedback received for Cloud Architect",
    time: "5 hrs ago",
    route: "/vendor/submissions",
    type: "feedback",
    read: true,
  },
  {
    id: 6,
    text: "Candidate profile Ravi Kumar successfully updated on Bench",
    time: "1 day ago",
    route: "/vendor/bench",
    type: "candidate",
    read: true,
  },
  {
    id: 7,
    text: "Monthly recruitment performance report is now available",
    time: "3 days ago",
    route: "/vendor/dashboard",
    type: "vendor",
    read: true,
  },
];


function NotificationsSkeleton() {
  return (
    <SkeletonContainer>
      <div className="dash-page-header">
        <div>
          <SkeletonLine style={{ width: "180px", height: "24px", marginBottom: "8px" }} />
          <SkeletonLine style={{ width: "120px", height: "14px" }} />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="py-2.5 px-3 bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-2xl flex items-center justify-between"
          >
            <div className="flex-1 space-y-1.5">
              <SkeletonLine style={{ width: "60%", height: "13px" }} />
              <SkeletonLine style={{ width: "20%", height: "10px" }} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}

export default function VendorNotificationsPage() {
  const router = useRouter();
  const { collapsed: sidebarCollapsed, toggleCollapse, mobileOpen, setMobileOpen, toggleMobile } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <VendorSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        loading={loading}
      />

      <main className={`dash-main ${sidebarCollapsed ? "dash-main-collapsed" : ""}`}>
        <VendorDashboardHeader onMobileToggle={() => toggleMobile()} />

        <div className="dash-content px-4 sm:px-8">
          {loading ? (
            <NotificationsSkeleton />
          ) : (
            <div className="sk-page-content-enter">
              {/* Page Header */}
              <div className="dash-page-header">
                <div>
                  <h1 className="dash-page-title">
                    Notifications
                  </h1>
                  <p className="dash-page-subtitle">
                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <DashButton
                      variant="ghost"
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5"
                    >
                      Mark all as read
                    </DashButton>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-2">
                {notifications.map((n, i) => {
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.route && n.route !== "#") {
                          router.push(n.route);
                        }
                      }}
                    >
                      <Card
                        className={`notif-card ${
                          !n.read ? "notif-card-unread" : "notif-card-read"
                        }`}
                      >
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`notif-text ${
                              !n.read ? "notif-text-unread" : "notif-text-read"
                            }`}
                          >
                            {n.text}
                          </p>
                          <span className="notif-time">
                            {n.time}
                          </span>
                        </div>

                        {/* Unread dot */}
                        {!n.read && (
                          <span className="notif-unread-dot" />
                        )}
                      </Card>
                    </motion.div>
                  );
                })}

                {notifications.length === 0 && (
                  <Card className="flex flex-col items-center justify-center py-16 bg-[var(--dash-card-bg-solid)] border border-[var(--dash-card-border)] rounded-2xl">
                    <Bell className="w-12 h-12 text-[var(--dash-text-muted)] mb-3 opacity-60" />
                    <span className="text-base font-bold text-[var(--dash-text-primary)] mb-1">
                      All caught up!
                    </span>
                    <p className="text-sm text-[var(--dash-text-secondary)] text-center max-w-sm">
                      You have no notifications at this time.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
