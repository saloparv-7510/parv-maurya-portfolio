import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap,
  Terminal,
  Globe,
  Smartphone,
  Network,
  FolderGit2,
  TrendingUp,
} from 'lucide-react'
import { journey } from '../data/content'
import { EASE, VIEWPORT, cn } from '../lib/motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

gsap.registerPlugin(ScrollTrigger)

const ICONS = { GraduationCap, Terminal, Globe, Smartphone, Network, FolderGit2, TrendingUp }

/* ============================================================================
 *  Journey — a horizontal-flowing learning path.
 *
 *  This is the one place GSAP genuinely earns its place over Framer Motion:
 *  ScrollTrigger's `scrub` gives frame-accurate, two-way scroll linkage for the
 *  connecting path draw and the staggered card entrances, and it recalculates
 *  correctly when the layout reflows. Framer's whileInView is one-shot and
 *  can't scrub.
 *
 *  On mobile the same data renders as a vertical list — a horizontal scroller
 *  on a phone would fight the page scroll.
 * ========================================================================== */
export default function Journey() {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (reduce) return

    const ctx = gsap.context(() => {
      /* --- 1. Draw the connecting path as the section scrolls through --- */
      const path = pathRef.current
      if (path) {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            end: 'bottom 62%',
            scrub: 0.6, // slight lag → feels weighted rather than twitchy
          },
        })
      }

      /* --- 2. Stagger the step cards in, linked to scroll position --- */
      gsap.utils.toArray('[data-journey-step]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 46, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            delay: (i % 4) * 0.06,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })
    }, sectionRef)

    // Recalculate after fonts/images settle, otherwise triggers can be stale
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(raf)
      ctx.revert() // kills every tween + trigger created in this context
    }
  }, [reduce])

  return (
    <Section id="journey" index="06 / JOURNEY">
      <SectionHeading
        eyebrow="Learning journey"
        title="How I got"
        highlight="here."
        lede="Not a straight line — each step made the next one make sense."
        align="center"
        className="mx-auto"
      />

      <div ref={sectionRef} className="relative mt-16 lg:mt-20">
        {/* ------------------------------------------- desktop: flowing path -- */}
        <svg
          className="pointer-events-none absolute inset-x-0 top-[58px] hidden h-24 w-full lg:block"
          viewBox="0 0 1200 100"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Static guide line */}
          <path
            d="M 40 50 C 200 10, 300 90, 460 50 S 720 10, 880 50 S 1080 90, 1160 50"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Scroll-drawn gradient line */}
          <path
            ref={pathRef}
            d="M 40 50 C 200 10, 300 90, 460 50 S 720 10, 880 50 S 1080 90, 1160 50"
            stroke="url(#journeyGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="journeyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* ---------------------------------------- mobile: vertical rail -- */}
        <div className="absolute left-[26px] top-4 bottom-4 w-px bg-gradient-to-b from-accent-400/50 via-indigo-400/30 to-transparent lg:hidden" />

        {/* -------------------------------------------------------- steps -- */}
        <ol
          className="relative grid gap-5 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10"
        >
          {journey.map((step, i) => {
            const Icon = ICONS[step.icon] ?? Terminal
            const isLast = i === journey.length - 1
            return (
              <li
                key={step.step}
                data-journey-step
                className={cn(
                  'relative pl-16 lg:pl-0',
                  // Nudge alternating desktop cards to follow the wave of the path
                  'lg:pt-0',
                  i % 2 === 1 && 'lg:mt-8',
                )}
              >
                {/* Mobile node marker on the rail */}
                <span className="absolute left-0 top-5 flex h-[53px] w-[53px] items-center justify-center lg:hidden">
                  <span className="absolute inset-[10px] rounded-full border border-white/10 bg-ink-900" />
                  <Icon size={16} className="relative text-accent-300" />
                </span>

                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className={cn(
                    'ring-gradient group relative flex h-full flex-col gap-3 rounded-3xl glass p-5',
                    isLast && 'border-accent-400/20',
                  )}
                >
                  {/* Step number + desktop icon */}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        'hidden h-10 w-10 items-center justify-center rounded-xl border transition-all duration-500 group-hover:scale-110 lg:flex',
                        isLast
                          ? 'border-accent-400/30 bg-accent-400/12 text-accent-200'
                          : 'border-white/10 bg-white/[0.04] text-accent-300',
                      )}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="font-mono text-[0.68rem] tracking-[0.2em] text-slate-600">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-display text-[1.02rem] font-semibold leading-snug text-white">
                    {step.title}
                  </h3>
                  <p className="text-[0.83rem] leading-relaxed text-slate-400">{step.body}</p>

                  {/* "You are here" marker on the final step */}
                  {isLast && (
                    <span className="mt-auto flex items-center gap-2 pt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent-300">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute h-full w-full rounded-full bg-accent-400 animate-pulse-ring" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-accent-400" />
                      </span>
                      Currently here
                    </span>
                  )}
                </motion.div>
              </li>
            )
          })}
        </ol>

        {/* Closing note */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto mt-12 max-w-md text-center text-[0.88rem] leading-relaxed text-slate-500"
        >
          The next step is a team — somewhere I can contribute real work, get
          properly reviewed, and keep this line going.
        </motion.p>
      </div>
    </Section>
  )
}
