export type WelcomePhase =
  | "loading"
  | "arrival"
  | "greeting"
  | "cards"
  | "ready";

export const WELCOME_TIMING = {
  greeting: 600,
  cards: 2200,
  ready: 3600,
} as const;

/** How long the greeting takes to type out, in ms. */
export const TYPE_DURATION = 1400;

/** Letters shown after `elapsed` ms; time-based so a busy browser catches up instead of lagging. */
export function typedLetters(elapsed: number, total: number) {
  if (elapsed <= 0) return 0;
  return Math.min(total, Math.ceil((elapsed / TYPE_DURATION) * total));
}

/** How long the mascot greets right after the 3D scene appears, in seconds. */
export const WAVE_DURATION = 1.8;

export function welcomePhase(
  elapsed: number,
  reducedMotion = false,
): WelcomePhase {
  if (reducedMotion || elapsed >= WELCOME_TIMING.ready) return "ready";
  if (elapsed >= WELCOME_TIMING.cards) return "cards";
  if (elapsed >= WELCOME_TIMING.greeting) return "greeting";
  return "arrival";
}

