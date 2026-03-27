import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoMain from "../../assets/logo_main.png";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const HEADING_WORDS = ["About", "Us"];

const paragraphs = [
  "Launched in 2025, we began our journey because we saw the vendor struggle first-hand.",
  "So now, we build products and solutions exactly as you need them — full transparency and communication as our priority.",
  "We build your solution as if we literally owned it.",
];

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const innerRef    = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const parasRef    = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const letters  = Array.from(headingRef.current?.querySelectorAll(".ab-letter") ?? []);
      const paras    = parasRef.current.filter((p): p is HTMLParagraphElement => p !== null);
      const isMobile = window.innerWidth <= 768;

      // ── Initial states ──────────────────────────────────────────
      gsap.set(innerRef.current,  { opacity: 0 });
      gsap.set(logoRef.current,   { scale: 0.45, opacity: 0, filter: "blur(24px)" });
      gsap.set(letters,           { opacity: 0, y: 28, scale: 1.7, filter: "blur(14px)" });
      gsap.set(paras,             { opacity: 0, y: 18, filter: "blur(6px)" });

      // ── Pinned scrub timeline ────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? "top 108px" : "top top",
          end:   isMobile ? "+=190%"    : "+=240%",
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // 0 → 0.03  Content wrapper appears
      tl.to(innerRef.current, { opacity: 1, duration: 0.03 }, 0);

      // 0.03 → 0.16  Logo pops in with glow
      tl.to(logoRef.current, {
        scale: 1, opacity: 1, filter: "blur(0px)",
        duration: 0.13,
      }, 0.03);

      // 0.16 → 0.38  Each letter of "ABOUT US" spawns
      letters.forEach((letter, i) => {
        const pos = 0.16 + (i / letters.length) * 0.22;
        tl.to(letter, {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 0.028,
        }, pos);
      });

      // 0.40 → 0.62  Paragraphs reveal
      paras.forEach((para, i) => {
        tl.to(para, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.09,
        }, 0.40 + i * 0.08);
      });

      // 0.65 → 1.0  Slow creep upward
      tl.to(innerRef.current, {
        y: isMobile ? -22 : -45,
        ease: "none",
        duration: 0.35,
      }, 0.65);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-inner" ref={innerRef}>

        <div className="about-logo-wrap" ref={logoRef}>
          <div className="about-logo-glow" />
          <img src={logoMain} alt="RAL" className="about-logo-img" />
        </div>

        <h2 className="about-heading" ref={headingRef}>
          {HEADING_WORDS.map((word, wi) => (
            <span key={wi} className="ab-word">
              {word.split("").map((char, ci) => (
                <span key={ci} className="ab-letter">{char}</span>
              ))}
            </span>
          ))}
        </h2>

        <div className="about-body">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="about-para"
              ref={el => { parasRef.current[i] = el; }}
            >
              {p}
            </p>
          ))}
        </div>

      </div>
    </section>
  );
}
