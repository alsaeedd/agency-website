import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Clients.css";

gsap.registerPlugin(ScrollTrigger);

type Logo = {
  name: string;
  src: string;
  className?: string;
  href?: string;
};

const logos: Logo[] = [
  { name: "Calo",         src: "/assets/calo.png",          className: "" },
  { name: "Citibank",     src: "/assets/citibank.png",      className: "logo-citibank" },
  { name: "Baby Details", src: "/assets/babydetails.png",   className: "logo-babydetails" },
  { name: "Credimax",     src: "/assets/credimax.png",      className: "logo-credimax" },
  { name: "Kaak Bsemsom", src: "/assets/kaakbsemsom.png",   className: "logo-kaakbsemsom", href: "https://www.kaakbsemsom.com" },
  { name: "Knights Gate", src: "/assets/knightsgate-mark.png", className: "logo-knightsgate", href: "https://www.kgadvisers.com" },
  { name: "Yellow Sports", src: "/assets/yellowsports.jpeg", className: "logo-yellowsports", href: "https://www.yellowsportsbh.com" },
  { name: "Jerar",        src: "/assets/Screenshot_2024-06-04_at_1.53.17_PM-removebg-preview-2-e1719916646965.png", className: "" },
  { name: "Golden Touch", src: "/assets/goldentouch.png",   className: "logo-goldentouch" },
  { name: "Palm & Plate", src: "/assets/palmnplate.png",    className: "logo-palmnplate", href: "https://www.palmandplate.com" },
  { name: "EarningSync",  src: "/assets/earningsync.png",   className: "logo-earningsync", href: "https://www.earningsync.com" },
  { name: "CustomPC",     src: "/assets/custompc.png",      className: "logo-custompc", href: "https://www.custompcbh.com" },
];

// Split logos roughly in half for two distinct rows
const half = Math.ceil(logos.length / 2);
const rowA = logos.slice(0, half);
const rowB = logos.slice(half);

// Triple each row so the CSS translate(-33.333%) loops seamlessly
const trackA = [...rowA, ...rowA, ...rowA];
const trackB = [...rowB, ...rowB, ...rowB];

function LogoItem({ logo, idx }: { logo: Logo; idx: number }) {
  const inner = (
    <>
      <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
      {logo.href && (
        <span className="client-logo-link-cue" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 11l6-6" />
            <path d="M6.5 5h4.5v4.5" />
          </svg>
        </span>
      )}
    </>
  );
  const baseClass = `client-logo ${logo.className ?? ""}${logo.href ? " is-linked" : ""}`;
  return logo.href ? (
    <a
      key={idx}
      className={baseClass}
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${logo.name}`}
      title={`Visit ${logo.name}`}
    >
      {inner}
    </a>
  ) : (
    <div key={idx} className={baseClass} aria-label={logo.name}>
      {inner}
    </div>
  );
}

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const tier = document.documentElement.dataset.tier;
    const isMobile =
      tier !== "high" ||
      (typeof matchMedia === "function" &&
        matchMedia("(pointer: coarse)").matches);
    if (isMobile) return;

    const ctx = gsap.context(() => {
      gsap.from(
        sectionRef.current!.querySelectorAll(".clients-header-anim"),
        {
          opacity: 0,
          y: 28,
          filter: "blur(10px)",
          duration: 1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="clients" id="clients" ref={sectionRef}>
      <div className="clients-ambient" aria-hidden="true" />

      <div className="container">
        <div className="clients-header">
          <span className="clients-eyebrow clients-header-anim">
            <span className="clients-eyebrow-dot" aria-hidden="true" />
            Trusted by
          </span>
          <h2 className="clients-heading clients-header-anim">
            Teams that{" "}
            <span className="clients-heading-accent">ship.</span>
          </h2>
          <p className="clients-intro clients-header-anim">
            From bootstrapped founders to banks - the same care, every brief,
            every brand.
          </p>
        </div>
      </div>

      {/* Top row: scrolls right -> left */}
      <div className="clients-marquee">
        <div className="clients-track clients-track-left">
          {trackA.map((logo, i) => (
            <LogoItem key={`a-${i}`} logo={logo} idx={i} />
          ))}
        </div>
      </div>

      {/* Bottom row: scrolls left -> right (opposite direction) */}
      <div className="clients-marquee clients-marquee-2">
        <div className="clients-track clients-track-right">
          {trackB.map((logo, i) => (
            <LogoItem key={`b-${i}`} logo={logo} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
