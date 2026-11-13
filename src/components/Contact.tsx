import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import logoMain from "../../assets/logo_main.png";
import "./Contact.css";
import { useLang } from "../i18n";

const CONTACT_T = {
  en: { ...{
  "title": "So, what're we cooking?",
  "w": [
    "So,",
    "what're",
    "we",
    "cooking?"
  ]
}, dialog: "Contact RAL Technologies", close: "Close", social: "RAL Technologies on social media", side: "Let's build something great.", sideDesc: "Two quick details and we'll pick this up on WhatsApp.", ok: "Off to WhatsApp.", okDesc: "Your message is prefilled. Just hit send on the chat that opened. If WhatsApp didn't pop up, use the button below.", manual: "Open WhatsApp manually", subtitle: "Three lines, then we move to WhatsApp.", interested: "I'm interested in", name: "Your name", namePh: "What should we call you?", notes: "Project notes", notesPh: "A few lines on what you're building, the goal, or anything you have in mind...", submit: "Continue on WhatsApp", handoff: "WhatsApp opens with your message prefilled. Just hit send on your end.", waHi: "Hi RAL Technologies, I'd like to chat about a project.", waName: "Name:", waLooking: "Looking for:", waNotes: "Project notes:", waSent: "Sent from raltech.dev", emailAlt: "Prefer email? Send it by email instead", backWa: "Back to WhatsApp", email: "Your email", emailPh: "Where should we reply?", phone: "Phone (optional)", phonePh: "In case a quick call is easier", sendEmail: "Send message", sending: "Sending...", emailNote: "Goes straight to info@raltech.dev. We reply within a day.", sentTitle: "Message sent.", sentPre: "We'll reply to ", sentPost: " within a day.", errTitle: "That didn't go through.", errDesc: "Try again, or reach us directly:", errMail: "Email us", errWa: "WhatsApp us", mailSubject: "Project inquiry", sep: ", " },
  ar: { ...{
  "title": "إذن، ماذا سنبني معًا؟",
  "w": [
    "إذن،",
    "ماذا",
    "سنبني",
    "معًا؟"
  ]
}, dialog: "تواصل مع RAL Technologies", close: "إغلاق", social: "RAL Technologies على وسائل التواصل", side: "لنبنِ شيئًا رائعًا.", sideDesc: "تفصيلان سريعان، ثم نكمل الحديث على واتساب.", ok: "إلى واتساب.", okDesc: "رسالتك جاهزة مسبقًا. اضغط إرسال في المحادثة التي فُتحت. وإن لم يظهر واتساب، استخدم الزر أدناه.", manual: "افتح واتساب يدويًا", subtitle: "ثلاثة أسطر، ثم ننتقل إلى واتساب.", interested: "أنا مهتم بـ", name: "اسمك", namePh: "بماذا نناديك؟", notes: "تفاصيل المشروع", notesPh: "بضعة أسطر عمّا تبنيه، أو هدفك، أو أي فكرة في بالك...", submit: "أكمل على واتساب", handoff: "يُفتح واتساب ورسالتك جاهزة. فقط اضغط إرسال.", waHi: "مرحبًا RAL Technologies، أودّ الحديث عن مشروع.", waName: "الاسم:", waLooking: "أبحث عن:", waNotes: "تفاصيل المشروع:", waSent: "أُرسلت من raltech.dev", emailAlt: "تفضّل البريد؟ أرسلها عبر البريد الإلكتروني", backWa: "العودة إلى واتساب", email: "بريدك الإلكتروني", emailPh: "أين نرسل ردّنا؟", phone: "الهاتف (اختياري)", phonePh: "إن كانت مكالمة سريعة أسهل", sendEmail: "أرسل الرسالة", sending: "جارٍ الإرسال...", emailNote: "تصل مباشرة إلى info@raltech.dev. نرد خلال يوم.", sentTitle: "تم إرسال رسالتك.", sentPre: "سنرد على ", sentPost: " خلال يوم.", errTitle: "لم تُرسل الرسالة.", errDesc: "حاول مرة أخرى، أو تواصل معنا مباشرة:", errMail: "راسلنا بالبريد", errWa: "راسلنا على واتساب", mailSubject: "استفسار عن مشروع", sep: "، " },
};

const services = [
  { id: "site-scratch", label: "Site from scratch", ar: "موقع من الصفر" },
  { id: "system-from-scratch", label: "System from scratch", ar: "نظام من الصفر" },
  { id: "ai-agents", label: "AI agents", ar: "وكلاء ذكاء اصطناعي" },
  { id: "cloud-deployment-only", label: "Cloud deployment only", ar: "نشر سحابي فقط" },
  { id: "other", label: "Something else", ar: "شيء آخر" },
];

