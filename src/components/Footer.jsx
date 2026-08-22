import { motion } from 'framer-motion'
import { ArrowUp, Heart } from 'lucide-react'
import { footer, navLinks, profile, socials } from '../data/content'
import { EASE, VIEWPORT, scrollToSection } from '../lib/motion'
import SocialIcon from './ui/SocialIcon'

export default function Footer() {
  const activeSocials = socials.filter((s) => s.enabled)

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pt-16">
      {/* Oversized watermark of the name — a common device in high-end
          portfolios; it fills the footer without adding content noise. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
      >
        <span className="translate-y-[28%] select-none whitespace-nowrap font-display text-[19vw] font-bold leading-none tracking-tighter text-white/[0.022]">
          {profile.name}
        </span>
      </div>

      <div className="shell relative">
        <div className="grid gap-10 pb-12 lg:grid-cols-12 lg:gap-8">
          {/* ------------------------------------------------- brand ---- */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col gap-4 lg:col-span-5"
          >
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="flex w-fit items-center gap-3"
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent-sweep bg-[length:200%_auto] animate-gradient-pan">
                <span className="absolute inset-[1.5px] rounded-[10px] bg-ink-950" />
                <span className="relative font-display text-[0.82rem] font-bold text-white">
                  {profile.initials}
                </span>
              </span>
              <span className="font-display text-lg font-semibold text-white">{profile.name}</span>
            </button>

            <p className="max-w-sm text-[0.86rem] leading-relaxed text-slate-500">
              {profile.title}
            </p>

            <a
              href={`mailto:${profile.email}`}
              className="w-fit border-b border-white/10 pb-0.5 font-mono text-[0.78rem] text-slate-400 transition-colors hover:border-accent-400/50 hover:text-accent-300"
            >
              {profile.email}
            </a>
          </motion.div>

          {/* ------------------------------------------------- links ---- */}
          <motion.nav
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            className="lg:col-span-4"
            aria-label="Footer navigation"
          >
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-slate-500">
              Navigate
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="group flex items-center gap-2 text-[0.85rem] text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="h-px w-0 bg-accent-400 transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* ------------------------------------------------ socials ---- */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
            className="flex flex-col gap-4 lg:col-span-3"
          >
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-slate-500">
              Connect
            </p>

            {activeSocials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeSocials.map((s) => (
                  <SocialIcon key={s.id} social={s} size="sm" />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="group mt-2 flex w-fit items-center gap-2.5 rounded-full border
                         border-white/10 bg-white/[0.03] py-2 pl-4 pr-2 text-[0.8rem]
                         text-slate-300 transition-colors hover:border-accent-400/40 hover:text-white"
            >
              Back to top
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] transition-all duration-300 group-hover:bg-accent-400 group-hover:text-ink-950">
                <ArrowUp size={12} className="transition-transform duration-300 group-hover:-translate-y-px" />
              </span>
            </button>
          </motion.div>
        </div>

        <div className="hairline" />

        {/* ------------------------------------------------- baseline ---- */}
        {/* Baseline sits on top of the oversized watermark, so it needs slate-500
            rather than the slate-600 used elsewhere for de-emphasised text:
            against the near-black base slate-600 lands around 2.4:1 contrast,
            which disappears at this 11.5px size. slate-500 reads ~4:1 — still
            clearly secondary, but legible. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-between gap-3 py-7 sm:flex-row"
        >
          <p className="text-center font-mono text-[0.72rem] text-slate-500 sm:text-left">
            {footer.copyright}
          </p>

          <p className="flex items-center gap-1.5 text-center font-mono text-[0.72rem] text-slate-500 sm:text-right">
            {footer.line.replace(' and technology.', '')}
            <Heart size={10} className="text-rose-400/60" />
            <span className="text-slate-400">and technology.</span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
