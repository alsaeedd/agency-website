import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ContactCircle.css";

interface ContactCircleProps {
  onClick: () => void;
}

export default function ContactCircle({ onClick }: ContactCircleProps) {
  const circleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!circleRef.current) return;

    // Start hidden — appears when corner labels pop up (progress ~0.15 of the hero timeline)
    // Timeline spans 2.5×vh, so labels appear at ~0.375×vh scroll
    gsap.set(circleRef.current, { scale: 0.5, opacity: 0 });

    let visible = false;

    const onScroll = () => {
      const threshold = window.innerHeight * 0.4;

      if (window.scrollY > threshold && !visible) {
        visible = true;
        gsap.to(circleRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: "back.out(1.2)",
          clearProps: "scale",
        });
      } else if (window.scrollY <= threshold && visible) {
        visible = false;
        gsap.to(circleRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className="contact-circle"
      ref={circleRef}
      onClick={onClick}
      aria-label="Get in touch"
    >
      <div className="contact-circle-inner">
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
            zIndex: 1,
          }}
        >
          <source src="/assets/gutra_guy.mp4" type="video/mp4" />
        </video>
        <div
          className="contact-circle-text"
          style={{ position: "absolute", zIndex: 2 }}
        >
          <svg
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="textPath"
              d="M75,75 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0"
              fill="none"
            />
            <text fill="white" fontSize="11" fontWeight="500" letterSpacing="1">
              <textPath href="#textPath">
                contact - contact - contact - contact - contact
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </button>
  );
}
