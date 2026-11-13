import { describe, expect, it } from "vitest";
import { mascotPose } from "@/components/requirements/mascot-motion";

describe("mascot motion", () => {
  it("shows a static pose throughout reduced motion", () => {
    for (const time of [0, 1, 5, 60]) {
      expect(mascotPose(time, true)).toEqual({ y: 0, rotationY: -0.12, rotationZ: 0 });
    }
  });
  it("enters from below then stands still without floating", () => {
    expect(mascotPose(0, false).y).toBe(-0.3);
    const a = mascotPose(5, false);
    for (const time of [6, 10, 15, 20]) {
      const pose = mascotPose(time, false);
      expect(Math.abs(pose.y - a.y)).toBeLessThan(1e-6);
      expect(Math.abs(pose.rotationY - a.rotationY)).toBeLessThan(1e-6);
    }
  });
});