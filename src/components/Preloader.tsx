import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lusion-tier intro preloader.
 *
 * The markup + critical CSS live inline in index.html so the wordmark stroke
 * begins drawing on the FIRST frame (before any Vite chunk hits the wire).
 * React only drives:
 *   1) A real percentage counter that tracks multi-source ready progress -
 *      fonts, window 'load', the hero WebGL "ral:hero-ready" event.
 *   2) The final exit timeline: counter snaps to 100, wordmark fills, then
 *      the whole overlay clips upward, the stage flies up faster than the
 *      mask so the wordmark "escapes" before the curtain closes.
 *   3) A safety dismissal after 4.5s so a stalled signal never traps anyone.
 *
 * This component renders nothing - it mutates the pre-existing #ral-preloader
 * element.
 */
export default function Preloader() {
  useEffect(() => {
    const el = document.getElementById("ral-preloader");
    if (!el) return;
    const numEl = el.querySelector<HTMLSpanElement>(".ralpl-num");
    const stage = el.querySelector<HTMLElement>(".ralpl-stage");
    if (!numEl || !stage) return;

    let dismissed = false;
    // Counter starts at 0 and walks toward `target` over time. We advance
    // `target` as real readiness signals fire - so the number always tracks
    // genuine progress, never a fake timer.
    const counter = { value: 0 };
    let target = 8; // small initial creep so the number is alive immediately

    const writeCount = () => {
      const v = Math.floor(counter.value);
      if (numEl.textContent !== String(v)) numEl.textContent = String(v);
    };

    // Continuous tween toward `target`. The tween restarts every time we bump
    // `target`, so the counter eases into each new ceiling smoothly.
    const counterTween = gsap.to(counter, {
      value: 8,
      duration: 1.0,
      ease: "power2.out",
      onUpdate: writeCount,
    });
    const advanceTo = (next: number, duration: number) => {
      target = Math.max(target, next);
      counterTween.kill();
      gsap.to(counter, {
        value: target,
        duration,
        ease: "power2.out",
        onUpdate: writeCount,
      });
    };

    // ─── Multi-source readiness ────────────────────────────────────────
    const fontsReady =
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ??
      Promise.resolve();

    const loadReady: Promise<void> = new Promise((resolve) => {
      if (document.readyState === "complete") return resolve();
      window.addEventListener("load", () => resolve(), { once: true });
    });

    const heroReady: Promise<void> = new Promise((resolve) => {
      window.addEventListener("ral:hero-ready", () => resolve(), { once: true });
    });

    // With React.lazy retired, every below-fold section is now in the main
    // bundle and mounts synchronously with the app - no separate chunk to
    // wait for. window.load already covers the JS + critical asset
    // download. Three-source readiness is enough now.
    // Minimum visible time so the curtain doesn't pop in and out on
    // ultra-fast connections (cached load). Also gives async hydration
    // + GSAP setup a chance to settle before reveal so the user never
    // sees a janky first-frame.
    const minVisible: Promise<void> = new Promise((resolve) =>
      setTimeout(resolve, 1200),
    );

    fontsReady.then(() => advanceTo(34, 0.55));
    loadReady.then(() => advanceTo(72, 0.7));
    heroReady.then(() => advanceTo(96, 0.5));

    // Idle settle: let the main thread breathe before the dramatic exit, so
    // GSAP runs at 60fps instead of fighting the first hero GC pause.
    const settleIdle = (): Promise<void> =>
      new Promise((resolve) => {
        const ric = (
          window as Window & {
            requestIdleCallback?: (
              cb: () => void,
              opts?: { timeout: number },
            ) => number;
          }
        ).requestIdleCallback;
        if (ric) ric(() => resolve(), { timeout: 400 });
        else setTimeout(resolve, 60);
      });

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;

      // CRITICAL: refresh ScrollTrigger right before the curtain lifts so
      // every cached trigger start/end position is recomputed against the
      // FINAL layout (fonts loaded, images loaded, lazy chunks mounted).
      // Without this, entrance animations on About / Portfolio / etc. can
      // fire at the wrong scrollY on mobile and look like they "never
      // popped up". One refresh inside rAF is idempotent + cheap.
      try {
        ScrollTrigger.refresh();
      } catch {
        /* GSAP not yet loaded; non-fatal */
      }

      el.setAttribute("data-state", "leaving");

      // Snap the counter to 100, fill the wordmark (CSS reacts to data-state),
      // then run a two-part exit: stage flies up, overlay clips upward.
      const exit = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          el.classList.add("is-removed");
          el.remove();
        },
      });

      exit
        .to(counter, {
          value: 100,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: writeCount,
        })
        .to({}, { duration: 0.18 }) // brief beat with the 100% held + filled
        .to(
          stage,
          {
            yPercent: -160,
            duration: 1.0,
            ease: "expo.inOut",
          },
          ">-0.02",
        )
        .to(
          el,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.95,
            ease: "expo.inOut",
          },
          "<0.08",
        );
    };

    // Safety: dismiss after 4.5s no matter what so a stalled font / hidden tab
    // / failed WebGL init never traps the user behind the curtain.
    const safety = window.setTimeout(dismiss, 4500);

    Promise.all([fontsReady, loadReady, heroReady, minVisible])
      .then(settleIdle)
      .then(() => {
        clearTimeout(safety);
        dismiss();
      })
      .catch(() => {
        clearTimeout(safety);
        dismiss();
      });

    return () => {
      window.clearTimeout(safety);
      counterTween.kill();
    };
  }, []);

  return null;
}
