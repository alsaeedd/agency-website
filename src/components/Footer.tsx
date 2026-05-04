import logoMain from "../../assets/logo_main.png";
import "./Footer.css";

interface FooterProps {
  onContactClick: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-top-glow" />
      <div className="container">
        <div className="footer-body">
          <p className="footer-brand-desc">
            We are a forward-thinking digital agency specializing in custom
            software development and intelligent AI automation workflows. We
            transform businesses through cutting-edge technology and innovative
            solutions tailored to your unique needs.
          </p>

          <div className="footer-col">
            <span className="footer-col-label">Get in Touch</span>
            <div className="footer-contact-list">
              <a
                href="mailto:info@revenueautomationlab.com"
                className="footer-contact-row"
              >
                <span className="footer-contact-text">
                  <span className="footer-contact-type">Email</span>
                  <span className="footer-contact-val">
                    info@revenueautomationlab.com
                  </span>
                </span>
                <svg
                  className="footer-arrow"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 13L13 3M13 3H5M13 3V11" />
                </svg>
              </a>
              <a
                href="https://wa.me/97366386602"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-row"
              >
                <span className="footer-contact-text">
                  <span className="footer-contact-type">WhatsApp</span>
                  <span className="footer-contact-val">+973 6638 6602</span>
                </span>
                <svg
                  className="footer-arrow"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 13L13 3M13 3H5M13 3V11" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <span className="footer-col-label">Navigation</span>
            <nav className="footer-nav">
              <a href="#services" className="footer-nav-item">
                Services
              </a>
              <a href="#about" className="footer-nav-item">
                About
              </a>
              <a href="#clients" className="footer-nav-item">
                Clients
              </a>
              <button
                onClick={onContactClick}
                className="footer-nav-item footer-nav-btn"
              >
                Contact
              </button>
            </nav>
          </div>
        </div>

        <div className="footer-bar">
          <img src={logoMain} className="footer-bar-logo" alt="RAL" />
          <span className="footer-copy">
            &copy; 2026 Revenue Automation Lab. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
