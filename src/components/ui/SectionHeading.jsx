import { motion } from 'framer-motion'
import { cn, EASE, stagger, VIEWPORT } from '../../lib/motion'

/**
 * Consistent section header: eyebrow label + animated headline + optional lede.
 * Every section uses this, which is what makes the page feel like one system.
 */
export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  lede,
  align = 'left',
  className = '',
}) {
  const centered = align === 'center'

  return (
    <motion.header
      variants={stagger(0.12)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className={cn(
        'relative flex flex-col gap-4',
        centered ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
          }}
          className="eyebrow"
        >
          {/* Pulsing indicator dot */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-400 animate-pulse-ring" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-400" />
          </span>
          {eyebrow}
        </motion.p>
      )}

      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 22 },
          show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
        }}
        className="max-w-3xl text-fluid-xl leading-[1.1]"
      >
        {title}{' '}
        {highlight && <span className="text-gradient">{highlight}</span>}
      </motion.h2>

      {lede && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 18 },
            show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.05 } },
          }}
          className={cn(
            'max-w-2xl text-fluid-base leading-relaxed text-slate-400',
            centered && 'mx-auto',
          )}
        >
          {lede}
        </motion.p>
      )}

      {/* Animated underline rule */}
      <motion.div
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          show: {
            scaleX: 1,
            opacity: 1,
            transition: { duration: 1.1, ease: EASE, delay: 0.15 },
          },
        }}
        style={{ transformOrigin: centered ? 'center' : 'left' }}
        className={cn(
          'mt-1 h-px w-full max-w-[220px] bg-gradient-to-r from-accent-400/70 via-iris-500/40 to-transparent',
          centered && 'max-w-[160px] bg-gradient-to-r from-transparent via-accent-400/60 to-transparent',
        )}
      />
    </motion.header>
  )
}
