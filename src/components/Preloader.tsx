import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Intro preloader — the RAL wordmark is a glass that fills with liquid while a
 * 3s startup chime plays, erupting on the chime's climax, then the curtain
 * lifts on the site.
 *
 * Browser autoplay policy blocks audible audio without a user gesture, so the
 * chime is unlocked by a "tap to begin" gesture (the whole overlay is the
 * target). The chime routes through an <audio> element + MediaElementSource so
 * the iOS hardware-mute switch doesn't silence it, while still feeding an
 * AnalyserNode that drives the liquid's surface wobble in real time.
 *
 * It never traps the visitor: if nothing is tapped within a few seconds of the
 * page being ready, it runs the fill silently and reveals; if audio playback is
 * refused, the visual still completes.
 *
 * The markup + critical CSS live inline in index.html so the empty glass paints
 * on the first frame; this component drives the liquid path + audio + reveal.
 */

const VB_W = 320;
const CHIME_SRC = "/intro-chime.mp3";
// Chime is 3.3s and ends on a sustained "high note" (~2.4–2.7s) + reverb tail.
// The glass fills and erupts on that high note, and the curtain lifts THEN —
// riding the reverb — rather than waiting for the audio to fully finish.
const AUDIO_DUR = 3.3; // full chime length
const FILL_DUR = 2.45; // glass reaches full just as the high note lands
const CLIMAX = 2.5; // eruption surge = the high note
const REVEAL_AT = 2.6; // curtain flies up here, over the reverb tail

