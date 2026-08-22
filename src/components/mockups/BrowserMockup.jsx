import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ShoppingBag, Star, Plus, Clock, Lock } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

/* ============================================================================
 *  BrowserMockup — an animated browser window showcasing the food delivery UI.
 *
 *  It self-demonstrates the core interaction of the project: a dish gets added
 *  to the cart, the badge counts up, and the running total updates. That is the
 *  thing worth showing about a food-ordering site, so the mockup performs it on
 *  a loop instead of sitting still.
 *
 *  Pure CSS/divs — the "food photos" are gradient tiles with an emoji, which
 *  reads as a deliberate design choice rather than a missing asset.
 * ========================================================================== */

const DISHES = [
  { name: 'Margherita Pizza', price: 249, rating: 4.6, time: '25 min', emoji: '🍕', from: '#f97316', to: '#dc2626' },
  { name: 'Paneer Butter Masala', price: 219, rating: 4.8, time: '30 min', emoji: '🍛', from: '#f59e0b', to: '#b45309' },
  { name: 'Veg Hakka Noodles', price: 179, rating: 4.4, time: '20 min', emoji: '🍜', from: '#84cc16', to: '#15803d' },
  { name: 'Chocolate Brownie', price: 129, rating: 4.9, time: '15 min', emoji: '🍰', from: '#a855f7', to: '#7e22ce' },
]

const CATEGORIES = ['All', 'Pizza', 'Indian', 'Chinese', 'Desserts']

