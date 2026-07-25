import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import bhCoatOfArms from "../../assets/bh-coat-of-arms.svg";
import { revealUp } from "../lib/reveal";
import "./Interlude.css";

interface InterludeProps {
  id?: string;
  /** Contents of the pill chip (pair with <span className="live-dot" />) */
  eyebrow: React.ReactNode;
  /** Statement headline - use <span className="serif-accent"> inside */
  title: React.ReactNode;
  sub?: React.ReactNode;
  /** Faint Bahrain crest behind the statement */
  crest?: boolean;
}

/**
 * Interlude - a quiet chapter-break between sections. Pure CSS
 * atmosphere (aurora + masked grid + hairlines); replaced the old
 * WebGL wave-grid scenes with zero per-frame cost. Content-sized,
 * never viewport-sized.
 */
export default function Interlude({
  id,
  eyebrow,
  title,
  sub,
  crest = false,
}: InterludeProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      revealUp(section.querySelectorAll("[data-il-reveal]"), {
        trigger: section,
        start: "top 80%",
        stagger: 0.12,
      });
      if (crest) {
        const crestEl = section.querySelector(".interlude-crest");
        if (crestEl) {
          // Settles at 0.09 - a ghost watermark, never competing with type.
          gsap.fromTo(
            crestEl,
            { opacity: 0, scale: 0.92 },
            {
              opacity: 0.09,
              scale: 1,
              duration: 1.6,
              ease: "expo.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                once: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [crest]);

  return (
    <section
      ref={sectionRef}
      className={`interlude${crest ? " has-crest" : ""}`}
      id={id}
    >
      <div className="interlude-aurora" aria-hidden="true" />
      <div className="interlude-grid" aria-hidden="true" />
      {crest && (
        <img
          src={bhCoatOfArms}
          alt=""
          aria-hidden="true"
          className="interlude-crest"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="interlude-inner">
        <span className="chip interlude-chip" data-il-reveal>
          {eyebrow}
        </span>
        <h2 className="interlude-title" data-il-reveal>
          {title}
        </h2>
        {sub && (
          <p className="interlude-sub" data-il-reveal>
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}
