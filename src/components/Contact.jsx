import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Mail,
  MapPin,
  Send,
  Check,
  Copy,
  Loader2,
  AlertCircle,
  MessageSquare,
  User,
} from 'lucide-react'
import { contact, profile, socials } from '../data/content'
import { EASE, VIEWPORT, cn, stagger } from '../lib/motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import SocialIcon from './ui/SocialIcon'
import { useSpotlight } from '../hooks/useSpotlight'

/* ============================================================================
 *  Contact — animated form with real validation.
 *
 *  ⭐ HOW SENDING WORKS
 *  There is no backend here, so on submit the form composes a pre-filled email
 *  and hands it to the visitor's mail client via `mailto:`. That is honest and
 *  works everywhere with zero setup — nothing silently disappears.
 *
 *  To send server-side instead, swap the body of `handleSubmit` for a POST to
 *  a form service. Both of these are free and need no backend of your own:
 *    • Formspree — https://formspree.io   →  fetch('https://formspree.io/f/XXXX', {…})
 *    • EmailJS   — https://emailjs.com    →  emailjs.send(serviceId, templateId, form)
 *  The validation, loading and success states below already handle a promise,
 *  so you only need to replace the `await` line.
 * ========================================================================== */

const EMPTY = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [copied, setCopied] = useState(false)
  const spot = useSpotlight()

  const activeSocials = socials.filter((s) => s.enabled)

  /* ------------------------------------------------------- validation -- */
  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell me your name'
    if (!form.email.trim()) next.email = 'An email address is required'
    // Deliberately permissive: catches typos without rejecting valid addresses
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "That doesn't look like a valid email"
    if (!form.message.trim()) next.message = 'Add a short message'
    else if (form.message.trim().length < 10) next.message = 'A little more detail, please'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    // Clear a field's error as soon as the visitor starts fixing it
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  /* ----------------------------------------------------------- submit -- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status !== 'idle') return
    if (!validate()) return

    setStatus('sending')

    // ⭐ REPLACE THIS BLOCK to POST to a form service instead.
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name.trim()}`)
    const body = encodeURIComponent(
      `${form.message.trim()}\n\n—\n${form.name.trim()}\n${form.email.trim()}`,
    )
    await new Promise((r) => setTimeout(r, 900)) // lets the loading state register
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`

    setStatus('sent')
    setForm(EMPTY)
    setTimeout(() => setStatus('idle'), 5000)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (insecure context / permissions) — fail quietly
      // rather than throwing an error the visitor can't act on.
    }
  }

  return (
    <Section id="contact" index="08 / CONTACT">
      <div className="relative overflow-hidden rounded-[2rem] glass p-6 sm:p-10 lg:p-14">
        {/* Ambient corner glows */}
        <span
          aria-hidden="true"
          className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent-400/[0.09] blur-[110px]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-iris-500/[0.09] blur-[110px]"
        />

        <div className="relative">
          <SectionHeading
            eyebrow="Get in touch"
            title="Let's Build Something"
            highlight="Amazing Together"
            lede={contact.body}
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
            {/* =============================================== DETAILS ==== */}
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="flex flex-col gap-4"
            >
              {/* Email card with copy-to-clipboard */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
                }}
                {...spot}
                className="spotlight ring-gradient group relative overflow-hidden rounded-2xl
                           border border-white/[0.07] bg-white/[0.02] p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-400/10 text-accent-300 transition-transform duration-500 group-hover:scale-110">
                    <Mail size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
                      Email
                    </p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="mt-1 block break-all text-[0.9rem] font-medium text-white transition-colors hover:text-accent-300"
                    >
                      {profile.email}
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border
                               border-white/10 bg-white/[0.03] text-slate-400 transition-colors
                               hover:border-accent-400/40 hover:text-accent-300"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={copied ? 'check' : 'copy'}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        {copied ? (
                          <Check size={14} className="text-emerald-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>

              {/* Location card */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
                }}
                className="ring-gradient group relative overflow-hidden rounded-2xl border
                           border-white/[0.07] bg-white/[0.02] p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-iris-500/20 bg-iris-500/10 text-iris-300 transition-transform duration-500 group-hover:scale-110">
                    <MapPin size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
                      Location
                    </p>
                    <p className="mt-1 text-[0.9rem] font-medium leading-snug text-white">
                      {profile.location}
                    </p>
                    <p className="mt-1 text-[0.75rem] text-slate-500">
                      Open to remote and relocation
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Social links */}
              {activeSocials.length > 0 && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
                  }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
                    Elsewhere
                  </p>
                  <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                    {activeSocials.map((s) => (
                      <SocialIcon key={s.id} social={s} />
                    ))}
                  </div>
                  {/* ⭐ Reminder — remove once your real URLs are in content.js */}
                  {activeSocials.every((s) => s.url === '#') && (
                    <p className="mt-3 font-mono text-[0.6rem] leading-relaxed text-slate-600">
                      Add your profile URLs in{' '}
                      <span className="text-slate-500">src/data/content.js</span>
                    </p>
                  )}
                </motion.div>
              )}

              {/* Availability strip */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
                }}
                className="flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] px-5 py-4"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute h-full w-full rounded-full bg-emerald-400 animate-pulse-ring" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <p className="text-[0.82rem] text-emerald-100/80">
                  Available for internships and junior developer roles
                </p>
              </motion.div>
            </motion.div>

            {/* ================================================== FORM ==== */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7"
            >
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  /* ------------------------------- success state ------- */
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center"
                  >
                    {/* Animated tick */}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                      className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10"
                    >
                      <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-pulse-ring" />
                      <Check size={28} className="relative text-emerald-400" strokeWidth={2.5} />
                    </motion.span>

                    <h3 className="font-display text-xl font-semibold text-white">
                      Your mail client is open
                    </h3>
                    <p className="max-w-xs text-[0.86rem] leading-relaxed text-slate-400">
                      I&apos;ve pre-filled the message for you — just hit send. If nothing opened,
                      email me directly at{' '}
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-accent-300 underline decoration-accent-400/40 underline-offset-2"
                      >
                        {profile.email}
                      </a>
                    </p>

                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="mt-2 rounded-full border border-white/12 px-5 py-2 text-[0.82rem] text-slate-300 transition-colors hover:border-accent-400/40 hover:text-white"
                    >
                      Write another message
                    </button>
                  </motion.div>
                ) : (
                  /* ---------------------------------- form state ------- */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare size={15} className="text-accent-400" />
                      <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-slate-400">
                        Send a message
                      </p>
                    </div>

                    <Field
                      id="contact-name"
                      label="Your name"
                      icon={User}
                      value={form.name}
                      onChange={update('name')}
                      error={errors.name}
                      placeholder="Jane Doe"
                      autoComplete="name"
                    />

                    <Field
                      id="contact-email"
                      label="Email address"
                      icon={Mail}
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      error={errors.email}
                      placeholder="jane@company.com"
                      autoComplete="email"
                    />

                    <Field
                      id="contact-message"
                      label="Message"
                      icon={MessageSquare}
                      value={form.message}
                      onChange={update('message')}
                      error={errors.message}
                      placeholder="Tell me about the role or project…"
                      textarea
                    />

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      data-cursor="hover"
                      className="group relative mt-1 flex items-center justify-center gap-2.5
                                 overflow-hidden rounded-full px-6 py-3.5 text-[0.9rem] font-semibold
                                 text-ink-950 transition-opacity disabled:opacity-70"
                    >
                      <span className="absolute inset-0 bg-accent-sweep bg-[length:200%_auto] animate-gradient-pan" />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent
                                   via-white/45 to-transparent transition-transform duration-[900ms]
                                   ease-premium group-hover:translate-x-[120%]"
                      />
                      <span className="relative flex items-center gap-2.5">
                        {status === 'sending' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Preparing…
                          </>
                        ) : (
                          <>
                            Send message
                            <Send
                              size={15}
                              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </>
                        )}
                      </span>
                    </button>

                    {contact.responseTime && (
                      <p className="text-center font-mono text-[0.62rem] uppercase tracking-[0.14em] text-slate-600">
                        {contact.responseTime}
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ========================================================================== */
/*  Form field with a floating label, focus glow and inline error              */
/* ========================================================================== */
function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  textarea = false,
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const filled = value.length > 0

  const shared = {
    id,
    value,
    onChange,
    placeholder: focused ? placeholder : '',
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
    className: cn(
      'peer w-full resize-none rounded-xl border bg-ink-900/60 px-4 pb-2.5 pt-6 text-[0.9rem]',
      'text-white outline-none transition-all duration-300 placeholder:text-slate-600',
      error
        ? 'border-rose-400/45 focus:border-rose-400/70'
        : 'border-white/[0.08] focus:border-accent-400/50',
    ),
    ...rest,
  }

  return (
    <div className="relative">
      {/* Focus glow behind the field */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -inset-[1px] rounded-xl transition-opacity duration-400',
          focused && !error ? 'opacity-100' : 'opacity-0',
        )}
        style={{ boxShadow: '0 0 0 1px rgba(34,211,238,0.25), 0 0 26px -6px rgba(34,211,238,0.4)' }}
      />

      <div className="relative">
        {textarea ? <textarea rows={5} {...shared} /> : <input type={type} {...shared} />}

        {/* Floating label */}
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-4 flex items-center gap-1.5 font-mono uppercase transition-all duration-300',
            filled || focused
              ? 'top-2.5 text-[0.58rem] tracking-[0.16em]'
              : 'top-1/2 -translate-y-1/2 text-[0.72rem] tracking-[0.08em]',
            textarea && !filled && !focused && 'top-5 translate-y-0',
            error ? 'text-rose-300' : focused ? 'text-accent-300' : 'text-slate-500',
          )}
        >
          <Icon size={filled || focused ? 10 : 13} />
          {label}
        </label>
      </div>

      {/* Inline error */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-1.5 overflow-hidden pt-1.5 text-[0.74rem] text-rose-300"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
