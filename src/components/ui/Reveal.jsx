import { motion } from 'framer-motion'
import { fadeUp, VIEWPORT } from '../../lib/motion'

/**
 * Scroll-triggered reveal wrapper.
 * Wrap anything that should animate into view.
 *
 * @param {number} delay      seconds to wait after entering the viewport
 * @param {string} direction  'up' | 'down' | 'left' | 'right' | 'none'
 */
export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 26,
  duration = 0.75,
  className = '',
  as: Tag = 'div',
  once = true,
}) {
  const MotionTag = motion[Tag] ?? motion.div

  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }[direction] ?? { y: distance }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ ...VIEWPORT, once }}
      transition={{ duration, delay, ease: fadeUp.show.transition.ease }}
    >
      {children}
    </MotionTag>
  )
}
