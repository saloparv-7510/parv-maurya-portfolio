import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Github, ExternalLink, Check, Lightbulb, Layers } from 'lucide-react'
import { EASE, modalBackdrop, modalPanel, stagger } from '../lib/motion'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import PhoneMockup from './mockups/PhoneMockup'
import BrowserMockup from './mockups/BrowserMockup'

/* ============================================================================
 *  ProjectModal — the full case study for a project.
 *
 *  Accessibility handled properly, because an interviewer may well tab through:
 *   • role="dialog" + aria-modal + aria-labelledby
 *   • Escape closes it
 *   • Background scroll is locked (without the layout shifting sideways)
 *   • Focus moves into the panel on open
 * ========================================================================== */
export default function ProjectModal({ project, onClose }) {
  const open = Boolean(project)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-ink-950/85 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            variants={modalPanel}
            initial="hidden"
            animate="show"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            ref={(node) => node?.focus()}
            className="relative my-auto w-full max-w-4xl overflow-hidden rounded-3xl glass-strong outline-none"
          >
            {/* ------------------------------------------------- header -- */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.07] bg-ink-850/90 px-5 py-4 backdrop-blur-xl sm:px-7 sm:py-5">
              <div className="min-w-0">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-accent-300/80">
                  {[project.kind, project.year, project.team].filter(Boolean).join(' · ')}
                </p>
                <h3
                  id="project-modal-title"
                  className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl"
                >
                  {project.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border
                           border-white/10 bg-white/[0.04] text-slate-400 transition-colors
                           hover:border-rose-400/40 hover:text-rose-300"
              >
                <X size={16} />
              </button>
            </div>

            {/* --------------------------------------------------- body -- */}
            <div className="max-h-[calc(100vh-14rem)] overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
                {/* ------------------------------------ text column -- */}
                <div className="flex flex-col gap-7">
                  <p className="text-fluid-base leading-relaxed text-slate-300">
                    {project.summary}
                  </p>

                  {/* Tech stack */}
                  <div>
                    <SubHeading icon={Layers}>Tech stack</SubHeading>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="chip chip-hover normal-case tracking-normal">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <SubHeading icon={Check}>Key features</SubHeading>
                    <motion.ul
                      variants={stagger(0.05)}
                      initial="hidden"
                      animate="show"
                      className="mt-3 grid gap-2 sm:grid-cols-2"
                    >
                      {project.features.map((f) => (
                        <motion.li
                          key={f}
                          variants={{
                            hidden: { opacity: 0, x: -12 },
                            show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
                          }}
                          className="flex items-start gap-2.5 text-[0.85rem] leading-relaxed text-slate-400"
                        >
                          <span className="mt-[7px] flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                          {f}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>

                  {/* Engineering highlights — the interview talking points */}
                  {project.highlights?.length > 0 && (
                    <div>
                      <SubHeading icon={Lightbulb}>How it was built</SubHeading>
                      <div className="mt-3 flex flex-col gap-3">
                        {project.highlights.map((h, i) => (
                          <motion.div
                            key={h.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.08 }}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                          >
                            <p className="font-display text-[0.92rem] font-semibold text-white">
                              {h.title}
                            </p>
                            <p className="mt-1.5 text-[0.84rem] leading-relaxed text-slate-400">
                              {h.body}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ---------------------------------- visual column -- */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-center">
                    {/* ⭐ If you add `image` in content.js it is shown here
                        instead of the animated mockup. */}
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.name} screenshot`}
                        loading="lazy"
                        className="w-full rounded-2xl border border-white/10"
                      />
                    ) : project.mockup === 'phone' ? (
                      <PhoneMockup className="w-full max-w-[230px]" />
                    ) : (
                      <BrowserMockup className="w-full" />
                    )}
                  </div>

                  {/* ⭐ LINKS — set project.links.github / .demo in content.js */}
                  <div className="flex flex-col gap-2">
                    {project.links?.github ? (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-center gap-2 rounded-full border
                                   border-white/12 bg-white/[0.04] px-4 py-2.5 text-[0.85rem]
                                   font-medium text-white transition-colors hover:border-accent-400/40"
                      >
                        <Github size={15} />
                        View source
                      </a>
                    ) : (
                      <PlaceholderLink label="Add GitHub URL in content.js" icon={Github} />
                    )}

                    {project.links?.demo ? (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-center gap-2 rounded-full
                                   bg-accent-sweep bg-[length:200%_auto] px-4 py-2.5 text-[0.85rem]
                                   font-semibold text-ink-950 animate-gradient-pan"
                      >
                        <ExternalLink size={15} />
                        Live demo
                      </a>
                    ) : (
                      <PlaceholderLink label="Add live demo URL in content.js" icon={ExternalLink} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------------------- */

function SubHeading({ icon: Icon, children }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-slate-500">
      <Icon size={12} className="text-accent-400/70" />
      {children}
    </p>
  )
}

/** Shown when a link hasn't been filled in yet — tells you exactly what to do. */
function PlaceholderLink({ label, icon: Icon }) {
  return (
    <span
      className="flex cursor-not-allowed items-center justify-center gap-2 rounded-full border
                 border-dashed border-white/12 px-4 py-2.5 text-[0.78rem] text-slate-600"
      title={label}
    >
      <Icon size={14} />
      {label}
    </span>
  )
}
