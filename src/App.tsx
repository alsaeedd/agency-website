import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Clients from "./components/Clients";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ContactCircle from "./components/ContactCircle";
import Contact from "./components/Contact";
import CursorFollower from "./components/CursorFollower";
import ScrollVideoSection from "./components/sections/ScrollVideoSection";

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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <>
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
    </>
  );
}

export default App;
