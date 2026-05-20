import { useEffect, useRef, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedGradient from "../ui/AnimatedGradient";
import "./ScrollVideoSection.css";

gsap.registerPlugin(ScrollTrigger);

const ScrollScene = lazy(() => import("./ScrollScene"));
const WaveGridScene = lazy(() => import("./WaveGridScene"));

interface ScrollVideoSectionProps {
  id?: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  tint?: string;
  /** Spinning glowing ornament above the title */
  ornament?: "spark" | "orb" | "ring" | false;
  /** Fallback WebGL gradient if no specific scene is chosen */
  fallbackGradient?: boolean;
  /** 3D particle tunnel scene */
  particleTunnel?: boolean;
  /** 3D wave grid scene */
  waveGrid?: boolean;
  /** Wave grid variant: "a" violet/mint (default), "b" magenta/violet */
  waveVariant?: "a" | "b";
  className?: string;
}

function OrnamentSVG({ kind }: { kind: "spark" | "orb" | "ring" }) {
  if (kind === "spark") {
    return (
      <svg viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id="sv-orn-spark" x1="0" y1="0" x2="56" y2="56">
            <stop offset="0%" stopColor="#d6c2ff" />
            <stop offset="100%" stopColor="#7c5aff" />
          </linearGradient>
        </defs>
        <path
          d="M28 4 L32 24 L52 28 L32 32 L28 52 L24 32 L4 28 L24 24 Z"
          fill="url(#sv-orn-spark)"
        />
        <circle cx="28" cy="28" r="4" fill="#4af5c0" opacity="0.95" />
      </svg>
    );
  }
  if (kind === "ring") {
    return (
      <svg viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id="sv-orn-ring" x1="0" y1="0" x2="56" y2="56">
            <stop offset="0%" stopColor="#d6c2ff" />
            <stop offset="100%" stopColor="#7c5aff" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r="22" stroke="url(#sv-orn-ring)" strokeWidth="2" fill="none" />
        <circle cx="28" cy="28" r="14" stroke="url(#sv-orn-ring)" strokeWidth="1.4" fill="none" opacity="0.55" />
        <circle cx="28" cy="6" r="3" fill="#4af5c0" />
        <circle cx="50" cy="28" r="2" fill="url(#sv-orn-ring)" />
        <circle cx="28" cy="50" r="2" fill="url(#sv-orn-ring)" opacity="0.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 56 56" fill="none">
      <defs>
        <radialGradient id="sv-orn-orb" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#d6c2ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7c5aff" stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <circle cx="28" cy="28" r="22" fill="url(#sv-orn-orb)" />
      <ellipse cx="22" cy="20" rx="6" ry="3" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}

export default function ScrollVideoSection({
  id,
  eyebrow,
  title,
  subtitle,
  tint = "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(12,7,21,0.25) 0%, rgba(12,7,21,0.7) 100%)",
  ornament = "spark",
  fallbackGradient = true,
  particleTunnel = false,
  waveGrid = false,
  waveVariant = "a",
  className = "",
}: ScrollVideoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(
          ".scroll-video-ornament, .scroll-video-eyebrow, .scroll-video-title, .scroll-video-subtitle",
        ),
        { opacity: 0, y: 30, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`scroll-video-section ${className}`}
      id={id}
    >
      {/* BG LAYER: absolute, fills the section bg behind text */}
      <div className="scroll-video-bg" aria-hidden="true">
        {particleTunnel && (
          <Suspense fallback={null}>
            <ScrollScene triggerRef={sectionRef} />
          </Suspense>
        )}
        {waveGrid && (
          <Suspense fallback={null}>
            <WaveGridScene triggerRef={sectionRef} variant={waveVariant} />
          </Suspense>
        )}
        {!particleTunnel && !waveGrid && fallbackGradient && (
          <div className="scroll-video-gradient">
            <AnimatedGradient
              config={{ preset: "Plasma", speed: 18 }}
              noise={{ opacity: 0.22, scale: 1.2 }}
            />
          </div>
        )}
        <div className="scroll-video-tint" style={{ background: tint }} />
      </div>

      {/* CONTENT LAYER: normal-flow, sizes the section */}
      <div className="scroll-video-overlay">
        {ornament && (
          <div className="scroll-video-ornament" aria-hidden="true">
            <OrnamentSVG kind={ornament} />
          </div>
        )}
        {eyebrow && <div className="scroll-video-eyebrow">{eyebrow}</div>}
        <div className="scroll-video-title">{title}</div>
        {subtitle && <div className="scroll-video-subtitle">{subtitle}</div>}
      </div>
    </section>
  );
}
