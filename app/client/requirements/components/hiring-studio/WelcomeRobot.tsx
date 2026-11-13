"use client";

import React, { Component, useCallback, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Rotate3d } from "lucide-react";
import { loadRobotSceneModule } from "./mascot-preload";
import type { WelcomePhase } from "./welcome-sequence";

const RobotScene = dynamic(() => loadRobotSceneModule(), {
  ssr: false,
  loading: () => null,
});

class MascotBoundary extends Component<
  { children: ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch() {
    this.props.onUnavailable();
  }

  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function WelcomeRobot({
  onReady,
  phase = "ready",
}: {
  onReady?: () => void;
  phase?: WelcomePhase;
}) {
  const [unavailable, setUnavailable] = useState(false);

  const ready = useCallback(() => {
    onReady?.();
  }, [onReady]);

  const handleUnavailable = useCallback(() => {
    setUnavailable(true);
    onReady?.();
  }, [onReady]);

  return (
    <div className="relative h-full w-full">
      {unavailable ? (
        <Image
          src="/images/robot-mascot.png"
          alt="StaffSync AI Mascot"
          width={220}
          height={220}
          className="welcome-poster pointer-events-none absolute inset-0 m-auto h-[82%] w-auto object-contain"
        />
      ) : (
        <>
          <div className="absolute inset-0">
            <MascotBoundary onUnavailable={handleUnavailable}>
              <RobotScene
                phase={phase}
                onReady={ready}
                onUnavailable={handleUnavailable}
              />
            </MascotBoundary>
          </div>
          <p
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2.5 left-1/2 flex -translate-x-1/2 select-none items-center gap-1 whitespace-nowrap text-[11px] font-medium text-[var(--dash-text-muted,#64748b)]"
          >
            <Rotate3d className="h-3 w-3 shrink-0" />
            <span>Drag to rotate 360°</span>
          </p>
        </>
      )}
    </div>
  );
}
