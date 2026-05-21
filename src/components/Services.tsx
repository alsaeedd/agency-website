import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Services.css";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  /** Animation flavor for the icon - matches CSS class */
  flavor: "float" | "spin" | "wobble" | "pulse";
}

const services: Service[] = [
  {
    id: 1,
    title: "Websites",
    description: "Marketing sites & shop fronts. Fast to load, easy to sell from.",
    flavor: "float",
    icon: (
      <svg viewBox="0 0 80 80" fill="none">
        <defs>
          <linearGradient id="svc-grad-1" x1="0" y1="0" x2="80" y2="80">
            <stop offset="0%" stopColor="#d6c2ff" />
            <stop offset="100%" stopColor="#7c5aff" />
          </linearGradient>
        </defs>
        {/* Browser window */}
        <rect x="10" y="14" width="60" height="48" rx="6" stroke="url(#svc-grad-1)" strokeWidth="1.8" />
        <line x1="10" y1="24" x2="70" y2="24" stroke="url(#svc-grad-1)" strokeWidth="1.8" />
        <circle cx="16" cy="19" r="1.3" fill="url(#svc-grad-1)" />
        <circle cx="20.5" cy="19" r="1.3" fill="url(#svc-grad-1)" />
        <circle cx="25" cy="19" r="1.3" fill="url(#svc-grad-1)" />
        {/* Content lines */}
        <line x1="18" y1="34" x2="44" y2="34" stroke="url(#svc-grad-1)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="18" y1="42" x2="60" y2="42" stroke="url(#svc-grad-1)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <line x1="18" y1="50" x2="38" y2="50" stroke="url(#svc-grad-1)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
        {/* Cursor */}
        <path d="M50 50 L58 58 L52 58 L54 64 L51 65 L49 59 L45 62 Z" fill="url(#svc-grad-1)" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Systems",
    description: "Internal tools, dashboards, custom CRMs. The kind that replaces five spreadsheets.",
    flavor: "wobble",
    icon: (
      <svg viewBox="0 0 80 80" fill="none">
        <defs>
          <linearGradient id="svc-grad-2" x1="0" y1="0" x2="80" y2="80">
            <stop offset="0%" stopColor="#d6c2ff" />
            <stop offset="100%" stopColor="#7c5aff" />
          </linearGradient>
        </defs>
        {/* Server stack */}
        <rect x="14" y="14" width="52" height="14" rx="3" stroke="url(#svc-grad-2)" strokeWidth="1.8" />
        <rect x="14" y="32" width="52" height="14" rx="3" stroke="url(#svc-grad-2)" strokeWidth="1.8" />
        <rect x="14" y="50" width="52" height="14" rx="3" stroke="url(#svc-grad-2)" strokeWidth="1.8" />
        {/* Status dots */}
        <circle cx="22" cy="21" r="1.8" fill="#4af5c0" />
        <circle cx="22" cy="39" r="1.8" fill="url(#svc-grad-2)" />
        <circle cx="22" cy="57" r="1.8" fill="url(#svc-grad-2)" />
        {/* Bars */}
        <line x1="32" y1="21" x2="58" y2="21" stroke="url(#svc-grad-2)" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        <line x1="32" y1="39" x2="52" y2="39" stroke="url(#svc-grad-2)" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        <line x1="32" y1="57" x2="56" y2="57" stroke="url(#svc-grad-2)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Apps",
    description: "Web & mobile apps with a real backend. Shipped to production, not a slide deck.",
    flavor: "pulse",
    icon: (
      <svg viewBox="0 0 80 80" fill="none">
        <defs>
          <linearGradient id="svc-grad-3" x1="0" y1="0" x2="80" y2="80">
            <stop offset="0%" stopColor="#d6c2ff" />
            <stop offset="100%" stopColor="#7c5aff" />
          </linearGradient>
        </defs>
        {/* Phone */}
        <rect x="22" y="8" width="36" height="64" rx="6" stroke="url(#svc-grad-3)" strokeWidth="1.8" />
        <line x1="34" y1="14" x2="46" y2="14" stroke="url(#svc-grad-3)" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        {/* App grid */}
        <rect x="28" y="22" width="10" height="10" rx="2" stroke="url(#svc-grad-3)" strokeWidth="1.4" opacity="0.9" />
        <rect x="42" y="22" width="10" height="10" rx="2" stroke="url(#svc-grad-3)" strokeWidth="1.4" opacity="0.7" />
        <rect x="28" y="36" width="10" height="10" rx="2" stroke="url(#svc-grad-3)" strokeWidth="1.4" opacity="0.7" />
        <rect x="42" y="36" width="10" height="10" rx="2" stroke="url(#svc-grad-3)" strokeWidth="1.4" opacity="0.95" fill="url(#svc-grad-3)" fillOpacity="0.25" />
        <rect x="28" y="50" width="10" height="10" rx="2" stroke="url(#svc-grad-3)" strokeWidth="1.4" opacity="0.6" />
        <rect x="42" y="50" width="10" height="10" rx="2" stroke="url(#svc-grad-3)" strokeWidth="1.4" opacity="0.6" />
        {/* Home dot */}
        <circle cx="40" cy="66" r="1.6" fill="url(#svc-grad-3)" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "AI",
    description: "Agents & workflows that quietly do the work your team was about to hire for.",
    flavor: "spin",
    icon: (
      <svg viewBox="0 0 80 80" fill="none">
        <defs>
          <linearGradient id="svc-grad-4" x1="0" y1="0" x2="80" y2="80">
            <stop offset="0%" stopColor="#d6c2ff" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c5aff" />
          </linearGradient>
          <radialGradient id="svc-grad-4r" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4af5c0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4af5c0" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Outer star/spark - 4-point */}
        <path
          d="M40 8 L46 34 L72 40 L46 46 L40 72 L34 46 L8 40 L34 34 Z"
          fill="url(#svc-grad-4)"
          opacity="0.85"
        />
        {/* Inner core glow */}
        <circle cx="40" cy="40" r="9" fill="url(#svc-grad-4r)" />
        {/* Small accent sparks */}
        <path
          d="M62 18 L64 24 L70 26 L64 28 L62 34 L60 28 L54 26 L60 24 Z"
          fill="url(#svc-grad-4)"
          opacity="0.55"
        />
        <path
          d="M18 56 L20 60 L24 62 L20 64 L18 68 L16 64 L12 62 L16 60 Z"
          fill="url(#svc-grad-4)"
          opacity="0.45"
        />
      </svg>
    ),
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const tier = document.documentElement.dataset.tier;
    const isWeak =
      tier === "low" ||
      tier === "med" ||
      (typeof matchMedia === "function" &&
        matchMedia("(pointer: coarse)").matches);

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter((c): c is HTMLDivElement => c !== null);

      // Entrance animations stay on every device — the owner likes them.
      // Reliability comes from `start: "top bottom"` (fires as soon as the
      // section enters the viewport at all, not waiting until 10–25% in)
      // and the global ScrollTrigger.refresh() the preloader runs on
      // dismiss so cached pixel positions are correct post-layout-shift.
      gsap.from(headerRef.current, {
        y: -28,
        opacity: 0,
        duration: isWeak ? 0.6 : 0.9,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          once: true,
        },
      });

      if (cards.length > 0) {
        gsap.from(cards, {
          y: 36,
          opacity: 0,
          filter: isWeak ? "blur(0px)" : "blur(8px)",
          duration: isWeak ? 0.55 : 0.95,
          ease: "expo.out",
          stagger: isWeak ? 0.05 : 0.1,
          scrollTrigger: {
            trigger: cards[0],
            start: "top bottom",
            once: true,
          },
        });
      }

      // Icon off-screen pause runs on EVERY device — perf gate, not entrance.
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const icon = entry.target.querySelector<HTMLElement>(".service-card-icon");
            if (!icon) continue;
            icon.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
          }
        },
        { threshold: 0.05, rootMargin: "100px 0px" },
      );
      cards.forEach((card) => io.observe(card));

      return () => io.disconnect();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor-aware glow inside each card
  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="container">
        <div className="services-header" ref={headerRef}>
          <span className="services-eyebrow">
            <span className="services-eyebrow-num">01</span>
            <span className="services-eyebrow-divider" aria-hidden="true" />
            <span>What we build</span>
          </span>
          <h2 className="services-heading">
            Four things we ship. <span className="services-heading-soft">In-house, end-to-end.</span>
          </h2>
          <p className="services-intro">
            No sub-contractors, no hand-offs. The same small team scopes it,
            builds it, and ships it.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, i) => (
            <div
              key={service.id}
              className={`service-card service-card-${service.flavor}`}
              ref={(el) => { cardsRef.current[i] = el; }}
              onMouseMove={handleCardMove}
            >
              <span className="service-card-num">0{service.id}</span>
              <div className={`service-card-icon icon-${service.flavor}`}>
                {service.icon}
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.description}</p>
              <span className="service-card-arrow" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 11l6-6" />
                  <path d="M6.5 5h4.5v4.5" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
