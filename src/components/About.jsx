import { motion } from 'framer-motion'
import { Code2, Network, Sparkles, MapPin, Mail, GraduationCap } from 'lucide-react'
import { about, profile } from '../data/content'
import { EASE, VIEWPORT, cn, stagger } from '../lib/motion'
import { assetUrl } from '../lib/assets'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import CountUp from './ui/CountUp'
import { useSpotlight } from '../hooks/useSpotlight'

// Icon registry — lets content.js reference icons by name as a plain string
const ICONS = { Code2, Network, Sparkles }

export default function About() {
  const spot = useSpotlight()

  return (
    <Section id="about" index="01 / ABOUT">
      <SectionHeading
        eyebrow={about.eyebrow}
        title="Curious by default,"
        highlight="engineer by practice."
        lede="A short version of who I am and how I approach building things."
      />

      <div className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        {/* ------------------------------------------------ Profile card -- */}
        <Reveal direction="right" className="lg:col-span-5">
          <div
            {...spot}
            className="spotlight ring-gradient group relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl glass p-6 sm:p-7"
          >
            {/* ⭐ PROFILE PHOTO
                Set `profile.photo = '/images/your-photo.jpg'` in content.js.
                Until then, an animated monogram stands in — it looks
                intentional rather than like a missing image. */}
            <div className="relative mx-auto aspect-square w-full max-w-[260px] shrink-0 sm:mx-0">
              {/* Rotating conic-gradient frame */}
              <div
                className="absolute -inset-[2px] rounded-[28px] opacity-70 blur-[1px] transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'conic-gradient(from 0deg, #22d3ee, #6366f1, #8b5cf6, #22d3ee)',
                  animation: 'spin-slow 14s linear infinite',
                }}
              />
              <div className="absolute inset-0 overflow-hidden rounded-[26px] bg-ink-900">
                {profile.photo ? (
                  <img
                    src={assetUrl(profile.photo)}
                    alt={profile.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center">
                    {/* Placeholder grid + monogram */}
                    <div className="absolute inset-0 bg-grid-fade bg-grid opacity-40" />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 35%, rgba(34,211,238,0.16), transparent 65%)',
                      }}
                    />
                    <span className="relative font-display text-6xl font-bold tracking-tighter text-white/90">
                      {profile.initials}
                    </span>
                    <span className="absolute bottom-4 left-0 right-0 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-slate-500">
                      Add photo in content.js
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Identity block */}
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-white">{profile.name}</h3>
                <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent-300/80">
                  Computer Science Student
                </p>
              </div>

              <div className="hairline" />

              <ul className="flex flex-col gap-2.5 text-[0.84rem] text-slate-400">
                <li className="flex items-start gap-2.5">
                  <GraduationCap size={15} className="mt-0.5 shrink-0 text-accent-400/70" />
                  <span>B.Tech Computer Science · AKTU Lucknow</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-accent-400/70" />
                  <span>{profile.location}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail size={15} className="mt-0.5 shrink-0 text-accent-400/70" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="break-all transition-colors hover:text-accent-300"
                  >
                    {profile.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        {/* -------------------------------------------------- Bio + stats -- */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Reveal direction="left" delay={0.08}>
            <div className="flex flex-col gap-5 rounded-3xl glass p-6 sm:p-8">
              {/* Terminal-style header — a small nod to the developer identity */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-2 font-mono text-[0.66rem] tracking-wider text-slate-500">
                  about-me.md
                </span>
              </div>

              <motion.div
                variants={stagger(0.14)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                className="flex flex-col gap-4"
              >
                {about.paragraphs.map((text, i) => (
                  <motion.p
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                    }}
                    className={cn(
                      'text-fluid-base leading-relaxed',
                      i === 0 ? 'text-slate-200' : 'text-slate-400',
                    )}
                  >
                    {/* First paragraph gets a decorative drop-cap accent bar */}
                    {i === 0 && (
                      <span className="mr-3 inline-block h-4 w-1 translate-y-[1px] rounded-full bg-accent-400 align-middle" />
                    )}
                    {text}
                  </motion.p>
                ))}
              </motion.div>
            </div>
          </Reveal>

          {/* ------------------------------------------------ Stat tiles -- */}
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {about.stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.96 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
                }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl glass p-4 text-center transition-colors duration-500 hover:border-accent-400/25"
              >
                <div className="font-display text-2xl font-bold text-white sm:text-3xl">
                  <CountUp value={stat.value} />
                </div>
                <div className="mt-1 font-mono text-[0.58rem] uppercase leading-tight tracking-[0.12em] text-slate-500">
                  {stat.label}
                </div>
                {/* Bottom accent line grows in on hover */}
                <span className="absolute inset-x-4 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent-400 to-transparent transition-transform duration-500 ease-premium group-hover:scale-x-100" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ------------------------------------------------- Pillar cards -- */}
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mt-6 grid gap-4 md:grid-cols-3 lg:mt-8"
      >
        {about.pillars.map((pillar, i) => {
          const Icon = ICONS[pillar.icon] ?? Sparkles
          return (
            <motion.article
              key={pillar.title}
              variants={{
                hidden: { opacity: 0, y: 26 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="ring-gradient group relative flex flex-col gap-4 rounded-3xl glass p-6"
            >
              {/* Index watermark */}
              <span
                aria-hidden="true"
                className="absolute right-5 top-4 font-display text-4xl font-bold text-white/[0.04] transition-colors duration-500 group-hover:text-accent-400/10"
              >
                0{i + 1}
              </span>

              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-400/10 text-accent-300 transition-all duration-500 group-hover:scale-110 group-hover:border-accent-400/40">
                <Icon size={19} />
                <span className="absolute inset-0 rounded-xl bg-accent-400/20 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
              </span>

              <h3 className="font-display text-lg font-semibold text-white">{pillar.title}</h3>
              <p className="text-[0.88rem] leading-relaxed text-slate-400">{pillar.body}</p>
            </motion.article>
          )
        })}
      </motion.div>
    </Section>
  )
}
