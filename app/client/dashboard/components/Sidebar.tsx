"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSidebar } from "@/app/components/SidebarContext";
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  TrendingUp,
  Bell,
  MessageSquare,
} from "lucide-react";

const SKELETON_ITEM_WIDTHS: Record<string, number> = {
  "/client/dashboard": 76,
  "/client/requirements": 102,
  "/client/submissions": 124,
  "/client/vendor-performance": 116,
  "/client/notifications": 80,
  "/client/support": 54,
};

const navItems = [
  {
    section: "",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/client/dashboard" },
      {
        label: "My Requirements",
        icon: ClipboardList,
        href: "/client/requirements",
        badge: 5,
      },
      {
        label: "Candidate Submissions",
        icon: UserCheck,
        href: "/client/submissions",
      },
      {
        label: "Vendor Performance",
        icon: TrendingUp,
        href: "/client/vendor-performance",
      },
      {
        label: "Notifications",
        icon: Bell,
        href: "/client/notifications",
        badge: 5,
      },
      { label: "Support", icon: MessageSquare, href: "/client/support" },
    ],
  },
];

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  loading?: boolean;
};

let globalFirstLoad = true;

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  loading = false,
}: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(globalFirstLoad);
  const { isHovered, setIsHovered } = useSidebar();
  const isVisualCollapsed = collapsed && !isHovered;

  // When cursor is already on the sidebar, keep sidebar open during navigation across links.
  // Collapse only when the cursor actually moves outside the sidebar bounds.
  useEffect(() => {
    if (!isHovered) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        // Keep open if within sidebar or the top brand header (y >= 0, x <= width)
        const isInside =
          e.clientX >= 0 &&
          e.clientX <= rect.right + 2 &&
          e.clientY >= 0 &&
          e.clientY <= rect.bottom;
        if (!isInside) {
          setIsHovered(false);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered, setIsHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLinkClick = () => {
    onCloseMobile();
    // Keep sidebar open if cursor is hovering at the sidebar on desktop
  };

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/client/dashboard") return pathname === "/client/dashboard";
    return pathname.startsWith(href);
  };

  useState(() => {
    // Synchronously check/set during render to avoid layout shift
    if (!loading && globalFirstLoad) {
      globalFirstLoad = false;
      setIsFirstLoad(false);
    }
  });

  // Also update when loading transitions to false
  if (!loading && globalFirstLoad) {
    globalFirstLoad = false;
  }

  if (loading && isFirstLoad) {
    return (
      <>
        {/* Mobile overlay */}
        <div
          className={`dash-mobile-overlay ${mobileOpen ? "visible" : ""}`}
          onClick={onCloseMobile}
        />

        {/* Fixed Desktop Logo Header */}
        <div className="dash-sidebar-brand-fixed">
          <Link
            href="/client/dashboard"
            className="dash-sidebar-brand"
            style={{ textDecoration: "none" }}
          >
            <span
              className="dash-sidebar-brand-name"
              style={{ color: "var(--dash-brand-title)" }}
            >
              StaffSync
            </span>
          </Link>
        </div>

        <aside
          ref={sidebarRef}
          className={`dash-sidebar ${isVisualCollapsed ? "collapsed" : ""} ${
            mobileOpen ? "mobile-open" : ""
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Mobile Drawer Header */}
          <div className="dash-sidebar-header md:hidden">
            <Link
              href="/client/dashboard"
              className="dash-sidebar-brand"
              style={{ textDecoration: "none" }}
            >
              <span
                className="dash-sidebar-brand-name"
                style={{ color: "var(--dash-brand-title)" }}
              >
                StaffSync
              </span>
            </Link>
          </div>

          {/* Nav Skeleton */}
          <nav className="dash-sidebar-nav" aria-label="Loading navigation">
            {navItems.map((section, sIdx) => (
              <div key={section.section || sIdx}>
                {section.section && (
                  <div className="dash-sidebar-section-label">
                    <span
                      className="dash-sidebar-skeleton-line"
                      style={{ width: 44, height: 9, margin: 0 }}
                    />
                  </div>
                )}
                {section.items.map((item) => {
                  const labelWidth = SKELETON_ITEM_WIDTHS[item.href] || 80;
                  return (
                    <div
                      key={item.label}
                      className="dash-sidebar-link dash-sidebar-skeleton-link"
                      aria-hidden="true"
                    >
                      <span className="dash-sidebar-link-icon">
                        <span className="dash-sidebar-skeleton-icon" />
                      </span>
                      <span className="dash-sidebar-link-text">
                        <span
                          className="dash-sidebar-skeleton-line"
                          style={{ width: labelWidth }}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`dash-mobile-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={onCloseMobile}
      />

      {/* Fixed Desktop Logo Header */}
      <div className="dash-sidebar-brand-fixed">
        <Link
          href="/client/dashboard"
          className="dash-sidebar-brand"
          style={{ textDecoration: "none" }}
        >
          <span
            className="dash-sidebar-brand-name"
            style={{ color: "var(--dash-brand-title)" }}
          >
            StaffSync
          </span>
        </Link>
      </div>

      <aside
        ref={sidebarRef}
        className={`dash-sidebar ${isVisualCollapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Mobile Drawer Header */}
        <div className="dash-sidebar-header md:hidden">
          <Link
            href="/client/dashboard"
            className="dash-sidebar-brand"
            style={{ textDecoration: "none" }}
          >
            <span
              className="dash-sidebar-brand-name"
              style={{ color: "var(--dash-brand-title)" }}
            >
              StaffSync
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="dash-sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section || "main"}>
              {section.section && (
                <div className="dash-sidebar-section-label">
                  {section.section}
                </div>
              )}
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`dash-sidebar-link ${isActive(item.href) ? "active" : ""}`}
                    onClick={handleLinkClick}
                    title={item.label}
                  >
                    <span className="dash-sidebar-link-icon">
                      <IconComponent size={18} />
                    </span>
                    <span className="dash-sidebar-link-text">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="dash-sidebar-link-badge">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
