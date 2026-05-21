import { useEffect, useRef, lazy, Suspense } from "react";
import { gsap } from "gsap";
import bhCoatOfArms from "../../assets/bh-coat-of-arms.svg";
import "./Hero.css";

// Lazy-load the Three.js scene (keeps initial bundle lean)
const HeroScene = lazy(() => import("./HeroScene"));

interface HeroProps {
  onContactClick: () => void;
}

const tickerItems = [
  "Custom software",
  "AI automations",
  "Production deploys",
  "Real CRMs",
  "Bahrain · GMT+3",
  "Replying in ~2h",
  "Founder-led",
  "End-to-end",
];

const CYCLE_WORDS = [
  "revenue.",
  "pipelines.",
  "margins.",
  "output.",
];

// Split a phrase into <word><letter><letter></word> structure so words stay together but letters animate.
const buildPhrase = (text: string, accentClass?: string): JSX.Element[] => {
  return text.split(/(\s+)/).map((token, wi) => {
    if (token === "") return <span key={`w-${wi}`} />;
    if (/^\s+$/.test(token)) {
      return <span key={`w-${wi}`} className="hero-space"> </span>;
    }
    return (
      <span key={`w-${wi}`} className="hero-word">
        {token.split("").map((char, ci) => (
          <span key={`c-${wi}-${ci}`} className="hero-letter">
            <span
              className={`hero-letter-in ${accentClass ?? ""}`}
              data-final={char}
            >
              {char}
            </span>
          </span>
        ))}
      </span>
    );
  });
};

