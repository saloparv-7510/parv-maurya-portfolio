import { motion } from 'framer-motion'

/* ============================================================================
 *  Brand icons as inline SVG.
 *
 *  Written by hand rather than pulled from an icon set: brand glyphs get
 *  deprecated and renamed between icon-library releases, and inlining them
 *  means zero extra bytes and no upgrade surprises.
 * ========================================================================== */
const PATHS = {
  github:
    'M12 2C6.475 2 2 6.475 2 12a10 10 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.337 1.087 2.912.825.088-.65.35-1.225.688-1.538-2.55-.287-4.15-1.35-4.15-3.887 0-.913.325-1.688.862-2.288-.062-.175-.312-.9.088-1.875 0 0 .662-.212 2.175.825a7.4 7.4 0 0 1 1.987-.275c.675 0 1.35.088 1.988.275 1.512-1.05 2.175-.825 2.175-.825.4.975.15 1.7.088 1.875.537.6.862 1.362.862 2.288 0 2.55-1.612 3.6-4.162 3.887.4.375.687 1.087.687 2.188 0 1.35-.013 2.437-.013 2.775 0 .263.188.575.688.475A10 10 0 0 0 22 12c0-5.525-4.475-10-10-10Z',
  linkedin:
    'M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.2 8.75h3.44V21H3.2V8.75Zm5.6 0h3.3v1.67h.05a3.62 3.62 0 0 1 3.26-1.79c3.48 0 4.12 2.29 4.12 5.27V21h-3.44v-5.98c0-1.43-.03-3.26-1.99-3.26-1.99 0-2.29 1.55-2.29 3.15V21H8.8V8.75Z',
  twitter:
    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z',
  instagram:
    'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.96.24 2.65.5.72.28 1.32.66 1.92 1.26.6.6.98 1.2 1.26 1.92.27.69.45 1.48.5 2.65.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.23 1.96-.5 2.65-.28.72-.66 1.32-1.26 1.92-.6.6-1.2.98-1.92 1.26-.69.27-1.48.45-2.65.5-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.96-.23-2.65-.5-.72-.28-1.32-.66-1.92-1.26-.6-.6-.98-1.2-1.26-1.92-.27-.69-.45-1.48-.5-2.65C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.23-1.96.5-2.65.28-.72.66-1.32 1.26-1.92.6-.6 1.2-.98 1.92-1.26.69-.27 1.48-.45 2.65-.5C8.42 2.17 8.8 2.16 12 2.16Zm0 1.98c-3.15 0-3.5.01-4.73.07-.94.04-1.45.2-1.79.33-.45.18-.77.39-1.11.73-.34.34-.55.66-.73 1.11-.13.34-.29.85-.33 1.79-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.04.94.2 1.45.33 1.79.18.45.39.77.73 1.11.34.34.66.55 1.11.73.34.13.85.29 1.79.33 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.94-.04 1.45-.2 1.79-.33.45-.18.77-.39 1.11-.73.34-.34.55-.66.73-1.11.13-.34.29-.85.33-1.79.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.94-.2-1.45-.33-1.79a2.98 2.98 0 0 0-.73-1.11 2.98 2.98 0 0 0-1.11-.73c-.34-.13-.85-.29-1.79-.33-1.23-.06-1.58-.07-4.73-.07Zm0 3.37a4.49 4.49 0 1 1 0 8.98 4.49 4.49 0 0 1 0-8.98Zm0 7.4a2.91 2.91 0 1 0 0-5.82 2.91 2.91 0 0 0 0 5.82Zm5.72-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z',
}

/**
 * A single social link button.
 * Renders nothing meaningful-looking if the URL is still the '#' placeholder —
 * it stays clickable-but-inert and shows a tooltip reminding you to add it.
 */
export default function SocialIcon({ social, size = 'md' }) {
  const path = PATHS[social.id]
  const isPlaceholder = !social.url || social.url === '#'

  const dims = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10'
  const icon = size === 'sm' ? 15 : 17

  return (
    <motion.a
      href={social.url || '#'}
      target={isPlaceholder ? undefined : '_blank'}
      rel="noreferrer noopener"
      aria-label={social.label}
      // Placeholder links tell you what to do instead of silently doing nothing
      title={isPlaceholder ? `Add your ${social.label} URL in src/data/content.js` : social.label}
      data-cursor="hover"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`group relative flex ${dims} items-center justify-center rounded-full border
                  border-white/10 bg-white/[0.03] text-slate-400 transition-colors duration-300
                  hover:border-accent-400/40 hover:bg-accent-400/10 hover:text-accent-200`}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="relative z-10"
      >
        <path d={path} />
      </svg>

      {/* Soft glow on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-accent-400/20 opacity-0 blur-md
                   transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.a>
  )
}
