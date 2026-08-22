import { useEffect } from 'react'

/**
 * Locks page scroll while a modal / mobile drawer is open.
 *
 * Compensates for the disappearing scrollbar by padding the body, so the
 * layout doesn't jump sideways when the overlay opens.
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return

    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
    }
  }, [locked])
}
