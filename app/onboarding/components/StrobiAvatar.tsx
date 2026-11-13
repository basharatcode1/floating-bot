"use client";

import React, { useSyncExternalStore } from "react";
import { createAvatar } from "@bible-strong/avatar-react";
import "@bible-strong/avatar-react/styles.css";
import definition from "@/app/onboarding/data/strobi.avatar.json";

const ExportedStrobi = createAvatar(definition);

export type StrobiAnimation = keyof typeof definition.animations;
export type StrobiExpression = keyof typeof definition.expressions;

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function subscribeClientMount() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function toStaticExpression(animation?: StrobiAnimation): StrobiExpression {
  if (animation === "angry-field-right" || animation === "angry") {
    return "angry-down-right";
  }
  if (animation === "angry-field-left") {
    return "angry-down-left";
  }
  if (animation === "guide-right" || animation === "guide-right-hint") {
    return "friendly-down-right";
  }
  if (animation === "guide-left" || animation === "guide-left-hint") {
    return "friendly-down-left";
  }
  if (animation === "happy" || animation === "celebrate" || animation === "excited") {
    return "joyful-wide";
  }
  if (animation === "curious" || animation === "thinking") {
    return "friendly-down-left";
  }
  if (animation === "listening") {
    return "attentive-left";
  }
  return "neutral";
}

interface StrobiAvatarProps {
  animation?: StrobiAnimation;
  expression?: StrobiExpression;
  size?: number | string;
  className?: string;
  ariaLabel?: string;
}

export function StrobiAvatar({
  animation = "idle",
  expression,
  size = 64,
  className,
  ariaLabel = "StaffSync onboarding assistant",
}: StrobiAvatarProps) {
  const mounted = useSyncExternalStore(
    subscribeClientMount,
    getClientSnapshot,
    getServerSnapshot,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ width: size, height: size }}
      />
    );
  }

  if (expression) {
    return (
      <ExportedStrobi
        expression={expression}
        size={size}
        className={className}
        ariaLabel={ariaLabel}
      />
    );
  }

  if (reducedMotion) {
    return (
      <ExportedStrobi
        expression={toStaticExpression(animation)}
        size={size}
        className={className}
        ariaLabel={ariaLabel}
      />
    );
  }

  return (
    <ExportedStrobi
      animation={animation}
      size={size}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}

