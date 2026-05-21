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
import ScrollVideoSection from "./components/sections/ScrollVideoSection";
import ContactCircle from "./components/ContactCircle";
import CursorFollower from "./components/CursorFollower";
import Contact from "./components/Contact";
import Preloader from "./components/Preloader";
import NavLoader from "./components/NavLoader";

// React.lazy + Suspense was pausing reconciliation on below-fold sections —
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

  // useLayoutEffect runs synchronously before paint — ensures ScrollTrigger
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
    // lag" — time-based easing has to unwind inertia from the previous
    // direction, so reverse scroll feels rubbery. `lerp` is frame-rate
    // independent linear interpolation toward the target — identical
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
    // ScrollTrigger.update)` was a SECOND update path — doubled per-frame
    // work and could re-enter on fast scroll. Single ticker is enough.
    const tickerCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger at every layout-shift checkpoint so cached
    // trigger positions are always accurate. Mobile is especially prone
    // to bad cached starts because of URL-bar collapse + font-driven
    // reflow. Each refresh is idempotent and cheap (~1ms per 10 triggers).
    const refreshTimer = window.setTimeout(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, 60);

    // 1. After fonts are loaded — typography changes line heights.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);

    // 2. After window load — images + critical assets done.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      requestAnimationFrame(onLoad);
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    // 3. On visualViewport resize — iOS URL-bar collapse changes innerHeight.
    // visualViewport reports the real visible viewport, unlike window resize
    // which doesn't fire on URL-bar toggle.
    const vv = window.visualViewport;
    let vvTimer: number | undefined;
    const onVvResize = () => {
      window.clearTimeout(vvTimer);
      vvTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    vv?.addEventListener("resize", onVvResize);

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(vvTimer);
      window.removeEventListener("load", onLoad);
      vv?.removeEventListener("resize", onVvResize);
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
      <CursorFollower />
      <ContactCircle onClick={openContact} />
      <Navbar onContactClick={openContact} scrollToSection={scrollToSection} />
      <main>
        <Hero onContactClick={openContact} />
        <Services />
        <About />
        <Clients />
        <ScrollVideoSection
          waveGrid
          waveVariant="b"
          ornament="spark"
          eyebrow={<><span className="sv-dot" /> The work behind the work</>}
          title={
            <>
              Built like it's{" "}
              <span className="scroll-video-title-accent">ours.</span>
            </>
          }
          subtitle={
            <>
              Every project gets the same care - weekly check-ins on real
              channels, code you can actually read, and zero black boxes.
            </>
          }
        />
        <Portfolio />
        <ScrollVideoSection
          waveGrid
          ornament="ring"
          eyebrow={<><span className="sv-dot" /> What it feels like to work with us</>}
          title={
            <>
              Less ceremony, <br />
              <span className="scroll-video-title-accent">more shipping.</span>
            </>
          }
          subtitle={
            <>
              No slide decks, no kick-off theater. We scope it on WhatsApp, ship
              the first slice in a week, and iterate from there.
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
