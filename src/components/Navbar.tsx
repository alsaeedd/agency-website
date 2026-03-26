import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import logoMain from "../../assets/logo_main.png";
import "./Navbar.css";

// Mobile-first navbar component with smooth animations and hamburger menu support
const navLinks = [
  { href: "#services", text: "Services" },
  { href: "#about", text: "About" },
  { href: "#clients", text: "Clients" },
];

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    // Start hidden — only appears when user scrolls
    gsap.set(navRef.current, { yPercent: -100, opacity: 0 });

    let visible = false;

    const onScroll = () => {
      if (window.scrollY > 60 && !visible) {
        visible = true;
        gsap.to(navRef.current, { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out" });
      } else if (window.scrollY <= 60 && visible) {
        visible = false;
        gsap.to(navRef.current, { yPercent: -100, opacity: 0, duration: 0.4, ease: "power3.in" });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" },
      );
    }
  }, [mobileMenuOpen]);

  const handleMobileContactClick = () => {
    setMobileMenuOpen(false);
    onContactClick();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar" ref={navRef}>
      <div className="container">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo" aria-label="Home">
            <img src={logoMain} alt="" className="navbar-logo-icon" />
          </a>
          <nav className="navbar-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} data-text={link.text}>
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
            className={`navbar-hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          ></button>
        </div>

        {mobileMenuOpen && (
          <div className="navbar-mobile-menu" ref={mobileMenuRef}>
            <nav className="navbar-mobile-nav">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="navbar-mobile-link"
                  onClick={closeMobileMenu}
                >
                  {link.text}
                </a>
              ))}
              <button
                onClick={handleMobileContactClick}
                className="navbar-mobile-contact-btn"
              >
                Contact Us
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
