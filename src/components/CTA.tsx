import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import AnimatedText from "./AnimatedText";
import "./CTA.css";

interface CTAProps {
  onContactClick: () => void;
}

export default function CTA({ onContactClick }: CTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            once: true,
          },
          delay: 0.3,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cta" id="contact" ref={sectionRef}>
      <div className="container">
        <div className="cta-content">
          <AnimatedText
            as="h2"
            className="cta-title"
            triggerOnScroll
            stagger={0.15}
          >
            Have a project?
          </AnimatedText>
          <button
            className="btn-cta-large"
            ref={buttonRef}
            onClick={onContactClick}
          >
            <span>TELL US</span>
          </button>
        </div>
      </div>
    </section>
  );
}
