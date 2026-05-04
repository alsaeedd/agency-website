import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoMain from "../../assets/logo_main.png";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const paragraphs = [
  "Launched in 2025, we began our journey because we saw the vendor struggle first-hand.",
  "So now, we build products and solutions exactly as you need them, with full transparency and communication as our priority.",
  "We build your solution as if we literally owned it.",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const parasRef   = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const paras = parasRef.current.filter((p): p is HTMLParagraphElement => p !== null);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(logoRef.current,
        { opacity: 0, y: 24, scale: 0.92, duration: 0.9, ease: "expo.out" }
      )
      .from(headingRef.current,
        { opacity: 0, y: 28, duration: 1.0, ease: "expo.out" },
        "-=0.55"
      )
      .from(paras,
        { opacity: 0, y: 16, duration: 0.8, ease: "expo.out", stagger: 0.1 },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-inner">

        <div className="about-logo-wrap" ref={logoRef}>
          <div className="about-logo-glow" />
          <img src={logoMain} alt="RAL" className="about-logo-img" />
        </div>

        <h2 className="about-heading" ref={headingRef}>About Us</h2>

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
