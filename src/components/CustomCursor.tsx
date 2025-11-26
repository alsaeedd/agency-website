import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorTextRef = useRef<HTMLDivElement>(null)
  const [cursorText, setCursorText] = useState('')
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorTextEl = cursorTextRef.current
    if (!cursor || !cursorTextEl) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      const dx = mouseX - cursorX
      const dy = mouseY - cursorY

      cursorX += dx * 0.15
      cursorY += dy * 0.15

      cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`
      cursorTextEl.style.transform = `translate(${mouseX}px, ${mouseY - 30}px)`

      requestAnimationFrame(animate)
    }

    animate()

    // Handle hover states
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const hoverElement = target.closest('[data-cursor]')
      const textElement = target.closest('[data-cursor-text]')

      if (hoverElement) {
        setIsHovering(true)
        gsap.to(cursor, { scale: 3, duration: 0.3, ease: 'expo.out' })
      }

      if (textElement) {
        const text = textElement.getAttribute('data-cursor-text')
        if (text) {
          setCursorText(text)
        }
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const hoverElement = target.closest('[data-cursor]')
      const textElement = target.closest('[data-cursor-text]')

      if (hoverElement) {
        setIsHovering(false)
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'expo.out' })
      }

      if (textElement) {
        setCursorText('')
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [])

  // Hide cursor on mobile/touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice && cursorRef.current) {
      cursorRef.current.style.display = 'none'
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className={`cursor ${isHovering ? 'hover' : ''}`}
      />
      <div
        ref={cursorTextRef}
        className={`cursor-text ${cursorText ? 'visible' : ''}`}
      >
        {cursorText}
      </div>
    </>
  )
}
