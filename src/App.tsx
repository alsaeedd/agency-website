import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import ContactCircle from "./components/ContactCircle";
import CursorFollower from "./components/CursorFollower";
import Contact from "./components/Contact";
import Preloader from "./components/Preloader";

// Below-the-fold sections are code-split into their own chunks so the initial
// JS payload only contains what's needed to paint the first viewport. We
// IMMEDIATELY kick off the dynamic imports for ALL of them (the `lazy()`
// alone doesn't fetch — it waits for the boundary to render) so the chunks
// stream down the wire IN PARALLEL with hero hydration, and the preloader
// waits for them to finish before dismissing. By the time the user can see
// the page, every section is already hydrated — no "section appears halfway
// through scroll" jank.
const portfolioImport = import("./components/Portfolio");
const clientsImport = import("./components/Clients");
const ctaImport = import("./components/CTA");
const footerImport = import("./components/Footer");
const scrollVideoImport = import("./components/sections/ScrollVideoSection");

// Expose a single promise the preloader waits on before dismissing.
declare global {
  interface Window {
    __ralChunksReady?: Promise<unknown>;
  }
}
if (typeof window !== "undefined") {
  window.__ralChunksReady = Promise.all([
    portfolioImport,
    clientsImport,
    ctaImport,
    footerImport,
    scrollVideoImport,
  ]).catch(() => undefined);
}

const Clients = lazy(() => clientsImport);
const Portfolio = lazy(() => portfolioImport);
const CTA = lazy(() => ctaImport);
const Footer = lazy(() => footerImport);
const ScrollVideoSection = lazy(() => scrollVideoImport);

function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContact = () => setIsContactOpen(true);

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -80, immediate: false });
    }
  };

  useEffect(() => {
    // ── ScrollTrigger global perf tuning ─────────────────────────
    // limitCallbacks: throttle onEnter/onLeave to rAF (biggest single win)
    // ignoreMobileResize: ignore iOS Safari URL-bar resize storms
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });
    ScrollTrigger.defaults({
      fastScrollEnd: true,
    });

    const reducedMotion =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse =
      typeof matchMedia === "function" &&
      matchMedia("(pointer: coarse)").matches;

    // ── Lenis touch/desktop tuning ───────────────────────────────
    // On coarse pointer (mobile/tablet), native momentum is BETTER than
    // Lenis. We use a much shorter duration so the JS smoothing barely
    // fights native scroll. On desktop, the cinematic 1.2s easing stays.
    // If the user prefers reduced motion, don't initialize Lenis at all.
    let lenis: Lenis | null = null;
    if (!reducedMotion) {
      lenis = new Lenis({
        duration: isCoarse ? 0.4 : 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
    }

    const tickerCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
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
        {/* Below-fold sections stream in their own chunks behind the
            preloader. fallback={null} is safe because the preloader covers
            the viewport while these resolve. */}
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer onContactClick={openContact} />
      </Suspense>
      <Contact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}

export default App;
