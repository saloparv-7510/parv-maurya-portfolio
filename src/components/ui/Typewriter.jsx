import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

/* ============================================================================
 *  Typewriter — cycles through a list of words, typing and deleting each one.
 *
 *  Implementation notes:
 *   • A single self-scheduling timeout drives the whole machine, so there is
 *     never more than one timer alive and cleanup is trivial.
 *   • Typing speed is jittered slightly (±25ms) — a perfectly constant rhythm
 *     is the thing that makes most typewriter effects feel robotic.
 *   • Reduced-motion users just see the first word, statically.
 *   • The full list is exposed to screen readers once via a visually hidden
 *     node; the animating text is aria-hidden so it isn't announced per letter.
 * ========================================================================== */
export default function Typewriter({
  words = [],
  typeSpeed = 68,
  deleteSpeed = 34,
  holdTime = 1750,
  className = '',
  caretClassName = '',
}) {
  const reduce = usePrefersReducedMotion()
  const [text, setText] = useState(reduce ? words[0] || '' : '')
  const [wordIndex, setWordIndex] = useState(0)
  const timer = useRef(null)

  // Phase machine: 'typing' → 'holding' → 'deleting' → next word
  const phase = useRef('typing')
  const charIndex = useRef(0)

  useEffect(() => {
    if (reduce || words.length === 0) return

    const jitter = (ms) => ms + (Math.random() * 50 - 25)

    const run = () => {
      const word = words[wordIndex % words.length]

      if (phase.current === 'typing') {
        charIndex.current += 1
        setText(word.slice(0, charIndex.current))

        if (charIndex.current >= word.length) {
          phase.current = 'holding'
          timer.current = setTimeout(run, holdTime)
        } else {
          timer.current = setTimeout(run, jitter(typeSpeed))
        }
        return
      }

      if (phase.current === 'holding') {
        phase.current = 'deleting'
        timer.current = setTimeout(run, deleteSpeed)
        return
      }

      // deleting
      charIndex.current -= 1
      setText(word.slice(0, Math.max(0, charIndex.current)))

      if (charIndex.current <= 0) {
        phase.current = 'typing'
        setWordIndex((i) => (i + 1) % words.length)
        timer.current = setTimeout(run, 380) // brief beat before the next word
      } else {
        timer.current = setTimeout(run, jitter(deleteSpeed))
      }
    }

    timer.current = setTimeout(run, 520)
    return () => clearTimeout(timer.current)
    // wordIndex is intentionally in the dep list: each word restarts the machine
  }, [wordIndex, words, reduce, typeSpeed, deleteSpeed, holdTime])

  return (
    <span className={className}>
      <span aria-hidden="true">{text}</span>

      {/* Blinking caret */}
      <span
        aria-hidden="true"
        className={`ml-1 inline-block w-[3px] translate-y-[0.09em] self-center bg-accent-400
                    animate-caret ${caretClassName}`}
        style={{ height: '1.05em' }}
      />

      {/* Announced once, so assistive tech gets the full list without spam */}
      <span className="sr">{words.join(', ')}</span>
    </span>
  )
}
