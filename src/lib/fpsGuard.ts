/**
 * Lightweight runtime FPS guard. Call the returned function once per rendered
 * frame with the rAF timestamp. If FPS stays below `minFps` across a full
 * sampling window, it fires `onDowngrade` — up to `maxDowngrades` times.
 *
 * Deliberately downgrade-ONLY: we never step quality back up, which removes any
 * risk of oscillating ("hysteresis by omission"). A scene typically wires this
 * to drop its renderer pixel ratio a notch each time it fires.
 */
export function makeFpsGuard(
  onDowngrade: () => void,
  {
    minFps = 38,
    windowMs = 1500,
    maxDowngrades = 3,
    graceMs = 1200,
  }: {
    minFps?: number;
    windowMs?: number;
    maxDowngrades?: number;
    /** Ignore the first N ms so initial scene warmup doesn't trip it. */
    graceMs?: number;
  } = {},
): (now: number) => void {
  let frames = 0;
  let windowStart = -1;
  let firstFrame = -1;
  let downgrades = 0;

  return (now: number) => {
    if (firstFrame < 0) {
      firstFrame = now;
      windowStart = now;
      return;
    }
    if (now - firstFrame < graceMs) return;

    frames++;
    const elapsed = now - windowStart;
    if (elapsed < windowMs) return;

    const fps = (frames * 1000) / elapsed;
    frames = 0;
    windowStart = now;

    if (fps < minFps && downgrades < maxDowngrades) {
      downgrades++;
      onDowngrade();
    }
  };
}
