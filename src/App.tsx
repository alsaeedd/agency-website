import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
// import Featured from './components/Featured'
import Services from './components/Services'
import CTA from './components/CTA'
import Footer from './components/Footer'
import ContactCircle from './components/ContactCircle'
import Contact from './components/Contact'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const lenisRef = useRef<Lenis | null>(null)
  const [isContactOpen, setIsContactOpen] = useState(false)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <ContactCircle onClick={() => setIsContactOpen(true)} />
      <Navbar onContactClick={() => setIsContactOpen(true)} />
      <main>
        <Hero />
        <About />
        {/* <Featured /> */}
        <Services />
        <CTA onContactClick={() => setIsContactOpen(true)} />
      </main>
      <Footer />
      <Contact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  )
}

export default App
