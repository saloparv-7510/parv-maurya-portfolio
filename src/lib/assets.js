/* ============================================================================
 *  assets.js — turning a path from /public into a URL that works everywhere.
 *
 *  This site ships to four places, and a bare relative path such as
 *  'Parv-Maurya-Resume.pdf' does NOT behave the same in all of them:
 *
 *    • dev server / Netlify  served from the domain root         → fine
 *    • the Capacitor APK     served from https://localhost/      → fine
 *    • GitHub Pages          served from /parv-maurya-portfolio/ → fragile.
 *        A bare relative path is resolved against the *current page URL*, so it
 *        only works while the address bar ends in a slash. Open the site as
 *        ".../parv-maurya-portfolio" (no trailing slash) and the browser looks
 *        for the file at the domain root instead — a 404.
 *
 *  assetUrl() removes the ambiguity by anchoring every path to Vite's BASE_URL
 *  (the Pages workflow sets it to '/parv-maurya-portfolio/'), producing an
 *  absolute path instead of one that depends on the current page.
 *
 *  CUSTOMISING: nothing here needs editing when you swap files — change the
 *  filenames in src/data/content.js and drop the files in /public.
 * ========================================================================== */

/** True inside the packaged Android/iOS app rather than a normal browser. */
export function isNativeApp() {
  if (typeof window === 'undefined') return false
  return Boolean(window.Capacitor?.isNativePlatform?.())
}

/**
 * Resolve a file from /public against this deployment's base path.
 * Full URLs and data: URIs are passed through untouched.
 * @example assetUrl('images/profile.jpg') // '/parv-maurya-portfolio/images/profile.jpg' on Pages
 */
export function assetUrl(path) {
  if (!path) return path
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//')) return path
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

/**
 * Work out where the "Resume" button should point, and how it should open.
 *
 * Why the résumé needs its own helper: **Android's WebView has no built-in PDF
 * viewer.** Inside the APK, navigating to the bundled PDF renders a blank white
 * screen, and a `target="_blank"` anchor typically does nothing at all — the
 * WebView has no concept of a second window to open it in. That is why tapping
 * "Resume" in the app appeared to be dead.
 *
 * The fix is to let the *device* open the file. Capacitor forwards any
 * navigation that leaves the app's own origin (https://localhost) to the system
 * browser, which does render PDFs. So in the app we point at the published copy
 * — `profile.resumeUrl` — and navigate in place rather than in a new window.
 *
 * On the web nothing changes behaviourally: the bundled file opens in a new tab.
 *
 * @param {{ resume?: string, resumeUrl?: string }} profile from content.js
 * @returns {{ href: string, target?: string, rel?: string }} anchor props
 */
export function resumeLink(profile) {
  const bundled = assetUrl(profile.resume)

  // In the APK, prefer the published URL so the OS can open it. If no
  // resumeUrl is set we still return the bundled path — the button then behaves
  // as it did before (i.e. not usefully), which is the signal to fill it in.
  if (isNativeApp() && profile.resumeUrl) {
    return { href: profile.resumeUrl }
  }

  return { href: bundled, target: '_blank', rel: 'noreferrer noopener' }
}
