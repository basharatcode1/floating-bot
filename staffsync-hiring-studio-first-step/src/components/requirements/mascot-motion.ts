/** Entrance settle only: once arrived, the robot stands still on the ground (no floating). */
export function mascotPose(elapsed: number, reducedMotion: boolean) {
  if (reducedMotion) return { y: 0, rotationY: -0.12, rotationZ: 0 };
  const settle = Math.exp(-elapsed * 4);
  return { y: -0.3 * settle, rotationY: -0.12 + 0.18 * settle, rotationZ: -0.045 * settle };
}
