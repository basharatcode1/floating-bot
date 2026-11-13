"use client";

import type { ComponentType } from "react";
import type { WelcomePhase } from "./welcome-sequence";

export interface RobotSceneProps {
  modelUrl?: string;
  phase?: WelcomePhase;
  onReady?: () => void;
  onUnavailable?: () => void;
}

const DEFAULT_MODEL_URL = "/models/welcome-mascot.glb";

const bufferPromises = new Map<string, Promise<ArrayBuffer>>();
let scenePromise: Promise<{ default: ComponentType<RobotSceneProps> }> | null =
  null;

export function loadRobotSceneModule(): Promise<{
  default: ComponentType<RobotSceneProps>;
}> {
  if (!scenePromise) {
    scenePromise = import("./RobotScene").catch((err) => {
      scenePromise = null;
      throw err;
    });
  }
  return scenePromise;
}

export function getPreloadedMascotBuffer(
  modelUrl = DEFAULT_MODEL_URL,
): Promise<ArrayBuffer> {
  const existing = bufferPromises.get(modelUrl);
  if (existing) return existing;

  const promise = fetch(modelUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch mascot model (${res.status})`);
      }
      return res.arrayBuffer();
    })
    .catch((err) => {
      bufferPromises.delete(modelUrl);
      throw err;
    });

  bufferPromises.set(modelUrl, promise);
  return promise;
}

export function preloadWelcomeMascot(modelUrl = DEFAULT_MODEL_URL): void {
  if (typeof window === "undefined") return;
  void loadRobotSceneModule().catch(() => {});
  void getPreloadedMascotBuffer(modelUrl).catch(() => {});
}

