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

function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContact = () => setIsContactOpen(true);

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
      <ContactCircle onClick={openContact} />
      <Navbar onContactClick={openContact} />
      <main>
        <Hero onContactClick={openContact} isContactOpen={isContactOpen} />
        <Services />
        <About />
        <Clients />
        <Portfolio />
        <CTA onContactClick={openContact} />
      </main>
      <Footer onContactClick={openContact} />
      <Contact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}

export default App;
