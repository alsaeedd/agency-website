import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { revealUp, revealWords } from "../lib/reveal";
import "./CTA.css";

interface CTAProps {
  onContactClick: () => void;
}

// Returns "Q3 2026" style label for the NEXT bookable quarter,
// rolling forward automatically as time passes.
function getBookingLabel(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const year = now.getFullYear();
  const currentQuarter = Math.floor(month / 3) + 1; // 1..4
  const nextQuarter = currentQuarter === 4 ? 1 : currentQuarter + 1;
  const nextYear = currentQuarter === 4 ? year + 1 : year;
  return `Q${nextQuarter} ${nextYear}`;
}

export default function CTA({ onContactClick }: CTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      revealUp(".cta-eyebrow", {
        trigger: sectionRef.current,
        start: "top 80%",
        y: 14,
      });

      revealWords(".cta-title .wmask-in", {
        trigger: sectionRef.current,
        start: "top 80%",
        stagger: 0.09,
        delay: 0.1,
      });

      revealUp([".cta-sub", ".cta-btn-wrap"], {
        trigger: sectionRef.current,
        start: "top 80%",
        stagger: 0.14,
        delay: 0.35,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCtaMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  // Cursor-follow ambient on the section bg
  const handleSectionMove = (e: React.MouseEvent<HTMLElement>) => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--cmx", `${x}%`);
    el.style.setProperty("--cmy", `${y}%`);
  };

  return (
    <section className="cta" id="contact" ref={sectionRef} onMouseMove={handleSectionMove}>
      {/* Soft top blend so the section doesn't cut hard */}
      <div className="cta-blend-top" aria-hidden="true" />
      {/* Pure CSS aurora - replaced the WebGL gradient at zero frame cost */}
      <div className="cta-aurora" aria-hidden="true" />
      <div className="cta-grid" aria-hidden="true" />
      <div className="container">
        <div className="cta-content">
          <span className="chip cta-eyebrow">
            <span className="live-dot" aria-hidden="true" />
            Now booking · {getBookingLabel()}
          </span>
          <h2 className="cta-title" aria-label="So, what're we cooking?">
            <span className="wmask"><span className="wmask-in">So,</span></span>{" "}
            <span className="wmask"><span className="wmask-in">what're</span></span>{" "}
            <span className="wmask"><span className="wmask-in">we</span></span>{" "}
            <span className="wmask cta-accent-wmask"><span className="wmask-in serif-accent cta-title-accent">cooking?</span></span>
          </h2>
          <p className="cta-sub">
            One quick chat, no decks, no pricing tables. Send us a few lines
            and we'll pick it up on WhatsApp.
          </p>
          <div className="cta-btn-wrap">
            <button
              className="btn-cta-large"
              ref={buttonRef}
              onClick={onContactClick}
              onMouseMove={handleCtaMove}
            >
              <span className="btn-cta-large-label">Tell us about it</span>
              <span className="btn-cta-large-arrow" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10h12" />
                  <path d="M11 5l5 5-5 5" />
                </svg>
              </span>
            </button>
            <p className="cta-local">
              We're in Manama, and probably online right now.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
