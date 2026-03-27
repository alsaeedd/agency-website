import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Services.css";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    title: "Websites",
    description:
      "Clean, fast, and built to convert. From landing pages to full web experiences.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Systems",
    description:
      "Backend infrastructure, APIs, and databases engineered to scale with your business.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Apps",
    description:
      "Web and mobile applications, designed with care and shipped with confidence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "AI",
    description:
      "Automations and AI agents that save time, cut costs, and generate revenue.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export default function Services() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const rowsRef     = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const rows = rowsRef.current.filter((r): r is HTMLDivElement => r !== null);

      // Header drops in as section enters view — before pin locks
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0, filter: "blur(5px)" },
        {
          y: 0, opacity: 1, filter: "blur(0px)",
          duration: 0.9, ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      gsap.set(rows, { y: -80, opacity: 0, filter: "blur(6px)" });

      const isMobile = window.innerWidth <= 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? "top 108px" : "top top",
          end: isMobile ? "+=160%" : "+=200%",
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      rows.forEach((row, i) => {
        tl.to(row, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.16 }, i * 0.21);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="container">

        <div className="services-header" ref={headerRef}>
          <span className="services-eyebrow">What we build</span>
          <h2 className="services-heading">Some of our services</h2>
          <p className="services-intro">
            From simple websites to robust AI automations, we design and build exactly what you need.
          </p>
        </div>

        <div className="services-list">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="service-row"
              ref={el => { rowsRef.current[i] = el; }}
            >
              <span className="service-row-num">0{service.id}</span>
              <h3 className="service-row-title">{service.title}</h3>
              <p className="service-row-desc">{service.description}</p>
              <div className="service-row-icon">{service.icon}</div>
              <div className="service-row-arrow"><ArrowIcon /></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
