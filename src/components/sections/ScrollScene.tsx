import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ScrollSceneProps {
  /** Element whose scroll progress drives the camera. Defaults to the parent section. */
  triggerRef?: React.RefObject<HTMLElement>;
}

/**
 * Scroll-driven particle tunnel.
 * - 3D field of glowing dots arranged in a long Z-axis grid
 * - Camera flies forward through the field as you scroll into the section
 * - Particles wave/breathe with time
 * - Color shifts violet -> mint as you progress
 * - GPU-accelerated via THREE.Points + custom shader material
 */
export default function ScrollScene({ triggerRef }: ScrollSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const w = host.clientWidth;
    const h = host.clientHeight;
    const camera = new THREE.PerspectiveCamera(58, w / h, 0.1, 200);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // ──────────────────────────────────────────────
    // PARTICLE GRID - a long Z-axis tunnel of dots
    // ──────────────────────────────────────────────
    const GRID_X = 16;
    const GRID_Y = 12;
    const GRID_Z = 60;
    const SPACING_XY = 1.2;
    const SPACING_Z = 1.4;
    const COUNT = GRID_X * GRID_Y * GRID_Z;

    const positions = new Float32Array(COUNT * 3);
    const offsets = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);

    let idx = 0;
    for (let z = 0; z < GRID_Z; z++) {
      for (let y = 0; y < GRID_Y; y++) {
        for (let x = 0; x < GRID_X; x++) {
          const px = (x - (GRID_X - 1) / 2) * SPACING_XY + (Math.random() - 0.5) * 0.3;
          const py = (y - (GRID_Y - 1) / 2) * SPACING_XY + (Math.random() - 0.5) * 0.3;
          const pz = -z * SPACING_Z + (Math.random() - 0.5) * 0.5;
          positions[idx * 3 + 0] = px;
          positions[idx * 3 + 1] = py;
          positions[idx * 3 + 2] = pz;
          offsets[idx] = Math.random() * Math.PI * 2;
          sizes[idx] = 4 + Math.random() * 8;
          idx++;
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(0xa78bfa) },
        uColorB: { value: new THREE.Color(0x4af5c0) },
        uProgress: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        attribute float aOffset;
        attribute float aSize;
        uniform float uTime;
        uniform float uProgress;
        uniform float uPixelRatio;
        varying float vDepth;
        varying float vWave;
        void main() {
          vec3 pos = position;
          // Gentle wave based on position + time
          float wave = sin(uTime * 0.7 + aOffset + pos.z * 0.3) * 0.18;
          pos.x += wave;
          pos.y += cos(uTime * 0.6 + aOffset * 1.3 + pos.z * 0.2) * 0.14;
          vWave = wave;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vDepth = -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
          float size = aSize * uPixelRatio * (24.0 / -mvPosition.z);
          // Fade in as user scrolls so first paint feels alive
          gl_PointSize = size * (0.4 + uProgress * 0.6);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uProgress;
        uniform float uTime;
        varying float vDepth;
        varying float vWave;
        void main() {
          // Round point with soft edges
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.0, d);
          if (alpha < 0.02) discard;

          // Color shift: violet -> mint as you scroll deeper
          vec3 col = mix(uColorA, uColorB, uProgress * 0.7 + vWave * 0.5);
          // Depth fade
          float depthFade = 1.0 - smoothstep(20.0, 60.0, vDepth);
          // Glow center
          float glow = pow(alpha, 2.0);
          gl_FragColor = vec4(col, alpha * depthFade * (0.5 + glow * 0.5));
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ──────────────────────────────────────────────
    // SCROLL DRIVER
    // ──────────────────────────────────────────────
    let scrollProgress = 0;
    let scrollTarget = 0;
    const triggerEl = triggerRef?.current ?? host.parentElement;

    const onScroll = () => {
      if (!triggerEl) return;
      const r = triggerEl.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
      const total = r.height + vh;
      const traveled = vh - r.top;
      scrollTarget = Math.max(0, Math.min(1, traveled / total));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mouse subtle camera tilt
    const mouseTarget = new THREE.Vector2(0, 0);
    const mouseCurrent = new THREE.Vector2(0, 0);
    const isCoarse = matchMedia("(pointer: coarse)").matches;
    const onMove = (e: PointerEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (!isCoarse) window.addEventListener("pointermove", onMove, { passive: true });

    // Resize
    const resize = () => {
      const ww = host.clientWidth;
      const hh = host.clientHeight;
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let visible = !document.hidden;
    const onVis = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    // ──────────────────────────────────────────────
    // ANIMATION LOOP
    // ──────────────────────────────────────────────
    let raf = 0;
    let lastTime = performance.now();

    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      // Lerp
      scrollProgress += (scrollTarget - scrollProgress) * 0.08;
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;

      material.uniforms.uTime.value += dt;
      material.uniforms.uProgress.value = scrollProgress;

      // Camera flies forward through the grid as scroll progresses
      const flyDistance = scrollProgress * GRID_Z * SPACING_Z * 0.85;
      camera.position.z = 12 - flyDistance;
      camera.position.x = mouseCurrent.x * 0.8;
      camera.position.y = mouseCurrent.y * 0.6;
      camera.lookAt(0, 0, -flyDistance - 4);

      // Slow continuous rotation for kinetic feel
      points.rotation.z = scrollProgress * 0.4;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
    };
  }, [triggerRef]);

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
