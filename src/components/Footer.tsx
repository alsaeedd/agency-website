// const footerLinks = [
//   { href: "#services", text: "Services" },
//   { href: "#contact", text: "Contact Us" },
// ];

// const socialLinks = [
//   { href: "#", icon: "instagram", label: "Instagram" },
//   { href: "#", icon: "youtube", label: "YouTube" },
//   { href: "#", icon: "github", label: "GitHub" },
//   { href: "#", icon: "dribbble", label: "Dribbble" },
//   { href: "#", icon: "behance", label: "Behance" },
// ];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-locations">
            <address className="footer-location">
              <div className="footer-location-action">
                <a href="mailto:info@ral-website.com">
                  saeedalsaeedbusiness@gmail.com
                </a>
              </div>
            </address>
            <address className="footer-location">
              <div className="footer-location-action">
                <a
                  href="https://wa.me/97333843915"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +973 3384 3915
                </a>
              </div>
            </address>
          </div>
          <div className="footer-disclaimer">
            <span className="disclaimer-trigger">
              Disclaimer
              <div className="disclaimer-tooltip">
                <div className="disclaimer-tooltip-content">
                  The design of this website is not original whatsoever. It is
                  completely the innovation and artwork of the Cuberto Design
                  Agency. All credits for the entire design go to them. Please
                  visit them here:{" "}
                  <a
                    href="https://cuberto.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    cuberto.com
                  </a>
                </div>
              </div>
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">
            <span>2025, Revenue Automation Lab</span>
          </div>
          {/* <div className="footer-socials">
            {socialLinks.map((social) => (
              <a
                key={social.icon}
                href={social.href}
                className="footer-social"
                aria-label={social.label}
              >
                <SocialIcon name={social.icon} />
              </a>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}

// function SocialIcon({ name }: { name: string }) {
//   const icons: Record<string, JSX.Element> = {
//     instagram: (
//       <svg
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//         <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//         <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//       </svg>
//     ),
//     youtube: (
//       <svg
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
//         <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
//       </svg>
//     ),
//     github: (
//       <svg
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
//       </svg>
//     ),
//     dribbble: (
//       <svg
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//       >
//         <circle cx="12" cy="12" r="10" />
//         <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
//       </svg>
//     ),
//     behance: (
//       <svg viewBox="0 0 24 24" fill="currentColor">
//         <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
//       </svg>
//     ),
//   };

//   return icons[name] || null;
// }
