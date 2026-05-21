import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ContainerScroll.css";

gsap.registerPlugin(ScrollTrigger);

interface ContainerScrollProps {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Scroll-driven 3D card reveal — the "iPad-style tilt".
 *
 * Rewritten away from framer-motion (was useScroll + useSpring + 3
 * useTransforms, an expensive per-frame pipeline) to a single GSAP
 * ScrollTrigger with scrub. Same visual, fraction of the cost. The tilt now
 * runs on EVERY device — mobile included — because GSAP only updates while
 * the section is in the scroll range and uses cheap GPU transforms.
 *
 * Cheaper still on weak tiers (low/med):
 *  - smaller rotation arc (12deg instead of 22deg)
 *  - drops to a 1-layer shadow
 *  - skip the spring-like smoothing (lower scrub value)
 *
 * High-tier desktop keeps the original buttery cinematic feel.
 */
export const ContainerScroll: React.FC<ContainerScrollProps> = ({
  titleComponent,
  children,
}) => {
  const shellRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shellRef.current || !cardRef.current || !headerRef.current) return;

    const tier = document.documentElement.dataset.tier;
    const isWeak =
      tier === "low" ||
      tier === "med" ||
      (typeof matchMedia === "function" &&
        matchMedia("(pointer: coarse)").matches);

    // High-tier: dramatic 22deg roll, buttery scrub. Weak tier: subtler 12deg
    // tilt with no scrub smoothing — still tilts, just snappy.
    const startRotate = isWeak ? 12 : 22;
    const startScale = isWeak ? 0.96 : 1.04;
    const headerTravel = isWeak ? -40 : -80;
    const scrubValue = isWeak ? true : 0.6;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(cardRef.current, {
        rotateX: startRotate,
        scale: startScale,
        transformPerspective: 1200,
        transformOrigin: "center top",
      });
      gsap.set(headerRef.current, { y: 0 });

      // Card: scroll-driven roll + scale to its natural state.
      gsap.to(cardRef.current, {
        rotateX: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: shellRef.current,
          start: "top bottom",
          end: "center center",
          scrub: scrubValue,
          invalidateOnRefresh: true,
        },
      });

      // Header: small parallax lift.
      gsap.to(headerRef.current, {
        y: headerTravel,
        ease: "none",
        scrollTrigger: {
          trigger: shellRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: scrubValue,
          invalidateOnRefresh: true,
        },
      });
    }, shellRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={shellRef} className="cscroll-shell">
      <div className="cscroll-stage">
        <div ref={headerRef} className="cscroll-header">
          {titleComponent}
        </div>
        <div ref={cardRef} className="cscroll-card">
          <div className="cscroll-card-inner">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ContainerScroll;
