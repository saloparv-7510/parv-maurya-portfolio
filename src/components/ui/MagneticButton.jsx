import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/motion'
import { useHasFinePointer, usePrefersReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Magnetic button — the element drifts toward the cursor as it approaches,
 * then springs back on leave. Disabled on touch devices and when the user
 * prefers reduced motion (where it becomes a normal, well-behaved button).
 *
 * Variants: 'primary' | 'ghost' | 'outline'
 */
export default function MagneticButton({
  children,
  onClick,
  href,
  variant = 'primary',
  className = '',
  strength = 0.32,
  icon = null,
  ...rest
}) {
  const ref = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const fine = useHasFinePointer()
  const reduce = usePrefersReducedMotion()
  const magnetic = fine && !reduce

  const onPointerMove = useCallback(
    (e) => {
      if (!magnetic || !ref.current) return
      const r = ref.current.getBoundingClientRect()
      // Vector from the button's centre to the cursor, scaled down
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      setOffset({ x, y })
    },
    [magnetic, strength],
  )

  const reset = useCallback(() => setOffset({ x: 0, y: 0 }), [])

  const base =
    'group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden ' +
    'rounded-full font-medium tracking-tight transition-colors duration-300 ' +
    'px-6 py-3 text-sm sm:px-7 sm:py-3.5 sm:text-[0.95rem]'

  const variants = {
    primary: 'text-ink-950 shadow-glow',
    outline: 'border border-white/15 bg-white/[0.04] text-white backdrop-blur-md hover:border-accent-400/50',
    ghost: 'text-slate-300 hover:text-white',
  }

  const Tag = href ? motion.a : motion.button
  const linkProps = href
    ? { href, ...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {}) }
    : { type: 'button' }

  return (
    <Tag
      ref={ref}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn(base, variants[variant], className)}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.4 }}
      whileTap={{ scale: 0.965 }}
      data-cursor="hover"
      {...linkProps}
      {...rest}
    >
      {/* Primary variant: animated gradient fill + a sheen that sweeps on hover */}
      {variant === 'primary' && (
        <>
          <span className="absolute inset-0 -z-10 bg-accent-sweep bg-[length:200%_auto] animate-gradient-pan" />
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/45 to-transparent
                       transition-transform duration-[900ms] ease-premium group-hover:translate-x-[120%]"
          />
        </>
      )}

      {/* Outline variant: soft inner glow appears on hover */}
      {variant === 'outline' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-accent-400/0 via-accent-400/10 to-iris-500/0
                     opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      {/* The label is nudged the opposite way for a subtle parallax depth cue */}
      <motion.span
        className="relative flex items-center gap-2.5"
        animate={{ x: offset.x * -0.22, y: offset.y * -0.22 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {children}
        {icon}
      </motion.span>
    </Tag>
  )
}
