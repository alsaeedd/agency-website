import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import logoMain from "../../assets/logo_main.png";
import "./Navbar.css";
import { useLang, altPath, localePath } from "../i18n";

const NAV_AR: Record<string, string> = {
  Home: "الرئيسية",
  Services: "الخدمات",
  About: "من نحن",
  Clients: "عملاؤنا",
  "RAL HR": "RAL HR",
  "Contact Us": "تواصل معنا",
};

const navLinks = [
  { href: "#home", text: "Home" },
  { href: "#services", text: "Services" },
  { href: "#about", text: "About" },
  { href: "#clients", text: "Clients" },
  { href: "/ral-hr/", text: "RAL HR" },
];

const DESKTOP_BREAKPOINT = 768;

interface NavbarProps {
  onContactClick: () => void;
  scrollToSection: (selector: string) => void;
  /** Prefix for "#section" links on pages other than home, e.g. "/". */
  linkBase?: string;
  /** Link shown as the current page. */
  activeHref?: string;
  /** Keep the bar visible at the top of the page (product pages). */
  showAtTop?: boolean;
}

/**
 * Navbar ported from palmandplate-landingpage with all the touch-friendly
 * UX: 3-line hamburger that morphs to X, full-screen mobile overlay,
 * body-scroll-lock, escape-key close, resize-to-desktop close, click-
 * outside-to-close, scrolled-state class at >80px scroll. Adapted to RAL's
 * purple/violet aesthetic + integrated with our scrollToSection prop.
 */
export default function Navbar({ onContactClick, scrollToSection, linkBase = "", activeHref, showAtTop = false }: NavbarProps) {
  const lang = useLang();
  const ar = lang === "ar";
  const label = (s: string) => (ar ? NAV_AR[s] ?? s : s);
  // Same page in the other language; SSR has no location, so start from home.
  const [alt, setAlt] = useState(ar ? "/" : "/ar/");
  useEffect(() => setAlt(altPath(location.pathname)), []);
  const langToggle = (
    <a
      className="lang-toggle"
      href={alt}
      hrefLang={ar ? "en" : "ar"}
      aria-label={ar ? "English" : "العربية"}
      onClick={(e) => { e.currentTarget.href = alt + location.hash; }}
    >
      <span className={ar ? undefined : "is-on"} lang="en">EN</span>
      <span className="lang-sep" aria-hidden="true">/</span>
      <span className={ar ? "is-on" : undefined} lang="ar">عربي</span>
    </a>
  );
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── Entrance reveal - fade in once the user scrolls past ~60px.
  // Stays mostly out of the way at the very top, then slides in. Cheaper
  // than a continuous transform - only updates when crossing the threshold.
  useEffect(() => {
    if (!navRef.current) return;
    if (!showAtTop) gsap.set(navRef.current, { yPercent: -100, opacity: 0 });

    let visible = showAtTop;
    let scrolledLocal = false;

    const onScroll = () => {
      const y = window.scrollY;

      // Slide in / out
      if (y > 60 && !visible) {
        visible = true;
        gsap.to(navRef.current, {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: "expo.out",
        });
      } else if (y <= 60 && visible && !showAtTop) {
        visible = false;
        gsap.to(navRef.current, {
          yPercent: -100,
          opacity: 0,
          duration: 0.35,
          ease: "power3.in",
        });
      }

      // Scrolled-state class (deeper background, brighter text)
      const shouldBeScrolled = y > 80;
      if (shouldBeScrolled !== scrolledLocal) {
        scrolledLocal = shouldBeScrolled;
        setScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Body scroll lock when menu is open. Use overflow hidden on the
  // document element, not body, so iOS Safari behaves.
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  // ── Close on Escape key.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // ── Close when resizing past the mobile breakpoint (orientation change,
  // foldable phones, dev tools).
  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    // Defer a frame so the menu's close transition starts before scroll
    // begins - feels more cohesive than scrolling immediately.
    requestAnimationFrame(() => scrollToSection(href));
  };

  const handleContactClick = () => {
    setMenuOpen(false);
    onContactClick();
  };

  return (
    <>
      <header
        className={`navbar${scrolled ? " nav-scrolled" : ""}${showAtTop ? " nav-solid" : ""}`}
        ref={navRef}
      >
        <div className="container">
          <div className="navbar-inner">
            <a href={localePath(lang, "/")} className="navbar-logo" aria-label={label("Home")}>
              <img src={logoMain} alt="" className="navbar-logo-icon" />
            </a>

            <nav className="navbar-nav">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href.startsWith("#") ? (linkBase && localePath(lang, linkBase)) + link.href : localePath(lang, link.href)}
                  className={link.href === activeHref ? "is-active" : undefined}
                  aria-current={link.href === activeHref ? "page" : undefined}
                  data-text={label(link.text)}
                  onClick={(e) => {
                    if (!link.href.startsWith("#") || linkBase) return;
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                >
                  <span>{label(link.text)}</span>
                </a>
              ))}
              <button
                onClick={onContactClick}
                data-text={label("Contact Us")}
                className="navbar-contact-btn"
              >
                <span>{label("Contact Us")}</span>
              </button>
              {langToggle}
            </nav>

            <button
              className={`navbar-hamburger${menuOpen ? " is-open" : ""}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={ar ? (menuOpen ? "إغلاق القائمة" : "فتح القائمة") : menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="burger-line" />
              <span className="burger-line" />
              <span className="burger-line" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu overlay - outside the navbar, fixed inset:0
          so it covers everything behind it. Always rendered but visually
          hidden when closed (opacity + pointer-events) so the open/close
          transition has time to run. */}
      <div
        id="mobile-menu"
        className={`navbar-mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div
          className="navbar-mobile-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
        <div className="navbar-mobile-content">
          <nav className="navbar-mobile-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href.startsWith("#") ? (linkBase && localePath(lang, linkBase)) + link.href : localePath(lang, link.href)}
                className={"navbar-mobile-link" + (link.href === activeHref ? " is-active" : "")}
                aria-current={link.href === activeHref ? "page" : undefined}
                onClick={(e) => {
                  if (!link.href.startsWith("#") || linkBase) return;
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
              >
                {label(link.text)}
              </a>
            ))}
          </nav>
          <div className="navbar-mobile-divider" aria-hidden="true" />
          <button
            onClick={handleContactClick}
            className="navbar-mobile-contact-btn"
          >
            {label("Contact Us")}
          </button>
          {langToggle}
        </div>
      </div>
    </>
  );
}
