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
                href="mailto:info@raltech.dev"
                className="footer-contact-row"
              >
                <span className="footer-contact-text">
                  <span className="footer-contact-type">Email</span>
                  <span className="footer-contact-val">
                    info@raltech.dev
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
          <img src={logoMain} className="footer-bar-logo" alt="RAL Technologies" />

          <div className="footer-socials" aria-label="RAL Technologies on social media">
            <a
              href="https://instagram.com/raltechh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer-social"
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
              className="footer-social"
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
              className="footer-social"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.22 0z" />
              </svg>
            </a>
            <a
              href="https://wa.me/97366386602"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="footer-social"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>
          </div>

          <span className="footer-copy">
            &copy; 2026 RAL Technologies. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