export default function BrowserMockup({ className = '' }) {
  const reduce = usePrefersReducedMotion()
  const [cart, setCart] = useState(reduce ? 2 : 0)
  const [total, setTotal] = useState(reduce ? 468 : 0)
  const [addingIdx, setAddingIdx] = useState(-1)
  const [activeCat, setActiveCat] = useState(0)

  /* --------------------------------------- scripted "add to cart" demo -- */
  useEffect(() => {
    if (reduce) return

    let cancelled = false
    const timers = []
    let step = 0

    const run = () => {
      if (cancelled) return

      // Every 4th step, reset the cart so the loop starts fresh
      if (step > 0 && step % 4 === 0) {
        setCart(0)
        setTotal(0)
        setActiveCat(0)
        setAddingIdx(-1)
        step += 1
        timers.push(setTimeout(run, 1400))
        return
      }

      const idx = step % DISHES.length
      setAddingIdx(idx)
      setActiveCat((idx % (CATEGORIES.length - 1)) + 1)

      timers.push(
        setTimeout(() => {
          if (cancelled) return
          setCart((c) => c + 1)
          setTotal((t) => t + DISHES[idx].price)
        }, 420),
      )

      timers.push(
        setTimeout(() => {
          if (cancelled) return
          setAddingIdx(-1)
        }, 1100),
      )

      step += 1
      timers.push(setTimeout(run, 2300))
    }

    timers.push(setTimeout(run, 1000))
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [reduce])

  return (
    <div className={`relative ${className}`}>
      {/* Ambient warm glow — matches the food/amber accent of this project */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 scale-105 rounded-3xl bg-amber-500/10 blur-3xl"
      />

      <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-ink-800 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
        {/* ------------------------------------------- browser chrome -- */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-ink-850 px-3.5 py-2.5">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>

          {/* URL bar */}
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1">
            <Lock size={9} className="shrink-0 text-emerald-400/70" />
            <span className="truncate font-mono text-[0.58rem] text-slate-500">
              localhost:3000<span className="text-slate-600">/menu</span>
            </span>
          </div>

          <span className="hidden shrink-0 font-mono text-[0.55rem] text-slate-600 sm:block">
            React
          </span>
        </div>

        {/* ------------------------------------------------- app body -- */}
        <div className="relative bg-[#0d1017]">
          {/* --- app nav --- */}
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.05] px-3.5 py-2.5 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 text-[0.6rem]">
                🍽️
              </span>
              <span className="font-display text-[0.72rem] font-bold text-white">
                Food<span className="text-amber-400">Rush</span>
              </span>
            </div>

            <div className="hidden flex-1 items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 sm:flex">
              <Search size={10} className="shrink-0 text-slate-500" />
              <span className="text-[0.58rem] text-slate-600">Search dishes…</span>
            </div>

            {/* Cart with animated badge */}
            <div className="relative shrink-0">
              <motion.span
                className="flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1"
                animate={addingIdx >= 0 ? { scale: [1, 1.09, 1] } : { scale: 1 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <ShoppingBag size={11} className="text-amber-300" />
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={total}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="font-mono text-[0.58rem] font-semibold tabular-nums text-amber-200"
                  >
                    ₹{total}
                  </motion.span>
                </AnimatePresence>
              </motion.span>

              {/* Item-count bubble */}
              <AnimatePresence>
                {cart > 0 && (
                  <motion.span
                    key={cart}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center
                               rounded-full bg-amber-400 font-mono text-[0.48rem] font-bold text-ink-950"
                  >
                    {cart}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* --- hero strip --- */}
          <div className="relative overflow-hidden px-3.5 pt-3 sm:px-4">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent p-3">
              <div
                aria-hidden="true"
                className="absolute -right-4 -top-6 text-5xl opacity-25 blur-[1px]"
              >
                🥘
              </div>
              <p className="relative font-display text-[0.78rem] font-bold leading-tight text-white sm:text-[0.9rem]">
                Hungry? Food in 30 minutes.
              </p>
              <p className="relative mt-0.5 text-[0.55rem] text-slate-400">
                Free delivery on your first order
              </p>
            </div>
          </div>

          {/* --- category chips --- */}
          <div className="flex gap-1.5 overflow-hidden px-3.5 py-3 sm:px-4">
            {CATEGORIES.map((cat, i) => (
              <motion.span
                key={cat}
                animate={{
                  backgroundColor:
                    activeCat === i ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)',
                  color: activeCat === i ? '#fcd34d' : '#94a3b8',
                  borderColor:
                    activeCat === i ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.07)',
                }}
                transition={{ duration: 0.4 }}
                className="shrink-0 rounded-full border px-2.5 py-1 text-[0.55rem] font-medium"
              >
                {cat}
              </motion.span>
            ))}
          </div>

          {/* --- dish grid --- */}
          <div className="grid grid-cols-2 gap-2 px-3.5 pb-4 sm:px-4">
            {DISHES.map((dish, i) => {
              const isAdding = addingIdx === i
              return (
                <motion.div
                  key={dish.name}
                  animate={
                    isAdding
                      ? { scale: 1.02, borderColor: 'rgba(251,191,36,0.4)' }
                      : { scale: 1, borderColor: 'rgba(255,255,255,0.06)' }
                  }
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden rounded-xl border bg-white/[0.02]"
                >
                  {/* "Photo" tile */}
                  <div
                    className="relative flex h-14 items-center justify-center text-2xl sm:h-16"
                    style={{
                      background: `linear-gradient(135deg, ${dish.from}33, ${dish.to}22)`,
                    }}
                  >
                    <span>{dish.emoji}</span>

                    {/* Rating pill */}
                    <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[0.45rem] font-semibold text-white backdrop-blur-sm">
                      <Star size={6} className="fill-amber-400 text-amber-400" />
                      {dish.rating}
                    </span>

                    {/* "Added" flash overlay */}
                    <AnimatePresence>
                      {isAdding && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.3 }}
                          transition={{ duration: 0.35 }}
                          className="absolute inset-0 flex items-center justify-center bg-amber-400/20 backdrop-blur-[1px]"
                        >
                          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[0.45rem] font-bold text-ink-950">
                            Added
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Details */}
                  <div className="p-2">
                    <p className="truncate text-[0.58rem] font-semibold text-white">{dish.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[0.48rem] text-slate-500">
                      <Clock size={6} />
                      {dish.time}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-1">
                      <span className="font-mono text-[0.6rem] font-bold text-white">
                        ₹{dish.price}
                      </span>
                      <motion.span
                        animate={isAdding ? { scale: [1, 0.85, 1] } : { scale: 1 }}
                        transition={{ duration: 0.35 }}
                        className="flex h-4 w-4 items-center justify-center rounded-md bg-amber-400 text-ink-950"
                      >
                        <Plus size={9} strokeWidth={3} />
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
