import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import bhCoatOfArms from "../../assets/bh-coat-of-arms.svg";
import "./Hero.css";

interface HeroProps {
  onContactClick: () => void;
}

export default function Hero({ onContactClick }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-anim]",
        { opacity: 0, y: 24, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.12,
          delay: 0.15,
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero-aurora" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-label" data-hero-anim>
          <span className="hero-label-dot" aria-hidden="true" />
          <img src={bhCoatOfArms} alt="" className="hero-label-crest" />
          <span>Bahrain · 2026 · building</span>
        </div>

        <h1 className="hero-title" data-hero-anim>
          <span className="hero-title-line">Elite software &amp; AI</span>
          <span className="hero-title-line">
            that scales your <span className="hero-title-accent">revenue.</span>
          </span>
        </h1>

        <p className="hero-sub" data-hero-anim>
          Custom software, AI automation, and the glamorous engineering that
          quietly makes the rest of it work.
        </p>

        <div className="hero-cta-row" data-hero-anim>
          <button className="hero-cta" onClick={onContactClick}>
            <span>Build Your Dream Project</span>
            <span className="hero-cta-arrow" aria-hidden="true">→</span>
          </button>
          <a href="#portfolio" className="hero-cta-secondary">
            See the work
          </a>
        </div>
      </div>
    </section>
  );
}
