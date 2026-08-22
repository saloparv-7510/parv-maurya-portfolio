import { useEffect, useState } from 'react'

/**
 * Tracks a CSS media query. SSR-safe and listener-cleaned.
 * @example const isDesktop = useMediaQuery('(min-width: 1024px)')
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/** True only on devices with a precise pointer (mouse / trackpad). */
export function useHasFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}
