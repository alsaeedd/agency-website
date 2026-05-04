import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import "./Portfolio.css";

interface Project {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  color: string;
  accent: string;
  cardClass: string;
  client: { name: string; logo: string };
  liveUrl: string;
  highlights: string[];
  outcome: string;
}

const projects: Project[] = [
  {
    id: 1,
    tag: "Hospitality · Membership",
    title: "Members-Only Dining Platform",
    subtitle:
      "A complete membership experience — tiered access, event registrations, and a polished member portal — built end-to-end on a custom monorepo.",
    color: "#A8302E",
    accent: "#F5E8D5",
    cardClass: "card-palmnplate",
    client: { name: "Palm & Plate", logo: "/assets/palmnplate-red.png" },
    liveUrl: "https://www.palmandplate.com",
    highlights: [
      "Tiered membership system with passwordless email-OTP auth and JWT refresh rotation.",
      "Event registration & venue booking flows with real-time availability and BHD pricing.",
      "Custom member portal — TanStack Router/Query + shadcn/ui — for tickets, profile, and renewals.",
      "Admin & API services on NestJS + Prisma + PostgreSQL, deployed via GitHub Actions to a managed VPS with PM2.",
      "Mobile-first, warm and editorial — the brand's hospitality identity carried into every micro-interaction.",
    ],
    outcome:
      "A production-grade membership platform that turned a hospitality concept into a working business — used by members across Bahrain.",
  },
  {
    id: 2,
    tag: "Capital · Partnerships",
    title: "Boutique Advisory — Web Presence",
    subtitle:
      "A premium marketing site for a Bahrain-based capital and partnerships advisory firm — positioning, leadership, and contact in one polished surface.",
    color: "#0B2545",
    accent: "#C9A24A",
    cardClass: "card-knightsgate",
    client: { name: "Knights Gate Advisers", logo: "/assets/knightsgate.png" },
    liveUrl: "https://www.knightsgateadvisers.com",
    highlights: [
      "Cinematic hero with custom motion treatment, paired with a refined editorial type system.",
      "Modular sections — services, leadership, why KGA, closing CTA — easy to extend as the firm grows.",
      "Editorial leadership profiles with on-brand photography and tasteful entrance choreography.",
      "Built for credibility — fast, accessible, SEO-clean, and fully indexable from day one.",
      "Knights Gate's deep navy + gold palette carried through every component and hover state.",
    ],
    outcome:
      "A boutique advisory presence that signals trust before the first conversation — and converts visitors into qualified inbound calls.",
  },
  {
    id: 3,
    tag: "Restaurant · F&B",
    title: "Bilingual Landing Page — Cinematic Motion",
    subtitle:
      "A bilingual (Arabic + English) landing site with award-caliber motion design — built to make customers say “wow” the moment the page loads.",
    color: "#0D4D2B",
    accent: "#C9942A",
    cardClass: "card-kaakbsemsom",
    client: { name: "Kaak Bsemsom", logo: "/assets/kaakbsemsom-green.jpeg" },
    liveUrl: "https://www.kaakbsemsom.com",
    highlights: [
      "Bilingual EN/AR experience with full RTL support and a smooth language toggle.",
      "GSAP ScrollTrigger + Framer Motion choreography — parallax, pinned sections, scrubbed timelines.",
      "Lenis-powered smooth scrolling at 120 fps, tuned to feel buttery on mobile too.",
      "Brand-true green & gold palette — typography, gradients, and micro-interactions all on-brand.",
      "Static export deployed to shared hosting — zero infra cost, zero downtime, instant TTFB.",
    ],
    outcome:
      "A landing page that feels less like a website and more like a brand experience — exactly what the founders asked for.",
  },
];

const featureIcons = [
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M17 17l-4-4"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h14M6 10h8M9 15h2"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41"/><circle cx="10" cy="10" r="3"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 11.5a4.5 4.5 0 006.36 0l2-2a4.5 4.5 0 00-6.36-6.36L9.1 4.54"/><path d="M11.5 8.5a4.5 4.5 0 00-6.36 0l-2 2a4.5 4.5 0 006.36 6.36l1.38-1.38"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L4.5 11H10l-3 7 8.5-9H10l3-7z"/></svg>,
];

const ArrowUpRight = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 11l6-6" />
    <path d="M6.5 5h4.5v4.5" />
  </svg>
);

