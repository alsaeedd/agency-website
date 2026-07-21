import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// Self-hosted Inter (latin subset) - no Google Fonts round-trip. Weights 300–700.
import '@fontsource/inter/latin-300.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
// Newsreader italic - the editorial serif accent ("the founder's voice
// leaning in"). Italic only, two weights; latin subset, self-hosted.
import '@fontsource/newsreader/latin-400-italic.css'
import '@fontsource/newsreader/latin-500-italic.css'
import './index.css'
import App from './App.tsx'
import { applyDeviceTierToDocument } from './lib/deviceProfile'

// Stamp <html data-tier> before first paint so CSS can scale effect intensity.
applyDeviceTierToDocument()

gsap.registerPlugin(ScrollTrigger)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
