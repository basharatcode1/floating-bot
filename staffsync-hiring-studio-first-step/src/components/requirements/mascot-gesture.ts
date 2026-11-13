import type { WelcomePhase } from "./welcome-sequence";

export function greetingGesture(seconds: number, phase: WelcomePhase, reducedMotion: boolean) {
  if (reducedMotion) return { shoulder: 0, wrist: 0, blink: 0, mouth: 0 };
  const greeting = phase === "greeting";
  const envelope = greeting ? Math.min(1, seconds / 0.3) : 0;
  const blinkTime = seconds % 4.2;
  return {
    shoulder: envelope * (0.12 + Math.sin(seconds * 6) * 0.09),
    wrist: envelope * Math.sin(seconds * 8) * 0.12,
    blink: blinkTime > 3.85 ? Math.sin((blinkTime - 3.85) / 0.35 * Math.PI) : 0,
    mouth: greeting ? 0.5 + Math.sin(seconds * 10) * 0.5 : 0,
  };
}