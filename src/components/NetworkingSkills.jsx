import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Radio, MousePointerClick } from 'lucide-react'
import { networkingSkills } from '../data/content'
import { EASE, VIEWPORT, cn } from '../lib/motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

/* ============================================================================
 *  NetworkingSkills — an interactive node graph.
 *
 *  ARCHITECTURE
 *  The graph lives in pixel space: a ResizeObserver measures the container and
 *  every node's normalised (0–1) position is multiplied up. That keeps the SVG
 *  lines, the HTML labels and the animated packets in perfect agreement at any
 *  screen size — no viewBox distortion, no non-uniform stroke widths.
 *
 *  INTERACTION
 *  Hovering (or tapping, or tabbing to) a node highlights it and its direct
 *  connections while dimming the rest, and the detail panel updates. Until the
 *  visitor interacts, the graph cycles through nodes on its own so the
 *  interaction demonstrates itself.
 * ========================================================================== */

/* Group → colour. Add a new group here and it just works. */
const GROUPS = {
  model: { label: 'Models', color: '#22d3ee', rgb: '34,211,238' },
  addressing: { label: 'Addressing', color: '#a78bfa', rgb: '167,139,250' },
  services: { label: 'Services', color: '#34d399', rgb: '52,211,153' },
  infra: { label: 'Infrastructure', color: '#818cf8', rgb: '129,140,248' },
  physical: { label: 'Physical', color: '#fbbf24', rgb: '251,191,36' },
  ops: { label: 'Operations', color: '#fb7185', rgb: '251,113,133' },
}

/* Extra semantic links, drawn on top of the hub-and-ring structure.
   These are the pairs that genuinely relate to each other conceptually. */
const CROSS_LINKS = [
  ['OSI Model', 'TCP/IP Model'],
  ['IPv4 Addressing', 'IPv6 Addressing'],
  ['DHCP', 'DNS Basics'],
  ['Routing', 'Switching Fundamentals'],
  ['IPv4 Addressing', 'Routing'],
  ['Network Media', 'Network Topologies'],
  ['Switching Fundamentals', 'Wireless & Mobile Networks'],
  ['DHCP', 'Network Troubleshooting'],
]

