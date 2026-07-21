import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import bhCoatOfArms from "../../assets/bh-coat-of-arms.svg";
import HeroStatus from "./ui/HeroStatus";
import "./Hero.css";

interface HeroProps {
  onContactClick: () => void;
}

const tickerItems = [
  "Custom software",
  "Event-driven backends",
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
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cyclerRef = useRef<HTMLSpanElement>(null);

  // ── Adaptive perf gate ─────────────────────────────────────────────
  // filter:blur keyframes are gorgeous on a 4090, ugly on a $120 Android:
  // each tweened blur frame is a full-layer GPU re-rasterization. On
  // non-high tiers we run the same animations with only opacity+translate.
  const heroPerf = (() => {
    if (typeof document === "undefined")
      return { useBlur: true, isCoarse: false };
    const tier = document.documentElement.dataset.tier;
    const coarse =
      typeof matchMedia === "function" &&
      matchMedia("(pointer: coarse)").matches;
    return { useBlur: tier === "high" && !coarse, isCoarse: coarse };
  })();

  // The preloader waits on "ral:hero-ready". The hero is pure CSS/GSAP now
  // (the WebGL scene was retired in the 2026 redesign) - the atmosphere is
  // painted with the first frame, so signal readiness immediately.
  useEffect(() => {
    window.dispatchEvent(new Event("ral:hero-ready"));
  }, []);

  // Word cycler (revenue → pipelines → margins → ...). Two stacked layers
  // crossfade/slide SIMULTANEOUSLY so words bridge with no blank gap, and the
  // wrapper width is tweened to the next word so the neighbouring "your" glides
  // instead of snapping. No overflow clip → descenders are never cut on iOS.
  useEffect(() => {
    const wrap = cyclerRef.current;
    if (!wrap) return;
    const sizer = wrap.querySelector<HTMLElement>(".hero-cycler-sizer");
    const layers = Array.from(
      wrap.querySelectorAll<HTMLElement>(".hero-cycler-word"),
    );
    if (!sizer || layers.length < 2) return;

    let idx = 0;
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    const reduce =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blur = heroPerf.useBlur ? "blur(5px)" : "blur(0px)";

    // Which layer is showing is derived from idx parity (no swap state that can
    // desync): even idx → layers[0], odd idx → layers[1]. The wrapper carries an
    // explicit width at all times so the neighbouring "your" glides; we tween it
    // each cycle and never clear it, so layout never depends on a callback firing.
    sizer.textContent = CYCLE_WORDS[0];
    gsap.set(layers[1], { autoAlpha: 0 });
    gsap.set(wrap, { width: layers[0].offsetWidth });
    // The cycler is set in Newsreader italic - if the serif arrives after
    // mount, the width measured above is stale until the first cycle.
    // Re-measure once the fonts settle.
    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts
      ?.ready;
    fontsReady?.then(() => {
      if (wrap.isConnected) gsap.set(wrap, { width: layers[0].offsetWidth });
    });

    const cycle = () => {
      const prevIdx = idx;
      idx = (idx + 1) % CYCLE_WORDS.length;
      const word = CYCLE_WORDS[idx];
      const inLayer = layers[idx % 2];
      const outLayer = layers[prevIdx % 2];
      inLayer.textContent = word;
      const endW = inLayer.offsetWidth; // absolute layer ⇒ natural width

      if (reduce) {
        gsap.set(outLayer, { autoAlpha: 0 });
        gsap.set(inLayer, { autoAlpha: 1, yPercent: 0, filter: "blur(0px)" });
        gsap.set(wrap, { width: endW });
        return;
      }

      gsap.set(inLayer, { yPercent: 45, autoAlpha: 0, filter: blur });

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        // old word lifts up + fades out
        .to(
          outLayer,
          { yPercent: -45, autoAlpha: 0, filter: blur, duration: 0.42, ease: "power2.in" },
          0,
        )
        // wrapper width glides → "your" slides over smoothly
        .to(wrap, { width: endW, duration: 0.62 }, 0)
        // new word rises in, overlapping the exit so they bridge (no blank)
        .to(inLayer, { yPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.62 }, 0.18);
    };

    const start = () => {
      clearInterval(interval);
      interval = setInterval(cycle, 2800);
    };
    const onVis = () => {
      if (document.hidden) clearInterval(interval);
      else start();
    };

    timeout = setTimeout(() => {
      start();
      document.addEventListener("visibilitychange", onVis);
    }, 3200);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
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
      <div className="hero-beams" aria-hidden="true" />
      <div className="hero-grid" ref={gridRef} aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />

      <div className="hero-particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`hero-particle hero-particle-${i % 5}`} />
        ))}
      </div>

      <div className="hero-year" aria-hidden="true">
        <span className="hero-year-line" />
        <span className="hero-year-text">RAL · MMXXVI</span>
        <span className="hero-year-line" />
      </div>

      <div className="hero-inner">
        <div className="hero-label" data-hero-anim>
          <span className="live-dot" aria-hidden="true" />
          <img src={bhCoatOfArms} alt="" className="hero-label-crest" />
          <span>
            Bahrain&nbsp;·&nbsp;GMT+3
            <span className="hero-label-tail">&nbsp;·&nbsp;<HeroStatus /></span>
          </span>
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
            <span className="hero-cycler" ref={cyclerRef}>
              {/* in-flow, invisible: sets the wrapper's natural width + baseline
                  so the two absolute layers sit where inline text would */}
              <span className="hero-cycler-sizer" aria-hidden="true">revenue.</span>
              {/* two layers crossfade simultaneously - no blank gap */}
              <span className="hero-cycler-word hero-title-accent" aria-hidden="true">revenue.</span>
              <span className="hero-cycler-word hero-title-accent" aria-hidden="true" />
            </span>
          </span>
        </h1>

        <p className="hero-sub" data-hero-anim>
          We take your idea from a conversation to a complete product running
          in production. And we build it like we own it.
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
          <a href="#portfolio" className="hero-cta-secondary">
            <span>See the work</span>
            <span aria-hidden="true" className="hero-cta-secondary-arrow">↗</span>
          </a>
        </div>

        <div className="hero-stats" data-hero-anim>
          <div className="hero-stat">
            <span className="hero-stat-num">12+</span>
            <span className="hero-stat-label">Brands shipped for</span>
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
