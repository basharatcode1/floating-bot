"use client";

import { useState, useEffect } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import ProfileHeader from "./components/ProfileHeader";
import CompanyInfo from "./components/CompanyInfo";
import CompanySummary from "./components/CompanySummary";
import SocialAndAccount from "./components/SocialAndAccount";
import { DashButton } from "@/app/components/ui/dash-button";
import ProfileSkeleton from "./components/ProfileSkeleton";
import { useSidebar } from "@/app/components/SidebarContext";


export default function ProfilePage() {
  const { collapsed: sidebarCollapsed, toggleCollapse, mobileOpen, setMobileOpen, toggleMobile } = useSidebar();
  const [isEditing, setIsEditing] = useState(false);
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
        className={`dash-main ${sidebarCollapsed ? "dash-main-collapsed" : ""}`}
        
      >
        <DashboardHeader onMobileToggle={() => toggleMobile()} />

        <div className="dash-content">
          {loading ? (
            <ProfileSkeleton />
          ) : (
            <div className="sk-page-content-enter">
              {/* 1. Profile Hero */}
              <ProfileHeader isEditing={isEditing} onEditClick={() => setIsEditing(true)} />

              {/* 2. Company Information & Point of Contact */}
              <CompanyInfo isEditing={isEditing} />

              {/* 4. Company Summary */}
              <CompanySummary isEditing={isEditing} />

              {/* 5. Social Media, Account Info & Account Actions */}
              <SocialAndAccount isEditing={isEditing} onEditClick={() => setIsEditing(true)} />

              {/* Save / Cancel Bottom Actions */}
              {isEditing && (
                <div className="flex justify-end gap-3 mt-6 pb-4">
                  <DashButton variant="ghost" onClick={() => {
                    window.dispatchEvent(new Event("profile-cancel"));
                    setIsEditing(false);
                  }}>
                    Cancel
                  </DashButton>
                  <DashButton variant="primary" onClick={() => {
                    window.dispatchEvent(new Event("profile-save"));
                    setIsEditing(false);
                  }}>
                    Save
                  </DashButton>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
