import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, MapPin, Mail, Sparkles, Compass } from 'lucide-react'
import { profile, socials } from '../data/content'
import { EASE, scrollToSection, stagger } from '../lib/motion'
import MagneticButton from './ui/MagneticButton'
import SplitText from './ui/SplitText'
import Typewriter from './ui/Typewriter'
import SocialIcon from './ui/SocialIcon'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

/* ============================================================================
 *  Hero — first impression. Everything here animates in on mount (not on
 *  scroll), sequenced so the eye lands on the name first, then the tagline,
 *  then the actions.
 * ========================================================================== */
export default function Hero() {
  const ref = useRef(null)
  const reduce = usePrefersReducedMotion()

  // Parallax: content drifts up and fades slightly as you scroll past it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 110])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96])

  const activeSocials = socials.filter((s) => s.enabled)

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32 sm:pt-36"
    >
      {/* Decorative orbit rings behind the content (desktop only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-18%] top-1/2 hidden -translate-y-1/2 lg:block"
      >
        <div className="relative h-[640px] w-[640px]">
          <div className="absolute inset-0 rounded-full border border-white/[0.05] animate-spin-slow" />
          <div
            className="absolute inset-[70px] rounded-full border border-accent-400/[0.09]"
            style={{ animation: 'spin-slow 32s linear infinite reverse' }}
          />
          <div className="absolute inset-[150px] rounded-full border border-iris-500/[0.08] animate-spin-slow" />
          {/* Orbiting dot */}
          <div className="absolute inset-0 animate-spin-slow">
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-400 shadow-[0_0_16px_4px_rgba(34,211,238,0.5)]" />
          </div>
        </div>
      </div>

      <motion.div
        className="shell relative z-10"
        style={reduce ? undefined : { y, opacity, scale }}
      >
        <motion.div
          variants={stagger(0.13, 0.1)}
          initial="hidden"
          animate="show"
          className="flex max-w-4xl flex-col items-start gap-7"
        >
          {/* ------------------------------------------- availability pill -- */}
          {profile.available && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
              className="glass flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute h-2 w-2 rounded-full bg-emerald-400 animate-pulse-ring" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-slate-300">
                Open to opportunities
              </span>
            </motion.div>
          )}

          {/* ------------------------------------------------------ heading -- */}
          <div className="flex flex-col gap-1">
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
              className="font-mono text-sm tracking-tight text-accent-300 sm:text-base"
            >
              <span className="text-slate-600">&lt;</span>
              Hi, I&apos;m
              <span className="text-slate-600">/&gt;</span>
            </motion.p>

            <h1 className="text-fluid-3xl font-bold leading-[0.95] tracking-[-0.03em]">
              <SplitText
                text="Parv Maurya"
                mode="char"
                animate
                delay={0.28}
                speed={0.035}
                className="block text-white"
              />
            </h1>
          </div>

          {/* ------------------------------------------- typewriter roles -- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.15 } },
            }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fluid-lg font-medium"
          >
            <span className="font-display text-slate-500">I&apos;m a</span>
            <Typewriter
              words={profile.roles}
              className="inline-flex items-center font-display font-semibold text-gradient"
            />
          </motion.div>

          {/* --------------------------------------------------- tagline -- */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="max-w-xl text-fluid-base leading-relaxed text-slate-400"
          >
            {profile.tagline} Currently studying computer science and turning what I learn into
            projects that actually run.
          </motion.p>

          {/* ------------------------------------------------- meta line -- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem] text-slate-500"
          >
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-accent-400/70" />
              Varanasi, Uttar Pradesh, India
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-center gap-2 transition-colors hover:text-accent-300"
            >
              <Mail size={14} className="text-accent-400/70" />
              <span className="border-b border-transparent transition-colors group-hover:border-accent-400/50">
                {profile.email}
              </span>
            </a>
          </motion.div>

          {/* ------------------------------------------------------ CTAs -- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 22 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="mt-2 flex flex-wrap items-center gap-3"
          >
            <MagneticButton
              variant="primary"
              onClick={() => scrollToSection('projects')}
              icon={<Sparkles size={15} />}
            >
              View My Work
            </MagneticButton>

            <MagneticButton
              variant="outline"
              onClick={() => scrollToSection('journey')}
              icon={<Compass size={15} className="transition-transform duration-500 group-hover:rotate-45" />}
            >
              Explore My Journey
            </MagneticButton>

            <MagneticButton
              variant="ghost"
              onClick={() => scrollToSection('contact')}
              className="underline decoration-white/20 decoration-1 underline-offset-[6px] hover:decoration-accent-400/60"
            >
              Contact Me
            </MagneticButton>
          </motion.div>

          {/* ----------------------------------------------- social links -- */}
          {activeSocials.length > 0 && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
              className="mt-4 flex items-center gap-3"
            >
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-slate-600">
                Find me
              </span>
              <span className="h-px w-8 bg-white/10" />
              <div className="flex items-center gap-2">
                {activeSocials.map((s) => (
                  <SocialIcon key={s.id} social={s} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* --------------------------------------------------- scroll cue -- */}
      {/* `hidden sm:flex` on purpose. This is centred on the hero's bottom
          edge, but on a narrow phone the content stack (which ends with the
          "Find me" social row) reaches almost the full 100svh, so a centred cue
          lands directly on top of those icons. Above 640px there's clear space
          between the left-aligned social row and the centre, so it reappears.
          Mobile loses nothing: the gradient below already signals more content. */}
      <motion.button
        type="button"
        onClick={() => scrollToSection('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.9 }}
        className="group absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        aria-label="Scroll to about section"
      >
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em] text-slate-600 transition-colors group-hover:text-accent-400">
          Scroll
        </span>
        {/* Vertical track with a travelling highlight */}
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-accent-400 to-transparent"
            animate={{ y: ['-100%', '260%'] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
        <ArrowDown
          size={13}
          className="text-slate-600 transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-accent-400"
        />
      </motion.button>

      {/* Fade the hero into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950 to-transparent"
      />
    </section>
  )
}
