"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SidebarContextType = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  toggleCollapse: () => void;
  isHovered: boolean;
  setIsHovered: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  toggleMobile: () => void;
};

const SidebarContext = createContext<SidebarContextType>({
  collapsed: true,
  setCollapsed: () => {},
  toggleCollapse: () => {},
  isHovered: false,
  setIsHovered: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
  toggleMobile: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => setCollapsed((p) => !p);
  const toggleMobile = () => setMobileOpen((p) => !p);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleCollapse,
        isHovered,
        setIsHovered,
        mobileOpen,
        setMobileOpen,
        toggleMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
