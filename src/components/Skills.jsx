import { motion } from 'framer-motion'
import {
  Coffee,
  Globe,
  Database,
  Wrench,
  Zap,
  MonitorSmartphone,
} from 'lucide-react'
import { skillGroups } from '../data/content'
import { EASE, VIEWPORT, cn, stagger } from '../lib/motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import { useSpotlight } from '../hooks/useSpotlight'

const ICONS = { Coffee, Globe, Database, Wrench, Zap, MonitorSmartphone }

/* Per-group accent so the grid has rhythm instead of one flat colour */
const ACCENTS = {
  accent: {
    text: 'text-accent-300',
    border: 'border-accent-400/20',
    bg: 'bg-accent-400/10',
    bar: 'from-accent-400 to-cyan-300',
    glow: 'bg-accent-400/20',
    hoverBorder: 'group-hover:border-accent-400/40',
  },
  iris: {
    text: 'text-iris-300',
    border: 'border-iris-500/20',
    bg: 'bg-iris-500/10',
    bar: 'from-iris-500 to-indigo-400',
    glow: 'bg-iris-500/20',
    hoverBorder: 'group-hover:border-iris-500/40',
  },
}

export default function Skills() {
  return (
    <Section id="skills" index="02 / SKILLS">
      <SectionHeading
        eyebrow="Technical skills"
        title="The tools I build"
        highlight="with."
        lede="Languages, frameworks and environments I've used to ship real projects — with an honest read on where each one sits."
      />

      {/* items-start rather than the default stretch: the groups hold 1–5
          skills each, and stretching gives the one-skill cards (Java, AJAX) a
          tall empty interior that reads as a rendering bug. Letting each card
          hug its content turns that space into gaps between cards instead,
          which reads as deliberate layout. */}
      <motion.div
        variants={stagger(0.09)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mt-14 grid items-start gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
      >
        {skillGroups.map((group) => (
          <SkillCard key={group.id} group={group} />
        ))}
      </motion.div>

      {/* Legend clarifying that the meters are a self-assessment, not a metric */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 text-center font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-600"
      >
        Meters reflect my own confidence level, not a certification score
      </motion.p>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

function SkillCard({ group }) {
  const Icon = ICONS[group.icon] ?? Zap
  const a = ACCENTS[group.accent] ?? ACCENTS.accent
  const spot = useSpotlight()

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      {...spot}
      className="spotlight ring-gradient group relative flex flex-col gap-5 overflow-hidden rounded-3xl glass p-6"
    >
      {/* ------------------------------------------------------- header -- */}
      <div className="flex items-center gap-3.5">
        <span
          className={cn(
            'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-500 group-hover:scale-110',
            a.border,
            a.bg,
            a.text,
            a.hoverBorder,
          )}
        >
          <Icon size={19} />
          <span
            className={cn(
              'absolute inset-0 rounded-xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100',
              a.glow,
            )}
          />
        </span>

        <div className="min-w-0">
          <h3 className="font-display text-[0.98rem] font-semibold leading-tight text-white">
            {group.title}
          </h3>
          <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-slate-600">
            {group.skills.length} {group.skills.length === 1 ? 'technology' : 'technologies'}
          </p>
        </div>
      </div>

      <div className="hairline" />

      {/* ------------------------------------------------------- skills -- */}
      <ul className="flex flex-col gap-3.5">
        {group.skills.map((skill, i) => (
          <li key={skill.name} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[0.86rem] font-medium text-slate-200 transition-colors duration-300 group-hover:text-white">
                {skill.name}
              </span>
              {/* Level number counts up alongside the bar */}
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                className="font-mono text-[0.62rem] tabular-nums text-slate-500"
              >
                {skill.level}%
              </motion.span>
            </div>

            {/* Meter track */}
            <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: skill.level / 100 }}
                viewport={VIEWPORT}
                transition={{ duration: 1.15, ease: EASE, delay: 0.15 + i * 0.09 }}
                style={{ transformOrigin: 'left' }}
                className={cn('h-full w-full rounded-full bg-gradient-to-r', a.bar)}
              >
                {/* Travelling sheen so the bar reads as "live" on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45
                             to-transparent opacity-0 transition-opacity duration-300
                             group-hover:animate-shimmer group-hover:opacity-100"
                />
              </motion.div>
            </div>
          </li>
        ))}
      </ul>
    </motion.article>
  )
}
