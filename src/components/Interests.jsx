import { motion } from 'framer-motion'
import { Film, Zap, Trophy, Plane } from 'lucide-react'
import { interests } from '../data/content'
import { EASE, VIEWPORT, cn, stagger } from '../lib/motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import { useSpotlight } from '../hooks/useSpotlight'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

const ICONS = { Film, Zap, Trophy, Plane }

/* A distinct hue per interest keeps this section light and playful — a
   deliberate tonal break after the dense technical sections above it. */
const TONES = [
  { text: 'text-rose-300', bg: 'bg-rose-400/10', border: 'border-rose-400/20', glow: 'bg-rose-400/20' },
  { text: 'text-emerald-300', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', glow: 'bg-emerald-400/20' },
  { text: 'text-amber-300', bg: 'bg-amber-400/10', border: 'border-amber-400/20', glow: 'bg-amber-400/20' },
  { text: 'text-sky-300', bg: 'bg-sky-400/10', border: 'border-sky-400/20', glow: 'bg-sky-400/20' },
]

export default function Interests() {
  return (
    <Section id="interests" index="07 / INTERESTS" compact>
      <SectionHeading
        eyebrow="Beyond the screen"
        title="What I do when I'm"
        highlight="not coding."
        align="center"
        className="mx-auto"
      />

      <motion.ul
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {interests.map((item, i) => (
          <InterestCard key={item.title} item={item} tone={TONES[i % TONES.length]} index={i} />
        ))}
      </motion.ul>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

function InterestCard({ item, tone, index }) {
  const Icon = ICONS[item.icon] ?? Zap
  const spot = useSpotlight()
  const reduce = usePrefersReducedMotion()

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
      }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      {...spot}
      className="spotlight ring-gradient group relative flex flex-col items-center gap-3.5
                 overflow-hidden rounded-3xl glass p-6 text-center"
    >
      {/* Icon with a continuous, very slow float so the row feels alive */}
      <motion.span
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{
          duration: 4 + index * 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.3,
        }}
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:scale-110',
          tone.border,
          tone.bg,
          tone.text,
        )}
      >
        <Icon size={23} />
        <span
          className={cn(
            'absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100',
            tone.glow,
          )}
        />
      </motion.span>

      <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
      <p className="text-[0.82rem] leading-relaxed text-slate-400">{item.body}</p>

      {/* Ring that expands outward on hover */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute left-1/2 top-9 h-14 w-14 -translate-x-1/2 rounded-2xl border opacity-0 transition-all duration-700 ease-premium group-hover:scale-[2.2] group-hover:opacity-100',
          tone.border,
        )}
      />
    </motion.li>
  )
}
