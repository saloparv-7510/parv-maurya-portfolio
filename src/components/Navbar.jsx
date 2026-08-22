import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { navLinks, profile } from '../data/content'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { cn, EASE, scrollToSection } from '../lib/motion'

const SECTION_IDS = navLinks.map((l) => l.id)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(SECTION_IDS, 150)

  useLockBodyScroll(open)

  // Condense the bar once the user leaves the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the mobile drawer
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id) => {
    setOpen(false)
    // Wait for the drawer's scroll lock to release before scrolling
    setTimeout(() => scrollToSection(id), open ? 240 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-[110] flex justify-center px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          className={cn(
            'flex w-full max-w-shell items-center justify-between gap-4 rounded-full border px-4 py-2.5 transition-all duration-500 ease-premium sm:px-5',
            scrolled
              ? 'border-white/10 shadow-lift nav-blur'
              : 'border-transparent bg-transparent',
          )}
        >
          {/* ---------------------------------------------------- Brand ---- */}
          <button
            type="button"
            onClick={() => go('home')}
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-accent-sweep bg-[length:200%_auto] animate-gradient-pan">
              <span className="absolute inset-[1.5px] rounded-[10px] bg-ink-900/90" />
              <span className="relative font-display text-[0.78rem] font-bold tracking-tight text-white">
                {profile.initials}
              </span>
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[0.9rem] font-semibold text-white">
                {profile.name}
              </span>
              <span className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-slate-500 transition-colors group-hover:text-accent-400">
                Developer
              </span>
            </span>
          </button>

          {/* ------------------------------------------- Desktop links ---- */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className={cn(
                      'relative rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors duration-300',
                      isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100',
                    )}
                  >
                    {/* Shared layout pill slides between items */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-accent-400/25 bg-accent-400/10"
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                      />
                    )}
                    {link.label}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* ----------------------------------------------- Right side ---- */}
          <div className="flex shrink-0 items-center gap-2">
            {/* ⭐ Optional resume button — set `profile.resume` in content.js */}
            {profile.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer noopener"
                className="hidden rounded-full border border-white/12 px-3.5 py-2 font-mono text-[0.68rem]
                           uppercase tracking-wider text-slate-300 transition-colors hover:border-accent-400/40
                           hover:text-accent-200 md:inline-flex"
              >
                Resume
              </a>
            )}

            <button
              type="button"
              onClick={() => go('contact')}
              className="group hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[0.8rem]
                         font-semibold text-ink-950 transition-all duration-300 hover:bg-accent-300 sm:inline-flex"
            >
              Let&apos;s talk
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10
                         bg-white/[0.04] text-white transition-colors hover:border-accent-400/40 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ------------------------------------------------ Mobile drawer ---- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[105] bg-ink-950/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              className="fixed inset-x-3 top-20 z-[106] overflow-hidden rounded-3xl glass-strong p-2 lg:hidden"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.4, ease: EASE }}
                  >
                    <button
                      type="button"
                      onClick={() => go(link.id)}
                      className={cn(
                        'group flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-colors',
                        active === link.id
                          ? 'bg-accent-400/10 text-white'
                          : 'text-slate-300 hover:bg-white/[0.04]',
                      )}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[0.62rem] text-accent-400/70">
                          0{i + 1}
                        </span>
                        <span className="font-display text-lg">{link.label}</span>
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="text-slate-600 transition-all duration-300 group-hover:translate-x-0.5
                                   group-hover:-translate-y-0.5 group-hover:text-accent-400"
                      />
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="hairline my-2" />

              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="truncate font-mono text-[0.7rem] text-slate-400 hover:text-accent-300"
                >
                  {profile.email}
                </a>
                {profile.resume && (
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="shrink-0 rounded-full border border-white/12 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-slate-300"
                  >
                    Resume
                  </a>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
