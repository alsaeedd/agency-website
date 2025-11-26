import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedText from "./AnimatedText";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    title: "Custom development",
    description:
      "Frontend + backend + AI integrations — built for performance and scalability.",
    image: "https://cuberto.com/assets/services/development/cover.png",
  },
  {
    id: 2,
    title: "AI-powered automation",
    description:
      "Automations that either save you time or make you money, or both.",
    image: "https://cuberto.com/assets/services/design/cover.png",
  },
  {
    id: 3,
    title: "Cloud deployment",
    description:
      "Initial infrastructure-as-code setup with a consistent deployment strategy.",
    image: "https://cuberto.com/assets/services/development/cover.png",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".service-card");

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
          delay: index * 0.1,
        }
      );
    });
  }, []);

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <AnimatedText
            as="h2"
            className="section-title"
            triggerOnScroll
            stagger={0.1}
          >
            Our services
          </AnimatedText>
        </div>
        <div className="services-intro">
          <AnimatedText as="p" triggerOnScroll stagger={0.02}>
            From AWS deployments to robust n8n automations — we design and build
            exactly what you need.
          </AnimatedText>
        </div>
        <div className="services-grid" ref={cardsRef}>
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card-preview">
                <img src={service.image} alt={service.title} loading="lazy" />
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-text">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="section-action">
          <a href="#" className="btn-cta" data-cursor="hover">
            <span>View all services</span>
          </a>
        </div>
      </div>
    </section>
  );
}
