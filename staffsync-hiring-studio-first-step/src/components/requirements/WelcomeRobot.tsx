import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import posterAsset from "@/assets/robot-poster.webp.asset.json";
import { cn } from "@/lib/utils";
import type { WelcomePhase } from "./welcome-sequence";

const loadScene = () => import("./RobotScene");
// Begin fetching the 3D scene code as soon as this module loads in the browser.
if (typeof window !== "undefined") void loadScene();
const RobotScene = lazy(loadScene);

class MascotBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override componentDidCatch() { this.props.onUnavailable(); }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function WelcomeRobot({ onReady, phase }: { onReady: () => void; phase: WelcomePhase }) {
  // The robot picture shows instantly (server-rendered); the 3D robot fades in over it once drawn.
  const [live, setLive] = useState(false);
  // Paint the popup and its animated poster before starting expensive WebGL setup.
  // This is a paint boundary, not a wait for the introduction to finish.
  const [mount3d, setMount3d] = useState(false);
  useEffect(() => {
    let secondFrame = 0;
    let task: ReturnType<typeof setTimeout> | undefined;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        task = setTimeout(() => setMount3d(true), 0);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      if (task !== undefined) clearTimeout(task);
    };
  }, []);
  const ready = useCallback(() => { setLive(true); onReady(); }, [onReady]);
  return (
    <div className="relative h-full w-full">
      <img
        src={posterAsset.url}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className={cn("welcome-poster pointer-events-none absolute inset-0 m-auto h-[79%] w-auto object-contain transition-opacity duration-300", live && "opacity-0")}
      />
      <div className={cn("absolute inset-0 transition-opacity duration-300", live ? "opacity-100" : "opacity-0")}>
        <MascotBoundary onUnavailable={onReady}>
          <ClientOnly fallback={null}>
            {mount3d && <Suspense fallback={null}><RobotScene onReady={ready} /></Suspense>}
          </ClientOnly>
        </MascotBoundary>
      </div>
    </div>
  );
}
