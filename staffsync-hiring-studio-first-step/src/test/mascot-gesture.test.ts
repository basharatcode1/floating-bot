import { describe, expect, it } from "vitest";
import { greetingGesture } from "@/components/requirements/mascot-gesture";

describe("adapted robot gesture", () => {
  it("moves shoulder and wrist independently during introduction", () => {
    const pose = greetingGesture(0.5, "greeting", false);
    expect(pose.shoulder).toBeGreaterThan(0);
    expect(Math.abs(pose.wrist)).toBeGreaterThan(0.01);
    expect(pose.mouth).toBeGreaterThan(0);
    expect(greetingGesture(1, "ready", false).shoulder).toBe(0);
  });
  it("keeps hands and face static for reduced motion", () => {
    for (const seconds of [0, 0.5, 3.99, 10]) {
      expect(greetingGesture(seconds, "greeting", true)).toEqual({ shoulder: 0, wrist: 0, blink: 0, mouth: 0 });
    }
  });
  it("blinks without exceeding the closed-eye range", () => {
    expect(greetingGesture(3.99, "ready", false).blink).toBeGreaterThan(0.8);
    expect(greetingGesture(2, "ready", false).blink).toBe(0);
  });
});