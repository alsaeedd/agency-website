import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoMain from "../../assets/logo_main.png";
import bhCoatOfArms from "../../assets/bh-coat-of-arms.svg";
import { ContainerScroll } from "./ui/ContainerScroll";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const paragraphs = [
  "Launched in 2025, we started this because we'd watched too many friends pay six figures for software that didn't ship, or shipped broken.",
  "So we built the agency we wished we'd been able to hire - weekly check-ins on real channels, code you can actually read, and zero black boxes.",
  "We build your solution as if we literally owned it.",
];

const splitToWords = (text: string) =>
  text.split(/(\s+)/).map((token, i) =>
    /^\s+$/.test(token) ? (
      <span key={`s-${i}`}> </span>
    ) : (
      <span key={`w-${i}`} className="about-word">
        <span className="about-word-in">{token}</span>
      </span>
    ),
  );

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ghostRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const tier = document.documentElement.dataset.tier;
    const isWeak =
      tier !== "high" ||
      (typeof matchMedia === "function" &&
        matchMedia("(pointer: coarse)").matches);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          // "top bottom" fires the moment the section's top crosses the
          // viewport bottom — earliest possible reliable trigger. The
          // Preloader's dismiss() runs ScrollTrigger.refresh() so cached
          // positions are correct against the final post-load layout.
          start: "top bottom",
          once: true,
        },
      });

      // Mobile: snappy entrance (no filter:blur, short durations, tight
      // stagger). Desktop: full cinematic timeline. Both versions actually
      // PLAY (no more "mobile = nothing").
      tl.from(ghostRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: isWeak ? 0.55 : 1.4,
        ease: "expo.out",
      })
        .from(
          logoRef.current,
          {
            opacity: 0,
            y: 20,
            scale: 0.94,
            duration: isWeak ? 0.45 : 0.9,
            ease: "expo.out",
          },
          isWeak ? "-=0.45" : "-=1.1",
        )
        .from(
          ".about-heading .about-word-in",
          {
            yPercent: 110,
            opacity: 0,
            duration: isWeak ? 0.5 : 0.9,
            ease: "expo.out",
            stagger: isWeak ? 0.025 : 0.06,
          },
          isWeak ? "-=0.3" : "-=0.6",
        )
        .from(
          ".about-body .about-word-in",
          {
            yPercent: 110,
            opacity: 0,
            duration: isWeak ? 0.4 : 0.7,
            ease: "expo.out",
            stagger: isWeak ? 0.004 : 0.012,
          },
          isWeak ? "-=0.3" : "-=0.6",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      {/* Rotating concentric text rings - a "mission seal" centerpiece */}
      <svg
        ref={ghostRef}
        className="about-rings"
        viewBox="0 0 800 800"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="about-ring-grad" x1="0" y1="0" x2="800" y2="800">
            <stop offset="0%" stopColor="#d6c2ff" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c5aff" />
          </linearGradient>
          <path
            id="about-ring-outer-path"
            d="M 400, 400 m -340, 0 a 340,340 0 1,1 680,0 a 340,340 0 1,1 -680,0"
          />
          <path
            id="about-ring-inner-path"
            d="M 400, 400 m -220, 0 a 220,220 0 1,1 440,0 a 220,220 0 1,1 -440,0"
          />
        </defs>

        {/* Faint border circles */}
        <circle cx="400" cy="400" r="340" fill="none" stroke="rgba(167,139,250,0.12)" strokeWidth="1" />
        <circle cx="400" cy="400" r="220" fill="none" stroke="rgba(167,139,250,0.08)" strokeWidth="1" />

        <g className="about-ring about-ring-outer">
          <text fill="url(#about-ring-grad)" fontSize="22" fontWeight="600" letterSpacing="10">
            <textPath href="#about-ring-outer-path" startOffset="0">
              BUILT IN BAHRAIN · SHIPPED WORLDWIDE · BUILT IN BAHRAIN · SHIPPED WORLDWIDE ·
            </textPath>
          </text>
        </g>

        <g className="about-ring about-ring-inner">
          <text fill="rgba(167,139,250,0.55)" fontSize="14" fontWeight="500" letterSpacing="8">
            <textPath href="#about-ring-inner-path" startOffset="0">
              RAL TECHNOLOGIES · MMXXVI · FOUNDER-LED · END-TO-END · RAL TECHNOLOGIES · MMXXVI ·
            </textPath>
          </text>
        </g>
      </svg>

      <div className="about-ambient" aria-hidden="true" />
      <div className="about-stars" aria-hidden="true" />

      <div className="about-inner">
        <span className="about-eyebrow">
          <span className="about-eyebrow-num">02</span>
          <span className="about-eyebrow-divider" aria-hidden="true" />
          <span>Who we are</span>
        </span>

        <div className="about-logo-wrap" ref={logoRef}>
          <div className="about-logo-glow" />
          <img src={logoMain} alt="RAL" className="about-logo-img" />
        </div>

        <h2 className="about-heading" ref={headingRef}>
          {splitToWords("About Us")}
        </h2>

        <div className="about-body">
          {paragraphs.map((p, i) => (
            <p key={i} className="about-para">
              {splitToWords(p)}
            </p>
          ))}
        </div>
      </div>

      {/* Sexy scroll-driven 3D preview card */}
      <ContainerScroll
        titleComponent={
          <div className="about-cscroll-title">
            <span className="about-cscroll-eyebrow">
              <span className="about-cscroll-dot" aria-hidden="true" />
              The team behind it
            </span>
            <h3 className="about-cscroll-headline">
              Built in Bahrain. <br />
              <span className="about-cscroll-headline-accent">
                Shipped to the world.
              </span>
            </h3>
          </div>
        }
      >
        <div className="about-cscroll-stage">
          <img
            src={bhCoatOfArms}
            alt=""
            aria-hidden="true"
            className="about-cscroll-crest"
            loading="lazy"
            decoding="async"
          />
          <div className="about-cscroll-overlay">
            <span className="about-cscroll-tag">
              <span className="about-cscroll-tag-dot" /> Bahrain · GMT+3 · live
            </span>
            <p className="about-cscroll-quote">
              &ldquo;We treat every project like a flagship. <br />
              No exceptions.&rdquo;
            </p>
            <span className="about-cscroll-sig">- The RAL Team</span>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
