import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import AnimatedText from "./AnimatedText";
import AnimatedGradient from "./ui/AnimatedGradient";
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
    if (!buttonRef.current) return;

    const tier = document.documentElement.dataset.tier;
    const isWeak =
      tier !== "high" ||
      (typeof matchMedia === "function" &&
        matchMedia("(pointer: coarse)").matches);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: isWeak ? 0.6 : 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            once: true,
          },
          delay: isWeak ? 0.1 : 0.3,
        }
      );

      gsap.from(".cta-eyebrow", {
        opacity: 0,
        y: 12,
        duration: isWeak ? 0.45 : 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          once: true,
        },
      });

      gsap.from(".cta-sub", {
        opacity: 0,
        y: 16,
        duration: isWeak ? 0.55 : 0.9,
        ease: "expo.out",
        delay: isWeak ? 0.15 : 0.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          once: true,
        },
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
      {/* Animated WebGL gradient bg - brand-tinted, kept dim so text reads */}
      <div className="cta-gradient-wrap" aria-hidden="true">
        <AnimatedGradient config={{ preset: "Plasma", speed: 14 }} noise={{ opacity: 0.18, scale: 1.2 }} />
      </div>
      <div className="container">
        <div className="cta-content">
          <span className="cta-eyebrow">
            <span className="cta-eyebrow-dot" aria-hidden="true" />
            Now booking · {getBookingLabel()}
          </span>
          <AnimatedText
            as="h2"
            className="cta-title"
            triggerOnScroll
            stagger={0.15}
          >
            What're we cooking?
          </AnimatedText>
          <p className="cta-sub">
            One quick chat, no decks, no pricing tables. Send us a few lines and we'll pick it up on WhatsApp.
          </p>
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
        </div>
      </div>
    </section>
  );
}
