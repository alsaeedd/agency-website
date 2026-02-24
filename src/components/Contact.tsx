import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import AnimatedText from "./AnimatedText";
import logoMain from "../../assets/logo_main.png";
import "./Contact.css";

const services = [
  { id: "site-scratch", label: "Site from scratch" },
  { id: "system-from-scratch", label: "System from scratch" },
  { id: "ai-automations", label: "AI automations" },
  { id: "cloud-deployment-only", label: "Cloud deployment only" },
  { id: "other", label: "Something else" },
];

const budgets = [
  { id: "under-500", label: "< 500 BHD" },
  { id: "500-1k", label: "500 \u2013 1k BHD" },
  { id: "1k-2k", label: "1k \u2013 2k BHD" },
  { id: "2k-5k", label: "2k \u2013 5k BHD" },
  { id: "5k-10k", label: "5k \u2013 10k BHD" },
  { id: "10k-20k", label: "10k \u2013 20k BHD" },
  { id: "more-20k", label: "> 20k BHD" },
];

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

const encode = (data: Record<string, string | File | null>) => {
  const formData = new FormData();
  for (const key of Object.keys(data)) {
    const value = data[key];
    if (value !== null) {
      formData.append(key, value);
    }
  }
  return formData;
};

export default function Contact({ isOpen, onClose }: ContactProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const formGroupsRef = useRef<HTMLFormElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (isOpen && !isVisible) {
      setIsVisible(true);
    }
  }, [isOpen, isVisible]);

  useEffect(() => {
    if (
      isVisible &&
      overlayRef.current &&
      contentRef.current &&
      closeButtonRef.current
    ) {
      isClosingRef.current = false;
      document.body.style.overflow = "hidden";

      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { y: 80, opacity: 0 });
      gsap.set(closeButtonRef.current, { scale: 0, opacity: 0 });

      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { y: 15, opacity: 0 });
      }

      if (sidebarRef.current) {
        const sidebarEls = sidebarRef.current.querySelectorAll(
          ".contact-sidebar-anim",
        );
        gsap.set(sidebarEls, { x: -30, opacity: 0 });
      }

      const tl = gsap.timeline();
      openTimelineRef.current = tl;

      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      })
        .to(
          contentRef.current,
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        )
        .to(
          closeButtonRef.current,
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
          "-=0.4",
        );

      if (subtitleRef.current) {
        tl.to(
          subtitleRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.15",
        );
      }

      if (sidebarRef.current) {
        const sidebarEls = sidebarRef.current.querySelectorAll(
          ".contact-sidebar-anim",
        );
        tl.to(
          sidebarEls,
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.5",
        );
      }

      if (formGroupsRef.current) {
        const sections =
          formGroupsRef.current.querySelectorAll(".contact-section");
        gsap.set(sections, { y: 30, opacity: 0 });
        tl.to(
          sections,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.3",
        );
      }

      return () => {
        tl.kill();
        openTimelineRef.current = null;
      };
    }
  }, [isVisible]);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    // Kill any in-progress open animation
    if (openTimelineRef.current) {
      openTimelineRef.current.kill();
      openTimelineRef.current = null;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        isClosingRef.current = false;
        document.body.style.overflow = "";
        onClose();
      },
    });

    tl.to(closeButtonRef.current, {
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
  }, [onClose]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleClose]);

  // Cleanup overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const resetForm = () => {
    setSelectedServices([]);
    setSelectedBudget("");
    setName("");
    setEmail("");
    setMessage("");
    setAttachment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedServiceLabels = selectedServices
      .map((id) => services.find((s) => s.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const selectedBudgetLabel =
      budgets.find((b) => b.id === selectedBudget)?.label || "";

    try {
      const response = await fetch("/", {
        method: "POST",
        body: encode({
          "form-name": "contact",
          name,
          email,
          services: selectedServiceLabels,
          message,
          budget: selectedBudgetLabel,
          attachment,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setShowSuccess(true);
      successTimerRef.current = setTimeout(() => {
        setShowSuccess(false);
        onClose();
        resetForm();
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = name.trim() !== "" && email.trim() !== "";

  if (!isVisible) return null;

  return (
    <div className="contact-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label="Contact form">
      <button
        className="contact-close"
        onClick={handleClose}
        ref={closeButtonRef}
        aria-label="Close"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="contact-layout">
        <aside className="contact-sidebar" ref={sidebarRef}>
          <div className="contact-sidebar-glow" />
          <img
            src={logoMain}
            className="contact-sidebar-logo contact-sidebar-anim"
            alt="RAL"
          />
          <div className="contact-sidebar-body">
            <h2 className="contact-sidebar-heading contact-sidebar-anim">
              Let's build something great.
            </h2>
            <p className="contact-sidebar-desc contact-sidebar-anim">
              Tell us what you're working on and we'll get back to you shortly.
            </p>
          </div>
          <div className="contact-sidebar-links contact-sidebar-anim">
            <a
              href="mailto:info@revenueautomationlab.com"
              className="contact-sidebar-link"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="16" height="12" rx="2" />
                <path d="M2 7l8 5 8-5" />
              </svg>
              info@revenueautomationlab.com
            </a>
            <a
              href="https://wa.me/97337771096"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-sidebar-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +973 3777 1096
            </a>
          </div>
        </aside>

        <div className="contact-scroll" data-lenis-prevent>
          <div className="contact-container" ref={contentRef}>
            {showSuccess ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="contact-success-header">Thank you!</div>
                <p>We'll be in touch with you shortly.</p>
              </div>
            ) : (
              <>
                <div className="contact-header">
                  <AnimatedText
                    as="h1"
                    className="contact-title"
                    delay={0.2}
                    stagger={0.1}
                  >
                    So, what're we cooking?
                  </AnimatedText>
                  <p className="contact-subtitle" ref={subtitleRef}>
                    Fill in what you can. We'll figure out the rest together.
                  </p>
                </div>

                <form
                  className="contact-form"
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  onSubmit={handleSubmit}
                  ref={formGroupsRef}
                >
                  <input type="hidden" name="form-name" value="contact" />

                  <div className="contact-section">
                    <div className="contact-section-head">
                      <span className="contact-step-num">01</span>
                      <span className="contact-label">I'm interested in</span>
                    </div>
                    <div className="contact-checkboxes">
                      {services.map((service) => (
                        <label key={service.id} className="contact-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                          />
                          <span className="contact-checkbox-box">
                            <span className="contact-checkbox-border" />
                            <span className="contact-checkbox-label">
                              {service.label}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="contact-section">
                    <div className="contact-section-head">
                      <span className="contact-step-num">02</span>
                      <span className="contact-label">Your details</span>
                    </div>
                    <div className="contact-row-2">
                      <div className="contact-input">
                        <input
                          type="text"
                          name="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        <div className="contact-input-line" />
                      </div>
                      <div className="contact-input">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <div className="contact-input-line" />
                      </div>
                    </div>
                  </div>

                  <div className="contact-section">
                    <div className="contact-section-head">
                      <span className="contact-step-num">03</span>
                      <span className="contact-label">Tell us more</span>
                    </div>
                    <div className="contact-input">
                      <textarea
                        name="message"
                        placeholder="Tell us about your project"
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        rows={1}
                      />
                      <div className="contact-input-line" />
                    </div>
                  </div>

                  <div className="contact-section">
                    <div className="contact-section-head">
                      <span className="contact-step-num">04</span>
                      <span className="contact-label">
                        Project budget (BHD)
                      </span>
                    </div>
                    <div className="contact-checkboxes">
                      {budgets.map((budget) => (
                        <label key={budget.id} className="contact-checkbox">
                          <input
                            type="radio"
                            name="budget"
                            checked={selectedBudget === budget.id}
                            onChange={() => setSelectedBudget(budget.id)}
                          />
                          <span className="contact-checkbox-box">
                            <span className="contact-checkbox-border" />
                            <span className="contact-checkbox-label">
                              {budget.label}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="contact-section contact-bottom-row">
                    <label className="contact-attachment">
                      <input
                        type="file"
                        name="attachment"
                        onChange={(e) =>
                          setAttachment(e.target.files?.[0] || null)
                        }
                      />
                      <span className="contact-attachment-btn">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        <span>
                          {attachment ? attachment.name : "Attach a file"}
                        </span>
                      </span>
                    </label>

                    <div className="contact-submit">
                      <button
                        type="submit"
                        className="btn-cta-submit"
                        disabled={!isFormValid || isSubmitting}
                      >
                        <span>
                          {isSubmitting ? "Sending..." : "Send request"}
                        </span>
                        {!isSubmitting && (
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 10h12M10 4l6 6-6 6" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
