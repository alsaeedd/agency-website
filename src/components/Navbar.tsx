import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const navLinks = [{ href: "#services", text: "Services" }];

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "expo.out" },
    );
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
            <span className="logo-text">Revenue Automation Lab</span>
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
