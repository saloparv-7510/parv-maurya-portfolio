import { useEffect, useRef, useState } from 'react'

/**
 * Scroll spy for the navbar.
 *
 * Rather than an IntersectionObserver (which fires awkwardly for sections
 * taller or shorter than the viewport), we pick the section whose top edge is
 * closest to — but still above — a line drawn near the top of the viewport.
 * That matches what a reader perceives as "the section I'm currently in".
 *
 * @param {string[]} ids     section element ids, in document order
 * @param {number}   offset  px from the top of the viewport for the sample line
 */
export function useScrollSpy(ids, offset = 140) {
  const [activeId, setActiveId] = useState(ids[0])
  const frame = useRef(0)

  useEffect(() => {
    const compute = () => {
      const line = offset
      let current = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const { top } = el.getBoundingClientRect()
        if (top - line <= 0) current = id
      }

      // Bottom of the page always resolves to the final section, even if that
      // section is too short to ever cross the sample line.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80
      if (atBottom) current = ids[ids.length - 1]

      setActiveId((prev) => (prev === current ? prev : current))
    }

    // rAF-throttled: at most one computation per painted frame.
    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        compute()
      })
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [ids, offset])

  return activeId
}
