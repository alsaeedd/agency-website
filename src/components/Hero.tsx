import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Application, SPEObject } from "@splinetool/runtime";
import bhFlag from "../../assets/bh.png";
import "./Hero.css";

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
  const labelTLRef     = useRef<HTMLDivElement>(null);
  const labelTRRef     = useRef<HTMLDivElement>(null);
  const labelBLRef     = useRef<HTMLDivElement>(null);
  const headlineRef    = useRef<HTMLHeadingElement>(null);
  const ctaRef         = useRef<HTMLButtonElement>(null);
  const scrollHintRef  = useRef<HTMLDivElement>(null);

  const splineAppRef       = useRef<Application | null>(null);
  const splineLightRef     = useRef<SPEObject | null>(null);
  const splineParticlesRef = useRef<SPEObject | null>(null);
  const splineBrainRef     = useRef<SPEObject | null>(null);

  const splineActiveRef = useRef(false);
  const hintVisibleRef  = useRef(false);

  const [loaded, setLoaded] = useState(false);

  // Evaluated inside the component so it always reads the real viewport on mount,
  // not a stale module-level value from a previous HMR/dev-tools session.
  const [sceneUrl] = useState(() =>
    window.innerWidth <= 768 ? SCENE_URL_MOBILE : SCENE_URL_DESKTOP
  );

  function onLoad(spline: Application) {
    splineAppRef.current       = spline;
    splineLightRef.current     = spline.findObjectByName("directional light") ?? null;
    splineParticlesRef.current = spline.findObjectByName("particles") ?? null;
    splineBrainRef.current     = spline.findObjectByName("brain_part_06") ?? null;

    const app = spline as any;

    // Halve GPU work on retina screens
    const renderer = app._renderer || app.renderer || app.webgl?.renderer || app._context?.renderer;
    if (renderer?.setPixelRatio) renderer.setPixelRatio(1);

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

  // Pause Spline while contact modal is open
  useEffect(() => {
    if (!splineAppRef.current) return;
    if (isContactOpen) {
      if (splineActiveRef.current) splineAppRef.current.stop?.();
    } else {
      if (splineActiveRef.current) splineAppRef.current.play?.();
    }
  }, [isContactOpen]);

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

  // Scroll-hint entrance
  useEffect(() => {
    if (!loaded) return;
    gsap.fromTo(scrollHintRef.current,
      { opacity: 0, y: 8 },
      { opacity: 0.45, y: 0, duration: 1.2, delay: 0.8, ease: "expo.out" }
    );
    hintVisibleRef.current = true;
  }, [loaded]);

  // Main scroll animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const labels = [labelTLRef.current, labelTRRef.current, labelBLRef.current];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   "top top",
          end:     () => window.innerWidth <= 480 ? "+=110%"
                       : window.innerWidth <= 768 ? "+=150%"
                       : "+=250%",
          invalidateOnRefresh: true,
          pin:     true,
          scrub:   window.innerWidth <= 768 ? 1 : 2,
          onLeave: () => {
            splineActiveRef.current = false;
            splineAppRef.current?.stop?.();
          },
          onEnterBack: () => {
            splineActiveRef.current = true;
            splineAppRef.current?.play?.();
          },
          onUpdate: (self) => {
            const p = self.progress;

            // Scroll hint
            if (p < 0.03 && !hintVisibleRef.current) {
              hintVisibleRef.current = true;
              gsap.to(scrollHintRef.current, { opacity: 0.45, duration: 0.5, overwrite: true });
            } else if (p >= 0.03 && hintVisibleRef.current) {
              hintVisibleRef.current = false;
              gsap.to(scrollHintRef.current, { opacity: 0, duration: 0.2, overwrite: true });
            }

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

      tl.fromTo(labels,
        { opacity: 0, scale: 1, textShadow: "none" },
        { opacity: 1, scale: 1.28, textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 28px rgba(180,100,255,0.9), 0 0 55px rgba(150,80,255,0.7)", duration: 0.4, stagger: 0.04 },
        0.15
      );

      const yOffset = window.innerWidth <= 480 ? 28
                    : window.innerWidth <= 768 ? 36
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
        <Spline scene={sceneUrl} onLoad={onLoad} />
      </div>

      <div className="hero-dark-overlay" ref={darkOverlayRef} />
      <div className="hero-glow-overlay" ref={glowOverlayRef} />
      <div className="hero-gold-overlay" ref={goldOverlayRef} />
      <div className="hero-vignette" />

      <div className="hero-label label-tl" ref={labelTLRef}>
        <span className="label-pulse" />
        Revenue Automation Lab
      </div>
      <div className="hero-label label-tr" ref={labelTRRef}>
        <img src={bhFlag} alt="Bahrain" className="label-flag" />
        Bahrain · 2025
      </div>
      <div className="hero-label label-bl" ref={labelBLRef}>
        Custom Dev · AI Automations
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

      <div className="hero-scroll-hint" ref={scrollHintRef}>
        <span className="scroll-label">Scroll</span>
        <div className="scroll-chevrons">
          <span className="scroll-chev">⌄</span>
          <span className="scroll-chev">⌄</span>
          <span className="scroll-chev">⌄</span>
        </div>
      </div>
    </section>
  );
}
