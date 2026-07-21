import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import Clients from "./components/Clients";
import Portfolio from "./components/Portfolio";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Interlude from "./components/Interlude";
import ContactCircle from "./components/ContactCircle";
import CursorFollower from "./components/CursorFollower";
import Contact from "./components/Contact";
import Preloader from "./components/Preloader";
import NavLoader from "./components/NavLoader";

// React.lazy + Suspense was pausing reconciliation on below-fold sections -
// the chunks downloaded, but Suspense kept the subtrees in "pending" state
// until the boundary settled, and the browser deferred their paint to the
// compositor commit. Result: content visibly "rendered late" when scrolled
// to. Bundle is small enough (~110KB gzip total) that the savings from
// code-splitting weren't worth the UX cost. Static imports everywhere
// below the fold; the preloader still hides initial paint, and every
// section is fully laid out + ScrollTrigger-registered by the time the
// curtain lifts. Contact stays its own normal import (modal, always-ready).

function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  // Defer non-critical UI chrome (contact circle, custom cursor) past the
  // first paint so they don't compete with hero hydration for the main
  // thread. requestIdleCallback fires during browser idle time; fallback
  // setTimeout(1500) for browsers without it (Safari).
  const [chromeReady, setChromeReady] = useState(false);
  const isCoarse =
    typeof matchMedia === "function" &&
    matchMedia("(pointer: coarse)").matches;

  const openContact = () => setIsContactOpen(true);

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) {
      window.dispatchEvent(
        new CustomEvent("ral:nav-scroll", { detail: { selector } }),
      );
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: -80, immediate: false });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  // useLayoutEffect runs synchronously before paint - ensures ScrollTrigger
  // has read element positions BEFORE the first paint, so initial entrance
  // triggers fire on the right frame instead of one frame late.
  useLayoutEffect(() => {
    // ── ScrollTrigger global perf tuning ─────────────────────────
    // limitCallbacks: throttle onEnter/onLeave to rAF (biggest single win)
    // ignoreMobileResize: ignore iOS Safari URL-bar resize storms
    // preventOverlaps: stop sibling timelines fighting during reverse scroll
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });
    ScrollTrigger.defaults({
      fastScrollEnd: true,
      preventOverlaps: true,
    });

    const reducedMotion =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse =
      typeof matchMedia === "function" &&
      matchMedia("(pointer: coarse)").matches;

    // ── Lenis: lerp (symmetric responsiveness up/down) ─────────────
    // The previous `duration: 1.2` was the dominant cause of "scroll-back
    // lag" - time-based easing has to unwind inertia from the previous
    // direction, so reverse scroll feels rubbery. `lerp` is frame-rate
    // independent linear interpolation toward the target - identical
    // responsiveness in both directions. 0.085 desktop keeps cinematic
    // smoothness without the rubber-band. Skip Lenis entirely on touch
    // (native iOS/Android momentum is better than anything JS can do)
    // and under prefers-reduced-motion.
    let lenis: Lenis | null = null;
    if (!reducedMotion && !isCoarse) {
      lenis = new Lenis({
        lerp: 0.085,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
      });
      lenisRef.current = lenis;
    }

    // GSAP ticker drives BOTH Lenis (via .raf) and ScrollTrigger's own
    // internal scroll polling. The previous `lenis.on('scroll',
    // ScrollTrigger.update)` was a SECOND update path - doubled per-frame
    // work and could re-enter on fast scroll. Single ticker is enough.
    const tickerCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // ONE post-mount ScrollTrigger.refresh() - the Preloader's own
    // dismiss() runs another against final layout. Calling refresh from
    // multiple sources (visualViewport, fonts.ready, window.load) was
    // CAUSING the lag - each refresh is O(triggers) and the visualViewport
    // listener was firing every URL-bar tick on mobile during scroll. One
    // refresh is enough; the rest were paranoia.
    const refreshTimer = window.setTimeout(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, 120);

    // Idle-defer the non-critical UI chrome (contact circle, custom
    // cursor). They mount AFTER the hero has had a frame to breathe.
    const ric = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    const idleId = ric
      ? ric(() => setChromeReady(true), { timeout: 2000 })
      : window.setTimeout(() => setChromeReady(true), 1500);

    return () => {
      window.clearTimeout(refreshTimer);
      const cic = (
        window as Window & { cancelIdleCallback?: (id: number) => void }
      ).cancelIdleCallback;
      if (cic) cic(idleId);
      else window.clearTimeout(idleId);
      gsap.ticker.remove(tickerCallback);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      <Preloader />
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>
      {chromeReady && !isCoarse && <CursorFollower />}
      {chromeReady && <ContactCircle onClick={openContact} />}
      <Navbar onContactClick={openContact} scrollToSection={scrollToSection} />
      <main>
        <Hero onContactClick={openContact} />
        <Services />
        <About />
        <Interlude
          crest
          eyebrow={
            <>
              <span className="live-dot" aria-hidden="true" /> Manama · GMT+3
            </>
          }
          title={
            <>
              Built in Bahrain. <br />
              <span className="serif-accent">Shipped to the world.</span>
            </>
          }
          sub={
            <>
              Same working hours as your customers, same standards as anywhere.
              Weekly check-ins on channels you actually open, and zero black
              boxes.
            </>
          }
        />
        <Clients />
        <Portfolio />
        <Interlude
          eyebrow={
            <>
              <span className="live-dot" aria-hidden="true" /> What it feels
              like to work with us
            </>
          }
          title={
            <>
              Less ceremony, <br />
              <span className="serif-accent">more shipping.</span>
            </>
          }
          sub={
            <>
              No slide decks, no kick-off theater. We scope it on WhatsApp,
              ship the first slice in a week, and iterate from there.
            </>
          }
        />
        <CTA onContactClick={openContact} />
      </main>
      <Footer onContactClick={openContact} />
      <Contact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <NavLoader />
    </>
  );
}

export default App;