function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current || !closeRef.current) return;

    isClosingRef.current = false;
    document.body.style.overflow = "hidden";

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(contentRef.current, { y: 60, opacity: 0 });
    gsap.set(closeRef.current, { scale: 0, opacity: 0 });

    const tl = gsap.timeline();
    openTimelineRef.current = tl;

    tl.to(overlayRef.current, { opacity: 1, duration: 0.45, ease: "power3.out" })
      .to(contentRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.25")
      .to(closeRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.4");

    return () => {
      tl.kill();
      openTimelineRef.current = null;
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (openTimelineRef.current) {
      openTimelineRef.current.kill();
      openTimelineRef.current = null;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        isClosingRef.current = false;
        onClose();
      },
    });

    tl.to(closeRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power3.in" })
      .to(contentRef.current, { y: 50, opacity: 0, duration: 0.45, ease: "power3.in" }, "-=0.2")
      .to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power3.in" }, "-=0.3");
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const heroStyle = {
    "--pd-brand": project.color,
    "--pd-accent": project.accent,
  } as React.CSSProperties;

  return (
    <div
      className="project-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      style={heroStyle}
    >
      <button
        className="project-overlay-close"
        onClick={handleClose}
        ref={closeRef}
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="project-overlay-scroll" data-lenis-prevent>
        <div className="project-overlay-content" ref={contentRef}>

          <div className="pd-hero">
            <div className="pd-hero-glow" aria-hidden="true" />
            <div className="pd-hero-inner">
              <div className="pd-hero-left">
                <span className="pd-tag">{project.tag}</span>
                <h1 className="pd-title">{project.title}</h1>
                <p className="pd-subtitle">{project.subtitle}</p>

                <div className="pd-cta-row">
                  <a
                    className="pd-cta-primary"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Visit live site</span>
                    <ArrowUpRight />
                  </a>
                  <a
                    className="pd-cta-secondary"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {new URL(project.liveUrl).hostname.replace(/^www\./, "")}
                  </a>
                </div>
              </div>
              <div className="pd-hero-right">
                <a
                  className="pd-visual-box pd-visual-link"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.client.name} live site`}
                >
                  <img
                    src={project.client.logo}
                    alt={project.client.name}
                    className="pd-visual-client-logo"
                  />
                  <span className="pd-visual-corner" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="pd-body">
            <div className="pd-inner">

              <div className="pd-section">
                <span className="pd-section-label">What we built</span>
                <div className="pd-features-grid">
                  {project.highlights.map((h, i) => (
                    <div className="pd-feature-card" key={i}>
                      <div className="pd-feature-top">
                        <span className="pd-feature-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="pd-feature-icon">{featureIcons[i % featureIcons.length]}</span>
                      </div>
                      <p className="pd-feature-text">{h}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pd-section">
                <span className="pd-section-label">The result</span>
                <p className="pd-outcome">{project.outcome}</p>
              </div>

              <div className="pd-section pd-section-last">
                <span className="pd-section-label">Client</span>
                <div className="pd-client-row">
                  <div className="pd-client-logo-wrap">
                    <img src={project.client.logo} alt={project.client.name} />
                  </div>
                  <div className="pd-client-meta">
                    <span className="pd-client-name">{project.client.name}</span>
                    <a
                      className="pd-client-link"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{new URL(project.liveUrl).hostname.replace(/^www\./, "")}</span>
                      <ArrowUpRight />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current!.querySelectorAll(".portfolio-card");

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
            delay: index * 0.12,
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardKeyDown = (e: React.KeyboardEvent, project: Project) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveProject(project);
    }
  };

  return (
    <>
      <section className="portfolio" id="portfolio" ref={sectionRef}>
        <div className="container">
          <div className="portfolio-grid" ref={cardsRef}>
            {projects.map((project) => (
              <article
                key={project.id}
                className={`portfolio-card ${project.cardClass}`}
                onClick={() => setActiveProject(project)}
                onKeyDown={(e) => handleCardKeyDown(e, project)}
                role="button"
                tabIndex={0}
                aria-label={`View case study: ${project.title}`}
                style={{
                  ["--card-brand" as string]: project.color,
                  ["--card-accent" as string]: project.accent,
                }}
              >
                <div className="portfolio-card-preview">
                  <div className="portfolio-card-preview-inner">
                    <img
                      src={project.client.logo}
                      alt={project.client.name}
                      className="portfolio-card-preview-logo"
                      loading="lazy"
                    />
                  </div>
                  <span className="portfolio-card-cue" aria-hidden="true">
                    <span className="portfolio-card-cue-text">View case study</span>
                    <span className="portfolio-card-cue-icon">
                      <ArrowUpRight />
                    </span>
                  </span>
                </div>
                <div className="portfolio-card-info">
                  <div className="portfolio-card-meta">
                    <span className="portfolio-card-tag">{project.tag}</span>
                    <span className="portfolio-card-client-name">{project.client.name}</span>
                  </div>
                  <h3 className="portfolio-card-title">{project.title}</h3>
                  <a
                    className="portfolio-card-live"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Open ${project.client.name} live site in a new tab`}
                  >
                    <span>{new URL(project.liveUrl).hostname.replace(/^www\./, "")}</span>
                    <ArrowUpRight />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {activeProject && (
        <ProjectDetail
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </>
  );
}
