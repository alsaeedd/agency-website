import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  stagger?: number
  triggerOnScroll?: boolean
  splitBy?: 'words' | 'chars'
}

export default function AnimatedText({
  children,
  className = '',
  as: Tag = 'p',
  delay = 0,
  stagger = 0.05,
  triggerOnScroll = false,
  splitBy = 'words',
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return

    const wordElements = containerRef.current.querySelectorAll('.word-inner')

    if (triggerOnScroll) {
      gsap.fromTo(
        wordElements,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: stagger,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )
    } else {
      gsap.fromTo(
        wordElements,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: stagger,
          delay: delay,
        }
      )
    }

    hasAnimated.current = true
  }, [delay, stagger, triggerOnScroll])

  const renderContent = () => {
    if (splitBy === 'words') {
      const words = children.split(' ')
      return words.map((word, index) => (
        <span key={index}>
          <span className="word">
            <span className="word-inner">{word}</span>
          </span>
          {index < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))
    }

    return children.split('').map((char, index) => (
      <span key={index} className="word">
        <span className="word-inner">{char === ' ' ? '\u00A0' : char}</span>
      </span>
    ))
  }

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className} aria-label={children}>
      {renderContent()}
    </Tag>
  )
}
