import { useEffect, useRef } from "react";
import "./CursorFollower.css";

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let dx = 0;
    let dy = 0;
    let rx = 0;
    let ry = 0;
    let active = false;
    let needsFrame = false;

    const tick = () => {
      const ddx = tx - dx;
      const ddy = ty - dy;
      const drx = tx - rx;
      const dry = ty - ry;

      dx += ddx * 0.55;
      dy += ddy * 0.55;
      rx += drx * 0.14;
      ry += dry * 0.14;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }

      // Continue only if still moving toward target
      const stillMoving =
        Math.abs(ddx) > 0.5 ||
        Math.abs(ddy) > 0.5 ||
        Math.abs(drx) > 0.5 ||
        Math.abs(dry) > 0.5;

      if (stillMoving || needsFrame) {
        needsFrame = false;
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      needsFrame = true;
      if (!active) {
        active = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      active = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest(
        "a, button, [role='button'], input, textarea, label",
      );
      if (ringRef.current) {
        ringRef.current.classList.toggle("is-hover", !!interactive);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseover", onOver);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
