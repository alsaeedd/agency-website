import { useEffect, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from '../Navbar'
import Footer from '../Footer'
import Contact from '../Contact'
import ContactCircle from '../ContactCircle'
import CursorFollower from '../CursorFollower'
import NavLoader from '../NavLoader'

// The main site's own chrome around the RAL HR pages: same navbar (anchor
// links point back to the homepage, RAL HR marked current), footer, contact
// modal, floating contact button, cursor, smooth scroll and background.
export default function SiteChrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
  const openContact = () => setOpen(true)

  useEffect(() => {
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })
    ScrollTrigger.defaults({ fastScrollEnd: true, preventOverlaps: true })
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = !reduced && !coarse
      ? new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false, anchors: { offset: -88 } })
      : null
    const tick = (t: number) => lenis?.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const id = typeof requestIdleCallback === 'function'
      ? requestIdleCallback(() => setReady(true), { timeout: 2000 })
      : window.setTimeout(() => setReady(true), 1500)
    return () => {
      if (typeof cancelIdleCallback === 'function') cancelIdleCallback(id); else clearTimeout(id)
      gsap.ticker.remove(tick)
      lenis?.destroy()
    }
  }, [coarse])

  return (
    <>
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>
      {ready && !coarse && <CursorFollower />}
      {ready && <ContactCircle onClick={openContact} />}
      <Navbar
        onContactClick={openContact}
        scrollToSection={(s) => { window.location.href = '/' + s }}
        linkBase="/"
        activeHref="/ral-hr/"
        showAtTop
      />
      {children}
      <Footer onContactClick={openContact} />
      <Contact isOpen={open} onClose={() => setOpen(false)} />
      <NavLoader />
    </>
  )
}
