import { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText";
import "./Clients.css";

const logos = [
  { name: "Calo",         src: "/assets/calo.png",                className: "" },
  { name: "Citibank",     src: "/assets/citibank.png",            className: "logo-citibank" },
  { name: "Baby Details", src: "/assets/babydetails.png",         className: "logo-babydetails" },
  { name: "Credimax",     src: "/assets/credimax.png",            className: "logo-credimax" },
  { name: "Kaak Bsemsom", src: "/assets/kaakbsemsom.png",         className: "logo-kaakbsemsom" },
  { name: "Jerar",        src: "/assets/Screenshot_2024-06-04_at_1.53.17_PM-removebg-preview-2-e1719916646965.png", className: "" },
  { name: "Golden Touch", src: "/assets/goldentouch.png",         className: "logo-goldentouch" },
  { name: "Palm & Plate", src: "/assets/palmnplate.png",          className: "logo-palmnplate" },
  { name: "EarningSync",  src: "/assets/earningsync.png",         className: "logo-earningsync" },
];

// 2x duplication — set 1 scrolls out, set 2 is visually identical, wrap is invisible
const track = [...logos, ...logos];

export default function Clients() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Wait for all images to load before measuring
  useEffect(() => {
    if (!trackRef.current) return;
    const images = trackRef.current.querySelectorAll("img");
    let loaded = 0;
    const total = images.length;
    const checkReady = () => { if (++loaded >= total) setReady(true); };
    images.forEach((img) => {
      if (img.complete) checkReady();
      else {
        img.addEventListener("load",  checkReady, { once: true });
        img.addEventListener("error", checkReady, { once: true });
      }
    });
    return () => {
      images.forEach((img) => {
        img.removeEventListener("load",  checkReady);
        img.removeEventListener("error", checkReady);
      });
    };
  }, []);

  useEffect(() => {
    if (!ready || !trackRef.current) return;
    const el = trackRef.current;

    // Precise wrap distance: left edge of item[0] → left edge of item[logos.length]
    // This is exactly one set width including all gaps, no rounding error from scrollWidth/2
    const r0 = (el.children[0] as HTMLElement).getBoundingClientRect();
    const r1 = (el.children[logos.length] as HTMLElement).getBoundingClientRect();
    const oneSetWidth = r1.left - r0.left;

    // 20 s per full set scroll
    const pxPerMs = oneSetWidth / (20 * 1000);

    let x = 0;
    let lastTime: number | null = null;
    let raf: number;

    const tick = (now: number) => {
      if (lastTime !== null) {
        x -= pxPerMs * (now - lastTime);
        // Modular wrap — x never resets to 0, just shifts by exactly one set width
        if (x <= -oneSetWidth) x += oneSetWidth;
        el.style.transform = `translateX(${x}px)`;
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
          {track.map((logo, i) => (
            <div key={i} className={`client-logo ${logo.className}`}>
              <img src={logo.src} alt={logo.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
