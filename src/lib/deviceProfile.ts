/**
 * Device capability profiling — picks a quality tier ONCE at boot so the rest
 * of the app can scale effect intensity to the hardware instead of shipping the
 * same heavy WebGL/CSS to a flagship and a $120 Android.
 *
 * Signals (all optional / progressively enhanced):
 *  - hardwareConcurrency  — logical CPU cores (broad support incl. Safari/FF)
 *  - deviceMemory         — RAM in GiB (Chromium-only; assumed mid elsewhere)
 *  - connection.saveData  — user asked for reduced data (Chromium-only)
 *  - connection.effectiveType — slow-2g/2g/3g => constrained context
 *  - (update: slow)       — display can't render smooth animation (e-ink etc.)
 *  - (pointer: coarse)    — touch device, used as a "probably a phone" nudge
 *  - prefers-reduced-motion — exposed separately; CSS handles motion gating
 */

export type DeviceTier = "low" | "med" | "high";

export interface DeviceProfile {
  tier: DeviceTier;
  /** Pixel ratio to pass to WebGLRenderer.setPixelRatio — capped per tier. */
  dpr: number;
  /** Enable MSAA on WebGL renderers? Expensive on mobile tiled GPUs. */
  antialias: boolean;
  reducedMotion: boolean;
  saveData: boolean;
}

interface NavigatorExtras {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

let cached: DeviceProfile | null = null;

function mm(query: string): boolean {
  return typeof matchMedia === "function" && matchMedia(query).matches;
}

export function getDeviceProfile(): DeviceProfile {
  if (cached) return cached;

  const nav =
    typeof navigator !== "undefined"
      ? (navigator as Navigator & NavigatorExtras)
      : ({} as Navigator & NavigatorExtras);

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4; // Chromium-only; mid default elsewhere
  const conn = nav.connection;
  const saveData = !!conn?.saveData;
  const slowNet = /(?:^|-)(?:slow-2g|2g|3g)$/.test(conn?.effectiveType ?? "");

  const reducedMotion = mm("(prefers-reduced-motion: reduce)");
  const updateSlow = mm("(update: slow)");
  const coarse = mm("(pointer: coarse)");

  let tier: DeviceTier;
  if (updateSlow || saveData || slowNet || cores <= 4 || memory <= 2) {
    tier = "low";
  } else if (!coarse && cores >= 8 && memory >= 8) {
    tier = "high";
  } else {
    tier = "med";
  }

  const rawDpr = (typeof window !== "undefined" && window.devicePixelRatio) || 1;
  const dpr =
    tier === "low"
      ? 1
      : tier === "med"
        ? Math.min(rawDpr, 1.5)
        : Math.min(rawDpr, 2);

  cached = { tier, dpr, antialias: tier === "high", reducedMotion, saveData };
  return cached;
}

/**
 * Stamp <html data-tier="…"> (and data-reduced-motion) so CSS can dial down
 * blur radii, particle counts, blend modes, etc. without any per-element JS.
 * Call once, as early as possible.
 */
export function applyDeviceTierToDocument(): DeviceProfile {
  const profile = getDeviceProfile();
  if (typeof document !== "undefined") {
    const el = document.documentElement;
    el.dataset.tier = profile.tier;
    if (profile.reducedMotion) el.dataset.reducedMotion = "true";
  }
  return profile;
}
