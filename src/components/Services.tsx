import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedText from "./AnimatedText";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    title: "Websites",
    description:
      "Clean, fast, and built to convert. From landing pages to full web experiences.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".service-card");

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 24, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            once: true,
          },
          delay: index * 0.08,
        },
      );
    });
  }, []);

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="container">
        <div className="services-top">
          <div className="section-header">
            <AnimatedText
              as="h2"
              className="section-title"
              triggerOnScroll
              stagger={0.1}
            >
              Some of our services
            </AnimatedText>
          </div>
          <div className="services-intro">
            <AnimatedText as="p" triggerOnScroll stagger={0.02}>
              From simple websites to robust AI automations, we design and build exactly what you need.
            </AnimatedText>
          </div>
        </div>
        <div className="services-grid" ref={cardsRef}>
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card-header">
                <span className="service-card-num">0{service.id}</span>
                <div className="service-card-icon">{service.icon}</div>
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-text">{service.description}</p>
              <div className="service-card-arrow">
                <ArrowIcon />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
