import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import logoMain from "../../assets/logo_main.png";
import "./Navbar.css";

const navLinks = [
  { href: "#services", text: "Services" },
  { href: "#about", text: "About" },
  { href: "#clients", text: "Clients" },
];

const DESKTOP_BREAKPOINT = 768;

interface NavbarProps {
  onContactClick: () => void;
  scrollToSection: (selector: string) => void;
}

/**
 * Navbar ported from palmandplate-landingpage with all the touch-friendly
 * UX: 3-line hamburger that morphs to X, full-screen mobile overlay,
 * body-scroll-lock, escape-key close, resize-to-desktop close, click-
 * outside-to-close, scrolled-state class at >80px scroll. Adapted to RAL's
 * purple/violet aesthetic + integrated with our scrollToSection prop.
 */
export default function Navbar({ onContactClick, scrollToSection }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── Entrance reveal — fade in once the user scrolls past ~60px.
  // Stays mostly out of the way at the very top, then slides in. Cheaper
  // than a continuous transform — only updates when crossing the threshold.
  useEffect(() => {
    if (!navRef.current) return;
    gsap.set(navRef.current, { yPercent: -100, opacity: 0 });

    let visible = false;
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
      } else if (y <= 60 && visible) {
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
    // begins — feels more cohesive than scrolling immediately.
    requestAnimationFrame(() => scrollToSection(href));
  };

  const handleContactClick = () => {
    setMenuOpen(false);
    onContactClick();
  };

  return (
    <>
      <header
        className={`navbar${scrolled ? " nav-scrolled" : ""}`}
        ref={navRef}
      >
        <div className="container">
          <div className="navbar-inner">
            <a href="/" className="navbar-logo" aria-label="Home">
              <img src={logoMain} alt="" className="navbar-logo-icon" />
            </a>

            <nav className="navbar-nav">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-text={link.text}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                >
                  <span>{link.text}</span>
                </a>
              ))}
              <button
                onClick={onContactClick}
                data-text="Contact Us"
                className="navbar-contact-btn"
              >
                <span>Contact Us</span>
              </button>
            </nav>

            <button
              className={`navbar-hamburger${menuOpen ? " is-open" : ""}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
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

      {/* Full-screen mobile menu overlay — outside the navbar, fixed inset:0
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
                href={link.href}
                className="navbar-mobile-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
              >
                {link.text}
              </a>
            ))}
          </nav>
          <div className="navbar-mobile-divider" aria-hidden="true" />
          <button
            onClick={handleContactClick}
            className="navbar-mobile-contact-btn"
          >
            Contact Us
          </button>
        </div>
      </div>
    </>
  );
}
