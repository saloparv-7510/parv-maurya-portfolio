import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GraduationCap, CheckCircle2, Loader, Award } from 'lucide-react'
import { academics, education } from '../data/content'
import { EASE, VIEWPORT, cn, stagger } from '../lib/motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import CountUp from './ui/CountUp'
import { useSpotlight } from '../hooks/useSpotlight'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

/* ============================================================================
 *  Education — a vertical timeline whose connecting line draws itself as you
 *  scroll, using Framer Motion's scroll progress mapped to scaleY.
 *
 *  Why scaleY on a gradient element rather than an SVG stroke-dashoffset:
 *  scaleY is a compositor-only property, so the line grows without triggering
 *  layout or paint on any frame. Buttery on mobile too.
 * ========================================================================== */
export default function Education() {
  const trackRef = useRef(null)
  const reduce = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: trackRef,
    // Start drawing when the list enters the lower third, finish near the top
    offset: ['start 78%', 'end 55%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <Section id="education" index="03 / EDUCATION">
      <SectionHeading
        eyebrow="Education"
        title="The academic"
        highlight="foundation."
        lede={academics.summary}
      />

      {/* ------------------------------------------- Academic details tiles -- */}
      {/* The headline numbers an interviewer looks for first — degree year,
          CGPA and division — pulled from `academics` in content.js. */}
      <div className="mt-12 flex justify-center lg:mt-14">
        <p className="eyebrow">{academics.eyebrow}</p>
      </div>

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mt-5 grid gap-3 sm:grid-cols-3"
      >
        {academics.highlights.map((item) => (
          <motion.div
            key={item.label}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.97 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
            }}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="group relative overflow-hidden rounded-2xl glass p-5 text-center transition-colors duration-500 hover:border-accent-400/25"
          >
            <div className="font-display text-2xl font-bold text-white sm:text-3xl">
              <CountUp value={item.value} />
            </div>
            <div className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent-300/85">
              {item.label}
            </div>
            <div className="mt-1 text-[0.75rem] leading-snug text-slate-500">{item.hint}</div>

            {/* Bottom accent line grows in on hover */}
            <span className="absolute inset-x-4 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent-400 to-transparent transition-transform duration-500 ease-premium group-hover:scale-x-100" />
          </motion.div>
        ))}
      </motion.div>

      <div ref={trackRef} className="relative mt-14 lg:mt-16">
        {/* ------------------------------------------------ timeline rail -- */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/[0.07] sm:left-[23px] lg:left-1/2 lg:-translate-x-1/2" />

        {/* The drawn-in progress line */}
        <motion.div
          className="absolute left-[19px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-accent-400 via-indigo-400 to-iris-500 sm:left-[23px] lg:left-1/2 lg:-translate-x-1/2"
          style={reduce ? { scaleY: 1 } : { scaleY: lineScale }}
        >
          {/* Glow travelling at the tip of the line */}
          <span className="absolute -inset-x-[3px] inset-y-0 bg-accent-400/25 blur-[6px]" />
        </motion.div>

        {/* ----------------------------------------------------- entries -- */}
        <ol className="flex flex-col gap-8 sm:gap-10">
          {education.map((item, i) => {
            const isRight = i % 2 === 1 // desktop: alternate sides
            return (
              <EducationItem
                key={item.degree}
                item={item}
                index={i}
                isRight={isRight}
                total={education.length}
              />
            )
          })}
        </ol>
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

function EducationItem({ item, index, isRight }) {
  const spot = useSpotlight()
  // `current: true` in content.js marks the in-progress entry. Falls back to the
  // old status check so an entry without the flag still behaves as before.
  const current = item.current ?? item.status === 'Pursuing'

  return (
    <motion.li
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
      className={cn(
        'relative pl-14 sm:pl-20',
        // On desktop the card sits on one side, the rail runs down the middle
        'lg:grid lg:grid-cols-2 lg:gap-14 lg:pl-0',
      )}
    >
      {/* ------------------------------------------------------- node dot -- */}
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.55, ease: EASE, delay: 0.18 }}
        className="absolute left-0 top-6 flex h-10 w-10 items-center justify-center rounded-full
                   border border-white/10 bg-ink-900 sm:left-1 sm:h-11 sm:w-11
                   lg:left-1/2 lg:-translate-x-1/2"
      >
        {/* Pulsing halo on the in-progress entry */}
        {current && (
          <span className="absolute inset-0 rounded-full bg-accent-400/25 animate-pulse-ring" />
        )}
        <span
          className={cn(
            'relative flex h-full w-full items-center justify-center rounded-full',
            current ? 'text-accent-300' : 'text-slate-500',
          )}
        >
          {current ? (
            <Loader size={15} className="animate-spin-slow" />
          ) : (
            <CheckCircle2 size={15} />
          )}
        </span>
      </motion.span>

      {/* ----------------------------------------------------------- card -- */}
      <div
        className={cn(
          'lg:col-span-1',
          isRight ? 'lg:col-start-2' : 'lg:col-start-1 lg:text-right',
        )}
      >
        <motion.div
          {...spot}
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="spotlight ring-gradient group relative overflow-hidden rounded-3xl glass p-5 sm:p-6"
        >
          {/* Period + status row */}
          <div
            className={cn(
              'flex flex-wrap items-center gap-2.5',
              !isRight && 'lg:justify-end',
            )}
          >
            <span className="chip chip-hover font-mono">{item.period}</span>
            <span
              className={cn(
                'chip',
                current
                  ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
                  : 'border-white/10 text-slate-500',
              )}
            >
              {item.status}
            </span>

            {/* Result chip — only rendered when `grade` is set in content.js */}
            {item.grade && (
              <span className="chip border-iris-400/25 bg-iris-400/10 text-iris-300">
                <Award size={11} />
                {item.grade}
              </span>
            )}
          </div>

          <h3 className="mt-3.5 font-display text-lg font-semibold leading-snug text-white sm:text-xl">
            {item.degree}
          </h3>

          <p
            className={cn(
              'mt-2 flex items-start gap-2 text-[0.86rem] leading-relaxed text-slate-300',
              !isRight && 'lg:flex-row-reverse lg:text-right',
            )}
          >
            <GraduationCap size={15} className="mt-0.5 shrink-0 text-accent-400/70" />
            <span>{item.institution}</span>
          </p>

          <p className="mt-2.5 text-[0.82rem] leading-relaxed text-slate-500">{item.note}</p>

          {/* Large ghosted index in the corner */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute bottom-2 font-display text-5xl font-bold text-white/[0.03] transition-colors duration-500 group-hover:text-accent-400/[0.07]',
              isRight ? 'right-4' : 'right-4 lg:left-4 lg:right-auto',
            )}
          >
            0{index + 1}
          </span>
        </motion.div>
      </div>
    </motion.li>
  )
}
