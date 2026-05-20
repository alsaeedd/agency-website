import { useEffect, useRef } from "react";
import * as THREE from "three";

interface WaveGridSceneProps {
  triggerRef?: React.RefObject<HTMLElement>;
  /** "a" = violet/mint, steeper angle (default)
   *  "b" = violet/magenta, shallower angle, denser & faster */
  variant?: "a" | "b";
}

/**
 * Scroll-driven wave grid - a plane of glowing dots that ripple like a fluid surface.
 * - Sine waves driven by time + scroll progress
 * - Camera angles down at the grid (top-down perspective)
 * - Color shifts from cool violet to mint as you scroll through
 * - Wave amplitude amplifies with scroll - section becomes more active deeper in
 */
export default function WaveGridScene({ triggerRef, variant = "a" }: WaveGridSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    // Variant config
    const cfg = variant === "b"
      ? {
          colorA: new THREE.Color(0xff7ad6),  // magenta
          colorB: new THREE.Color(0xa78bfa),  // violet
          gridSize: 64,
          spacing: 0.38,
          spinSpeed: -0.06,
          camY: 3.2,
          camZ: 8.5,
          rotX: -0.3,
          timeBoost: 1.25,
        }
      : {
          colorA: new THREE.Color(0x7c5aff),  // violet
          colorB: new THREE.Color(0x4af5c0),  // mint
          gridSize: 56,
          spacing: 0.42,
          spinSpeed: 0.04,
          camY: 4.5,
          camZ: 9,
          rotX: -0.4,
          timeBoost: 1,
        };

    const scene = new THREE.Scene();
    const w = host.clientWidth;
    const h = host.clientHeight;
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.set(0, cfg.camY, cfg.camZ);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // ──────────────────────────────────────────
    // WAVE GRID - rectangular plane of points
    // ──────────────────────────────────────────
    const GRID_X = cfg.gridSize;
    const GRID_Z = cfg.gridSize;
    const SPACING = cfg.spacing;
    const COUNT = GRID_X * GRID_Z;

    const positions = new Float32Array(COUNT * 3);
    const offsets = new Float32Array(COUNT);

    let idx = 0;
    for (let z = 0; z < GRID_Z; z++) {
      for (let x = 0; x < GRID_X; x++) {
        const px = (x - (GRID_X - 1) / 2) * SPACING;
        const pz = (z - (GRID_Z - 1) / 2) * SPACING;
        positions[idx * 3 + 0] = px;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = pz;
        offsets[idx] =
          Math.sqrt(px * px + pz * pz) + Math.random() * 0.4; // radial offset
        idx++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColorA: { value: cfg.colorA },
        uColorB: { value: cfg.colorB },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMouseX: { value: 0 },
        uMouseY: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute float aOffset;
        uniform float uTime;
        uniform float uProgress;
        uniform float uPixelRatio;
        uniform float uMouseX;
        uniform float uMouseY;
        varying float vWave;
        varying float vDist;
        void main() {
          vec3 pos = position;
          // Radial ripple from origin (offset acts as radius)
          float ripple = sin(aOffset * 1.3 - uTime * 1.8) * 0.6;
          // Crossing diagonal wave
          float diag = sin((pos.x + pos.z) * 0.35 + uTime * 0.8) * 0.35;
          // Mouse-driven hill
          float dx = pos.x - uMouseX * 8.0;
          float dz = pos.z - uMouseY * 6.0;
          float hill = exp(-(dx*dx + dz*dz) * 0.08) * 1.4;
          float y = (ripple + diag + hill) * (0.45 + uProgress * 1.0);
          pos.y = y;
          vWave = y;
          vDist = length(pos.xz);

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          float size = (4.0 + abs(y) * 6.0) * uPixelRatio * (12.0 / -mv.z);
          gl_PointSize = size;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uProgress;
        varying float vWave;
        varying float vDist;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.0, d);
          if (alpha < 0.02) discard;
          // Mix color by wave height + scroll progress
          float t = clamp(vWave * 0.5 + 0.5, 0.0, 1.0);
          vec3 col = mix(uColorA, uColorB, t * 0.6 + uProgress * 0.4);
          // Distance fade for soft edges
          float fade = 1.0 - smoothstep(8.0, 14.0, vDist);
          gl_FragColor = vec4(col, alpha * fade * 0.95);
        }
      `,
    });

    const points = new THREE.Points(geo, mat);
    points.rotation.x = cfg.rotX;
    scene.add(points);

    // ──────────────────────────────────────────
    // SCROLL
    // ──────────────────────────────────────────
    let scrollTarget = 0;
    let scrollLerp = 0;
    const triggerEl = triggerRef?.current ?? host.parentElement;
    const onScroll = () => {
      if (!triggerEl) return;
      const r = triggerEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const traveled = vh - r.top;
      scrollTarget = Math.max(0, Math.min(1, traveled / total));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mouse interaction - drives a "hill" in the wave
    const mouseTarget = new THREE.Vector2(0, 0);
    const mouseCurrent = new THREE.Vector2(0, 0);
    const isCoarse = matchMedia("(pointer: coarse)").matches;
    const onMove = (e: PointerEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (!isCoarse) window.addEventListener("pointermove", onMove, { passive: true });

    let visible = !document.hidden;
    const onVis = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    const resize = () => {
      const ww = host.clientWidth;
      const hh = host.clientHeight;
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let raf = 0;
    let lastTime = performance.now();
    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      scrollLerp += (scrollTarget - scrollLerp) * 0.08;
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;

      mat.uniforms.uTime.value += dt * cfg.timeBoost;
      mat.uniforms.uProgress.value = scrollLerp;
      mat.uniforms.uMouseX.value = mouseCurrent.x;
      mat.uniforms.uMouseY.value = mouseCurrent.y;

      // Camera arcs forward + down as you scroll
      camera.position.y = cfg.camY - scrollLerp * 1.2;
      camera.position.z = cfg.camZ - scrollLerp * 2.5;
      camera.lookAt(0, scrollLerp * 0.3, 0);

      // Slow rotation - variant b spins opposite direction
      points.rotation.z += dt * cfg.spinSpeed;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
    };
  }, [triggerRef, variant]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
