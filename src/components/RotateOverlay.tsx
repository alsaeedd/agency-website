import { useEffect, useState } from "react";
import "./RotateOverlay.css";

export default function RotateOverlay() {
  const [mounted, setMounted]   = useState(false);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    const check = () => {
      const landscape   = window.innerWidth > window.innerHeight;
      const shortScreen = window.innerHeight <= 500;
      const touch       = navigator.maxTouchPoints > 0;
      const shouldShow  = touch && landscape && shortScreen;

      clearTimeout(hideTimer);

      if (shouldShow) {
        setMounted(true);
        // tiny delay so the element is in the DOM before opacity transition fires
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      } else {
        setVisible(false);
        // keep mounted until fade-out finishes (600 ms matches CSS transition)
        hideTimer = setTimeout(() => setMounted(false), 650);
      }
    };

    check();

    const onOrientationChange = () => setTimeout(check, 120);
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      clearTimeout(hideTimer);
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={`ro-overlay${visible ? " ro-visible" : ""}`}>
      <div className="ro-glow" />

      <div className="ro-rings-wrap">
        <div className="ro-ring ro-ring-1" />
        <div className="ro-ring ro-ring-2" />
        <div className="ro-ring ro-ring-3" />

        <div className="ro-phone-wrap">
          <svg className="ro-phone-svg" viewBox="0 0 24 40" fill="none">
            <rect x="1.5" y="1.5" width="21" height="37" rx="3.5"
              stroke="currentColor" strokeWidth="2" />
            <rect x="8" y="5" width="8" height="1.5" rx="0.75" fill="currentColor" />
            <circle cx="12" cy="34.5" r="1.5" fill="currentColor" />
          </svg>
          {/* Circular rotation arrows — direction-agnostic */}
          <svg className="ro-arrow-svg" viewBox="0 0 24 24" fill="none">
            <path d="M12 2a10 10 0 1 0 10 10" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round"/>
            <polyline points="17,2 22,2 22,7" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <p className="ro-title">Rotate Your Device</p>
      <p className="ro-sub">For the best experience</p>
    </div>
  );
}
