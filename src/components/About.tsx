import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoMain from "../../assets/logo_main.png";
import { isWeakDevice } from "../lib/reveal";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const paragraphs = [
  "Launched in 2025, we started this because we'd watched too many friends pay six figures for software that didn't ship, or shipped broken.",
  "So we built the agency we wished we'd been able to hire: weekly check-ins on real channels, code you can actually read, and a bill that matches the quote.",
];

const PULL_QUOTE = "We build your solution as if we literally owned it.";

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
  const auraRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const isWeak = isWeakDevice();

    const ctx = gsap.context(() => {
      // Explicit hidden initial state, applied pre-paint (useLayoutEffect) so
      // there's no flash. Using gsap.set + .to (NOT .from) makes the reveal
      // deterministic: when the trigger activates it PLAYS the tween from 0,
      // instead of snapping straight to the finished state on a late
      // ScrollTrigger.refresh() after the preloader dismisses.
      gsap.set(auraRef.current, { opacity: 0, scale: 0.94 });
      gsap.set(logoRef.current, { opacity: 0, y: 20, scale: 0.94 });
      gsap.set(".about-eyebrow", { opacity: 0, y: 14 });
      gsap.set(".about-heading", { opacity: 0, y: 30 });
      gsap.set(".about-body .about-word-in", {
        yPercent: 110,
        opacity: 0,
      });
      gsap.set(".about-quote", { opacity: 0, y: 26, scale: 0.985 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(auraRef.current, {
        opacity: 1,
        scale: 1,
        duration: isWeak ? 0.55 : 1.4,
        ease: "expo.out",
      })
        .to(
          ".about-eyebrow",
          { opacity: 1, y: 0, duration: isWeak ? 0.4 : 0.7, ease: "expo.out" },
          isWeak ? "-=0.45" : "-=1.2",
        )
        .to(
          logoRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isWeak ? 0.45 : 0.9,
            ease: "expo.out",
          },
          isWeak ? "-=0.35" : "-=1.05",
        )
        .to(
          ".about-heading",
          {
            opacity: 1,
            y: 0,
            duration: isWeak ? 0.5 : 1.0,
            ease: "expo.out",
          },
          isWeak ? "-=0.3" : "-=0.6",
        )
        .to(
          ".about-body .about-word-in",
          {
            yPercent: 0,
            opacity: 1,
            duration: isWeak ? 0.4 : 0.7,
            ease: "expo.out",
            stagger: isWeak ? 0.004 : 0.012,
          },
          isWeak ? "-=0.3" : "-=0.6",
        )
        .to(
          ".about-quote",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isWeak ? 0.5 : 1.1,
            ease: "expo.out",
          },
          isWeak ? "-=0.2" : "-=0.35",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      {/* Static centerpiece aura - one layer, composited once. */}
      <div ref={auraRef} className="about-aura" aria-hidden="true" />
      <div className="about-ambient" aria-hidden="true" />
      <div className="about-stars" aria-hidden="true" />

      <div className="about-inner">
        <span className="eyebrow about-eyebrow">
          <span className="eyebrow-num">02</span>
          <span className="eyebrow-rule" aria-hidden="true" />
          <span>Who we are</span>
        </span>

        <div className="about-logo-wrap" ref={logoRef}>
          <div className="about-logo-glow" />
          <img src={logoMain} alt="RAL" className="about-logo-img" />
        </div>

        {/* No per-word masks here - the heading's purple glow would get
            clipped into visible rectangles at each word boundary. It
            rises as one piece instead. */}
        <h2 className="about-heading">The short version.</h2>

        <div className="about-body">
          {paragraphs.map((p, i) => (
            <p key={i} className="about-para">
              {splitToWords(p)}
            </p>
          ))}
        </div>

        {/* The line everything else hangs off - set in the founder's hand */}
        <blockquote className="about-quote">
          <p>{PULL_QUOTE}</p>
        </blockquote>
      </div>
    </section>
  );
}
