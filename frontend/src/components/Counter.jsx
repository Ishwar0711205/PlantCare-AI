import { useEffect, useRef, useState } from 'react'
import useInView from '../hooks/useInView'

function parseNumber(value) {
  if (typeof value === 'number') return value
  const digits = String(value).replace(/,/g, '')
  return Number.isFinite(Number(digits)) ? Number(digits) : 0
}

function formatNumber(value) {
  return Math.round(value).toLocaleString('en-US')
}

export default function Counter({ value, suffix = '', duration = 1200, className = '' }) {
  const { ref, inView } = useInView()
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)

  useEffect(() => {
    if (!inView) return
    const target = parseNumber(value)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplay(target)
      return
    }
    let frame
    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts
      const progress = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(target * eased)
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {formatNumber(display)}
      {suffix}
    </span>
  )
}