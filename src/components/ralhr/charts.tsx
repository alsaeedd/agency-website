import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Small shared helpers for the RAL HR page: count-ups, SVG sparklines and
// the reduced-motion / weak-device switch. Pure SVG, no chart library.
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function calm(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.tier === 'low'
}

export function money(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

type CountProps = { value: number; prefix?: string; suffix?: string; decimals?: number; duration?: number; className?: string }

export function CountUp({ value, prefix = '', suffix = '', decimals = 0, duration = 1.4, className = '' }: CountProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(0)
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const out = (v: number) => { el.textContent = prefix + money(v, decimals) + suffix }
    if (calm()) { out(value); prev.current = value; return }
    const o = { v: prev.current }
    out(o.v)
    const t = gsap.to(o, { v: value, duration, ease: 'expo.out', onUpdate: () => out(o.v), onComplete: () => { prev.current = value } })
    return () => { t.kill(); prev.current = o.v }
  }, [value, prefix, suffix, decimals, duration])
  return <span ref={ref} className={`tnum ${className}`}>{prefix + money(value, decimals) + suffix}</span>
}

export function Spark({ data, tone = 'plain' }: { data: readonly number[]; tone?: string }) {
  const ref = useRef<SVGPathElement>(null)
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 100, 22 - ((v - min) / span) * 18] as const)
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const last = pts[pts.length - 1]
  useIsoLayoutEffect(() => {
    if (!ref.current || calm()) return
    const t = gsap.fromTo(ref.current, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'expo.out', delay: 0.15 })
    return () => { t.kill() }
  }, [])
  return (
    <svg className={`spark spark-${tone}`} viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d} L100 24 L0 24 Z`} className="spark-area" />
      <path ref={ref} d={d} pathLength={1} className="spark-line" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="1.6" className="spark-dot" />
    </svg>
  )
}

// Bars that grow on the compositor (scaleX), staggered.
export function useGrow(selector: string) {
  const ref = useRef<HTMLDivElement>(null)
  useIsoLayoutEffect(() => {
    const root = ref.current
    if (!root || calm()) return
    const t = gsap.fromTo(root.querySelectorAll(selector), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out', stagger: 0.12, transformOrigin: 'left center' })
    return () => { t.kill() }
  }, [selector])
  return ref
}
