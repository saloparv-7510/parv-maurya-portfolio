import { motion } from 'framer-motion'
import { charReveal, stagger, VIEWPORT, wordReveal } from '../../lib/motion'

/**
 * Text reveal animation.
 *
 * `mode="char"` → per-character 3D flip (use for short headlines)
 * `mode="word"` → per-word rise (use for sentences; far fewer DOM nodes)
 *
 * Words are kept in non-breaking spans so the reveal never breaks line-wrapping,
 * and the whole string stays in the accessibility tree via aria-label.
 */
export default function SplitText({
  text,
  mode = 'word',
  as: Tag = 'span',
  className = '',
  wordClassName = '',
  delay = 0,
  speed = 0.045,
  animate, // pass `true` to animate on mount instead of on scroll
}) {
  const MotionTag = motion[Tag] ?? motion.span

  const activation = animate
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: VIEWPORT }

  const words = String(text).split(' ')

  return (
    <MotionTag
      className={className}
      variants={stagger(speed, delay)}
      initial="hidden"
      aria-label={text}
      {...activation}
    >
      {words.map((word, w) => (
        <span
          key={`${word}-${w}`}
          className={`inline-block whitespace-nowrap ${wordClassName}`}
          aria-hidden="true"
        >
          {mode === 'char' ? (
            <>
              {[...word].map((char, c) => (
                <motion.span
                  key={`${char}-${c}`}
                  variants={charReveal}
                  className="inline-block will-change-transform"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  {char}
                </motion.span>
              ))}
            </>
          ) : (
            <motion.span variants={wordReveal} className="inline-block will-change-transform">
              {word}
            </motion.span>
          )}
          {/* Real space between words so text still wraps naturally */}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  )
}
