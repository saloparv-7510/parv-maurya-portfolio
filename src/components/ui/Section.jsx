import { cn } from '../../lib/motion'

/**
 * Section wrapper — provides the id anchor (for the navbar), vertical rhythm,
 * and an optional decorative index number in the gutter.
 */
export default function Section({
  id,
  children,
  className = '',
  index,
  compact = false,
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative w-full',
        compact ? 'py-16 sm:py-20' : 'py-24 sm:py-28 lg:py-36',
        className,
      )}
    >
      {/* Decorative section number — hidden on small screens and from AT */}
      {index && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-16 hidden select-none font-mono
                     text-[0.7rem] tracking-[0.4em] text-white/15 2xl:block"
          style={{ writingMode: 'vertical-rl' }}
        >
          {index}
        </span>
      )}
      <div className="shell">{children}</div>
    </section>
  )
}
