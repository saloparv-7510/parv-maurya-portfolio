import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Github, ExternalLink, Maximize2 } from 'lucide-react'
import { projects } from '../data/content'
import { EASE, VIEWPORT, cn } from '../lib/motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import ProjectModal from './ProjectModal'
import PhoneMockup from './mockups/PhoneMockup'
import BrowserMockup from './mockups/BrowserMockup'
import { useSpotlight } from '../hooks/useSpotlight'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

/* Per-project accent so the two cards feel distinct rather than duplicated */
const ACCENTS = {
  accent: {
    text: 'text-accent-300',
    ring: 'border-accent-400/25',
    bg: 'bg-accent-400/10',
    glow: 'bg-accent-400/[0.11]',
    line: 'from-accent-400 via-indigo-400 to-transparent',
    hex: '#22d3ee',
  },
  amber: {
    text: 'text-amber-300',
    ring: 'border-amber-400/25',
    bg: 'bg-amber-400/10',
    glow: 'bg-amber-400/[0.11]',
    line: 'from-amber-400 via-orange-400 to-transparent',
    hex: '#fbbf24',
  },
  iris: {
    text: 'text-iris-300',
    ring: 'border-iris-400/25',
    bg: 'bg-iris-400/10',
    glow: 'bg-iris-400/[0.11]',
    line: 'from-iris-400 via-indigo-400 to-transparent',
    hex: '#a78bfa',
  },
}

export default function Projects() {
  const [selected, setSelected] = useState(null)

  return (
    <Section id="projects" index="05 / PROJECTS">
      <SectionHeading
        eyebrow="Selected work"
        title="Things I've actually"
        highlight="shipped."
        lede="Three projects taken from idea to working software, including my final-year major project. Open any one for the full breakdown of how it was built."
      />

      <div className="mt-14 flex flex-col gap-6 lg:mt-16 lg:gap-8">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            reversed={i % 2 === 1}
            onOpen={() => setSelected(project)}
          />
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}

/* ========================================================================== */

function ProjectCard({ project, reversed, onOpen }) {
  const cardRef = useRef(null)
  const spot = useSpotlight()
  const reduce = usePrefersReducedMotion()
  const a = ACCENTS[project.accent] ?? ACCENTS.accent

  // Gentle parallax: the mockup drifts against the page as the card scrolls by.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const mockupY = useTransform(scrollYProgress, [0, 1], [42, -42])

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE }}
      {...spot}
      className="spotlight ring-gradient group relative overflow-hidden rounded-[2rem] glass"
    >
      {/* Ambient colour wash that intensifies on hover */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -top-32 h-72 w-72 rounded-full blur-[100px] transition-all duration-700',
          a.glow,
          reversed ? '-right-24 group-hover:-right-16' : '-left-24 group-hover:-left-16',
        )}
      />

      <div
        className={cn(
          'relative grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10',
          reversed && 'lg:[&>*:first-child]:order-2',
        )}
      >
        {/* ================================================== CONTENT ==== */}
        <div className="flex flex-col gap-5">
          {/* Index + kind */}
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'font-display text-5xl font-bold leading-none tracking-tighter transition-colors duration-500 sm:text-6xl',
                'text-white/[0.07] group-hover:text-white/[0.13]',
              )}
            >
              {project.index}
            </span>
            <div className="flex flex-col gap-1">
              <span className={cn('font-mono text-[0.62rem] uppercase tracking-[0.2em]', a.text)}>
                {project.kind}
              </span>
              {/* Year and team size — each only rendered when set in content.js */}
              {(project.year || project.team) && (
                <span className="font-mono text-[0.62rem] tracking-wider text-slate-600">
                  {[project.year, project.team].filter(Boolean).join(' · ')}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2.1rem]">
              {project.name}
            </h3>
            <p className={cn('mt-2 text-fluid-base leading-snug', a.text)}>{project.tagline}</p>
          </div>

          <p className="max-w-lg text-[0.9rem] leading-relaxed text-slate-400">
            {project.summary}
          </p>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.45, ease: EASE, delay: 0.25 + i * 0.06 }}
                whileHover={{ y: -3 }}
                className="chip chip-hover normal-case tracking-normal"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: a.hex }}
                />
                {t}
              </motion.span>
            ))}
          </div>

          {/* Feature preview — first four, rest behind the modal */}
          <ul className="flex flex-col gap-2">
            {project.features.slice(0, 4).map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.07 }}
                className="flex items-start gap-2.5 text-[0.85rem] text-slate-400"
              >
                <span
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: a.hex }}
                />
                {f}
              </motion.li>
            ))}
            {project.features.length > 4 && (
              <li className="pl-[18px] font-mono text-[0.72rem] text-slate-600">
                +{project.features.length - 4} more
              </li>
            )}
          </ul>

          {/* Actions */}
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpen}
              data-cursor="hover"
              className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full
                         border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[0.85rem] font-medium
                         text-white transition-colors duration-300 hover:border-white/25"
            >
              <span
                className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-premium group-hover/btn:translate-x-0"
                style={{ background: `linear-gradient(90deg, ${a.hex}22, transparent)` }}
              />
              <Maximize2 size={14} className="relative" />
              <span className="relative">View case study</span>
            </button>

            {/* ⭐ These only render once you add the URLs in content.js */}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10
                           bg-white/[0.03] text-slate-400 transition-colors hover:border-white/25 hover:text-white"
                aria-label={`${project.name} source code`}
              >
                <Github size={15} />
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link flex items-center gap-1.5 text-[0.85rem] font-medium text-slate-300 transition-colors hover:text-white"
              >
                Live demo
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                />
              </a>
            )}
          </div>
        </div>

        {/* ================================================== VISUAL ===== */}
        <motion.button
          type="button"
          onClick={onOpen}
          data-cursor="view"
          aria-label={`Open ${project.name} case study`}
          style={reduce ? undefined : { y: mockupY }}
          className="relative flex w-full items-center justify-center rounded-2xl outline-none"
        >
          {/* ⭐ SCREENSHOT SLOT
              Add `image: '/images/your-shot.png'` in content.js and it replaces
              the animated mockup below. */}
          {project.image ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <img
                src={project.image}
                alt={`${project.name} preview`}
                loading="lazy"
                className="w-full transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ) : (
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.02, rotate: reversed ? -0.6 : 0.6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="w-full"
            >
              {project.mockup === 'phone' ? (
                <PhoneMockup />
              ) : (
                <BrowserMockup className="mx-auto max-w-[440px]" />
              )}
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Bottom accent line sweeps across on hover */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r transition-transform duration-1000 ease-premium group-hover:scale-x-100',
          a.line,
        )}
      />
    </motion.article>
  )
}
