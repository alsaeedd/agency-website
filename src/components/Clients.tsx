import { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText";
import "./Clients.css";

const logos = [
  {
    name: "Jerar",
    src: "/assets/Screenshot_2024-06-04_at_1.53.17_PM-removebg-preview-2-e1719916646965.png",
    className: "",
  },
  {
    name: "Calo",
    src: "/assets/calo.png",
    className: "",
  },
  {
    name: "Citibank",
    src: "/assets/citibank.png",
    className: "logo-citibank",
  },
  {
    name: "Credimax",
    src: "/assets/credimax.png",
    className: "logo-credimax",
  },
  {
    name: "EarningSync",
    src: "/assets/earningsync.png",
    className: "logo-earningsync",
  },
];

// 4x duplication for seamless loop with translateX(-50%)
const track = [...logos, ...logos, ...logos, ...logos];

export default function Clients() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!trackRef.current) return;

    const images = trackRef.current.querySelectorAll("img");
    let loaded = 0;
    const total = images.length;

    const checkReady = () => {
      loaded++;
      if (loaded >= total) setReady(true);
    };

    images.forEach((img) => {
      if (img.complete) {
        checkReady();
      } else {
        img.addEventListener("load", checkReady, { once: true });
        img.addEventListener("error", checkReady, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", checkReady);
        img.removeEventListener("error", checkReady);
      });
    };
  }, []);

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
