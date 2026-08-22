import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CheckCheck, Phone, Video, ArrowLeft, Smile, Paperclip, Mic } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

/* ============================================================================
 *  PhoneMockup — an animated Android phone showcasing the chat app.
 *
 *  The conversation plays itself: messages appear one at a time with a typing
 *  indicator before each incoming reply, tick marks progress from sent → read,
 *  and the whole script loops. It communicates "real-time messaging" far better
 *  than a static screenshot would.
 *
 *  Built entirely from divs — no image asset needed, so it stays crisp on any
 *  display and there is nothing for you to replace before showing it.
 * ========================================================================== */

// The scripted conversation. Edit freely — the animation adapts to any length.
const SCRIPT = [
  { from: 'them', text: 'Hey! Is the chat app working?', delay: 700 },
  { from: 'me', text: 'Yes — just deployed it 🎉', delay: 1100 },
  { from: 'me', text: 'Firestore syncs in real time', delay: 900 },
  { from: 'them', text: 'And login? OTP too?', delay: 1500 },
  { from: 'me', text: 'Email + phone OTP, both live ✅', delay: 1200 },
  { from: 'them', text: "That's impressive 🔥", delay: 1500 },
]

export default function PhoneMockup({ className = '' }) {
  const reduce = usePrefersReducedMotion()
  // Reduced motion: show the finished conversation immediately, no looping.
  const [visible, setVisible] = useState(reduce ? SCRIPT.length : 0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (reduce) return

    let cancelled = false
    const timers = []

    const play = () => {
      if (cancelled) return
      setVisible(0)
      setTyping(false)

      let elapsed = 600

      SCRIPT.forEach((msg, i) => {
        // Incoming messages get a typing indicator beforehand
        if (msg.from === 'them') {
          timers.push(setTimeout(() => !cancelled && setTyping(true), elapsed))
          elapsed += 900
          timers.push(
            setTimeout(() => {
              if (cancelled) return
              setTyping(false)
              setVisible(i + 1)
            }, elapsed),
          )
        } else {
          elapsed += msg.delay
          timers.push(setTimeout(() => !cancelled && setVisible(i + 1), elapsed))
        }
        elapsed += msg.delay
      })

      // Hold the finished conversation, then replay
      timers.push(setTimeout(play, elapsed + 3200))
    }

    play()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reduce])

  return (
    <div className={`relative ${className}`}>
      {/* Ambient glow behind the device */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 scale-[1.15] rounded-[3rem] bg-emerald-500/10 blur-3xl"
      />

      {/* ------------------------------------------------- device frame -- */}
      <div className="relative mx-auto w-full max-w-[268px] rounded-[2.4rem] border border-white/[0.12] bg-ink-800 p-[9px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
        {/* Side buttons */}
        <span
          aria-hidden="true"
          className="absolute -right-[2px] top-[112px] h-14 w-[3px] rounded-r-full bg-white/15"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[2px] top-[92px] h-8 w-[3px] rounded-l-full bg-white/12"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[2px] top-[136px] h-8 w-[3px] rounded-l-full bg-white/12"
        />

        {/* --------------------------------------------------- screen -- */}
        <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.9rem] bg-[#0b141a]">
          {/* Chat wallpaper: subtle pattern so bubbles have something to sit on */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 25%, rgba(16,185,129,0.09), transparent 45%), radial-gradient(circle at 80% 70%, rgba(34,211,238,0.07), transparent 45%)',
            }}
          />

          {/* --------------------------------------------- status bar -- */}
          <div className="relative flex items-center justify-between px-4 pt-2.5 text-[0.55rem] font-medium text-white/70">
            <span className="tabular-nums">9:41</span>
            {/* Punch-hole camera */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black/80 ring-1 ring-white/10"
            />
            <span className="flex items-center gap-1">
              {/* Signal bars */}
              <span className="flex items-end gap-[1.5px]">
                {[3, 5, 7, 9].map((h) => (
                  <span key={h} className="w-[2px] rounded-sm bg-white/70" style={{ height: h }} />
                ))}
              </span>
              {/* Battery */}
              <span className="ml-0.5 flex h-2.5 w-5 items-center rounded-[3px] border border-white/50 p-[1.5px]">
                <span className="h-full w-[72%] rounded-[1px] bg-white/70" />
              </span>
            </span>
          </div>

          {/* ------------------------------------------- chat header -- */}
          <div className="relative mt-2 flex items-center gap-2.5 border-b border-white/[0.06] bg-[#1f2c34]/90 px-3 py-2.5 backdrop-blur">
            <ArrowLeft size={14} className="shrink-0 text-white/60" />
            <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-[0.6rem] font-bold text-white">
              A
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#1f2c34] bg-emerald-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.65rem] font-semibold text-white">Aditya</p>
              <p className="text-[0.5rem] text-emerald-400/90">
                {typing ? 'typing…' : 'online'}
              </p>
            </div>
            <Video size={13} className="shrink-0 text-white/50" />
            <Phone size={12} className="shrink-0 text-white/50" />
          </div>

          {/* ---------------------------------------------- messages -- */}
          <div className="relative flex h-[calc(100%-108px)] flex-col justify-end gap-1.5 overflow-hidden px-2.5 pb-2">
            {/* Encryption notice, like the real app */}
            <div className="mx-auto mb-1 max-w-[85%] rounded-md bg-amber-500/[0.08] px-2 py-1 text-center text-[0.45rem] leading-tight text-amber-200/60">
              Messages are synced in real time via Firebase Firestore
            </div>

            <AnimatePresence initial={false}>
              {SCRIPT.slice(0, visible).map((msg, i) => {
                const mine = msg.from === 'me'
                return (
                  <motion.div
                    key={`${i}-${msg.text}`}
                    layout
                    initial={{ opacity: 0, y: 14, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.42, ease: EASE }}
                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative max-w-[78%] rounded-lg px-2 py-1.5 text-[0.58rem] leading-snug shadow-sm ${
                        mine
                          ? 'rounded-br-sm bg-[#005c4b] text-white'
                          : 'rounded-bl-sm bg-[#202c33] text-white/90'
                      }`}
                    >
                      {msg.text}
                      <span className="mt-0.5 flex items-center justify-end gap-1 text-[0.42rem] text-white/45">
                        9:4{i + 1}
                        {mine &&
                          // Last sent message shows single tick, earlier ones show read
                          (i === visible - 1 ? (
                            <Check size={7} className="text-white/45" />
                          ) : (
                            <CheckCheck size={7} className="text-sky-300" />
                          ))}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Typing indicator bubble */}
            <AnimatePresence>
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.28 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1 rounded-lg rounded-bl-sm bg-[#202c33] px-2.5 py-2">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1 w-1 rounded-full bg-white/50"
                        animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: d * 0.16,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ------------------------------------------- input bar -- */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-[#1f2c34]/95 px-2 py-2 backdrop-blur">
            <div className="flex flex-1 items-center gap-1.5 rounded-full bg-[#2a3942] px-2.5 py-1.5">
              <Smile size={11} className="shrink-0 text-white/40" />
              <span className="flex-1 text-[0.55rem] text-white/30">Message</span>
              <Paperclip size={10} className="shrink-0 text-white/40" />
            </div>
            <motion.span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00a884]"
              animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Mic size={12} className="text-white" />
            </motion.span>
          </div>
        </div>
      </div>

      {/* Floating tech tags orbiting the phone (desktop only — avoids clutter) */}
      <FloatingTag className="-left-4 top-[18%] hidden sm:flex" delay={0}>
        Firestore
      </FloatingTag>
      <FloatingTag className="-right-6 top-[42%] hidden sm:flex" delay={0.9}>
        Phone OTP
      </FloatingTag>
      <FloatingTag className="-left-6 bottom-[16%] hidden sm:flex" delay={1.8}>
        Java
      </FloatingTag>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function FloatingTag({ children, className = '', delay = 0 }) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.span
      className={`absolute z-20 items-center gap-1.5 rounded-full border border-white/10
                  bg-ink-850/85 px-2.5 py-1 font-mono text-[0.58rem] text-slate-300
                  backdrop-blur-md ${className}`}
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {children}
    </motion.span>
  )
}