export default function Preloader() {
  useEffect(() => {
    const el = document.getElementById("ral-preloader");
    if (!el) return;
    const liquid = el.querySelector<SVGPathElement>(".ralpl-liquid");
    const shine = el.querySelector<SVGPathElement>(".ralpl-liquid-shine");
    const stage = el.querySelector<HTMLElement>(".ralpl-stage");
    if (!liquid || !stage) return;

    const reduce =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let begun = false;
    let dismissed = false;

    // ── Liquid surface geometry ──────────────────────────────────────────
    // level 0 → empty (surface below the letters), 1 → full (above the caps).
    const SEG = 14;
    const buildPaths = (level: number, amp: number, t: number) => {
      const surf = 78 - level * 72; // 78 (empty) → 6 (full + slight overflow)
      const ys: number[] = [];
      for (let i = 0; i <= SEG; i++) {
        const y =
          surf +
          Math.sin(t * 3.2 + i * 0.9) * amp * 0.6 +
          Math.sin(t * 5.1 + i * 0.5) * amp * 0.4;
        ys.push(y);
      }
      // body: from bottom-left, up to the wavy surface, across, down to bottom
      let d = `M0 104 L0 ${ys[0].toFixed(1)}`;
      for (let i = 0; i <= SEG; i++) d += ` L${((i / SEG) * VB_W).toFixed(1)} ${ys[i].toFixed(1)}`;
      d += ` L${VB_W} 104 Z`;
      liquid.setAttribute("d", d);
      // surface highlight ribbon (~3px under the crest) for a glassy meniscus
      if (shine) {
        let s = `M0 ${ys[0].toFixed(1)}`;
        for (let i = 1; i <= SEG; i++) s += ` L${((i / SEG) * VB_W).toFixed(1)} ${ys[i].toFixed(1)}`;
        for (let i = SEG; i >= 0; i--)
          s += ` L${((i / SEG) * VB_W).toFixed(1)} ${(ys[i] + 3).toFixed(1)}`;
        s += " Z";
        shine.setAttribute("d", s);
      }
    };
    buildPaths(0, 0, 0); // start empty

    // ── Audio (created up front so it preloads; analyser wired on the gesture)
    const audio = new Audio(CHIME_SRC);
    audio.preload = "auto";
    let actx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let timeData: Uint8Array | null = null;
    const wireAudio = () => {
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AC) return;
        actx = new AC();
        const src = actx.createMediaElementSource(audio);
        analyser = actx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        src.connect(analyser);
        analyser.connect(actx.destination);
        timeData = new Uint8Array(analyser.fftSize);
      } catch {
        analyser = null; // no Web Audio → fill still runs, just no live wobble
      }
    };
    const liveRms = () => {
      if (!analyser || !timeData) return 0;
      analyser.getByteTimeDomainData(timeData);
      let sum = 0;
      for (let i = 0; i < timeData.length; i++) {
        const v = (timeData[i] - 128) / 128;
        sum += v * v;
      }
      return Math.sqrt(sum / timeData.length);
    };

    // ── Readiness gates the REVEAL (not the tap): resolves on all signals or
    //    a 4.5s safety so it can never hang. ──────────────────────────────
    const fontsReady =
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ??
      Promise.resolve();
    const loadReady = new Promise<void>((r) =>
      document.readyState === "complete"
        ? r()
        : window.addEventListener("load", () => r(), { once: true }),
    );
    const heroReady = new Promise<void>((r) =>
      window.addEventListener("ral:hero-ready", () => r(), { once: true }),
    );
    const minVisible = new Promise<void>((r) => setTimeout(r, 900));
    let pageReady = false;
    const pageReadyP = new Promise<void>((resolve) => {
      const done = () => {
        pageReady = true;
        resolve();
      };
      Promise.all([fontsReady, loadReady, heroReady, minVisible])
        .then(done)
        .catch(done);
      setTimeout(done, 4500); // safety
    });

    // Invite the tap once the outline has drawn in.
    const gateTimer = window.setTimeout(() => {
      if (!begun) el.setAttribute("data-ready", "1");
    }, 1650);

    // ── The run: fill + (optional) audio + reveal ────────────────────────
    const run = (withAudio: boolean) => {
      if (begun) return;
      begun = true;
      clearTimeout(gateTimer);
      clearTimeout(idleTimer);
      el.setAttribute("data-state", "playing");

      if (withAudio) {
        wireAudio();
        actx?.resume?.();
        const p = audio.play();
        // If the gesture somehow didn't unlock audio, keep the visual going.
        if (p && typeof p.catch === "function") p.catch(() => {});
      }

      const t0 = performance.now();
      const tick = (now: number) => {
        const t = (now - t0) / 1000;
        const p = Math.min(1, t / FILL_DUR);
        const eased = p * p * (3 - 2 * p); // smoothstep base fill
        const surge = Math.exp(-Math.pow((t - CLIMAX) / 0.24, 2)); // 0..1 bell at the high note
        const level = Math.min(1.06, eased + surge * 0.09);
        const amp = 1.4 + (withAudio ? liveRms() * 11 : 0) + surge * 15;
        buildPaths(level, amp, t);
        if (t < REVEAL_AT) raf = requestAnimationFrame(tick);
        else reveal(); // fire on the high note; audio reverb plays under the lift
      };
      raf = requestAnimationFrame(tick);
      // Hard safety: never let the intro outlast the chime if rAF stalls.
      window.setTimeout(reveal, (AUDIO_DUR + 0.5) * 1000);
    };

    // ── Reveal: curtain lifts once the fill finishes AND the page is ready
    const reveal = () => {
      if (dismissed) return;
      const go = () => {
        if (dismissed) return;
        dismissed = true;
        cancelAnimationFrame(raf);
        try {
          ScrollTrigger.refresh();
        } catch {
          /* GSAP not ready; non-fatal */
        }
        el.setAttribute("data-state", "leaving");
        if (audio && !audio.paused) {
          gsap.to(audio, {
            volume: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => audio.pause(),
          });
        }
        gsap
          .timeline({
            defaults: { ease: "expo.inOut" },
            onComplete: () => {
              el.classList.add("is-removed");
              el.remove();
              actx?.close?.();
            },
          })
          .to(stage, { yPercent: -120, scale: 1.05, duration: 0.95 })
          .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.9 }, "<0.08");
      };
      pageReady ? go() : pageReadyP.then(go);
    };

    // ── Reduced motion: no chime, no fill theatrics — reveal once ready ──
    if (reduce) {
      buildPaths(1, 0, 0); // show the wordmark filled (static)
      pageReadyP.then(() => setTimeout(reveal, 400));
      return () => {
        clearTimeout(gateTimer);
        cancelAnimationFrame(raf);
      };
    }

    // ── Tap anywhere to begin (the gesture that unlocks the chime) ──
    const onBegin = () => run(true);
    el.addEventListener("pointerdown", onBegin, { once: true });

    // ── Never trap: if untouched a few seconds after ready, run silently ──
    let idleTimer = 0 as unknown as ReturnType<typeof setTimeout>;
    pageReadyP.then(() => {
      idleTimer = setTimeout(() => {
        if (!begun) run(false);
      }, 6000);
    });

    return () => {
      clearTimeout(gateTimer);
      clearTimeout(idleTimer);
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onBegin);
    };
  }, []);

  return null;
}
