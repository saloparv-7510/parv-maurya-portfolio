import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import ParticleNetwork from './ParticleNetwork'
import { useHasFinePointer } from '../hooks/useMediaQuery'

/**
 * BackgroundFX — the fixed, full-page atmosphere sitting behind all content.
 *
 * Layer order (back → front):
 *   1. Base radial gradients (the "aurora" glow)
 *   2. Perspective grid floor
 *   3. Particle network canvas
 *   4. Film grain + vignette
 *
 * Everything here is `fixed` and `pointer-events-none`, so it costs nothing in
 * layout and never intercepts clicks.
 *
 * PERFORMANCE NOTE — this layer is on screen for the entire visit, so anything
 * expensive here is expensive all the time. Two deliberate choices:
 *   • The glows are plain radial gradients with NO `filter: blur()`. A gradient
 *     is already soft-edged, so a 130px blur on top changed almost nothing
 *     visually while forcing the GPU to re-blur three viewport-sized surfaces.
 *   • The scroll-linked drift is desktop-only. Transforming a fixed, full-screen
 *     layer on every scroll frame is what made phones and the APK flicker.
 */
export default function BackgroundFX() {
  const reduce = useReducedMotion()
  const fine = useHasFinePointer()

  // Scroll-linked drift is desktop-only (see PERFORMANCE NOTE above). On touch
  // the aurora is simply static — you cannot tell while scrolling anyway.
  const animate = fine && !reduce

  const { scrollYProgress } = useScroll()

  // The aurora drifts very slightly as you scroll — enough to feel alive,
  // subtle enough that you never consciously notice it.
  const auroraY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const auroraOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.75, 0.55])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1 — Base colour field */}
      <div className="absolute inset-0 bg-ink-950" />

      <motion.div
        className="absolute inset-0"
        style={animate ? { y: auroraY, opacity: auroraOpacity } : undefined}
      >
        {/* Cyan glow, top-left. The gradient's own falloff *is* the blur. */}
        <div
          className="absolute -left-[18%] -top-[22%] h-[62vh] w-[62vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.16), transparent 72%)' }}
        />
        {/* Violet glow, right */}
        <div
          className="absolute -right-[14%] top-[16%] h-[58vh] w-[52vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.16), transparent 72%)' }}
        />
        {/* Indigo glow, bottom */}
        <div
          className="absolute bottom-[-18%] left-[24%] h-[52vh] w-[56vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.13), transparent 74%)' }}
        />
      </motion.div>

      {/* 2 — Perspective grid, fading out toward the horizon */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45vh] bg-grid-fade bg-grid opacity-[0.55]"
        style={{
          maskImage: 'linear-gradient(to top, #000 0%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(to top, #000 0%, transparent 92%)',
          transform: 'perspective(340px) rotateX(58deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Flat grid over the whole page for texture */}
      <div className="absolute inset-0 bg-grid-fade bg-grid opacity-50" />

      {/* 3 — Live particle network */}
      <div className="absolute inset-0">
        <ParticleNetwork opacity={0.85} />
      </div>

      {/* 4 — Grain + vignette give the flat gradients a premium, filmic depth.
             `.grain` owns the blend mode so the touch override in index.css can
             drop it — blend modes are costly on phone GPUs. */}
      <div className="absolute inset-0 bg-noise grain" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(2,3,8,0.55) 100%)',
        }}
      />
    </div>
  )
}
