import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedText from "./AnimatedText";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visualRef.current || !contentRef.current) return;

    gsap.fromTo(
      visualRef.current,
      { scale: 0.92, opacity: 0, filter: "blur(10px)" },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      },
    );

    gsap.fromTo(
      contentRef.current.children,
      { y: 28, opacity: 0, filter: "blur(6px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 82%",
          once: true,
        },
      },
    );
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          <div className="about-visual" ref={visualRef}>
            <img src="/assets/logo_main.png" alt="Logo" />
          </div>
          <div className="about-content" ref={contentRef}>
            <AnimatedText as="h2" className="section-title" triggerOnScroll stagger={0.1}>
              About us
            </AnimatedText>
            <div className="about-text">
              <p>
                Launched in 2025, we began our journey because we saw the vendor
                struggle first-hand.
              </p>
              <p>
                So now, we build products and solutions exactly as you need
                them, with full transparency and communication as our priority.
              </p>
              <p>We build your solution as if we literally owned it.</p>
            </div>
            {/* <a href="#services" className="btn-cta" data-cursor="hover">
              <span>What we do</span>
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}