export default function Hero({ onContactClick }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const aurora2Ref = useRef<HTMLDivElement>(null);
  const blobRef = useRef<SVGSVGElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // ── Adaptive perf gate ─────────────────────────────────────────────
  // The `filter: blur(...)` keyframes below are gorgeous on a 4090, ugly on
  // a $120 Android: each tweened blur(8px → 0) frame is a full-screen GPU
  // re-rasterization. On non-high tiers we run the same animations with
  // only opacity + translate — composited operations the GPU loves.
  const heroPerf = (() => {
    if (typeof document === "undefined") return { useBlur: true };
    const tier = document.documentElement.dataset.tier;
    const coarse =
      typeof matchMedia === "function" &&
      matchMedia("(pointer: coarse)").matches;
    return { useBlur: tier === "high" && !coarse };
  })();

  // Word cycler on the accent word (revenue → pipelines → margins → ...)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    let idx = 0;
    const cyclerBlur = heroPerf.useBlur ? "blur(6px)" : "blur(0px)";

    const cycle = () => {
      const el = document.querySelector<HTMLElement>(".hero-cycler-text");
      if (!el) return;
      idx = (idx + 1) % CYCLE_WORDS.length;
      const next = CYCLE_WORDS[idx];

      gsap
        .timeline()
        .to(el, {
          yPercent: -110,
          opacity: 0,
          filter: cyclerBlur,
          duration: 0.42,
          ease: "expo.in",
        })
        .call(() => {
          el.textContent = next;
        })
        .fromTo(
          el,
          { yPercent: 110, opacity: 0, filter: cyclerBlur },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "expo.out",
          },
        );
    };

    timeout = setTimeout(() => {
      interval = setInterval(cycle, 2800);
    }, 3200);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  // Letter mask reveal on load - clean cascading slide-up
  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = titleRef.current?.querySelectorAll<HTMLElement>(
        ".hero-letter-in",
      );
      if (!letters) return;

      const letterBlur = heroPerf.useBlur ? "blur(8px)" : "blur(0px)";

      gsap.fromTo(
        letters,
        { yPercent: 130, opacity: 0, filter: letterBlur },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: heroPerf.useBlur ? 1.2 : 0.8,
          ease: "expo.out",
          stagger: heroPerf.useBlur ? 0.022 : 0.012,
          delay: 0.2,
        },
      );

      gsap.fromTo(
        "[data-hero-anim]",
        { opacity: 0, y: 22, filter: letterBlur },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: heroPerf.useBlur ? 1 : 0.7,
          ease: "expo.out",
          stagger: heroPerf.useBlur ? 0.09 : 0.05,
          delay: 0.18,
        },
      );

      gsap.fromTo(
        ".hero-year",
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1.4, ease: "expo.out", delay: 0.95 },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Mouse parallax on atmosphere (light, RAF-throttled)
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let needsFrame = false;

    const apply = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (auroraRef.current) {
        auroraRef.current.style.setProperty("--mpx", `${cx * 30}px`);
        auroraRef.current.style.setProperty("--mpy", `${cy * 20}px`);
      }
      if (aurora2Ref.current) {
        aurora2Ref.current.style.setProperty("--mpx", `${cx * -44}px`);
        aurora2Ref.current.style.setProperty("--mpy", `${cy * -28}px`);
      }
      if (blobRef.current) {
        blobRef.current.style.setProperty("--mpx", `${cx * 18}px`);
        blobRef.current.style.setProperty("--mpy", `${cy * 12}px`);
      }
      if (gridRef.current) {
        gridRef.current.style.setProperty("--mpx", `${cx * 8}px`);
        gridRef.current.style.setProperty("--mpy", `${cy * 5}px`);
      }
      if (needsFrame || Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(apply);
      } else {
        raf = 0;
      }
      needsFrame = false;
    };

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      needsFrame = true;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const handleCtaMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const localX = e.clientX - r.left;
    const localY = e.clientY - r.top;
    el.style.setProperty("--mx", `${localX}px`);
    el.style.setProperty("--my", `${localY}px`);
    const dx = (localX / r.width - 0.5) * 16;
    const dy = (localY / r.height - 0.5) * 12;
    el.style.setProperty("--magX", `${dx}px`);
    el.style.setProperty("--magY", `${dy}px`);
  };

  const handleCtaLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--magX", `0px`);
    el.style.setProperty("--magY", `0px`);
  };

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero-aurora" ref={auroraRef} aria-hidden="true" />
      <div className="hero-aurora hero-aurora-2" ref={aurora2Ref} aria-hidden="true" />

      {/* Liquid SVG blob layer with goo + displacement (Lusion-style without WebGL) */}
      <svg
        ref={blobRef}
        className="hero-blob"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="blob-violet" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#cf9bff" stopOpacity="1" />
            <stop offset="45%" stopColor="#8b5fff" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#5a2cff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-pink" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#ff7ad6" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#c441f0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#a73fe0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-cyan" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#74d6ff" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#5cb0ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4af5c0" stopOpacity="0" />
          </radialGradient>

          {/* Goo / gooify filter - merges overlapping blobs into a single liquid mass */}
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0  0
                0 1 0 0  0
                0 0 1 0  0
                0 0 0 22 -10
              "
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>

          {/* Liquid displacement - turbulent noise warps the blobs */}
          <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.011 0.018"
              numOctaves="2"
              seed="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="36s"
                values="0.011 0.018; 0.018 0.012; 0.011 0.018"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="65"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g className="hero-blob-group" filter="url(#liquid)">
          <g filter="url(#goo)">
            <ellipse cx="360" cy="240" rx="340" ry="290" fill="url(#blob-violet)" className="hero-blob-1" />
            <ellipse cx="880" cy="220" rx="320" ry="260" fill="url(#blob-pink)"   className="hero-blob-2" />
            <ellipse cx="640" cy="560" rx="360" ry="240" fill="url(#blob-violet)" className="hero-blob-3" />
            <ellipse cx="220" cy="640" rx="280" ry="200" fill="url(#blob-pink)"   className="hero-blob-4" opacity="0.7" />
            <ellipse cx="1000" cy="600" rx="240" ry="180" fill="url(#blob-cyan)"  className="hero-blob-5" />
          </g>
        </g>
      </svg>

      <div className="hero-grid" ref={gridRef} aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />

      <div className="hero-particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className={`hero-particle hero-particle-${i % 5}`} />
        ))}
      </div>

      {/* WebGL physics scene - floating iridescent geometry with cursor magnet */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      <div className="hero-year" aria-hidden="true">
        <span className="hero-year-line" />
        <span className="hero-year-text">RAL · MMXXVI</span>
        <span className="hero-year-line" />
      </div>

      <div className="hero-inner">
        <div className="hero-label" data-hero-anim>
          <span className="hero-label-dot" aria-hidden="true" />
          <img src={bhCoatOfArms} alt="" className="hero-label-crest" />
          <span>Bahrain · 2026 · currently building</span>
        </div>

        <h1
          className="hero-title"
          ref={titleRef}
          aria-label="Elite software and AI that scales your revenue."
        >
          <span className="hero-title-line">
            {buildPhrase("Elite software & AI")}
          </span>
          <span className="hero-title-line">
            {buildPhrase("that scales your ")}
            <span className="hero-cycler">
              <span className="hero-cycler-text hero-title-accent">revenue.</span>
            </span>
          </span>
        </h1>

        <p className="hero-sub" data-hero-anim>
          Custom software &amp; AI automations, shipped end-to-end by a small team that actually ships.
        </p>

        <div className="hero-cta-row" data-hero-anim>
          <button
            ref={ctaRef}
            className="hero-cta"
            onClick={onContactClick}
            onMouseMove={handleCtaMove}
            onMouseLeave={handleCtaLeave}
          >
            <span className="hero-cta-label">Build your dream project</span>
            <span className="hero-cta-arrow" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10h12" />
                <path d="M11 5l5 5-5 5" />
              </svg>
            </span>
          </button>
          <a href="#clients" className="hero-cta-secondary">
            <span>See the work</span>
            <span aria-hidden="true" className="hero-cta-secondary-arrow">↗</span>
          </a>
        </div>

        <div className="hero-stats" data-hero-anim>
          <div className="hero-stat">
            <span className="hero-stat-num">Dozens of</span>
            <span className="hero-stat-label">Projects shipped</span>
          </div>
          <span className="hero-stat-divider" aria-hidden="true" />
          <div className="hero-stat">
            <span className="hero-stat-num">~2h</span>
            <span className="hero-stat-label">Avg reply time</span>
          </div>
          <span className="hero-stat-divider" aria-hidden="true" />
          <div className="hero-stat">
            <span className="hero-stat-num">100%</span>
            <span className="hero-stat-label">In-house, end-to-end</span>
          </div>
        </div>
      </div>

      <div className="hero-ticker" aria-hidden="true" data-hero-anim>
        <div className="hero-ticker-track">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="hero-ticker-item">
              <span className="hero-ticker-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-scrollcue" aria-hidden="true" data-hero-anim>
        <span className="hero-scrollcue-line" />
        <span className="hero-scrollcue-text">scroll</span>
      </div>
    </section>
  );
}
