import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, BadgeCheck, Building2, Calendar, MapPin, ShieldCheck } from 'lucide-react'
import { certifications } from '../data/content'
import { EASE, VIEWPORT, cn, stagger } from '../lib/motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import CountUp from './ui/CountUp'
import { useSpotlight } from '../hooks/useSpotlight'

const KIND_ICONS = {
  Certification: ShieldCheck,
  Training: Award,
  Internship: Building2,
}

export default function Certifications() {
  const featured = certifications.filter((c) => c.featured)
  const rest = certifications.filter((c) => !c.featured)

  return (
    <Section id="certifications" index="04 / CERTIFICATIONS">
      <SectionHeading
        eyebrow="Certifications & training"
        title="Verified learning,"
        highlight="on the record."
        lede="Structured programmes that gave my self-teaching a backbone — and a score to prove it."
      />

      <div className="mt-14 flex flex-col gap-4 lg:mt-16">
        {/* -------------------------------------------- Featured (Cisco) -- */}
        {featured.map((cert) => (
          <FeaturedCertCard key={cert.id} cert={cert} />
        ))}

        {/* ---------------------------------------------- Secondary cards -- */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid gap-4 md:grid-cols-2"
        >
          {rest.map((cert) => (
            <CertCard key={cert.id} cert={cert} />
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

/* ========================================================================== */
/*  Featured card — full width, with the animated score ring                  */
/* ========================================================================== */
function FeaturedCertCard({ cert }) {
  const spot = useSpotlight()
  const Icon = KIND_ICONS[cert.kind] ?? Award

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.85, ease: EASE }}
      {...spot}
      className="spotlight ring-gradient group relative overflow-hidden rounded-3xl glass p-6 sm:p-8"
    >
      {/* Ambient corner glow */}
      <span
        aria-hidden="true"
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-400/[0.09] bloom
                   transition-all duration-700 group-hover:bg-accent-400/[0.16]"
      />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
        {/* --------------------------------------------------- left: info -- */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
                         border border-accent-400/25 bg-accent-400/10 text-accent-300
                         transition-transform duration-500 group-hover:scale-110"
            >
              <Icon size={21} />
              <span className="absolute inset-0 rounded-xl bg-accent-400/25 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
            </span>

            <div className="min-w-0">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-accent-300/80">
                {cert.org}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-white sm:text-2xl">
                {cert.title}
              </h3>
            </div>

            <span className="chip ml-auto shrink-0 border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
              <BadgeCheck size={12} />
              Completed
            </span>
          </div>

          <p className="text-[0.9rem] text-slate-400">{cert.meta}</p>

          <div className="hairline" />

          {/* Topic chips */}
          <div>
            <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
              Topics covered
            </p>
            <motion.ul
              variants={stagger(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="flex flex-wrap gap-2"
            >
              {cert.topics.map((topic) => (
                <motion.li
                  key={topic}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 8 },
                    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                  }}
                >
                  <span className="chip chip-hover normal-case tracking-normal">{topic}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* ------------------------------------------------ right: score -- */}
        <div className="flex items-center justify-center gap-6 lg:flex-col lg:gap-4">
          <ScoreRing score={cert.score} />
          <div className="text-left lg:text-center">
            <p className="font-display text-sm font-semibold text-white">{cert.scoreLabel}</p>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-slate-500">
              Knowledge check
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

/* -------------------------------------------------------------------------- */
/*  Animated circular score meter                                             */
/* -------------------------------------------------------------------------- */
function ScoreRing({ score = 0, size = 132 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })

  const stroke = 7
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r

  return (
    <div ref={ref} className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={stroke}
        />
        {/* Progress arc — animated via strokeDashoffset */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: inView ? circumference * (1 - score / 100) : circumference,
          }}
          transition={{ duration: 1.7, ease: EASE, delay: 0.25 }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="55%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Centre readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold leading-none text-white">
          <CountUp value={score} duration={1700} />
        </span>
        <span className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-slate-500">
          Score
        </span>
      </div>

      {/* Soft glow behind the ring */}
      <span
        aria-hidden="true"
        className="absolute inset-4 -z-10 rounded-full bg-accent-400/15 blur-2xl"
      />
    </div>
  )
}

/* ========================================================================== */
/*  Standard certification / training card                                    */
/* ========================================================================== */
function CertCard({ cert }) {
  const spot = useSpotlight()
  const Icon = KIND_ICONS[cert.kind] ?? Award

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      {...spot}
      className="spotlight ring-gradient group relative flex flex-col gap-4 overflow-hidden rounded-3xl glass p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                     border border-iris-500/20 bg-iris-500/10 text-iris-300
                     transition-transform duration-500 group-hover:scale-110"
        >
          <Icon size={19} />
          <span className="absolute inset-0 rounded-xl bg-iris-500/25 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
        </span>

        <span className="chip shrink-0">{cert.kind}</span>
      </div>

      <div>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-iris-300/80">
          {cert.org}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-white">
          {cert.title}
        </h3>
      </div>

      <p className="text-[0.85rem] leading-relaxed text-slate-400">{cert.meta}</p>

      {/* Period / location metadata */}
      {(cert.period || cert.location) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.75rem] text-slate-500">
          {cert.period && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-iris-400/70" />
              {cert.period}
            </span>
          )}
          {cert.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-iris-400/70" />
              {cert.location}
            </span>
          )}
        </div>
      )}

      <div className="hairline mt-auto" />

      <ul className="flex flex-wrap gap-1.5">
        {cert.topics.map((topic) => (
          <li key={topic}>
            <span className="chip chip-hover normal-case tracking-normal">{topic}</span>
          </li>
        ))}
      </ul>

      {/* Bottom accent line sweeps in on hover */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r',
          'from-iris-500 via-accent-400 to-transparent',
          'transition-transform duration-700 ease-premium group-hover:scale-x-100',
        )}
      />
    </motion.article>
  )
}
