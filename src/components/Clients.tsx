import { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText";
import "./Clients.css";

type Logo = {
  name: string;
  src: string;
  className?: string;
  href?: string;
};

const logos: Logo[] = [
  { name: "Calo",            src: "/assets/calo.png",                                                                  className: "" },
  { name: "Citibank",        src: "/assets/citibank.png",                                                              className: "logo-citibank" },
  { name: "Baby Details",    src: "/assets/babydetails.png",                                                           className: "logo-babydetails" },
  { name: "Credimax",        src: "/assets/credimax.png",                                                              className: "logo-credimax" },
  { name: "Kaak Bsemsom",    src: "/assets/kaakbsemsom.png",                                                           className: "logo-kaakbsemsom",   href: "https://www.kaakbsemsom.com" },
  { name: "Knights Gate",    src: "/assets/knightsgate-mark.png",                                                      className: "logo-knightsgate",   href: "https://www.kgadvisers.com" },
  { name: "Yellow Sports",   src: "/assets/yellowsports.jpeg",                                                         className: "logo-yellowsports",  href: "https://www.yellowsportsbh.com" },
  { name: "Jerar",           src: "/assets/Screenshot_2024-06-04_at_1.53.17_PM-removebg-preview-2-e1719916646965.png", className: "" },
  { name: "Golden Touch",    src: "/assets/goldentouch.png",                                                           className: "logo-goldentouch" },
  { name: "Palm & Plate",    src: "/assets/palmnplate.png",                                                            className: "logo-palmnplate",    href: "https://www.palmandplate.com" },
  { name: "EarningSync",     src: "/assets/earningsync.png",                                                           className: "logo-earningsync",   href: "https://www.earningsync.com" },
  { name: "CustomPC",        src: "/assets/custompc.png",                                                              className: "logo-custompc" },
];

const track = [...logos, ...logos];

export default function Clients() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Wait for all images to load before measuring — with a safety timeout so a
  // single slow/blocked asset (or a never-firing lazy-load) can't strand the
  // track at opacity: 0 forever.
  useEffect(() => {
    if (!trackRef.current) return;
    const images = trackRef.current.querySelectorAll("img");
    let loaded = 0;
    let done = false;
    const total = images.length;
    const finish = () => { if (!done) { done = true; setReady(true); } };
    const checkReady = () => { if (++loaded >= total) finish(); };
    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) checkReady();
      else {
        img.addEventListener("load",  checkReady, { once: true });
        img.addEventListener("error", checkReady, { once: true });
      }
    });
    const fallback = window.setTimeout(finish, 1500);
    return () => {
      window.clearTimeout(fallback);
      images.forEach((img) => {
        img.removeEventListener("load",  checkReady);
        img.removeEventListener("error", checkReady);
      });
    };
  }, []);

  useEffect(() => {
    if (!ready || !trackRef.current) return;
    const el = trackRef.current;

    const r0 = (el.children[0] as HTMLElement).getBoundingClientRect();
    const r1 = (el.children[logos.length] as HTMLElement).getBoundingClientRect();
    const oneSetWidth = r1.left - r0.left;

    const pxPerMs = oneSetWidth / (28 * 1000);

    let x = 0;
    let lastTime: number | null = null;
    let raf: number;

    const tick = (now: number) => {
      if (lastTime !== null) {
        x -= pxPerMs * (now - lastTime);
        if (x <= -oneSetWidth) x += oneSetWidth;
        el.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      lastTime = now;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <section className="clients" id="clients">
      <div className="container">
        <div className="clients-header">
          <AnimatedText
            as="h2"
            className="section-title"
            triggerOnScroll
            stagger={0.1}
          >
            Our team has built for
          </AnimatedText>
        </div>
      </div>

      <div className="clients-marquee">
        <div
          className={`clients-track${ready ? " ready" : ""}`}
          ref={trackRef}
        >
          {track.map((logo, i) => {
            const inner = (
              <>
                <img src={logo.src} alt={logo.name} />
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
                key={i}
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
              <div key={i} className={baseClass} aria-label={logo.name}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
