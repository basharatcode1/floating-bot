"use client";

import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uHover;
uniform float uClick;
uniform vec3 uBaseColor;
uniform vec3 uGlassColor;
uniform vec2 uResolution;

// Hash function for pseudo-randomness
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Simplex-style noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Fractal Brownian Motion for liquid distortion
float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 4; i++) {
        f += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
    }
    return f;
}

void main() {
    // Aspect-corrected coordinates for perfect pill shape math
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= aspect;

    // Center calculations for the liquid click surge
    vec2 center = vec2(0.5);
    vec2 dirToCenter = normalize(vUv - center + vec2(0.0001));
    float distToCenter = length(vUv - center);

    // 1. SDF (Signed Distance Field) for a Pill Shape
    float r = 1.0; 
    vec2 b = vec2(max(aspect - 1.0, 0.0), 0.0);
    vec2 d = abs(p) - b;
    float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
    
    // Normalized distance from edge (0 = edge, 1 = center)
    float innerDist = clamp(abs(dist), 0.0, 1.0);

    // 2. Dynamic Liquid Noise Field
    float t = uTime;
    
    // Stretch noise horizontally
    vec2 noiseUv = vUv * vec2(2.0, 1.0); 
    
    // Dynamic warping on hover + Liquid Surge on Click
    vec2 warp = vec2(fbm(noiseUv + t * 0.5), fbm(noiseUv + t * 0.5 + 12.34)) * mix(0.0, 0.4, uHover);
    warp -= dirToCenter * uClick * 0.25 * smoothstep(0.8, 0.0, distToCenter); 
    
    float n1 = fbm(noiseUv + warp + vec2(t, 0.0));
    float n2 = fbm(noiseUv + warp + vec2(n1, t * 1.2));

    // 3. Glassy Rim & Specular Highlights
    float rimWidth = mix(0.15, 0.35, n2) * mix(1.0, 1.4, uHover);
    rimWidth += uClick * 0.15; // Rim expands on click
    float rim = smoothstep(rimWidth, 0.0, innerDist);
    
    float specDist = abs(innerDist - 0.12 + n1 * 0.08);
    float specular = smoothstep(0.03, 0.0, specDist);

    float rightBias = smoothstep(0.2, 1.0, vUv.x);
    rim *= mix(0.6, 1.5, rightBias);
    specular *= mix(0.5, 2.0, rightBias);

    // 4. Highly Dynamic Stars / Particles
    vec2 starUv = vUv * vec2(aspect * 6.0, 6.0);
    
    // Drift uses the accumulated uTime so it accelerates smoothly without jumping
    starUv.x -= uTime * 0.2; 
    starUv.y += sin(uTime * 0.5 + starUv.x) * mix(0.2, 0.6, uHover); 
    
    // Star Burst on Click
    starUv += dirToCenter * uClick * 1.5;

    vec2 id = floor(starUv);
    vec2 gv = fract(starUv) - 0.5;
    float nStar = hash(id);
    float star = 0.0;
    
    float starThreshold = mix(0.94, 0.86, uHover); 
    
    if (nStar > starThreshold) { 
        // Randomize size per star
        float sizeMod = mix(0.5, 2.5, hash(id + 13.37)); 
        
        // Local micro-movements (wiggling inside their cell on hover)
        vec2 localWiggle = vec2(
            sin(uTime * 2.0 + nStar * 50.0),
            cos(uTime * 2.3 + nStar * 40.0)
        ) * 0.25 * uHover;

        float starDist = length(gv - localWiggle) * sizeMod;
        
        // Core brightness + Outer glow
        star = smoothstep(0.12, 0.0, starDist);
        star += smoothstep(0.25, 0.0, starDist) * 0.3;

        // Twinkle phase uses accumulated time to naturally speed up
        float twinklePhase = uTime * mix(5.0, 15.0, hash(id + 42.0));
        star *= sin(twinklePhase + nStar * 100.0) * 0.5 + 0.5; 
        
        // Fade stars out near the edge
        star *= smoothstep(0.05, 0.2, innerDist); 
    }

    // 5. Compositing
    vec3 color = vec3(0.0);
    
    float innerLiquid = smoothstep(0.1, 0.8, n2) * (1.0 - innerDist) * mix(0.35, 0.75, uHover);
    color += vec3(1.0) * innerLiquid;
    
    float rimTerm = rim * mix(0.6, 1.2, uHover);
    color += uGlassColor * rimTerm;

    float specTerm = specular * mix(0.8, 2.0, uHover);
    color += vec3(1.0) * specTerm;
    
    float starTerm = star * mix(0.8, 1.5, uHover);
    color += vec3(1.0) * starTerm;

    // Click Flash Effects
    float clickRim = rim * uClick * 0.8;
    float clickSpec = specular * uClick * 1.5;
    float clickGlow = exp(-distToCenter * 6.0) * uClick * 0.6; // Volumetric center glow
    color += uGlassColor * clickRim;
    color += vec3(1.0) * clickSpec;
    color += uGlassColor * clickGlow;

    float edgeFade = smoothstep(1.5, 0.2, length(vUv - 0.5));
    color *= edgeFade;

    // Glassy alpha: the pill center stays transparent (shows the page
    // behind it) while the liquid rim, specular highlights, twinkling
    // stars and click flash remain fully visible.
    float baseGlass = mix(0.10, 0.22, uHover); // faint frosted-glass base
    float alpha = baseGlass
        + rimTerm * 0.9
        + specTerm * 0.8
        + starTerm * 0.9
        + clickRim * 0.9
        + clickSpec
        + clickGlow;
    alpha = clamp(alpha, 0.0, 1.0) * edgeFade;

    gl_FragColor = vec4(color, alpha);
}
`;

interface FluidGlassButtonProps {
  text?: string;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  baseColor?: string;
  glassColor?: string;
  hoverSpeed?: number;
  borderRadius?: number;
  className?: string;
}

export default function FluidGlassButton({
  text = "Book a Demo",
  onClick,
  baseColor = "#080D17", // matches var(--dark-bg)
  glassColor = "#6366F1", // matches var(--accent-primary) (Indigo)
  hoverSpeed = 0.6,
  borderRadius = 999,
  className = "",
}: FluidGlassButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef<number>(0);
  const clickRef = useRef<number>(0);
  const outerRef = useRef<HTMLButtonElement | null>(null);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uHover: { value: 0 },
    uClick: { value: 0 },
    uBaseColor: { value: new THREE.Color() },
    uGlassColor: { value: new THREE.Color() },
    uResolution: { value: new THREE.Vector2(1, 1) },
  });

  useEffect(() => {
    uniformsRef.current.uBaseColor.value.set(baseColor);
    uniformsRef.current.uGlassColor.value.set(glassColor);
  }, [baseColor, glassColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: uniformsRef.current,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    let timeAccumulator = 0;
    let lastTime = performance.now();
    let isIntersecting = false;
    let currentHoverValue = 0;
    let currentClickValue = 0;

    const renderLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);
      if (!isIntersecting) {
        lastTime = time;
        return;
      }
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const targetHover = hoverRef.current;
      currentHoverValue = THREE.MathUtils.lerp(currentHoverValue, targetHover, delta * 4);

      if (clickRef.current > 0) {
        currentClickValue = clickRef.current;
        clickRef.current = 0;
      }

      currentClickValue = THREE.MathUtils.lerp(currentClickValue, 0, delta * 6);

      const currentSpeed = THREE.MathUtils.lerp(0.15, hoverSpeed, currentHoverValue);
      timeAccumulator += delta * currentSpeed;

      uniformsRef.current.uTime.value = timeAccumulator;
      uniformsRef.current.uHover.value = currentHoverValue;
      uniformsRef.current.uClick.value = currentClickValue;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        renderer.setSize(width, height);
        uniformsRef.current.uResolution.value.set(width, height);
      }
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        isIntersecting = entry.isIntersecting;
      }
    });
    intersectionObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hoverSpeed]);

  const handleMouseDownEvt = useCallback(() => {
    clickRef.current = 1;
    if (outerRef.current) {
      outerRef.current.style.transform = "scale(0.96)";
    }
  }, []);

  const handleMouseUpEvt = useCallback(() => {
    if (outerRef.current) {
      outerRef.current.style.transform = "scale(1)";
    }
  }, []);

  const handleMouseEnterEvt = useCallback(() => {
    hoverRef.current = 1;
    if (outerRef.current) {
      outerRef.current.style.zIndex = "10";
    }
  }, []);

  const handleMouseLeaveEvt = useCallback(() => {
    hoverRef.current = 0;
    if (outerRef.current) {
      outerRef.current.style.transform = "scale(1)";
      outerRef.current.style.zIndex = "1";
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        clickRef.current = 1;
        if (outerRef.current) {
          outerRef.current.style.transform = "scale(0.96)";
          setTimeout(() => {
            if (outerRef.current) {
              outerRef.current.style.transform = "scale(1)";
            }
          }, 150);
        }
        if (onClick) {
          onClick(e);
        }
      }
    },
    [onClick]
  );

  const radiusStyle = borderRadius === 999 ? "999px" : `${borderRadius}px`;

  return (
    <button
      ref={outerRef}
      onMouseEnter={handleMouseEnterEvt}
      onMouseLeave={handleMouseLeaveEvt}
      onMouseDown={handleMouseDownEvt}
      onMouseUp={handleMouseUpEvt}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center justify-center font-semibold text-white select-none whitespace-nowrap cursor-pointer px-5 py-3 text-base sm:px-8 sm:py-4 sm:text-lg transition-transform duration-300 ${className}`}
      style={{
        width: "auto",
        borderRadius: radiusStyle,
        backgroundColor: "transparent",
        outline: "none",
        border: "none",
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          borderRadius: radiusStyle,
        }}
      />
      <span className="relative z-10 pointer-events-none text-shadow-[0px_2px_10px_rgba(255,255,255,0.3)]">
        {text}
      </span>
    </button>
  );
}
