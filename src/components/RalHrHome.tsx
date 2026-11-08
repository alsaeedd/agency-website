import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { revealUp, isWeakDevice } from "../lib/reveal";
import "./RalHrHome.css";
import { useLang } from "../i18n";

// Home-page showcase for RAL HR, our own product. It reuses the product page's
// hero window (Payday) so home and /ral-hr/ read as one site. Nothing runs at
// page load: the Payday chunk is fetched and the reveal is built only when the
// section nears the viewport. Weak devices get the window in its final state.
const Payday = lazy(() => import("./ralhr/Payday"));

// Four facts, each led by a figure so the data reads at a glance.
const FACTS: { fig: string; t: string; d: string }[] = [
  { fig: "10/10", t: "WPS columns checked", d: "Your LMRA salary file, every row checked before you download it." },
  { fig: "2", t: "SIO shares per person", d: "Employee and employer, for Bahraini and expat staff, every month." },
  { fig: "2024", t: "End of service, ready", d: "The old labour law and the new SIO scheme, both worked out." },
  { fig: "AR/EN", t: "On every screen", d: "Web and iOS & Android. Ask RAL answers your team's questions." },
];

const FACTS_AR: typeof FACTS = [
  { fig: "10/10", t: "أعمدة WPS، مدققة كلها", d: "ملف رواتب LMRA، كل صف فيه مدقق قبل أن تنزّله." },
  { fig: "2", t: "حصتا SIO لكل موظف", d: "حصة الموظف وحصة صاحب العمل، للبحرينيين والوافدين، كل شهر." },
  { fig: "2024", t: "مكافأة نهاية الخدمة، جاهزة", d: "قانون العمل القديم ونظام SIO الجديد، كلاهما محسوب." },
  { fig: "عربي/EN", t: "على كل شاشة", d: "على الويب وiOS وأندرويد. ومساعد Ask RAL يجيب عن أسئلة فريقك." },
];
const HRH_T = {
  en: { eyebrow: "Our own product", sub: "HR and payroll, ", accent: "built for Bahrain.", intro: "We build software for clients. RAL HR is our own product: HR and payroll for Bahrain companies still working in Excel and fixing rejected WPS files by hand.", cap: "A sample payday with demo company data.", capStrong: "Click anyone to open their payslip.", from: "From", price: "BD 1", per: "per employee a month", explore: "Explore RAL HR", demo: "Try the live demo" },
  ar: { eyebrow: "منتجنا الخاص", sub: "الموارد البشرية والرواتب، ", accent: "مصممة للبحرين.", intro: "نبني البرمجيات لعملائنا، أما RAL HR فهو منتجنا نحن: نظام موارد بشرية ورواتب للشركات البحرينية التي ما زالت تعمل على جداول إكسل وتصلح ملفات WPS المرفوضة يدويًا.", cap: "يوم رواتب نموذجي ببيانات شركة تجريبية.", capStrong: "اضغط على أي موظف لفتح قسيمة راتبه.", from: "ابتداءً من", price: "1 د.ب", per: "لكل موظف شهريًا", explore: "اكتشف RAL HR", demo: "جرّب العرض المباشر" },
};

export default function RalHrHome() {
  const lang = useLang();
  const L = HRH_T[lang];
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
          ctx = gsap.context(() => {
            revealUp(root.querySelectorAll(".hrh-head .hrh-anim, .hrh-fact"), {
              trigger: root.querySelector(".hrh-title"),
              start: "top 80%",
              stagger: 0.12,
            });
            revealUp(root.querySelector(".hrh-offer"), {
              trigger: root.querySelector(".hrh-offer"),
              start: "top 88%",
            });
          }, root);
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

            <header className="hrh-head">
              <span className="eyebrow hrh-anim">
                <span className="eyebrow-rule" aria-hidden="true" />
                <span>{L.eyebrow}</span>
              </span>
              <h2 id="hrh-title" className="section-heading hrh-title hrh-anim">
                <span className="hrh-name">RAL HR</span>
                <span className="hrh-sub">
                  {L.sub}<span className="serif-accent">{L.accent}</span>
                </span>
              </h2>
              <p className="section-intro hrh-intro hrh-anim">
                {L.intro}
              </p>
            </header>

            <dl className="hrh-facts">
              {(lang === "ar" ? FACTS_AR : FACTS).map((f) => (
                <div className="hrh-fact hrh-anim" key={f.t}>
                  <dt>
                    <span className="hrh-fig">{f.fig}</span>
                    <span className="hrh-fact-t">{f.t}</span>
                  </dt>
                  <dd>{f.d}</dd>
                </div>
              ))}
            </dl>

            <figure className="hrh-stage">
              <div className="hrh-pd">
                {show ? (
                  <Suspense fallback={<div className="hrh-shell" aria-hidden="true" />}>
                    <Payday compact waitForView lite={lite} />
                  </Suspense>
                ) : (
                  <div className="hrh-shell" aria-hidden="true" />
                )}
              </div>
              <figcaption className="hrh-caption">
                {L.cap} <strong>{L.capStrong}</strong>
              </figcaption>
            </figure>

            <div className="hrh-offer hrh-anim">
              <p className="hrh-price">
                <span className="hrh-price-from">{L.from}</span>
                <span className="hrh-price-num">{L.price}</span>
                <span className="hrh-price-per">{L.per}</span>
              </p>
              <div className="hrh-ctas">
                <a className="hrh-btn hrh-btn--primary" href="/ral-hr/">
                  <span>{L.explore}</span>
                  <span className="hrh-btn-icon" aria-hidden="true">→</span>
                </a>
                <a className="hrh-btn hrh-btn--ghost" href="/ral-hr/#demo">
                  <span>{L.demo}</span>
                  <span className="hrh-btn-icon" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