const WHATSAPP_NUMBER = "97338218181";

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Contact({ isOpen, onClose }: ContactProps) {
  const lang = useLang();
  const L = CONTACT_T[lang];
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<"whatsapp" | "email">("whatsapp");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honey, setHoney] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "error">("idle");
  const [sentTo, setSentTo] = useState("");
  const emailFieldsRef = useRef<HTMLDivElement>(null);
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

      const titleWords =
        contentRef.current.querySelectorAll(".contact-title .wmask-in");
      if (titleWords.length) {
        gsap.set(titleWords, { yPercent: 115, opacity: 0 });
      }

      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { y: 15, opacity: 0 });
      }

      if (sidebarRef.current) {
        const sidebarEls = sidebarRef.current.querySelectorAll(
          ".contact-sidebar-anim",
        );
        gsap.set(sidebarEls, { x: lang === "ar" ? 30 : -30, opacity: 0 });
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

      if (titleWords.length) {
        tl.to(
          titleWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: "expo.out",
            stagger: 0.08,
          },
          "-=0.35",
        );
      }

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

    if (openTimelineRef.current) {
      openTimelineRef.current.kill();
      openTimelineRef.current = null;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        if (sentTo) {
          setSentTo("");
          setMode("whatsapp");
          resetForm();
        }
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
  }, [onClose, sentTo]);

  useEffect(() => {
    if (mode !== "email" || !emailFieldsRef.current) return;
    const els = emailFieldsRef.current.querySelectorAll(".contact-section");
    const tween = gsap.fromTo(
      els,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.1 },
    );
    return () => {
      tween.kill();
    };
  }, [mode]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleClose]);

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
    setName("");
    setMessage("");
    setWaUrl("");
    setEmail("");
    setPhone("");
    setSendState("idle");
  };

  const payload = (channel: "whatsapp" | "email") =>
    JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      services: selectedServices,
      message: message.trim(),
      lang,
      channel,
      website: honey,
    });

  const mailtoUrl = () =>
    `mailto:info@raltech.dev?subject=${encodeURIComponent(`${L.mailSubject}: ${name.trim()}`)}&body=${encodeURIComponent(message.trim())}`;

  const handleEmailSubmit = async () => {
    if (sendState === "sending") return;
    setSendState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload("email"),
      });
      const out = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !out.ok) throw new Error("send failed");
      setSentTo(email.trim());
      setSendState("idle");
    } catch {
      setSendState("error");
    }
  };

  const buildWhatsAppUrl = () => {
    const interestedIn = selectedServices
      .map((id) => services.find((s) => s.id === id)?.[lang === "ar" ? "ar" : "label"])
      .filter(Boolean)
      .join(L.sep);

    const lines: string[] = [
      L.waHi,
      "",
      `${L.waName} ${name.trim()}`,
    ];

    if (interestedIn) {
      lines.push(`${L.waLooking} ${interestedIn}`);
    }

    lines.push("", L.waNotes, message.trim(), "", L.waSent);

    const text = lines.join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    if (mode === "email") {
      if (isEmailValid) void handleEmailSubmit();
      return;
    }

    const url = buildWhatsAppUrl();
    setWaUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");

    // Fire-and-forget copy by email, so we have their details even if they never hit send.
    try {
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload("whatsapp"),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* never block the WhatsApp handoff */
    }

    setShowSuccess(true);
    successTimerRef.current = setTimeout(() => {
      setShowSuccess(false);
      onClose();
      resetForm();
    }, 6000);
  };

  const isFormValid = name.trim() !== "" && message.trim() !== "";
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  if (!isVisible) return null;

  return (
    <div className="contact-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label={L.dialog}>
      <button
        className="contact-close"
        onClick={handleClose}
        ref={closeButtonRef}
        aria-label={L.close}
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
            alt="RAL Technologies"
          />
          <div className="contact-sidebar-body">
            <h2 className="contact-sidebar-heading contact-sidebar-anim">
              {L.side}
            </h2>
            <p className="contact-sidebar-desc contact-sidebar-anim">
              {L.sideDesc}
            </p>
          </div>
          <div className="contact-sidebar-links contact-sidebar-anim">
            <a
              href="mailto:info@raltech.dev"
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
              info@raltech.dev
            </a>
            <a
              href="https://wa.me/97338218181"
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
              <span dir="ltr">+973 3821 8181</span>
            </a>

            <div className="contact-sidebar-social" aria-label={L.social}>
              <a
                href="https://instagram.com/raltechh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="contact-sidebar-social-link"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@raltechh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="contact-sidebar-social-link"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.32 5.56a5.13 5.13 0 0 1-3.78-4.25V1H12.4v13.13a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.31 0 .61.05.89.13V8.07a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 19.97a6.34 6.34 0 0 0 10.86-4.43V8.5a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2.11-1.06z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/raltechh/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="contact-sidebar-social-link"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.22 0z" />
                </svg>
              </a>
              <a
                href="https://wa.me/97338218181"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="contact-sidebar-social-link"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>
        </aside>

        {/* Mobile brand bar, shown only when sidebar is hidden */}
        <div className="contact-mobile-brand">
          <img src={logoMain} alt="RAL Technologies" className="contact-mobile-logo" />
          <span className="contact-mobile-brand-name">RAL Technologies</span>
        </div>

        <div className="contact-scroll" data-lenis-prevent>
          <div className="contact-container" ref={contentRef}>
            {sentTo ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="16" height="12" rx="2" />
                    <path d="M2 7l8 5 8-5" />
                  </svg>
                </div>
                <div className="contact-success-header">{L.sentTitle}</div>
                <p>
                  {L.sentPre}
                  <span dir="ltr" className="contact-sent-to">{sentTo}</span>
                  {L.sentPost}
                </p>
              </div>
            ) : showSuccess ? (
              <div className="contact-success">
                <div className="contact-success-icon contact-success-icon-wa">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div className="contact-success-header">{L.ok}</div>
                <p>
                  {L.okDesc}
                </p>
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-wa-retry"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>{L.manual}</span>
                  </a>
                )}
              </div>
            ) : (
              <>
                <div className="contact-header">
                  <h1 className="contact-title" aria-label={L.title}>
                    <span className="wmask"><span className="wmask-in">{L.w[0]}</span></span>{" "}
                    <span className="wmask"><span className="wmask-in">{L.w[1]}</span></span>{" "}
                    <span className="wmask"><span className="wmask-in">{L.w[2]}</span></span>{" "}
                    <span className="wmask">
                      <span className="wmask-in serif-accent contact-title-accent">{L.w[3]}</span>
                    </span>
                  </h1>
                  <p className="contact-subtitle" ref={subtitleRef}>
                    {L.subtitle}
                  </p>
                </div>

                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                  ref={formGroupsRef}
                >
                  <div className="contact-section">
                    <span className="contact-eyebrow">{L.interested}</span>
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
                              {lang === "ar" ? service.ar : service.label}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="contact-section">
                    <span className="contact-eyebrow">{L.name}</span>
                    <div className="contact-input">
                      <input
                        type="text"
                        name="name"
                        placeholder={L.namePh}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        required
                      />
                      <div className="contact-input-line" />
                    </div>
                  </div>

                  <div className="contact-section">
                    <span className="contact-eyebrow">{L.notes}</span>
                    <div className="contact-input">
                      <textarea
                        name="message"
                        placeholder={L.notesPh}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        required
                      />
                      <div className="contact-input-line" />
                    </div>
                  </div>

                  <div className="contact-hp" aria-hidden="true">
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honey}
                        onChange={(e) => setHoney(e.target.value)}
                      />
                    </label>
                  </div>

                  {mode === "email" && (
                    <div className="contact-email-fields" ref={emailFieldsRef}>
                      <div className="contact-section">
                        <span className="contact-eyebrow">{L.email}</span>
                        <div className="contact-input">
                          <input
                            type="email"
                            name="email"
                            dir="ltr"
                            placeholder={L.emailPh}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            maxLength={254}
                            required
                          />
                          <div className="contact-input-line" />
                        </div>
                      </div>
                      <div className="contact-section">
                        <span className="contact-eyebrow">{L.phone}</span>
                        <div className="contact-input">
                          <input
                            type="tel"
                            name="phone"
                            dir="ltr"
                            placeholder={L.phonePh}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="tel"
                            maxLength={40}
                          />
                          <div className="contact-input-line" />
                        </div>
                      </div>
                    </div>
                  )}

                  {mode === "email" ? (
                  <div className="contact-submit-section">
                    <button
                      type="submit"
                      className="btn-cta-submit btn-cta-email"
                      disabled={!isFormValid || !isEmailValid || sendState === "sending"}
                      aria-busy={sendState === "sending"}
                    >
                      {sendState === "sending" ? (
                        <span className="contact-spinner" aria-hidden="true" />
                      ) : (
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="16" height="12" rx="2" />
                    <path d="M2 7l8 5 8-5" />
                  </svg>
                      )}
                      <span>{sendState === "sending" ? L.sending : L.sendEmail}</span>
                    </button>
                    {sendState === "error" ? (
                      <div className="contact-send-error" role="alert">
                        <strong>{L.errTitle}</strong> {L.errDesc}{" "}
                        <a href={mailtoUrl()}>{L.errMail}</a>
                        {" · "}
                        <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                          {L.errWa}
                        </a>
                      </div>
                    ) : (
                      <p className="contact-handoff-note">{L.emailNote}</p>
                    )}
                    <button
                      type="button"
                      className="contact-alt-link"
                      onClick={() => {
                        setMode("whatsapp");
                        setSendState("idle");
                      }}
                    >
                      {L.backWa}
                    </button>
                  </div>
                  ) : (
                  <div className="contact-submit-section">
                    <button
                      type="submit"
                      className="btn-cta-submit btn-cta-whatsapp"
                      disabled={!isFormValid}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>{L.submit}</span>
                    </button>
                    <p className="contact-handoff-note">
                      {L.handoff}
                    </p>
                    <button
                      type="button"
                      className="contact-alt-link"
                      onClick={() => setMode("email")}
                    >
                      {L.emailAlt}
                    </button>
                  </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
