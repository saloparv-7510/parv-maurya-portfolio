/* ============================================================================
 *  Shared animation language.
 *  Keeping easings + variants in one file is why every section feels like it
 *  belongs to the same product rather than a pile of separate effects.
 * ========================================================================== */

/** Signature easing — a confident, decelerating "premium" curve. */
export const EASE = [0.16, 1, 0.3, 1]
export const EASE_SOFT = [0.33, 1, 0.68, 1]

/** Default viewport config: animate once, trigger slightly before fully in view. */
export const VIEWPORT = { once: true, margin: '-12% 0px -12% 0px' }
export const VIEWPORT_EARLY = { once: true, margin: '0px 0px -18% 0px' }

/* ------------------------------------------------------------- primitives -- */
export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
}

export const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
}

export const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
}

/* --------------------------------------------------------------- staggers -- */
/** Parent container that releases children one after another. */
export const stagger = (staggerChildren = 0.09, delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/** Per-character text reveal (used by <SplitText />). */
export const charReveal = {
  hidden: { opacity: 0, y: '0.55em', rotateX: -55 },
  show: {
    opacity: 1,
    y: '0em',
    rotateX: 0,
    transition: { duration: 0.72, ease: EASE },
  },
}

/** Per-word reveal — cheaper than per-character for long paragraphs. */
export const wordReveal = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/* ----------------------------------------------------------------- modals -- */
export const modalBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25, delay: 0.08 } },
}

export const modalPanel = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, scale: 0.97, y: 14, transition: { duration: 0.25, ease: EASE_SOFT } },
}

/* ------------------------------------------------------------------ utils -- */
/** Tiny classname joiner (avoids pulling in a dependency for this). */
export const cn = (...parts) => parts.filter(Boolean).join(' ')

/** Smooth-scrolls to a section id, accounting for the sticky navbar. */
export function scrollToSection(id, offset = 78) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}
