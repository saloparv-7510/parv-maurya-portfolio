import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '../lib/motion'
import { profile } from '../data/content'

/**
 * Preloader — a short, purposeful loading sequence.
 *
 * It counts to 100 with slight easing (fast start, slow finish) so it reads as
 * a real progress indicator rather than a fixed delay, then splits open with a
 * two-panel curtain reveal.
 *
 * Total: ~2.1s. Long enough to feel deliberate, short enough that nobody waits.
 */
export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Respect reduced-motion: skip straight through.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(100)
      setExiting(true)
      const t = setTimeout(onDone, 220)
      return () => clearTimeout(t)
    }

    let raf = 0
    let handoff = 0
    let value = 0
    const start = performance.now()
    const DURATION = 1500

    const tick = (now) => {
      const elapsed = now - start
      // easeOutCubic: quick early progress, gentle settle at the end
      const t = Math.min(elapsed / DURATION, 1)
      value = Math.round((1 - Math.pow(1 - t, 3)) * 100)
      setProgress(value)

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setExiting(true)
        // Tracked so the cleanup below can cancel it. Without that, a re-run of
        // this effect after completion would leave a second onDone pending.
        handoff = setTimeout(onDone, 900) // let the curtain finish first
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(handoff)
    }
  }, [onDone])

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        {/* Two curtain panels that slide apart to reveal the page */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 bg-ink-950"
          animate={exiting ? { y: '-100%' } : { y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.14 }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950"
          animate={exiting ? { y: '100%' } : { y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.14 }}
        />

        {/* Ambient glow behind the mark */}
        <div
          className="absolute h-[46vh] w-[46vh] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.2), transparent 70%)' }}
        />

        <motion.div
          className="relative flex flex-col items-center gap-8"
          animate={exiting ? { opacity: 0, scale: 0.95, y: -14 } : { opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {/* Monogram with an orbiting ring */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#preloadGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 46}
                style={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progress / 100) }}
              />
              <defs>
                <linearGradient id="preloadGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            <motion.span
              className="font-display text-2xl font-semibold tracking-tight text-white"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {profile.initials}
            </motion.span>
          </div>

          {/* Name + counter */}
          <div className="flex flex-col items-center gap-3">
            <motion.p
              className="font-mono text-[0.68rem] uppercase tracking-[0.42em] text-slate-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            >
              {profile.name}
            </motion.p>

            <div className="flex items-baseline gap-1 font-mono text-4xl font-light tabular-nums text-white">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                {String(progress).padStart(3, '0')}
              </motion.span>
              <span className="text-base text-accent-400">%</span>
            </div>

            {/* Linear progress track */}
            <div className="mt-1 h-px w-40 overflow-hidden bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-accent-400 to-iris-500 transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <motion.p
              className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {progress < 45
                ? 'Establishing connection'
                : progress < 82
                  ? 'Loading experience'
                  : 'Almost there'}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
