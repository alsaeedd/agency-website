import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { revealUp, isWeakDevice } from "../lib/reveal";
import "./RalHrHome.css";

// Home-page showcase for RAL HR, our own product. The payroll card renders
// its FINAL state in markup (SSR + no-JS read correctly); the "run" is a
// GSAP timeline that is only built once the section nears the viewport, so
// nothing here costs main-thread time at page load.

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

// Sample run (demo company data, labelled as such under the card).
const RUN = { staff: 98, gross: 72486, sio: 2941.38, net: 69544.62 };

const STEPS = ["Compute", "Review", "Approve", "WPS file"];

const FACTS: { t: string; d: string }[] = [
  { t: "WPS, done right", d: "Your LMRA salary file, every row checked before you download it." },
  { t: "SIO, worked out", d: "Bahraini and expat contributions, employee and employer, every month." },
  { t: "End of service", d: "The old labour law and the 2024 SIO scheme, both handled." },
  { t: "Arabic and English", d: "On the web and on iOS & Android. Ask RAL answers your team's questions." },
];

export default function RalHrHome() {
  const sectionRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let ctx: gsap.Context | null = null;

    const build = () => {
      const q = (s: string) => root.querySelector(s);
      const qa = <T extends Element = Element>(s: string) =>
        root.querySelectorAll<T>(s);
      const weak = isWeakDevice();
      const d = weak ? 0.6 : 1;

      revealUp(qa(".hrh-anim"), {
        trigger: q(".hrh-title"),
        start: "top 80%",
        stagger: 0.12,
      });

      const counters = Array.from(qa<HTMLElement>("[data-to]"));
      const state = { p: 0 };
      const paint = () => {
        counters.forEach((el) => {
          const to = Number(el.dataset.to);
          const v = to * state.p;
          el.textContent = el.dataset.int ? String(Math.round(v)) : fmt(v);
        });
      };

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: q(".hrh-stage"), start: "top 75%", once: true },
        onStart: () => {
          state.p = 0;
          paint();
        },
      });

      tl.from(".hrh-run", { opacity: 0, y: 34, duration: 1.0 * d })
        .from(
          ".hrh-step-bar",
          { scaleX: 0, duration: 0.5 * d, stagger: 0.14, ease: "power3.out" },
          0.25,
        )
        .to(
          state,
          { p: 1, duration: 1.3 * d, ease: "power3.out", onUpdate: paint },
          0.3,
        )
        .from(".hrh-wps", { opacity: 0, y: 12, duration: 0.7 * d }, ">-0.35")
        .from(
          ".hrh-stamp-in",
          { opacity: 0, scale: 1.9, duration: 0.55 * d },
          ">-0.15",
        )
        .from(".hrh-phone", { opacity: 0, y: 40, duration: 1.0 * d }, "<0.05")
        .from(
          ".hrh-notif",
          { opacity: 0, y: -18, scale: 0.96, duration: 0.8 * d },
          ">-0.55",
        );

      tlRef.current = tl;
    };

    // Lazy init: build the timeline + ScrollTriggers only as the section
    // approaches (a quarter-viewport ahead), never at load.
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        ctx = gsap.context(build, root);
      },
      { rootMargin: "0px 0px 25% 0px" },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      ctx?.revert();
      tlRef.current = null;
    };
  }, []);

  const replay = () => tlRef.current?.restart();

  return (
    <section className="hrh" id="ral-hr" ref={sectionRef} aria-labelledby="hrh-title">
      <div className="container">
        <div className="hrh-panel">
          <div className="hrh-core">
            <div className="hrh-ambient" aria-hidden="true" />

            <div className="hrh-copy">
              <span className="eyebrow hrh-anim">
                <span className="eyebrow-rule" aria-hidden="true" />
                <span>Our own product</span>
              </span>
              <h2 id="hrh-title" className="section-heading hrh-title hrh-anim">
                HR and payroll, <span className="serif-accent">built for Bahrain.</span>
              </h2>
              <p className="section-intro hrh-intro hrh-anim">
                We build software for clients, and we built this one as our own product. RAL HR is for Bahrain
                companies still running payroll in Excel and fixing rejected WPS
                files by hand.
              </p>

              <dl className="hrh-facts hrh-anim">
                {FACTS.map((f) => (
                  <div className="hrh-fact" key={f.t}>
                    <dt>{f.t}</dt>
                    <dd>{f.d}</dd>
                  </div>
                ))}
              </dl>

              <div className="hrh-offer hrh-anim">
                <p className="hrh-price">
                  <span className="hrh-price-from">From</span>
                  <span className="hrh-price-num">BD 1</span>
                  <span className="hrh-price-per">per employee a month</span>
                </p>
                <div className="hrh-ctas">
                  <a className="hrh-btn hrh-btn--primary" href="/ral-hr/">
                    <span>Explore RAL HR</span>
                    <span className="hrh-btn-icon" aria-hidden="true">→</span>
                  </a>
                  <a className="hrh-btn hrh-btn--ghost" href="/ral-hr/#demo">
                    <span>Try the live demo</span>
                    <span className="hrh-btn-icon" aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="hrh-stage">
              <div className="hrh-scene">
                <div className="hrh-run">
                  <span className="hrh-stamp" aria-hidden="true">
                    <span className="hrh-stamp-in">Approved</span>
                  </span>
                  <div className="hrh-run-core">
                    <div className="hrh-run-head">
                      <span className="hrh-run-kicker">Payroll run</span>
                      <span className="hrh-run-month">November 2026</span>
                    </div>

                    <ol className="hrh-steps" aria-label="Run steps, all complete">
                      {STEPS.map((s) => (
                        <li key={s}>
                          <span className="hrh-step-track">
                            <span className="hrh-step-bar" />
                          </span>
                          {s}
                        </li>
                      ))}
                    </ol>

                    <dl className="hrh-ledger">
                      <div className="hrh-row">
                        <dt>Staff paid</dt>
                        <dd>
                          <span data-to={RUN.staff} data-int="1">{RUN.staff}</span>
                        </dd>
                      </div>
                      <div className="hrh-row">
                        <dt>Gross pay</dt>
                        <dd>
                          <span className="hrh-cur">BHD</span>
                          <span data-to={RUN.gross}>{fmt(RUN.gross)}</span>
                        </dd>
                      </div>
                      <div className="hrh-row">
                        <dt>Employee SIO</dt>
                        <dd className="hrh-minus">
                          <span className="hrh-cur">−&nbsp;BHD</span>
                          <span data-to={RUN.sio}>{fmt(RUN.sio)}</span>
                        </dd>
                      </div>
                      <div className="hrh-row hrh-row--net">
                        <dt>Net pay</dt>
                        <dd>
                          <span className="hrh-cur">BHD</span>
                          <span data-to={RUN.net}>{fmt(RUN.net)}</span>
                        </dd>
                      </div>
                    </dl>

                    <div className="hrh-wps">
                      <span className="hrh-check" aria-hidden="true">✓</span>
                      <span className="hrh-wps-text">
                        <strong>WPS file checked</strong>
                        <span>
                          <span data-to={RUN.staff} data-int="1">{RUN.staff}</span> of{" "}
                          {RUN.staff} rows pass LMRA checks
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="hrh-phone"
                  role="img"
                  aria-label="Phone notification from RAL HR: payslip ready, November net pay BD 712.480"
                >
                  <div className="hrh-screen">
                    <span className="hrh-island" aria-hidden="true" />
                    <span className="hrh-time" aria-hidden="true">9:41</span>
                    <span className="hrh-date" aria-hidden="true">Thursday 26 November</span>
                    <div className="hrh-notif">
                      <div className="hrh-notif-top">
                        <span className="hrh-app" aria-hidden="true">HR</span>
                        <span className="hrh-app-name">RAL HR</span>
                        <span className="hrh-now">now</span>
                      </div>
                      <strong>Payslip ready</strong>
                      <span>Your November net pay is BD 712.480</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hrh-caption">
                <span>Sample run with demo company data.</span>
                <button type="button" className="hrh-replay" onClick={replay}>
                  Run it again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
