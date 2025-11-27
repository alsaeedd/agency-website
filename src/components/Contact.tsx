import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import AnimatedText from "./AnimatedText";

const services = [
  { id: "site-scratch", label: "Site from scratch" },
  { id: "system-from-scratch", label: "System from scratch" },
  { id: "ai-automations", label: "AI automations" },
  { id: "cloud-deployment-only", label: "Cloud deployment only" },
  { id: "other", label: "Something else" },
];

const budgets = [
  { id: "under-500", label: "< 500 BHD" },
  { id: "500-1k", label: "500 - 1k BHD" },
  { id: "1k-2k", label: "1k - 2k BHD" },
  { id: "2k-5k", label: "2k - 5k BHD" },
  { id: "5k-10k", label: "5k - 10k BHD" },
  { id: "10k-20k", label: "10k - 20k BHD" },
  { id: "more-20k", label: "> 20k BHD" },
];

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

// Encode form data for Netlify
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
  const [isAnimating, setIsAnimating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle open animation
  useEffect(() => {
    if (isOpen && !isVisible) {
      setIsVisible(true);
    }
  }, [isOpen, isVisible]);

  // Run animation after component mounts with isVisible
  useEffect(() => {
    if (
      isVisible &&
      overlayRef.current &&
      contentRef.current &&
      closeButtonRef.current
    ) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";

      // Set initial states immediately
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { y: 80, opacity: 0 });
      gsap.set(closeButtonRef.current, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      });

      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      })
        .to(
          contentRef.current,
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          closeButtonRef.current,
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
          "-=0.4"
        );
    }
  }, [isVisible]);

  // Handle close animation
  const handleClose = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        setIsAnimating(false);
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
        "-=0.2"
      )
      .to(
        overlayRef.current,
        { opacity: 0, duration: 0.4, ease: "power3.in" },
        "-=0.3"
      );
  }, [isAnimating, onClose]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get selected service labels
    const selectedServiceLabels = selectedServices
      .map((id) => services.find((s) => s.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    // Get selected budget label
    const selectedBudgetLabel =
      budgets.find((b) => b.id === selectedBudget)?.label || "";

    try {
      await fetch("/", {
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

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        // Reset form
        setSelectedServices([]);
        setSelectedBudget("");
        setName("");
        setEmail("");
        setMessage("");
        setAttachment(null);
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
    <div className="contact-overlay" ref={overlayRef}>
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
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="contact-scroll" data-lenis-prevent>
        <div className="contact-container" ref={contentRef}>
          {showSuccess ? (
            <div className="contact-success">
              <div className="contact-success-header">
                Thank you!{" "}
                <span role="img" aria-label="thumbs up">
                  👍
                </span>
              </div>
              <p>
                Thanks for inquiry! We'll contact you shortly!{" "}
                <span role="img" aria-label="wink">
                  😉
                </span>
              </p>
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
              </div>

              <form
                className="contact-form"
                name="contact"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />

                <div className="contact-group">
                  <div className="contact-label">I'm interested in...</div>
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

                <div className="contact-group">
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
                </div>

                <div className="contact-group">
                  <div className="contact-input">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="contact-input-line" />
                  </div>
                </div>

                <div className="contact-group">
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

                <div className="contact-group">
                  <div className="contact-label">Project budget (BHD)</div>
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

                <div className="contact-group">
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
                        {attachment ? attachment.name : "Add attachment"}
                      </span>
                    </span>
                  </label>
                </div>

                <div className="contact-submit">
                  <button
                    type="submit"
                    className="btn-cta-submit"
                    disabled={!isFormValid || isSubmitting}
                  >
                    <span>{isSubmitting ? "Sending..." : "Send request"}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
