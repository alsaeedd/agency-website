import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getDeviceProfile } from "../lib/deviceProfile";
import "./HeroScene.css";

/**
 * AI neural core scene - centered, premium, sexy.
 * - Central rotating wireframe icosahedron (the "brain")
 * - Inner solid icosahedron with iridescent material
 * - Pulsing glow core at the very center
 * - Orbiting satellite particles in two layered rings
 * - Constellation lines connecting nearest satellites
 * - Subtle camera tilt on mouse (no magnet, no displacement of particles)
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const isCoarse = matchMedia("(pointer: coarse)").matches;
    const profile = getDeviceProfile();

    const scene = new THREE.Scene();
    const w = host.clientWidth;
    const h = host.clientHeight;
    const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 100);
    camera.position.set(0, 0, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: profile.antialias,
      powerPreference: "high-performance",
      stencil: false,
    });
    renderer.setPixelRatio(profile.dpr);
    renderer.setSize(w, h, false);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // ──────────────────────────────────────────
    // LIGHTING
    // ──────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x3a2870, 0.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(5, 4, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa78bfa, 1.4);
    rimLight.position.set(-4, 1, 3);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0xff7ad6, 3.2, 14);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const accentLight = new THREE.PointLight(0x4af5c0, 1.8, 10);
    accentLight.position.set(0, -2, 2);
    scene.add(accentLight);

    // ──────────────────────────────────────────
    // CORE GROUP (the "brain")
    // ──────────────────────────────────────────
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner solid icosahedron - glowing violet crystal.
    // Was MeshPhysicalMaterial with transmission+iridescence+clearcoat — the
    // transmission alone forced an extra full-scene render pass every frame
    // (the dominant GPU cost on mobile). MeshStandardMaterial + emissive reads
    // as the same glowing crystal at this size for a fraction of the cost.
    const innerGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xb084ff,
      metalness: 0.6,
      roughness: 0.18,
      emissive: 0x6a3fd0,
      emissiveIntensity: 0.45,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Outer wireframe icosahedron - the "neural shell"
    const outerGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.55,
    });
    const wireMesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(outerGeo),
      wireMat,
    );
    coreGroup.add(wireMesh);

    // Larger wireframe shell (cage)
    const cageGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const cageMat = new THREE.LineBasicMaterial({
      color: 0x7c5aff,
      transparent: true,
      opacity: 0.18,
    });
    const cageMesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(cageGeo),
      cageMat,
    );
    coreGroup.add(cageMesh);

    // Glowing core at very center
    const coreGlowGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const coreGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffe8f4,
      transparent: true,
      opacity: 0.95,
    });
    const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
    coreGroup.add(coreGlow);

    // ──────────────────────────────────────────
    // SATELLITE PARTICLES (two orbital rings)
    // ──────────────────────────────────────────
    // Satellites: one InstancedMesh per ring (was 28 individual draw calls →
    // now 2), and cheap MeshStandardMaterial instead of MeshPhysicalMaterial.
    const satellites: {
      angle: number;
      ring: number;
      local: number;
      radius: number;
      tilt: number;
      speed: number;
      verticalPhase: number;
      pos: THREE.Vector3;
    }[] = [];
    const satGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xe6d4ff,
      metalness: 0.4,
      roughness: 0.25,
      emissive: 0x8866ff,
      emissiveIntensity: 0.55,
      transparent: true,
    });
    const satMatMint = new THREE.MeshStandardMaterial({
      color: 0xc8fff0,
      metalness: 0.3,
      roughness: 0.3,
      emissive: 0x4af5c0,
      emissiveIntensity: 0.5,
      transparent: true,
    });

    const SAT_COUNT_PER_RING = profile.tier === "low" ? 6 : isCoarse ? 9 : 14;
    const RINGS = 2;
    const satDummy = new THREE.Object3D();
    const ringMeshes: THREE.InstancedMesh[] = [];
    for (let r = 0; r < RINGS; r++) {
      const im = new THREE.InstancedMesh(
        satGeo,
        r === 0 ? satMat : satMatMint,
        SAT_COUNT_PER_RING,
      );
      im.frustumCulled = false; // instances orbit far from geometry origin
      ringMeshes.push(im);
      scene.add(im);

      const radius = 3.4 + r * 1.3;
      const tilt = r === 0 ? 0.32 : -0.45;
      for (let i = 0; i < SAT_COUNT_PER_RING; i++) {
        satellites.push({
          angle: (i / SAT_COUNT_PER_RING) * Math.PI * 2,
          ring: r,
          local: i,
          radius,
          tilt,
          speed: 0.08 + r * 0.04 + Math.random() * 0.03,
          verticalPhase: Math.random() * Math.PI * 2,
          pos: new THREE.Vector3(),
        });
      }
    }

    // ──────────────────────────────────────────
    // CONSTELLATION LINES (between near satellites)
    // ──────────────────────────────────────────
    const lineSegments: THREE.Vector3[] = [];
    for (let i = 0; i < satellites.length; i++) {
      lineSegments.push(new THREE.Vector3());
      lineSegments.push(new THREE.Vector3());
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(lineSegments);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.32,
    });
    const constellation = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(constellation);

    // ──────────────────────────────────────────
    // MOUSE - subtle camera parallax only
    // ──────────────────────────────────────────
    const target = new THREE.Vector2(0, 0);
    const current = new THREE.Vector2(0, 0);
    let visible = !document.hidden;
    let onScreen = true;

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (!isCoarse) window.addEventListener("pointermove", onMove, { passive: true });

    const onVis = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);

    // ──────────────────────────────────────────
    // SCROLL - drives the morph: core shrinks, cage fades,
    // satellites explode outward, camera pulls back
    // ──────────────────────────────────────────
    let scrollProgress = 0; // 0 at top of hero, 1 when fully scrolled past
    let scrollTarget = 0;
    const onScroll = () => {
      const wh = window.innerHeight;
      const y = window.scrollY;
      // 0 → 1 over the first viewport height of scroll
      scrollTarget = Math.max(0, Math.min(1, y / (wh * 0.9)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const resize = () => {
      const ww = host.clientWidth;
      const hh = host.clientHeight;
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ──────────────────────────────────────────
    // ANIMATION LOOP — runs only while tab-visible AND on screen
    // ──────────────────────────────────────────
    let raf = 0;
    let lastTime = performance.now();
    let firstRenderFired = false;
    const tmpVec = new THREE.Vector3();
    const linePosArr = new Float32Array(satellites.length * satellites.length * 6);
    const linePosBuffer = new THREE.BufferAttribute(linePosArr, 3);
    constellation.geometry.setAttribute("position", linePosBuffer);

    const tick = (time: number) => {
      if (!visible || !onScreen) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);

      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      const t = time * 0.001;

      // Smooth cursor for camera tilt
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;

      // Smooth scroll progress
      scrollProgress += (scrollTarget - scrollProgress) * 0.08;
      const sp = scrollProgress; // 0..1
      const spEase = sp * sp * (3 - 2 * sp); // smoothstep

      // Camera: pulls back + drifts up as you scroll
      camera.position.x = current.x * 0.6;
      camera.position.y = current.y * 0.4 + spEase * 1.5;
      camera.position.z = 11 + spEase * 6;
      camera.lookAt(0, 0, 0);

      // Core group spin - accelerates with scroll
      const spinAccel = 1 + spEase * 3.5;
      coreGroup.rotation.x += dt * 0.18 * spinAccel;
      coreGroup.rotation.y += dt * 0.22 * spinAccel;
      cageMesh.rotation.x -= dt * 0.1 * spinAccel;
      cageMesh.rotation.z += dt * 0.07 * spinAccel;

      // Core: shrinks + dims as you scroll
      const breathe = 1 + Math.sin(t * 1.4) * 0.08;
      const coreScale = breathe * (1 - spEase * 0.5);
      innerMesh.scale.setScalar(coreScale);
      coreGlow.scale.setScalar((1 + Math.sin(t * 3) * 0.25) * (1 - spEase * 0.6));
      coreGlowMat.opacity = (0.7 + Math.sin(t * 3) * 0.25) * (1 - spEase * 0.8);
      coreLight.intensity = (2.6 + Math.sin(t * 3) * 0.6) * (1 - spEase * 0.7);

      // Wireframe cages fade
      wireMat.opacity = 0.55 * (1 - spEase * 0.6);
      cageMat.opacity = 0.18 * (1 - spEase * 0.9);

      // Satellites: explode outward, accelerate, fade (written to instances)
      const radiusMul = 1 + spEase * 1.6;
      const orbitAccel = 1 + spEase * 4;
      const satScale = 1 + spEase * 0.6;
      for (let i = 0; i < satellites.length; i++) {
        const s = satellites[i];
        s.angle += s.speed * dt * orbitAccel;
        const liveRadius = s.radius * radiusMul;
        const ringTiltX = Math.cos(s.angle) * liveRadius;
        const ringTiltY = Math.sin(s.angle) * liveRadius * Math.cos(s.tilt);
        const ringTiltZ = Math.sin(s.angle) * liveRadius * Math.sin(s.tilt);
        const wobble = Math.sin(t * 1.2 + s.verticalPhase) * 0.18;
        s.pos.set(ringTiltX, ringTiltY + wobble, ringTiltZ);
        satDummy.position.copy(s.pos);
        satDummy.scale.setScalar(satScale);
        satDummy.updateMatrix();
        ringMeshes[s.ring].setMatrixAt(s.local, satDummy.matrix);
      }
      ringMeshes[0].instanceMatrix.needsUpdate = true;
      ringMeshes[1].instanceMatrix.needsUpdate = true;
      satMat.opacity = 1 - spEase * 0.55;
      satMatMint.opacity = 1 - spEase * 0.55;
      lineMat.opacity = 0.32 * (1 - spEase * 0.9);

      // Constellation lines - connect particles within distance threshold
      const positions = linePosBuffer.array as Float32Array;
      let lineIndex = 0;
      const maxLines = satellites.length * 4;
      const thresholdSq = 2.4 * 2.4;
      for (let i = 0; i < satellites.length && lineIndex < maxLines; i++) {
        for (let j = i + 1; j < satellites.length && lineIndex < maxLines; j++) {
          tmpVec.subVectors(satellites[i].pos, satellites[j].pos);
          const dSq = tmpVec.lengthSq();
          if (dSq < thresholdSq) {
            positions[lineIndex * 6 + 0] = satellites[i].pos.x;
            positions[lineIndex * 6 + 1] = satellites[i].pos.y;
            positions[lineIndex * 6 + 2] = satellites[i].pos.z;
            positions[lineIndex * 6 + 3] = satellites[j].pos.x;
            positions[lineIndex * 6 + 4] = satellites[j].pos.y;
            positions[lineIndex * 6 + 5] = satellites[j].pos.z;
            lineIndex++;
          }
        }
      }
      // Clear remaining positions
      for (let i = lineIndex * 6; i < positions.length; i++) positions[i] = 0;
      linePosBuffer.needsUpdate = true;
      constellation.geometry.setDrawRange(0, lineIndex * 2);

      renderer.render(scene, camera);

      if (!firstRenderFired) {
        firstRenderFired = true;
        // Signal the preloader that the hero WebGL has rendered its first frame.
        // The preloader holds the intro overlay open until this fires (or a
        // safety timeout elapses), so the user never sees a blank/flashing hero.
        window.dispatchEvent(new Event("ral:hero-ready"));
      }
    };

    // Loop lifecycle — only run when tab-visible AND scrolled on screen.
    const start = () => {
      if (!raf && visible && onScreen) {
        lastTime = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    function sync() {
      if (visible && onScreen) start();
      else stop();
    }

    // rootMargin: "200px 0px" wakes the scene up BEFORE it scrolls into
    // view, so the first frame on resume is computed during the buffer
    // window and the user sees the already-running animation — no
    // first-frame stutter when scrolling back into the hero.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0, rootMargin: "200px 0px" },
    );
    io.observe(host);

    sync();

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      ro.disconnect();

      ringMeshes.forEach((im) => {
        scene.remove(im);
        im.dispose();
      });
      scene.remove(coreGroup);
      scene.remove(constellation);

      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      wireMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      coreGlowGeo.dispose();
      coreGlowMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      satMatMint.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="hero-scene" aria-hidden="true" />;
}
