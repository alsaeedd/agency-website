import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import AnimatedText from './AnimatedText'

const services = [
  { id: 'site-scratch', label: 'Site from scratch' },
  { id: 'design', label: 'UX/UI design' },
  { id: 'product-design', label: 'Product design' },
  { id: 'webflow-site', label: 'Webflow site' },
  { id: 'motion', label: 'Motion design' },
  { id: 'branding', label: 'Branding' },
  { id: 'mobile-development', label: 'Mobile development' },
]

const budgets = [
  { id: '10-20k', label: '10-20k' },
  { id: '30-40k', label: '30-40k' },
  { id: '40-50k', label: '40-50k' },
  { id: '50-100k', label: '50-100k' },
  { id: 'more100k', label: '> 100k' },
]

interface ContactProps {
  isOpen: boolean
  onClose: () => void
}

export default function Contact({ isOpen, onClose }: ContactProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedBudget, setSelectedBudget] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'expo.out' }
      )
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.1, ease: 'expo.out' }
      )
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onClose()
      // Reset form
      setSelectedServices([])
      setSelectedBudget('')
      setName('')
      setEmail('')
      setMessage('')
    }, 3000)
  }

  const isFormValid = name.trim() !== '' && email.trim() !== ''

  if (!isOpen) return null

  return (
    <div className="contact-overlay" ref={overlayRef}>
      <button className="contact-close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="contact-scroll" data-lenis-prevent>
        <div className="contact-container" ref={contentRef}>
          {showSuccess ? (
            <div className="contact-success">
              <div className="contact-success-header">
                Thank you! <span role="img" aria-label="thumbs up">👍</span>
              </div>
              <p>
                Thanks for inquiry! We'll contact you shortly!{' '}
                <span role="img" aria-label="wink">😉</span>
              </p>
            </div>
          ) : (
            <>
              <div className="contact-header">
                <AnimatedText as="h1" className="contact-title" delay={0.2} stagger={0.1}>
                  Hey! Tell us all the things
                </AnimatedText>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-group">
                  <div className="contact-label">I'm interested in...</div>
                  <div className="contact-checkboxes">
                    {services.map((service) => (
                      <label key={service.id} className="contact-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                        />
                        <span className="contact-checkbox-box">
                          <span className="contact-checkbox-border" />
                          <span className="contact-checkbox-label">{service.label}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="contact-group">
                  <div className="contact-input">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <div className="contact-input-line" />
                  </div>
                </div>

                <div className="contact-group">
                  <div className="contact-input">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="contact-input-line" />
                  </div>
                </div>

                <div className="contact-group">
                  <div className="contact-input">
                    <textarea
                      placeholder="Tell us about your project"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="contact-input-line" />
                  </div>
                </div>

                <div className="contact-group">
                  <div className="contact-label">Project budget (USD)</div>
                  <div className="contact-checkboxes">
                    {budgets.map((budget) => (
                      <label key={budget.id} className="contact-checkbox">
                        <input
                          type="radio"
                          name="budget"
                          checked={selectedBudget === budget.id}
                          onChange={() => setSelectedBudget(budget.id)}
                        />
                        <span className="contact-checkbox-box">
                          <span className="contact-checkbox-border" />
                          <span className="contact-checkbox-label">{budget.label}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="contact-group">
                  <label className="contact-attachment">
                    <input type="file" multiple />
                    <span className="contact-attachment-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <span>Add attachment</span>
                    </span>
                  </label>
                </div>

                <div className="contact-submit">
                  <button
                    type="submit"
                    className="btn-cta-submit"
                    disabled={!isFormValid}
                  >
                    <span>Send request</span>
                  </button>
                </div>

                <div className="contact-terms">
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>{' '}
                  apply.
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
