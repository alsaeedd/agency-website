import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import "./Portfolio.css";

interface Project {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  color: string;
  client: { name: string; logo: string } | null;
  clientNote: string | null;
  highlights: string[];
  outcome: string;
}

const projects: Project[] = [
  {
    id: 1,
    tag: "Talent Acquisition",
    title: "LinkedIn Recruitment at Scale",
    subtitle:
      "1,000 candidates sourced, filtered, and personally messaged \u2014 in one automated run.",
    color: "#1a1a1a",
    client: null,
    clientNote:
      "Built for a senior executive at one of Bahrain\u2019s leading technology firms in the financial services space. Name withheld at the client\u2019s request.",
    highlights: [
      "Enter a keyword and location \u2014 receive a curated pipeline of candidates from LinkedIn.",
      "Automatic deduplication against existing records. No duplicates, no wasted outreach.",
      "AI-generated messages tailored to each profile \u2014 a Java developer hears about Java, a cloud engineer hears about cloud.",
      "Every message ties the candidate\u2019s experience directly to the company\u2019s work. Relevant, not templated.",
      "Automated delivery at scale \u2014 1,000 candidates reached in the time it used to take to find 10.",
    ],
    outcome:
      "1,000 candidates sourced and messaged per batch \u2014 replacing roughly 80+ hours of manual recruiting with a single automated workflow.",
  },
  {
    id: 2,
    tag: "E-Commerce",
    title: "Pre-Orders, Shipping & Automation",
    subtitle:
      "A complete pre-order system, shipping integration, and workflow automation for a growing e-commerce brand.",
    color: "#f5f0eb",
    client: {
      name: "Jerar",
      logo: "/assets/Screenshot_2024-06-04_at_1.53.17_PM-removebg-preview-2-e1719916646965.png",
    },
    clientNote: null,
    highlights: [
      "Custom pre-order system with a tailored checkout, payment, and email flow.",
      "Mixed carts handled cleanly \u2014 pre-order and in-stock items in one basket, zero shipping conflicts.",
      "Shipping calculations with real-time duty and customs fees across the GCC.",
      "Automated pickup scheduling with the shipping provider \u2014 no manual intervention.",
      "End-to-end built with custom code and workflow automation.",
    ],
    outcome:
      "We\u2019re grateful this turned into a lasting partnership \u2014 the client continues to trust us with new projects as we grow together.",
  },
];

const featureIcons = [
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M17 17l-4-4"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h14M6 10h8M9 15h2"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41"/><circle cx="10" cy="10" r="3"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 11.5a4.5 4.5 0 006.36 0l2-2a4.5 4.5 0 00-6.36-6.36L9.1 4.54"/><path d="M11.5 8.5a4.5 4.5 0 00-6.36 0l-2 2a4.5 4.5 0 006.36 6.36l1.38-1.38"/></svg>,
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L4.5 11H10l-3 7 8.5-9H10l3-7z"/></svg>,
];

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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current || !closeRef.current) return;

    setIsAnimating(true);
    document.body.style.overflow = "hidden";

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(contentRef.current, { y: 60, opacity: 0 });
    gsap.set(closeRef.current, { scale: 0, opacity: 0 });

    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    tl.to(overlayRef.current, { opacity: 1, duration: 0.45, ease: "power3.out" })
      .to(contentRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.25")
      .to(closeRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }, "-=0.4");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setIsAnimating(false);
        onClose();
      },
    });

    tl.to(closeRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power3.in" })
      .to(contentRef.current, { y: 50, opacity: 0, duration: 0.45, ease: "power3.in" }, "-=0.2")
      .to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power3.in" }, "-=0.3");
  }, [isAnimating, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div className="project-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label={project.title}>
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
            <div className="pd-hero-inner">
              <div className="pd-hero-left">
                <span className="pd-tag">{project.tag}</span>
                <h1 className="pd-title">{project.title}</h1>
                <p className="pd-subtitle">{project.subtitle}</p>
              </div>
              <div className="pd-hero-right">
                {project.client ? (
                  <div className="pd-visual-box">
                    <img
                      src={project.client.logo}
                      alt={project.client.name}
                      className="pd-visual-client-logo"
                    />
                  </div>
                ) : (
                  <div className="pd-visual-box pd-visual-metric">
                    <img src="/assets/linkedin.png" alt="LinkedIn" className="pd-metric-platform" />
                    <span className="pd-metric-number">1,000+</span>
                    <span className="pd-metric-label">candidates per batch</span>
                  </div>
                )}
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
                {project.client ? (
                  <div className="pd-client-row">
                    <div className="pd-client-logo-wrap">
                      <img src={project.client.logo} alt={project.client.name} />
                    </div>
                    <span className="pd-client-name">{project.client.name}</span>
                  </div>
                ) : (
                  <p className="pd-client-note">{project.clientNote}</p>
                )}
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
              <div
                key={project.id}
                className="portfolio-card"
                onClick={() => setActiveProject(project)}
                onKeyDown={(e) => handleCardKeyDown(e, project)}
                role="button"
                tabIndex={0}
                aria-label={`View project: ${project.title}`}
              >
                <div
                  className="portfolio-card-preview"
                  style={{ background: project.color }}
                >
                  <div className="portfolio-card-preview-inner">
                    {project.client ? (
                      <img
                        src={project.client.logo}
                        alt={project.client.name}
                        className="portfolio-card-preview-logo"
                      />
                    ) : (
                      <div className="portfolio-card-preview-metric">
                        <img
                          src="/assets/linkedin.png"
                          alt="LinkedIn"
                          className="portfolio-card-preview-metric-logo"
                        />
                        <span className="portfolio-card-preview-number">1,000+</span>
                        <span className="portfolio-card-preview-label">candidates per batch</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="portfolio-card-info">
                  <div className="portfolio-card-meta">
                    <span className="portfolio-card-tag">{project.tag}</span>
                    {project.client && (
                      <span className="portfolio-card-client-name">{project.client.name}</span>
                    )}
                  </div>
                  <h3 className="portfolio-card-title">{project.title}</h3>
                </div>
              </div>
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
