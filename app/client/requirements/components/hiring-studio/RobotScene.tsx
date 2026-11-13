"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
  type Material,
  type WebGLRenderTarget,
} from "three";
import {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mascotPose } from "./mascot-motion";
import { adaptMascot, type AdaptedMascot } from "./mascot-rig";
import { greetingGesture } from "./mascot-gesture";
import { getPreloadedMascotBuffer, type RobotSceneProps } from "./mascot-preload";
import { WAVE_DURATION, type WelcomePhase } from "./welcome-sequence";

function disposeObject3D(root: Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    obj.geometry?.dispose();
    const mats: Material[] = Array.isArray(obj.material)
      ? obj.material
      : obj.material
        ? [obj.material]
        : [];
    for (const mat of mats) {
      const record = mat as unknown as Record<string, unknown>;
      for (const value of Object.values(record)) {
        if (value instanceof Texture) {
          value.dispose();
        }
      }
      mat.dispose();
    }
  });
}

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

export default function RobotScene({
  modelUrl = "/models/welcome-mascot.glb",
  phase,
  onReady,
  onUnavailable,
}: RobotSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const onUnavailableRef = useRef(onUnavailable);
  const phaseRef = useRef<WelcomePhase | undefined>(phase);

  useEffect(() => {
    onReadyRef.current = onReady;
    onUnavailableRef.current = onUnavailable;
    phaseRef.current = phase;
  }, [onReady, onUnavailable, phase]);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let rafId = 0;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      onUnavailableRef.current?.();
      return;
    }

    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0.04, 5.8);

    let envRT: WebGLRenderTarget | null = null;
    try {
      const pmrem = new PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      envRT = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = envRT.texture;
      pmrem.dispose();
      roomEnv.dispose();
    } catch {
      // Fall back cleanly to direct lights if PMREM environment setup fails
    }

    const ambientLight = new AmbientLight(0xffffff, 0.9);
    const keyLight = new DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(3, 4, 5);
    const rimLight = new DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(-3, 1, 2);
    const backLight = new DirectionalLight(0xffffff, 1.35);
    backLight.position.set(-2.5, 3, -5);
    scene.add(ambientLight, keyLight, rimLight, backLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.enableDamping = !reducedMotion;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.9;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.82;
    controls.update();
    controls.saveState();

    const handleResetView = () => {
      controls.reset();
    };
    renderer.domElement.addEventListener("dblclick", handleResetView);

    const group = new Group();
    scene.add(group);

    let rig: AdaptedMascot | null = null;
    let loadedRoot: Group | null = null;

    const resize = () => {
      if (disposed || !container) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(w, h, false);
      if (reducedMotion && loadedRoot) {
        renderer.render(scene, camera);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const handleReducedMotionOrbit = () => {
      if (!disposed && reducedMotion && loadedRoot) {
        renderer.render(scene, camera);
      }
    };
    controls.addEventListener("change", handleReducedMotionOrbit);

    const handleLoaded = (gltf: GLTF) => {
      if (disposed) {
        disposeObject3D(gltf.scene);
        return;
      }

      const model = gltf.scene;
      model.updateMatrixWorld(true);
      const bounds = new Box3().setFromObject(model);
      const size = bounds.getSize(new Vector3());
      const center = bounds.getCenter(new Vector3());

      const scale = Math.min(
        2.7 / Math.max(size.y, 0.001),
        2.45 / Math.max(size.x, 0.001),
      );
      model.scale.setScalar(scale);
      model.position.copy(center.multiplyScalar(-scale));

      loadedRoot = model;
      rig = adaptMascot(model);
      group.add(model);

      const debugParam =
        process.env.NODE_ENV !== "production"
          ? new URLSearchParams(window.location.search).get("mascot-time")
          : null;
      const debugTime =
        debugParam !== null && Number.isFinite(Number(debugParam))
          ? Number(debugParam)
          : null;

      let elapsed = 0;
      let lastTs = performance.now();
      let phaseStart = 0;
      let faceFrame = -1;
      let notifiedReady = false;

      const renderFrame = (now: number) => {
        if (disposed) return;

        const delta = Math.min((now - lastTs) / 1000, 0.05);
        lastTs = now;
        elapsed += delta;

        const pose = mascotPose(elapsed, reducedMotion);
        group.position.y = pose.y;

        if (!phaseStart) phaseStart = now;
        const seconds = debugTime ?? (now - phaseStart) / 1000;
        const waving =
          debugTime !== null ||
          seconds < WAVE_DURATION ||
          phaseRef.current === "greeting";

        const gesture = greetingGesture(
          seconds,
          waving ? "greeting" : "ready",
          reducedMotion,
        );

        if (rig?.hasRiggedArm) {
          group.rotation.set(0, pose.rotationY, pose.rotationZ);
          rig.arm.rotation.z = reducedMotion
            ? 0
            : MathUtils.damp(rig.arm.rotation.z, gesture.shoulder, 12, delta);
          rig.wrist.rotation.z = reducedMotion
            ? 0
            : MathUtils.damp(rig.wrist.rotation.z, gesture.wrist, 12, delta);
        } else {
          group.rotation.set(
            gesture.bodyNod,
            pose.rotationY + gesture.bodyTurn,
            pose.rotationZ + gesture.bodyTilt,
          );
        }

        if (rig?.hasRiggedFace) {
          const frame = reducedMotion ? 0 : Math.floor(seconds * 12);
          if (frame !== faceFrame) {
            rig.drawFace(gesture.blink, gesture.mouth);
            faceFrame = frame;
          }
        }

        controls.update();
        renderer.render(scene, camera);

        if (!notifiedReady) {
          notifiedReady = true;
          container.setAttribute("data-scene-ready", "true");
          onReadyRef.current?.();
        }

        if (!reducedMotion) {
          rafId = requestAnimationFrame(renderFrame);
        }
      };

      if (reducedMotion) {
        const staticPose = mascotPose(0, true);
        group.position.y = staticPose.y;
        group.rotation.set(0, staticPose.rotationY, staticPose.rotationZ);
        controls.update();
        renderer.render(scene, camera);
        container.setAttribute("data-scene-ready", "true");
        onReadyRef.current?.();
      } else {
        renderFrame(performance.now());
      }
    };

    const handleError = () => {
      if (!disposed) {
        onUnavailableRef.current?.();
      }
    };

    const loader = new GLTFLoader();
    getPreloadedMascotBuffer(modelUrl)
      .then((buffer) => {
        if (disposed) return;
        try {
          loader.parse(buffer.slice(0), "/models/", handleLoaded, handleError);
        } catch {
          handleError();
        }
      })
      .catch(handleError);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.removeEventListener("change", handleReducedMotionOrbit);
      renderer.domElement.removeEventListener("dblclick", handleResetView);
      controls.dispose();
      rig?.dispose();
      rig = null;
      disposeObject3D(scene);
      envRT?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing select-none touch-none"
      role="img"
      aria-label="StaffSync AI 3D mascot — drag to rotate 360 degrees"
    />
  );
}
