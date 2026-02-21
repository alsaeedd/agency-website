import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedText from "./AnimatedText";

gsap.registerPlugin(ScrollTrigger);

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
      "1,000 candidates sourced, filtered, and personally messaged — in one automated run.",
    color: "#1a1a1a",
    client: null,
    clientNote:
      "Built for a senior executive at one of Bahrain\u2019s leading technology firms in the financial services space. Name withheld at the client\u2019s request.",
    highlights: [
      "Enter a keyword and location — receive a curated pipeline of candidates from LinkedIn.",
      "Automatic deduplication against existing records. No duplicates, no wasted outreach.",
      "AI-generated messages tailored to each profile — a Java developer hears about Java, a cloud engineer hears about cloud.",
      "Every message ties the candidate\u2019s experience directly to the company\u2019s work. Relevant, not templated.",
      "Automated delivery at scale — 1,000 candidates reached in the time it used to take to find 10.",
    ],
    outcome:
      "1,000 candidates sourced and messaged per batch — replacing roughly 80+ hours of manual recruiting with a single automated workflow.",
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
      "Mixed carts handled cleanly — pre-order and in-stock items in one basket, zero shipping conflicts.",
      "Shipping calculations with real-time duty and customs fees across the GCC.",
      "Automated pickup scheduling with the shipping provider — no manual intervention.",
      "End-to-end built with custom code and workflow automation.",
    ],
    outcome:
      "We\u2019re grateful this turned into a lasting partnership — the client continues to trust us with new projects as we grow together.",
  },
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
    gsap.set(contentRef.current, { y: 80, opacity: 0 });
    gsap.set(closeRef.current, { scale: 0, opacity: 0 });

    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    tl.to(overlayRef.current, { opacity: 1, duration: 0.5, ease: "power3.out" })
      .to(
        contentRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3",
      )
      .to(
        closeRef.current,
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.4",
      );
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

    tl.to(closeRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
    })
      .to(
        contentRef.current,
        { y: 60, opacity: 0, duration: 0.5, ease: "power3.in" },
        "-=0.2",
      )
      .to(
        overlayRef.current,
        { opacity: 0, duration: 0.4, ease: "power3.in" },
        "-=0.3",
      );
  }, [isAnimating, onClose]);

  return (
    <div className="project-overlay" ref={overlayRef}>
      <button
        className="project-overlay-close"
        onClick={handleClose}
        ref={closeRef}
        aria-label="Close"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="project-overlay-scroll" data-lenis-prevent>
        <div className="project-overlay-content" ref={contentRef}>
          {/* Hero */}
          <div className="project-hero">
            <div className="project-hero-inner">
              <span className="project-hero-tag">{project.tag}</span>
              {project.client && (
                <img
                  src={project.client.logo}
                  alt={project.client.name}
                  className="project-hero-logo"
                />
              )}
              <h1 className="project-hero-title">{project.title}</h1>
              <p className="project-hero-subtitle">{project.subtitle}</p>
            </div>
          </div>

          {/* Details */}
          <div className="project-details">
            <div className="project-details-inner">
              <div className="project-section">
                <span className="project-section-label">What we built</span>
                <ul className="project-section-list">
                  {project.highlights.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="project-section">
                <span className="project-section-label">The result</span>
                <p className="project-section-outcome">{project.outcome}</p>
              </div>

              <div className="project-section">
                <span className="project-section-label">Client</span>
                {project.client ? (
                  <div className="project-section-client">
                    <img src={project.client.logo} alt={project.client.name} />
                    <span>{project.client.name}</span>
                  </div>
                ) : project.clientNote ? (
                  <p className="project-section-client-note">
                    {project.clientNote}
                  </p>
                ) : null}
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

    const cards = cardsRef.current.querySelectorAll(".portfolio-card");

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
  }, []);

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
                        <img src="/assets/linkedin.png" alt="LinkedIn" className="portfolio-card-preview-metric-logo" />
                        <span className="portfolio-card-preview-number">
                          1,000+
                        </span>
                        <span className="portfolio-card-preview-label">
                          candidates per batch
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="portfolio-card-info">
                  <div className="portfolio-card-meta">
                    <span className="portfolio-card-tag">{project.tag}</span>
                    {project.client && (
                      <span className="portfolio-card-client-name">
                        {project.client.name}
                      </span>
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
