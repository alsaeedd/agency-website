import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The ONE entrance signature for the whole site: blur-rise, expo.out,
 * fire-once. Every section calls this instead of hand-rolling its own
 * choreography, so the entire page moves with a single accent.
 *
 * Weak devices (any non-high tier, any touch device) get the identical
 * gesture minus the blur (filter tweens force full-layer re-raster on
 * mobile GPUs) and with tighter timing.
 */

export function isWeakDevice(): boolean {
  if (typeof document === "undefined") return true;
  const tier = document.documentElement.dataset.tier;
  const coarse =
    typeof matchMedia === "function" &&
    matchMedia("(pointer: coarse)").matches;
  return tier !== "high" || coarse;
}

export interface RevealOptions {
  /** Element whose position drives the trigger. Defaults to the first target. */
  trigger?: Element | null;
  /** ScrollTrigger start. Default "top 82%". */
  start?: string;
  /** Stagger between items (desktop). Weak devices use ~40% of it. */
  stagger?: number;
  /** Extra delay after trigger. */
  delay?: number;
  /** Rise distance in px. */
  y?: number;
}

export function revealUp(
  targets: gsap.DOMTarget,
  {
    trigger,
    start = "top 82%",
    stagger = 0.12,
    delay = 0,
    y = 26,
  }: RevealOptions = {},
): gsap.core.Tween | null {
  const els = gsap.utils.toArray<Element>(targets);
  if (els.length === 0) return null;
  const weak = isWeakDevice();

  return gsap.fromTo(
    els,
    { opacity: 0, y, filter: weak ? "blur(0px)" : "blur(10px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: weak ? 0.55 : 1.0,
      ease: "expo.out",
      stagger: weak ? stagger * 0.4 : stagger,
      delay,
      scrollTrigger: {
        trigger: trigger ?? els[0],
        start,
        once: true,
        invalidateOnRefresh: true,
      },
    },
  );
}

/**
 * Masked word-rise for display headlines (pair with .wmask/.wmask-in
 * spans). Same accent as revealUp but yPercent-driven so the mask clip
 * reads as type "arriving" rather than fading.
 */
export function revealWords(
  targets: gsap.DOMTarget,
  {
    trigger,
    start = "top 82%",
    stagger = 0.055,
    delay = 0,
  }: RevealOptions = {},
): gsap.core.Tween | null {
  const els = gsap.utils.toArray<Element>(targets);
  if (els.length === 0) return null;
  const weak = isWeakDevice();

  return gsap.fromTo(
    els,
    { yPercent: 115, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: weak ? 0.6 : 0.95,
      ease: "expo.out",
      stagger: weak ? stagger * 0.5 : stagger,
      delay,
      scrollTrigger: {
        trigger: trigger ?? els[0],
        start,
        once: true,
        invalidateOnRefresh: true,
      },
    },
  );
}
