import { useEffect, useState } from "react";
import "./NavLoader.css";

/**
 * Brief overlay shown when the user clicks a menu/nav link. Holds until the
 * smooth-scroll has visibly settled at the target so the user sees a clear
 * "I clicked → something is happening → arrived" loop instead of a janky
 * mid-scroll arrival. Pure CSS animations - no GSAP cost during scroll.
 *
 * Triggered by a custom event from App.tsx#scrollToSection:
 *   window.dispatchEvent(new CustomEvent("ral:nav-scroll", ...));
 *
 * Lifespan:
 *   - Shows for at LEAST 250ms (so it doesn't pop in and out and look
 *     glitchy on a fast scroll)
 *   - Holds until the user has stopped scrolling for ~120ms (settled at
 *     destination)
 *   - Hard cap at 1400ms so a long-page scroll never traps the user
 */
export default function NavLoader() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let hardCap: ReturnType<typeof setTimeout> | undefined;
    let minVisibleUntil = 0;
    let lastScroll = 0;

    const onScrollEnd = () => {
      // Wait until the scroll has been still for 120ms, OR the min-visible
      // window has elapsed, whichever is later.
      const now = performance.now();
      const settled = now - lastScroll > 120;
      const minMet = now >= minVisibleUntil;
      if (settled && minMet) {
        setActive(false);
      } else {
        // Re-check in 60ms.
        hideTimer = setTimeout(onScrollEnd, 60);
      }
    };

    const onScroll = () => {
      lastScroll = performance.now();
    };

    const onNavScroll = () => {
      lastScroll = performance.now();
      minVisibleUntil = performance.now() + 250;
      setActive(true);
      clearTimeout(hideTimer);
      clearTimeout(hardCap);
      hideTimer = setTimeout(onScrollEnd, 200);
      // Hard cap so we never get stuck visible.
      hardCap = setTimeout(() => setActive(false), 1400);
    };

    window.addEventListener("ral:nav-scroll", onNavScroll as EventListener);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("ral:nav-scroll", onNavScroll as EventListener);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(hideTimer);
      clearTimeout(hardCap);
    };
  }, []);

  return (
    <div
      className={`nav-loader${active ? " is-active" : ""}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="nav-loader-bar" />
    </div>
  );
}
