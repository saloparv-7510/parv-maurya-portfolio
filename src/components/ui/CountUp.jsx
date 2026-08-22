import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

const NUMERIC = /^(\D*)(\d+(?:\.\d+)?)(\D*)$/

/**
 * Number that counts up when it scrolls into view.
 *
 * Handles values like "4+", "85", "2" — any non-digit prefix/suffix is
 * preserved and only the numeric part animates.
 *
 * The parse is memoised on `value` for a reason that isn't cosmetic: the
 * animation effect depends on the parsed target, and a regex match array is a
 * new object on every render. Passing that array straight into the dependency
 * list re-runs the effect after every `setDisplay`, which resets the start
 * timestamp and re-renders — an infinite loop where the number creeps upward
 * and never actually arrives. Depend on primitives only.
 */
export default function CountUp({ value, duration = 1600, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = usePrefersReducedMotion()

  // Split "85%" → prefix '', target 85, suffix '%'
  const { ok, prefix, target, suffix, decimals } = useMemo(() => {
    const m = String(value).match(NUMERIC)
    if (!m) return { ok: false, prefix: '', target: 0, suffix: '', decimals: 0 }
    return {
      ok: true,
      prefix: m[1],
      target: parseFloat(m[2]),
      suffix: m[3],
      decimals: m[2].includes('.') ? 1 : 0,
    }
  }, [value])

  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!ok) return

    // Reduced motion (or a value that changed after mount): land on the number
    // directly rather than animating to it.
    if (reduce) {
      setDisplay(target)
      return
    }
    if (!inView) return

    let raf = 0
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      // easeOutExpo — races ahead then eases into the final number
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(target)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, ok, target, duration])

  // Unparseable values (e.g. pure text) render as-is
  if (!ok) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    )
  }

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
