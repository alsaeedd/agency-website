import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Application, SPEObject } from "@splinetool/runtime";
import bhFlag from "../../assets/bh.png";
import "./Hero.css";

// Spline is ~2 MB of JS + a remote scene fetch — lazy-load it so the rest of the
// page can hydrate before this blocks. The placeholder fills the same space so
// no layout shift when the canvas mounts.
const Spline = lazy(() => import("@splinetool/react-spline"));

gsap.registerPlugin(ScrollTrigger);

const SCENE_URL_DESKTOP = "https://prod.spline.design/8fsk08FLXfrBXTI4/scene.splinecode";
const SCENE_URL_MOBILE  = "https://prod.spline.design/kvm6pdQOSjIeQDqO/scene.splinecode";

interface HeroProps {
  onContactClick: () => void;
  isContactOpen: boolean;
}

export default function Hero({ onContactClick, isContactOpen }: HeroProps) {
  const sectionRef     = useRef<HTMLElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const glowOverlayRef = useRef<HTMLDivElement>(null);
  const goldOverlayRef = useRef<HTMLDivElement>(null);
  const labelTRRef     = useRef<HTMLDivElement>(null);
  const headlineRef    = useRef<HTMLHeadingElement>(null);
  const ctaRef         = useRef<HTMLButtonElement>(null);

  const splineAppRef       = useRef<Application | null>(null);
  const splineLightRef     = useRef<SPEObject | null>(null);
  const splineParticlesRef = useRef<SPEObject | null>(null);
  const splineBrainRef     = useRef<SPEObject | null>(null);

  const splineActiveRef    = useRef(false);
  const isContactOpenRef   = useRef(isContactOpen);

  const [loaded, setLoaded] = useState(false);

  // Portrait phone → dedicated 375×812 scene.
  // Landscape phone / desktop / thin window → desktop scene (wider aspect ratio).
  const [sceneUrl] = useState(() => {
    const isPortraitMobile = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
    return isPortraitMobile ? SCENE_URL_MOBILE : SCENE_URL_DESKTOP;
  });

  function onLoad(spline: Application) {
    splineAppRef.current       = spline;
    splineLightRef.current     = spline.findObjectByName("directional light") ?? null;
    splineParticlesRef.current = spline.findObjectByName("particles") ?? null;
    splineBrainRef.current     = spline.findObjectByName("brain_part_06") ?? null;

    const app = spline as any;

    // Cap pixel ratio — saves GPU on retina without visible quality loss
    const renderer = app._renderer || app.renderer || app.webgl?.renderer || app._context?.renderer;
    if (renderer?.setPixelRatio) renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Force renderer to match container size on load
    const wrap = document.querySelector(".hero-spline-wrap");
    if (wrap && renderer?.setSize) {
      const { clientWidth: w, clientHeight: h } = wrap as HTMLElement;
      renderer.setSize(w, h, false);
    }

    splineActiveRef.current = true;
    setLoaded(true);

    // Kill Spline watermark
    const container = document.querySelector(".hero-spline-wrap");
    const killWatermark = () => {
      (container ?? document.body)
        .querySelectorAll<HTMLElement>('a[href*="spline.design"]')
        .forEach((el) => {
          el.style.setProperty("display",     "none",   "important");
          el.style.setProperty("opacity",     "0",      "important");
          el.style.setProperty("visibility",  "hidden", "important");
        });
    };
    killWatermark();
    const observer = new MutationObserver(killWatermark);
    observer.observe(container ?? document.body, { childList: true, subtree: true });
    (window as any).__splineObserver = observer;
  }

  // Keep contact ref in sync so scroll callbacks always have current value
  useEffect(() => {
    isContactOpenRef.current = isContactOpen;
  }, [isContactOpen]);

  // Pause Spline while contact modal is open
  useEffect(() => {
    if (!splineAppRef.current) return;
    if (isContactOpen) {
      if (splineActiveRef.current) splineAppRef.current.stop?.();
    } else {
      if (splineActiveRef.current) splineAppRef.current.play?.();
    }
  }, [isContactOpen]);

  // Freeze Spline when hero is nearly off-screen, resume when it's back
  useEffect(() => {
    if (!loaded) return;
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        splineActiveRef.current = true;
        if (!isContactOpenRef.current) splineAppRef.current?.play?.();
      } else {
        splineActiveRef.current = false;
        splineAppRef.current?.stop?.();
      }
    }, { threshold: 0.15 });

    observer.observe(section);
    return () => observer.disconnect();
  }, [loaded]);

  // Keep Spline renderer size in sync with container on resize / orientation change
  useEffect(() => {
    if (!loaded) return;
    const wrap = document.querySelector(".hero-spline-wrap") as HTMLElement | null;
    if (!wrap) return;

    const syncSize = () => {
      const app = splineAppRef.current as any;
      const renderer = app?._renderer || app?.renderer || app?.webgl?.renderer || app?._context?.renderer;
      if (renderer?.setSize) {
        renderer.setSize(wrap.clientWidth, wrap.clientHeight, false);
      }
    };

    const ro = new ResizeObserver(syncSize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [loaded]);

  // Block right-click drag, keep native context menu
  useEffect(() => {
    if (!loaded) return;
    const canvas = document.querySelector(".hero-spline-wrap canvas");
    if (!canvas) return;
    const blockRight   = (e: Event) => { if ((e as PointerEvent).button === 2) e.stopPropagation(); };
    const passContext  = (e: Event) => { e.stopPropagation(); };
    canvas.addEventListener("pointerdown",  blockRight,  true);
    canvas.addEventListener("contextmenu",  passContext, true);
    return () => {
      canvas.removeEventListener("pointerdown",  blockRight,  true);
      canvas.removeEventListener("contextmenu",  passContext, true);
    };
  }, [loaded]);

  // Main scroll animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   "top top",
          end:     () => window.innerWidth <= 480  ? "+=80%"
                       : window.innerWidth <= 768  ? "+=100%"
                       : window.innerHeight <= 500 ? "+=100%"  // landscape phone / thin window
                       : "+=150%",
          invalidateOnRefresh: true,
          pin:     true,
          scrub:   window.innerWidth <= 768  ? 1
                 : window.innerHeight <= 500 ? 1.5
                 : 2,
          onUpdate: (self) => {
            const p = self.progress;

            // Brain emissive glow
            const brain = splineBrainRef.current;
            if (brain) {
              const mat = (brain as any).material || (brain as any)._material;
              if (mat) {
                if (mat.emissive) { mat.emissive.r = p * 0.5; mat.emissive.g = 0; mat.emissive.b = p; }
                if ("emissiveIntensity" in mat) mat.emissiveIntensity = p * 4;
              }
            }

            // Light ramp
            const light = splineLightRef.current as any;
            if (light) {
              if ("intensity" in light) light.intensity = 1 + p * 22;
              if (light.color) { light.color.r = 1 - p * 0.3; light.color.g = 1 - p * 0.5; light.color.b = 1; }
            }

            // Particles expand
            const particles = splineParticlesRef.current;
            if (particles?.scale) {
              const s = 1 + p * 2;
              particles.scale.x = s; particles.scale.y = s; particles.scale.z = s;
            }
          },
        },
      });

      tl.to(darkOverlayRef.current, { opacity: 0, duration: 0.4 }, 0);
      tl.to(glowOverlayRef.current, { opacity: 1, duration: 0.4 }, 0.05);
      tl.to(glowOverlayRef.current, { opacity: 0, duration: 0.3 }, 0.55);
      tl.to(goldOverlayRef.current, { opacity: 0.6, duration: 0.35 }, 0.45);
      tl.to(goldOverlayRef.current, { opacity: 1,   duration: 0.3  }, 0.72);

      tl.fromTo(labelTRRef.current,
        { opacity: 0, scale: 1, textShadow: "none" },
        { opacity: 1, scale: 1.28, textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 28px rgba(180,100,255,0.9), 0 0 55px rgba(150,80,255,0.7)", duration: 0.4 },
        0.15
      );

      const yOffset = window.innerWidth <= 480  ? 28
                    : window.innerWidth <= 768  ? 36
                    : window.innerHeight <= 500 ? 32   // landscape phone / thin window
                    : 55;

      tl.fromTo(headlineRef.current,
        { opacity: 0, y: -yOffset },
        { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" },
        0.28
      );

      tl.fromTo(ctaRef.current,
        { opacity: 0, y: yOffset },
        { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" },
        0.38
      );
    }, sectionRef);

    const onOrientationChange = () => setTimeout(() => ScrollTrigger.refresh(), 300);
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      ctx.revert();
      window.removeEventListener("orientationchange", onOrientationChange);
      (window as any).__splineObserver?.disconnect();
    };
  }, []);

  return (
    <section className="hero-brain" ref={sectionRef}>
      <div className="hero-spline-wrap">
        <Suspense fallback={<div className="hero-spline-fallback" aria-hidden="true" />}>
          <Spline scene={sceneUrl} onLoad={onLoad} />
        </Suspense>
      </div>

      <div className="hero-dark-overlay" ref={darkOverlayRef} />
      <div className="hero-glow-overlay" ref={glowOverlayRef} />
      <div className="hero-gold-overlay" ref={goldOverlayRef} />
      <div className="hero-vignette" />

      <div className="hero-label label-tr" ref={labelTRRef}>
        <img src={bhFlag} alt="Bahrain" className="label-flag" />
        Bahrain · 2025
      </div>

      <div className="hero-top-content">
        <h1 className="hero-brain-title" ref={headlineRef}>
          Elite software & AI that scales your revenue.
        </h1>
      </div>

      <div className="hero-bottom-content">
        <button className="hero-brain-cta" ref={ctaRef} onClick={onContactClick}>
          <span className="cta-shimmer" />
          Build Your Dream Project
          <span className="cta-arrow">→</span>
        </button>
      </div>
    </section>
  );
}
