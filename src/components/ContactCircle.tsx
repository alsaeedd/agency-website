import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ContactCircleProps {
  onClick: () => void
}

export default function ContactCircle({ onClick }: ContactCircleProps) {
  const circleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!circleRef.current) return

    gsap.fromTo(
      circleRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, delay: 1.5, ease: 'expo.out' }
    )
  }, [])

  return (
    <button
      className="contact-circle"
      ref={circleRef}
      onClick={onClick}
      aria-label="Get in touch"
    >
      <div className="contact-circle-inner">
        <video autoPlay muted loop playsInline>
          <source src="https://cuberto.com/assets/intouch/2.mp4" type="video/mp4" />
        </video>
        <div className="contact-circle-text">
          <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              id="textPath"
              d="M75,75 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0"
              fill="none"
            />
            <text fill="white" fontSize="11" fontWeight="500" letterSpacing="1">
              <textPath href="#textPath">
                contact - contact - contact - contact -
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </button>
  )
}
