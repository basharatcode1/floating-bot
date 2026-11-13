"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { publicApi } from "@/app/lib/axios";
import { ENDPOINTS } from "@/app/lib/endpoints";
import { toast } from "@/app/components/ui/toast";
import { useDashboardTheme } from "../DashboardThemeContext";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  User,
  Trash2,
  LogOut,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

type DashboardHeaderProps = {
  onMobileToggle: () => void;
};

interface NotificationItem {
  id: string;
  text: React.ReactNode;
  time: string;
  read: boolean;
  route?: string;
}

export default function DashboardHeader({
  onMobileToggle,
}: DashboardHeaderProps) {
  const { mode, toggleMode, mounted } = useDashboardTheme();
  const isDarkMode = mounted && mode === "dark";
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    await signOut({ redirect: false });
    toast.success("Successfully logged out");
    router.push("/");
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      text: (
        <>
          Vendor submitted candidate for <strong>React Developer</strong>
        </>
      ),
      time: "2m ago",
      read: false,
      route: "/client/submissions",
    },
    {
      id: "2",
      text: (
        <>
          New match found — <strong>Karan Singh (94%)</strong>
        </>
      ),
      time: "8m ago",
      read: false,
      route: "/client/submissions",
    },
    {
      id: "3",
      text: (
        <>
          Interview scheduled with <strong>Sara Khan</strong>
        </>
      ),
      time: "35m ago",
      read: false,
      route: "/client/submissions",
    },
    {
      id: "4",
      text: (
        <>
          <strong>DevOps Engineer</strong> requirement updated
        </>
      ),
      time: "1h ago",
      read: false,
      route: "/client/requirements",
    },
    {
      id: "5",
      text: (
        <>
          <strong>Arjun Patel</strong> selected for the next round by team
        </>
      ),
      time: "1h ago",
      read: false,
      route: "/client/submissions",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <header className="dash-header">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Mobile sidebar toggle wrapper */}
        <div className="md:flex-1 flex items-center">
          <button
            className="dash-mobile-toggle"
            onClick={onMobileToggle}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
        </div>


        {/* Actions wrapper */}
        <div className="md:flex-1 flex items-center justify-end">
          <div className="dash-header-actions">
            {/* Theme toggle */}
            <button
              className="dash-theme-toggle"
              onClick={toggleMode}
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="header-notification-trigger"
                  className="dash-header-btn"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="badge-dot"></span>}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-[380px] p-0 border-[var(--dash-card-border)] bg-[var(--dash-card-bg-solid)] text-[var(--dash-text-primary)] shadow-2xl rounded-xl z-50 overflow-hidden"
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--dash-divider)] bg-[var(--dash-card-bg)]">
                  <h3 className="text-xs font-semibold flex items-center gap-2 m-0">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-[var(--dash-badge-bg)] text-[var(--dash-accent-text)] px-2 py-0.5 rounded-full font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      id="notification-mark-all-read"
                      onClick={markAllAsRead}
                      className="text-[11px] text-[var(--dash-accent-text)] hover:underline font-medium bg-transparent border-0 cursor-pointer p-0"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Popover Body / Notifications List */}
                <ScrollArea className="max-h-[280px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--dash-card-hover)] flex items-center justify-center mb-3">
                        <Bell
                          size={20}
                          className="text-[var(--dash-text-muted)]"
                        />
                      </div>
                      <p className="text-xs font-semibold text-[var(--dash-text-primary)] m-0">
                        All caught up!
                      </p>
                      <p className="text-[11px] text-[var(--dash-text-muted)] mt-1 mb-0">
                        You have no new notifications.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          id={`notification-item-${item.id}`}
                          onClick={() => {
                            markAsRead(item.id);
                            if (item.route && item.route !== "#") {
                              router.push(item.route);
                            }
                          }}
                          className={`flex items-start gap-3 p-4 border-b border-[var(--dash-divider)] hover:bg-[var(--dash-card-hover)] transition-colors cursor-pointer relative group ${
                            !item.read ? "bg-[rgba(0,90,156,0.05)]" : ""
                          }`}
                        >
                          {/* Notification Details */}
                          <div className="flex-1 min-w-0 pr-6">
                            <p
                              className={`text-[11px] text-[var(--dash-text-primary)] leading-normal m-0 truncate ${!item.read ? "font-semibold" : "text-[var(--dash-text-secondary)]"}`}
                            >
                              {item.text}
                            </p>
                            <span className="text-[10px] text-[var(--dash-text-muted)] mt-1 inline-block">
                              {item.time}
                            </span>
                          </div>

                          {/* Action Buttons & Unread Indicator */}
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {!item.read && (
                              <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                            )}
                            <button
                              id={`notification-delete-${item.id}`}
                              onClick={(e) => deleteNotification(item.id, e)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] rounded hover:bg-[var(--dash-card-hover)] bg-transparent border-0 cursor-pointer flex items-center justify-center"
                              title="Delete notification"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Popover Footer */}
                {notifications.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-[var(--dash-card-bg)] border-t border-[var(--dash-divider)]">
                    <button
                      id="notification-clear-all"
                      onClick={clearAll}
                      className="text-[11px] text-[var(--dash-text-muted)] hover:text-[var(--dash-text-primary)] bg-transparent border-0 cursor-pointer p-0"
                    >
                      Clear all
                    </button>
                    <Link
                      href="/client/notifications"
                      className="text-[11px] text-[var(--dash-accent-text)] hover:underline font-medium"
                    >
                      View all →
                    </Link>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* User profile */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity group bg-transparent border-none p-0 cursor-pointer text-left">
                  <div className="dash-header-avatar-sm">
                    <User size={16} />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-[var(--dash-text-primary)] leading-tight group-hover:text-[var(--dash-accent-text)] transition-colors">
                      John Smith
                    </span>
                    <span className="text-[10px] text-[var(--dash-text-muted)] leading-tight">
                      Client
                    </span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-48 p-2 shadow-lg"
                style={{
                  background: "var(--dash-card-bg-solid)",
                  borderColor: "var(--dash-card-border)",
                }}
              >
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/client/profile"
                    className="px-3 py-2 text-xs text-[var(--dash-text-primary)] hover:bg-[var(--dash-bg)] rounded-md transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/client/profile?action=edit"
                    className="px-3 py-2 text-xs text-[var(--dash-text-primary)] hover:bg-[var(--dash-bg)] rounded-md transition-colors"
                  >
                    Edit profile
                  </Link>
                  <Link
                    href="/client/profile?action=change-password"
                    className="px-3 py-2 text-xs text-[var(--dash-text-primary)] hover:bg-[var(--dash-bg)] rounded-md transition-colors"
                  >
                    Change password
                  </Link>
                  <Link
                    href="/client/profile?action=sub-user"
                    className="px-3 py-2 text-xs text-[var(--dash-text-primary)] hover:bg-[var(--dash-bg)] rounded-md transition-colors"
                  >
                    Sub user
                  </Link>
                  <Link
                    href="/client/billing"
                    className="px-3 py-2 text-xs text-[var(--dash-text-primary)] hover:bg-[var(--dash-bg)] rounded-md transition-colors"
                  >
                    Billing &amp; Payment
                  </Link>
                  <Link
                    href="/"
                    className="px-3 py-2 text-xs text-[var(--dash-text-primary)] hover:bg-[var(--dash-bg)] rounded-md transition-colors"
                  >
                    Homepage
                  </Link>
                  <div className="h-[1px] bg-[var(--dash-card-border)]" />
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer bg-transparent border-0 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-[400px] md:max-w-[400px] !max-w-[400px] bg-[var(--dash-card-bg-solid)] border-[var(--dash-card-border)] text-[var(--dash-text-primary)] rounded-[16px] p-6 shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="mx-auto text-red-500 mb-2 flex items-center justify-center">
              <LogOut size={24} className="animate-pulse" />
            </div>
            <DialogTitle className="text-xl font-bold text-center text-[var(--dash-text-primary)]">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-sm text-[var(--dash-text-secondary)] text-center">
              Are you sure you want to log out of your session? Any unsaved changes may be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-center gap-3 mt-6 sm:space-x-0 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogoutConfirm(false)}
              className={`flex-1 rounded-xl h-10 text-xs font-semibold border hover:bg-[var(--dash-card-hover)] text-[var(--dash-text-primary)] transition-all duration-200 ${
                isDarkMode ? "border-zinc-700" : "border-slate-300"
              }`}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleLogout}
              className="flex-1 rounded-xl h-10 bg-red-600 hover:bg-red-700 text-white text-xs font-bold border-0 transition-all duration-200"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
