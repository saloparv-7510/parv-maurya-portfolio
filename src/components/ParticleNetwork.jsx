import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

/* ============================================================================
 *  ParticleNetwork — animated "connected network" canvas.
 *
 *  This is the futuristic backdrop: drifting nodes that link up when they come
 *  close, plus data packets that travel along the links. It is the visual
 *  metaphor for the networking side of the portfolio.
 *
 *  PERFORMANCE NOTES (why this stays at 60fps):
 *   • Node count scales with viewport area and is hard-capped.
 *   • Neighbour search is O(n²) but over a small n, using squared distances
 *     (no Math.sqrt in the hot loop).
 *   • Device pixel ratio is clamped to 2 — a 3x-DPR phone would otherwise
 *     rasterise 9x the pixels for no visible gain.
 *   • The loop pauses entirely when the tab is hidden or the canvas scrolls
 *     out of view, so it never burns battery behind other sections.
 *   • Honours prefers-reduced-motion by drawing a single static frame.
 * ========================================================================== */

const CONFIG = {
  density: 0.000075, // nodes per px² of viewport
  maxNodes: 92,
  minNodes: 26,
  linkDist: 148, // px — nodes closer than this get connected
  speed: 0.16, // px per frame
  nodeColor: '148, 205, 245',
  linkColor: '80, 175, 220',
  pulseColor: '34, 211, 238',
  cursorRadius: 190, // pointer influence radius
  packetCount: 7,
}

export default function ParticleNetwork({ className = '', opacity = 1 }) {
  const canvasRef = useRef(null)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let nodes = []
    let packets = []
    let rafId = 0
    let visible = true
    const pointer = { x: -9999, y: -9999, active: false }

    // On phones / the packaged APK (coarse pointer or a narrow viewport) the
    // canvas shares a tighter frame budget with scroll compositing. Run a
    // lighter field there: fewer nodes (the neighbour search is O(n²), so
    // halving the count roughly quarters the per-frame work), fewer packets,
    // and a lower DPR ceiling. Desktop keeps the full-density network.
    const lowPower =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    const maxNodes = lowPower ? 46 : CONFIG.maxNodes
    const packetCount = lowPower ? 3 : CONFIG.packetCount
    const dprCap = lowPower ? 1.5 : 2

    /* ------------------------------------------------------------- setup -- */
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, dprCap)
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const seed = () => {
      const target = Math.round(width * height * CONFIG.density)
      const count = Math.max(CONFIG.minNodes, Math.min(maxNodes, target))

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.speed * 2,
        vy: (Math.random() - 0.5) * CONFIG.speed * 2,
        r: Math.random() * 1.5 + 0.9,
        // Slow independent twinkle so the field never looks uniform
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.004 + Math.random() * 0.01,
      }))

      // Packets travel from one node to another, then pick a new destination.
      packets = Array.from({ length: packetCount }, () => makePacket(count))
    }

    const makePacket = (count) => {
      const from = Math.floor(Math.random() * count)
      let to = Math.floor(Math.random() * count)
      if (to === from) to = (to + 1) % count
      return {
        from,
        to,
        t: Math.random(),
        speed: 0.0028 + Math.random() * 0.0042,
      }
    }

    /* ------------------------------------------------------------- render -- */
    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // --- links (drawn first so nodes sit on top) ---
      const limitSq = CONFIG.linkDist * CONFIG.linkDist

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq > limitSq) continue

          // Closer nodes → brighter link
          const strength = 1 - distSq / limitSq
          ctx.strokeStyle = `rgba(${CONFIG.linkColor}, ${strength * 0.3})`
          ctx.lineWidth = strength * 0.9
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }

        // --- link to the cursor: the network reaches toward the pointer ---
        if (pointer.active) {
          const dx = a.x - pointer.x
          const dy = a.y - pointer.y
          const distSq = dx * dx + dy * dy
          const rSq = CONFIG.cursorRadius * CONFIG.cursorRadius
          if (distSq < rSq) {
            const strength = 1 - distSq / rSq
            ctx.strokeStyle = `rgba(${CONFIG.pulseColor}, ${strength * 0.42})`
            ctx.lineWidth = strength * 1.1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      // --- nodes ---
      for (const n of nodes) {
        const alpha = 0.32 + Math.sin(n.phase) * 0.26
        ctx.fillStyle = `rgba(${CONFIG.nodeColor}, ${Math.max(0.08, alpha)})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // --- data packets gliding between nodes ---
      for (const p of packets) {
        const a = nodes[p.from]
        const b = nodes[p.to]
        if (!a || !b) continue
        const x = a.x + (b.x - a.x) * p.t
        const y = a.y + (b.y - a.y) * p.t

        // Fade in and out at the ends of the trip
        const fade = Math.sin(p.t * Math.PI)
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 7)
        grad.addColorStop(0, `rgba(${CONFIG.pulseColor}, ${0.85 * fade})`)
        grad.addColorStop(1, `rgba(${CONFIG.pulseColor}, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(220, 250, 255, ${0.95 * fade})`
        ctx.beginPath()
        ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        n.phase += n.twinkle

        // Bounce off the edges rather than wrapping — wrapping makes links
        // visibly snap across the screen.
        if (n.x < 0 || n.x > width) {
          n.vx *= -1
          n.x = Math.max(0, Math.min(width, n.x))
        }
        if (n.y < 0 || n.y > height) {
          n.vy *= -1
          n.y = Math.max(0, Math.min(height, n.y))
        }
      }

      for (const p of packets) {
        p.t += p.speed
        if (p.t >= 1) {
          // Arrived: continue the walk from the node we just reached
          p.from = p.to
          let next = Math.floor(Math.random() * nodes.length)
          if (next === p.from) next = (next + 1) % nodes.length
          p.to = next
          p.t = 0
          p.speed = 0.0028 + Math.random() * 0.0042
        }
      }
    }

    const loop = () => {
      if (visible) {
        step()
        draw()
      }
      rafId = requestAnimationFrame(loop)
    }

    /* ------------------------------------------------------------ events -- */
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active =
        pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height
    }
    const onPointerLeave = () => {
      pointer.active = false
    }

    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 160)
    }

    const onVisibility = () => {
      visible = !document.hidden
    }

    // Pause when the canvas scrolls out of view — the single biggest win for
    // battery life on a long scrolling page.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    /* -------------------------------------------------------------- boot -- */
    resize()

    if (reduceMotion) {
      draw() // one static frame, no animation loop
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointerleave', onPointerLeave)
      document.addEventListener('visibilitychange', onVisibility)
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(resizeTimer)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduceMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none h-full w-full ${className}`}
      style={{ opacity }}
    />
  )
}
