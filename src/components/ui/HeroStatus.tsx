import { useEffect, useState } from "react";

/**
 * Time-of-day status for the hero chip, on Bahrain local time. During
 * working hours it reads "currently building"; after hours it flips to a
 * couple of quieter, self-aware lines so the badge feels alive and human
 * without ever showing a literal clock. Re-checks every minute so it
 * changes on its own if the page is left open across a boundary.
 *
 *   06:00 - 19:30  ->  currently building
 *   19:30 - 00:00  ->  still shipping, probably
 *   00:00 - 06:00  ->  asleep, the servers aren't
 */
function bahrainStatus(): string {
  let minutes: number;
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bahrain",
    }).formatToParts(new Date());
    const h = Number(parts.find((p) => p.type === "hour")?.value ?? "12");
    const m = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
    // Some engines emit "24" for midnight; normalise into 0-1439.
    minutes = ((h % 24) * 60) + m;
  } catch {
    return "currently building";
  }

  const workStart = 6 * 60; // 06:00
  const workEnd = 19 * 60 + 30; // 19:30

  if (minutes >= workStart && minutes < workEnd) return "currently building";
  if (minutes >= workEnd) return "still shipping, probably"; // 19:30 - 23:59
  return "asleep, the servers aren't"; // 00:00 - 05:59
}

export default function HeroStatus() {
  const [status, setStatus] = useState<string>(bahrainStatus);

  useEffect(() => {
    const id = window.setInterval(() => setStatus(bahrainStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return <>{status}</>;
}
