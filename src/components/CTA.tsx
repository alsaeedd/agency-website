import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedText from './AnimatedText'

gsap.registerPlugin(ScrollTrigger)

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!buttonRef.current) return

    gsap.fromTo(
      buttonRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          once: true,
        },
        delay: 0.3,
      }
    )
  }, [])

  return (
    <section className="cta" id="contact" ref={sectionRef}>
      <div className="cta-bg">
        <video autoPlay muted loop playsInline>
          <source src="https://cuberto.com/assets/footer/ropes.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="container">
        <div className="cta-content">
          <AnimatedText as="h2" className="cta-title" triggerOnScroll stagger={0.15}>
            Have an idea?
          </AnimatedText>
          <a href="#" className="btn-cta-large" ref={buttonRef} data-cursor="hover">
            <span>Tell us</span>
          </a>
        </div>
      </div>
    </section>
  )
}
