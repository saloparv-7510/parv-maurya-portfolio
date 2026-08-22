import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useHasFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery'

/* ============================================================================
 *  CustomCursor — a two-part cursor: a small solid dot that tracks exactly, and
 *  a larger ring that lags behind with spring physics.
 *
 *  The ring grows and changes colour over interactive elements. Any element can
 *  opt in by adding `data-cursor="hover"` (or "text" / "view").
 *
 *  Only mounted on fine-pointer devices with motion enabled — on touch screens
 *  and for reduced-motion users the native cursor is left completely alone.
 * ========================================================================== */
export default function CustomCursor() {
  const fine = useHasFinePointer()
  const reduce = usePrefersReducedMotion()
  const enabled = fine && !reduce

  const [variant, setVariant] = useState('default')
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)

  // Exact position for the dot
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  // Spring-smoothed position for the trailing ring
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.45 })
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.45 })

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('custom-cursor')
      return
    }

    document.body.classList.add('custom-cursor')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)

      // Walk up from the hovered element to find a cursor intent.
      const target = e.target instanceof Element ? e.target : null
      if (!target) return

      const flagged = target.closest('[data-cursor]')
      if (flagged) {
        setVariant(flagged.getAttribute('data-cursor') || 'hover')
        return
      }

      // Sensible defaults so you don't have to annotate every element.
      if (target.closest('a, button, [role="button"], input, textarea, select, label')) {
        setVariant('hover')
      } else {
        setVariant('default')
      }
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled, visible, x, y])

  if (!enabled) return null

  // Ring appearance per interaction state
  const ring = {
    default: { size: 34, border: 'rgba(148,163,184,0.45)', bg: 'rgba(34,211,238,0)' },
    hover: { size: 62, border: 'rgba(34,211,238,0.75)', bg: 'rgba(34,211,238,0.09)' },
    text: { size: 78, border: 'rgba(139,92,246,0.55)', bg: 'rgba(139,92,246,0.08)' },
    view: { size: 84, border: 'rgba(34,211,238,0.8)', bg: 'rgba(34,211,238,0.12)' },
  }[variant] ?? { size: 34, border: 'rgba(148,163,184,0.45)', bg: 'transparent' }

  const scale = pressed ? 0.82 : 1

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[150] rounded-full border backdrop-blur-[1px]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: ring.border,
          backgroundColor: ring.bg,
        }}
        animate={{
          width: ring.size,
          height: ring.size,
          opacity: visible ? 1 : 0,
          scale,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 24, mass: 0.4 }}
      >
        {/* "View" label appears inside the ring on project cards */}
        {variant === 'view' && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center font-mono text-[0.55rem]
                       uppercase tracking-[0.18em] text-accent-200"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            View
          </motion.span>
        )}
      </motion.div>

      {/* Exact-tracking dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[151] h-1.5 w-1.5 rounded-full bg-accent-300"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible && variant !== 'view' ? 1 : 0,
          scale: pressed ? 1.7 : 1,
        }}
        transition={{ duration: 0.16 }}
      />
    </>
  )
}
