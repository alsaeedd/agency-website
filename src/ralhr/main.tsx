import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@fontsource/inter/latin-300.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/newsreader/latin-400-italic.css'
import '@fontsource/newsreader/latin-500-italic.css'
import '../index.css'
import '../App.css'
import '../i18n/rtl.css'
import { applyDeviceTierToDocument } from '../lib/deviceProfile'
import RalHrPage from '../components/ralhr/RalHrPage'
import Inquire from '../components/ralhr/Inquire'
import SiteChrome from '../components/ralhr/SiteChrome'

// One entry for both RAL HR pages; the prerendered HTML is replaced by the
// client render (same no-hydration pattern as the homepage).
applyDeviceTierToDocument()
gsap.registerPlugin(ScrollTrigger)
const isInquire = /^(\/ar)?\/ral-hr\/inquire/.test(window.location.pathname)
createRoot(document.getElementById('root')!).render(
  <StrictMode><SiteChrome>{isInquire ? <Inquire /> : <RalHrPage />}</SiteChrome></StrictMode>,
)
