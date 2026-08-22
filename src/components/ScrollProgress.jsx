import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Scroll progress bar pinned to the very top of the viewport.
 * Spring-smoothed so trackpad momentum reads as fluid rather than jittery.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[120] h-[2px] w-full origin-left bg-gradient-to-r
                 from-accent-400 via-indigo-400 to-iris-500"
      style={{ scaleX: width }}
    >
      {/* Glowing head of the bar */}
      <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-300 blur-[5px]" />
    </motion.div>
  )
}
