import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const navLinks = [
  { href: "#services", text: "Services" },
];

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "expo.out" }
    );
  }, []);

  return (
    <header className="navbar" ref={navRef}>
      <div className="container">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo" aria-label="Home">
            <span className="logo-text">revenue automation lab</span>
          </a>
          <nav className="navbar-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-text={link.text}
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
        </div>
      </div>
    </header>
  );
}
