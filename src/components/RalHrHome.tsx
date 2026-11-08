import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { revealUp, isWeakDevice } from "../lib/reveal";
import "./RalHrHome.css";

// Home-page showcase for RAL HR, our own product. It reuses the product page's
// hero window (Payday) so home and /ral-hr/ read as one site. Nothing runs at
// page load: the Payday chunk is fetched and the reveal is built only when the
// section nears the viewport. Weak devices get the window in its final state.
const Payday = lazy(() => import("./ralhr/Payday"));

const FACTS: { t: string; d: string }[] = [
  { t: "WPS, done right", d: "Your LMRA salary file, every row checked before you download it." },
  { t: "SIO, worked out", d: "Bahraini and expat contributions, employee and employer, every month." },
  { t: "End of service", d: "The old labour law and the 2024 SIO scheme, both handled." },
  { t: "Arabic and English", d: "On the web and on iOS & Android. Ask RAL answers your team's questions." },
];

export default function RalHrHome() {
  const sectionRef = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    const reduce =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: gsap.Context | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setLite(isWeakDevice());
        setShow(true);
        if (!reduce)
          ctx = gsap.context(
            () =>
              revealUp(root.querySelectorAll(".hrh-anim"), {
                trigger: root.querySelector(".hrh-title"),
                start: "top 80%",
                stagger: 0.12,
              }),
            root,
          );
      },
      { rootMargin: "0px 0px 35% 0px" },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      ctx?.revert();
    };
  }, []);


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
              <div className="hrh-pd">
                {show ? (
                  <Suspense fallback={<div className="hrh-shell" aria-hidden="true" />}>
                    <Payday compact waitForView lite={lite} />
                  </Suspense>
                ) : (
                  <div className="hrh-shell" aria-hidden="true" />
                )}
              </div>
              <p className="hrh-caption">
                <span>A sample payday with demo company data. Click anyone to open their payslip.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
