import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Box3, Group, MathUtils, Vector3 } from "three";
import modelAsset from "@/assets/models/requirements-pocket-robot.glb.asset.json";
import { mascotPose } from "./mascot-motion";
import { adaptMascot } from "./mascot-rig";
import { greetingGesture } from "./mascot-gesture";
import { WAVE_DURATION } from "./welcome-sequence";

function Mascot({ reducedMotion, onReady }: { reducedMotion: boolean; onReady: () => void }) {
  const { scene } = useGLTF(modelAsset.url);
  const group = useRef<Group>(null);
  const time = useRef(10);
  const ready = useRef(false);
  const normalized = useMemo(() => {
    const model = scene.clone(true);
    const bounds = new Box3().setFromObject(model);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const scale = 2.7 / Math.max(size.y, 0.001);
    model.scale.setScalar(scale);
    model.position.copy(center.multiplyScalar(-scale));
    return model;
  }, [scene]);
  const rig = useRef<ReturnType<typeof adaptMascot> | null>(null);
  const phaseStart = useRef(0);
  const faceFrame = useRef(-1);
  const debugTime = useRef<number | null>(null);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const value = new URLSearchParams(window.location.search).get("mascot-time");
    if (value !== null && Number.isFinite(Number(value))) debugTime.current = Number(value);
  }, []);
  useLayoutEffect(() => {
    const adapted = adaptMascot(normalized);
    rig.current = adapted;
    return () => { adapted.dispose(); rig.current = null; };
  }, [normalized]);

  useFrame((state, delta) => {
    if (!group.current) return;
    time.current += Math.min(delta, 0.05);
    const pose = mascotPose(time.current, reducedMotion);
    group.current.position.y = pose.y;
    group.current.rotation.set(0, pose.rotationY, pose.rotationZ);
    if (!phaseStart.current) phaseStart.current = performance.now();
    const seconds = debugTime.current ?? (performance.now() - phaseStart.current) / 1000;
    // Wave hello right when the 3D robot appears, then stand still and keep blinking.
    const waving = debugTime.current !== null || seconds < WAVE_DURATION;
    const gesture = greetingGesture(seconds, waving ? "greeting" : "ready", reducedMotion);
    if (rig.current) {
      rig.current.arm.rotation.z = reducedMotion ? 0 : MathUtils.damp(rig.current.arm.rotation.z, gesture.shoulder, 12, Math.min(delta, 0.05));
      rig.current.wrist.rotation.z = reducedMotion ? 0 : MathUtils.damp(rig.current.wrist.rotation.z, gesture.wrist, 12, Math.min(delta, 0.05));
      const frame = reducedMotion ? 0 : Math.floor(seconds * 12);
      if (frame !== faceFrame.current) { rig.current.drawFace(gesture.blink, gesture.mouth); faceFrame.current = frame; }
    }
    if (!ready.current) {
      ready.current = true;
      requestAnimationFrame(onReady);
    }
    if (!reducedMotion) state.invalidate();
  });

  return <group ref={group}><primitive object={normalized} /></group>;
}

export default function RobotScene({ onReady }: { onReady: () => void }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div ref={wrapper} className="h-full w-full" role="img" aria-label="StaffSync AI 3D robot mascot">
      <Canvas frameloop={reducedMotion ? "demand" : "always"} dpr={[1, 1.5]} camera={{ position: [0, 0.05, 6], fov: 32 }} gl={{ alpha: true, antialias: true }} fallback={<span className="text-sm text-muted-foreground">3D is unavailable on this device.</span>}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} />
        <directionalLight position={[-3, 1, 2]} intensity={1.2} />
        <Environment resolution={64}>
          <Lightformer intensity={2} position={[0, 4, 3]} scale={[8, 8, 1]} />
          <Lightformer intensity={1} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 6, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <Mascot reducedMotion={reducedMotion} onReady={() => {
            wrapper.current?.setAttribute("data-scene-ready", "true");
            onReady();
          }} />
        </Suspense>
      </Canvas>
    </div>
  );
}