export default function NetworkingSkills() {
  const containerRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [activeIdx, setActiveIdx] = useState(0)
  const [userEngaged, setUserEngaged] = useState(false)
  const reduce = usePrefersReducedMotion()

  /* ------------------------------------------------- measure container -- */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* ---------------------------------------------------- node positions -- */
  // Normalised 0–1 coordinates on a slightly irregular ellipse. The small
  // per-node radius variation is what stops it looking like a clock face.
  const nodes = useMemo(() => {
    const n = networkingSkills.length
    return networkingSkills.map((skill, i) => {
      const angle = (-90 + (360 / n) * i) * (Math.PI / 180)
      const wobble = 0.88 + ((i * 7) % 5) / 15 // 0.88 … 1.15
      const rx = 0.385 * wobble
      const ry = 0.375 * wobble
      return {
        ...skill,
        i,
        nx: 0.5 + Math.cos(angle) * rx,
        ny: 0.5 + Math.sin(angle) * ry,
      }
    })
  }, [])

  const px = useCallback((n) => ({ x: n.nx * size.w, y: n.ny * size.h }), [size])
  const hub = { x: size.w / 2, y: size.h / 2 }

  /* ---------------------------------------------------------- edge set -- */
  const edges = useMemo(() => {
    const byName = new Map(nodes.map((n) => [n.name, n]))
    const list = []

    // Spokes: every skill connects to the central hub
    nodes.forEach((n) => list.push({ a: n, b: null, kind: 'spoke' }))

    // Ring: each node to its neighbour, closing the loop
    nodes.forEach((n, i) => {
      list.push({ a: n, b: nodes[(i + 1) % nodes.length], kind: 'ring' })
    })

    // Semantic cross-links
    CROSS_LINKS.forEach(([from, to]) => {
      const a = byName.get(from)
      const b = byName.get(to)
      if (a && b) list.push({ a, b, kind: 'cross' })
    })

    return list
  }, [nodes])

  /* Which node names are connected to the active one (for highlighting) */
  const connected = useMemo(() => {
    const active = nodes[activeIdx]
    if (!active) return new Set()
    const set = new Set([active.name])
    edges.forEach((e) => {
      if (e.kind === 'spoke') return
      if (e.a?.name === active.name && e.b) set.add(e.b.name)
      if (e.b?.name === active.name && e.a) set.add(e.a.name)
    })
    return set
  }, [activeIdx, edges, nodes])

  /* ----------------------------------------- idle auto-cycle (self demo) -- */
  useEffect(() => {
    if (userEngaged || reduce) return
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % nodes.length)
    }, 2600)
    return () => clearInterval(id)
  }, [userEngaged, reduce, nodes.length])

  const engage = useCallback((idx) => {
    setUserEngaged(true)
    setActiveIdx(idx)
  }, [])

  const active = nodes[activeIdx]
  const activeGroup = GROUPS[active?.group] ?? GROUPS.model
  const ready = size.w > 0 && size.h > 0

  return (
    <Section id="networking" index="02b / NETWORKING">
      <SectionHeading
        eyebrow="Computer Networking"
        title="Understanding the layer"
        highlight="underneath."
        lede="Networking is the part of computer science I keep coming back to. Explore the map — every node is something I've studied hands-on."
      />

      <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8">
        {/* ================================================== GRAPH ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative overflow-hidden rounded-3xl glass lg:col-span-8"
        >
          {/* Header strip */}
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
            <div className="flex items-center gap-2.5">
              <Radio size={14} className="text-accent-400" />
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-slate-400">
                Network topology map
              </span>
            </div>
            <span className="hidden items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-600 sm:flex">
              <MousePointerClick size={12} />
              Hover a node
            </span>
          </div>

          <div
            ref={containerRef}
            className="relative aspect-square w-full sm:aspect-[16/11]"
            onPointerLeave={() => setUserEngaged(true)}
          >
            {/* ------------------------------------------- SVG: edges -- */}
            {ready && (
              <svg
                className="absolute inset-0 h-full w-full"
                width={size.w}
                height={size.h}
                viewBox={`0 0 ${size.w} ${size.h}`}
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="hubGlow">
                    <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
                    <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                  </radialGradient>
                </defs>

                {/* Hub halo */}
                <circle cx={hub.x} cy={hub.y} r={Math.min(size.w, size.h) * 0.18} fill="url(#hubGlow)" />

                {edges.map((e, i) => {
                  const A = px(e.a)
                  const B = e.b ? px(e.b) : hub
                  const involvesActive =
                    e.a?.name === active?.name || e.b?.name === active?.name
                  const isSpoke = e.kind === 'spoke'

                  const baseOpacity = isSpoke ? 0.14 : e.kind === 'ring' ? 0.1 : 0.16
                  const stroke = involvesActive ? activeGroup.color : '#64748b'

                  return (
                    <line
                      key={`${e.kind}-${i}`}
                      x1={A.x}
                      y1={A.y}
                      x2={B.x}
                      y2={B.y}
                      stroke={stroke}
                      strokeWidth={involvesActive ? 1.4 : 0.8}
                      strokeOpacity={involvesActive ? 0.75 : baseOpacity}
                      strokeDasharray={e.kind === 'cross' ? '4 5' : undefined}
                      className={cn(
                        'transition-all duration-500',
                        e.kind === 'cross' && !reduce && 'animate-dash-flow',
                      )}
                    />
                  )
                })}

                {/* ------------------------------ animated data packets -- */}
                {!reduce &&
                  nodes.slice(0, 6).map((n, k) => {
                    const P = px(n)
                    const color = GROUPS[n.group]?.color ?? '#22d3ee'
                    return (
                      <motion.circle
                        key={`packet-${n.name}`}
                        r={2.6}
                        fill={color}
                        initial={{ cx: P.x, cy: P.y, opacity: 0 }}
                        animate={{
                          cx: [P.x, hub.x, P.x],
                          cy: [P.y, hub.y, P.y],
                          opacity: [0, 0.95, 0.95, 0],
                        }}
                        transition={{
                          duration: 4.2 + k * 0.45,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: k * 0.7,
                          times: [0, 0.45, 0.55, 1],
                        }}
                        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
                      />
                    )
                  })}
              </svg>
            )}

            {/* ----------------------------------------- HTML: the hub -- */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-accent-400/30 bg-ink-900/90 backdrop-blur-sm sm:h-20 sm:w-20">
                <span className="absolute inset-0 rounded-full bg-accent-400/15 animate-pulse-ring" />
                <span className="absolute -inset-2 rounded-full border border-accent-400/10 animate-spin-slow" />
                <div className="relative text-center">
                  <div className="font-display text-[0.62rem] font-bold uppercase leading-tight tracking-wide text-white sm:text-[0.7rem]">
                    Net
                    <br />
                    working
                  </div>
                </div>
              </div>
            </div>

            {/* --------------------------------------- HTML: the nodes -- */}
            {nodes.map((n) => {
              const g = GROUPS[n.group] ?? GROUPS.model
              const isActive = n.i === activeIdx
              const isLinked = connected.has(n.name)
              const dimmed = !isActive && !isLinked

              return (
                <button
                  key={n.name}
                  type="button"
                  onPointerEnter={() => engage(n.i)}
                  onFocus={() => engage(n.i)}
                  onClick={() => engage(n.i)}
                  aria-label={`${n.name}: ${n.blurb}`}
                  aria-pressed={isActive}
                  data-cursor="hover"
                  className={cn(
                    'group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-premium',
                    dimmed ? 'opacity-40' : 'opacity-100',
                  )}
                  style={{ left: `${n.nx * 100}%`, top: `${n.ny * 100}%` }}
                >
                  <span className="flex flex-col items-center gap-1.5">
                    {/* Dot */}
                    <span className="relative flex items-center justify-center">
                      {isActive && (
                        <motion.span
                          layoutId="net-node-halo"
                          className="absolute h-9 w-9 rounded-full sm:h-10 sm:w-10"
                          style={{ backgroundColor: `rgba(${g.rgb},0.18)` }}
                          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                        />
                      )}
                      <span
                        className={cn(
                          'relative rounded-full border-2 transition-all duration-500',
                          isActive ? 'h-4 w-4 sm:h-[18px] sm:w-[18px]' : 'h-2.5 w-2.5 group-hover:h-3.5 group-hover:w-3.5',
                        )}
                        style={{
                          borderColor: g.color,
                          backgroundColor: isActive ? g.color : 'rgba(7,9,18,0.9)',
                          boxShadow: isActive ? `0 0 16px 2px rgba(${g.rgb},0.55)` : 'none',
                        }}
                      />
                    </span>

                    {/* Label — hidden on the smallest screens where 12 labels
                        would collide; the list below covers that case. */}
                    <span
                      className={cn(
                        'hidden max-w-[92px] text-center text-[0.6rem] font-medium leading-tight transition-colors duration-300 sm:block sm:max-w-[104px] sm:text-[0.66rem]',
                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300',
                      )}
                    >
                      {n.name}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ================================================ SIDE PANEL ==== */}
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
          className="flex flex-col gap-4 lg:col-span-4"
        >
          {/* Active node detail */}
          <div className="relative min-h-[190px] overflow-hidden rounded-3xl glass p-6">
            <span
              className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl transition-colors duration-700"
              style={{ backgroundColor: `rgba(${activeGroup.rgb},0.22)` }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active?.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative flex flex-col gap-3"
              >
                <span
                  className="chip w-fit"
                  style={{
                    borderColor: `rgba(${activeGroup.rgb},0.3)`,
                    backgroundColor: `rgba(${activeGroup.rgb},0.1)`,
                    color: activeGroup.color,
                  }}
                >
                  {activeGroup.label}
                </span>

                <h3 className="font-display text-xl font-semibold leading-snug text-white">
                  {active?.name}
                </h3>

                <p className="text-[0.88rem] leading-relaxed text-slate-400">{active?.blurb}</p>
              </motion.div>
            </AnimatePresence>

            {/* Progress ticks showing position in the set */}
            <div className="relative mt-5 flex items-center gap-1">
              {nodes.map((n) => (
                <span
                  key={n.name}
                  className="h-0.5 flex-1 rounded-full transition-colors duration-500"
                  style={{
                    backgroundColor:
                      n.i === activeIdx ? activeGroup.color : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-3xl glass p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
              Categories
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              {Object.entries(GROUPS).map(([key, g]) => (
                <li key={key} className="flex items-center gap-2 text-[0.72rem] text-slate-400">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  {g.label}
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>

      {/* ================================== FULL LIST (mobile-friendly) ====
          Paired with the node labels above, which are `hidden sm:block`. Below
          640px the graph shows dots only, so this tappable list is the way to
          reach every topic; from 640px up the labels are back and this row
          would just repeat them, so it goes away. Same `engage()` handler, so
          selection state stays in sync either way. */}
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        className="mt-5 flex flex-wrap gap-2 sm:hidden"
      >
        {nodes.map((n) => {
          const g = GROUPS[n.group] ?? GROUPS.model
          const isActive = n.i === activeIdx
          return (
            <motion.li
              key={n.name}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
              }}
            >
              <button
                type="button"
                onClick={() => engage(n.i)}
                onPointerEnter={() => engage(n.i)}
                data-cursor="hover"
                className={cn(
                  'chip transition-all duration-300',
                  isActive ? 'text-white' : 'hover:text-slate-200',
                )}
                style={
                  isActive
                    ? {
                        borderColor: `rgba(${g.rgb},0.45)`,
                        backgroundColor: `rgba(${g.rgb},0.12)`,
                      }
                    : undefined
                }
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: g.color }}
                />
                {n.name}
              </button>
            </motion.li>
          )
        })}
      </motion.ul>
    </Section>
  )
}
