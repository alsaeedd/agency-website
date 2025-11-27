import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visualRef.current || !contentRef.current) return;

    gsap.fromTo(
      visualRef.current,
      { scale: 0.85, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      }
    );

    gsap.fromTo(
      contentRef.current.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          <div className="about-visual" ref={visualRef}>
            <video autoPlay muted loop playsInline>
              <source
                src="/assets/Animated_Flame_Like_Hair_Video.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="about-content" ref={contentRef}>
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
