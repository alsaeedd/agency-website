import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Showreel() {
  const previewRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!previewRef.current) return;

    gsap.fromTo(
      previewRef.current,
      { scale: 0.9, opacity: 0, clipPath: "inset(10% round 2rem)" },
      {
        scale: 1,
        opacity: 1,
        clipPath: "inset(0% round 2rem)",
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: previewRef.current,
          start: "top 90%",
          once: true,
        },
      }
    );

    // Parallax effect on scroll
    gsap.to(videoRef.current, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: previewRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section className="showreel">
      <div className="container">
        <div className="showreel-preview" ref={previewRef}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80"
          >
            <source
              src="https://ral-website.com/assets/showreel/short.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </section>
  );
}
