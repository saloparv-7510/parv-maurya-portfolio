import { useCallback, useRef } from 'react'

/**
 * Cursor-tracking spotlight.
 *
 * Writes `--mx` / `--my` CSS variables onto the element so the `.spotlight`
 * class (see index.css) can position a radial gradient at the cursor.
 * We mutate CSS vars directly instead of using React state — no re-render per
 * mousemove, which is what keeps this at 60fps on a page full of cards.
 *
 * @example
 *   const spot = useSpotlight()
 *   <div className="spotlight" {...spot}>…</div>
 */
export function useSpotlight() {
  const frame = useRef(0)

  const onPointerMove = useCallback((e) => {
    const el = e.currentTarget
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    })
  }, [])

  return { onPointerMove }
}

/**
 * 3D tilt on hover, driven by pointer position.
 *
 * @param {number} max        maximum rotation in degrees
 * @param {number} scale      scale applied while hovering
 * @param {boolean} enabled   pass false to disable (mobile / reduced motion)
 */
export function useTilt({ max = 8, scale = 1.02, enabled = true } = {}) {
  const ref = useRef(null)
  const frame = useRef(0)

  const onPointerMove = useCallback(
    (e) => {
      if (!enabled) return
      const el = ref.current
      if (!el) return
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        const r = el.getBoundingClientRect()
        // Normalise pointer position to -0.5 … 0.5 around the card centre
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        el.style.transform =
          `perspective(900px) rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg) scale(${scale})`
      })
    },
    [enabled, max, scale],
  )

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    if (frame.current) {
      cancelAnimationFrame(frame.current)
      frame.current = 0
    }
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)'
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
