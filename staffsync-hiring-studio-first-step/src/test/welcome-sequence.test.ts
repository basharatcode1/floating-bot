import { describe, expect, it } from "vitest";
import { TYPE_DURATION, typedLetters, welcomePhase } from "@/components/requirements/welcome-sequence";

describe("Requirements welcome sequence", () => {
  it("arrives before greeting and keeps choices hidden until the pocket reveal", () => {
    expect(welcomePhase(0)).toBe("arrival");
    expect(welcomePhase(599)).toBe("arrival");
    expect(welcomePhase(600)).toBe("greeting");
    expect(welcomePhase(2199)).toBe("greeting");
    expect(welcomePhase(2200)).toBe("cards");
    expect(welcomePhase(3600)).toBe("ready");
  });
  it("types the greeting by elapsed time so a slow frame never delays the text", () => {
    expect(typedLetters(0, 100)).toBe(0);
    expect(typedLetters(700, 100)).toBe(50);
    expect(typedLetters(TYPE_DURATION, 100)).toBe(100);
    expect(typedLetters(5000, 100)).toBe(100);
  });
  it("immediately exposes choices for reduced motion", () => {
    expect(welcomePhase(0, true)).toBe("ready");
  });
});