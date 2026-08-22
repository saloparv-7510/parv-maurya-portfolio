# Parv Maurya — Developer Portfolio

A premium, animation-first personal portfolio built with **React + Vite**, **Tailwind CSS**,
**Framer Motion** and **GSAP ScrollTrigger**.

Everything the site says about you lives in **one file**: [`src/data/content.js`](src/data/content.js).
You should never need to touch a component to update your details.

---

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:5173>.

| Command           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                          |
| `npm run build`   | Production build into `dist/`                       |
| `npm run preview` | Serves the built `dist/` locally, to check it first |

**Node 18 or newer** is required.

---

## Customisation checklist

Open `src/data/content.js` and work down this list. Each item is marked with a ⭐ comment
in the file so you can find it quickly.

### 1. Profile photo

Drop your photo into `public/images/`, then:

```js
// src/data/content.js → profile
photo: '/images/profile.jpg',
```

Leave it as `null` and an animated monogram avatar (`PM`) is shown instead — the site looks
finished either way. Square images around 600×600 work best.

### 2. Social links

Replace each placeholder `'#'` with your real URL. Set `enabled: false` to hide one
without deleting it:

```js
export const socials = [
  { id: 'github',   label: 'GitHub',   handle: '@yourname', url: 'https://github.com/yourname',      enabled: true },
  { id: 'linkedin', label: 'LinkedIn', handle: 'in/you',    url: 'https://linkedin.com/in/yourname', enabled: true },
  { id: 'twitter',  label: 'X / Twitter', handle: '@you',   url: '#',                                 enabled: false },
]
```

While every URL is still `'#'`, the contact section shows a small reminder pointing back
at this file. It disappears on its own once you add a real link.

### 3. Project links

```js
// src/data/content.js → projects[n]
links: { github: 'https://github.com/you/repo', demo: 'https://your-demo.app' },
```

Set either to `null` to hide that button. In the case-study modal, an unfilled link renders
as a dashed placeholder that names the field to edit — useful while you're still setting up,
and worth filling in before an interview.

### 4. Project screenshots

Each project currently renders a **live animated mockup** (an Android phone running the chat
app, a browser running the food-delivery UI). These are real components, not images, so they
look sharp at any size — you can happily ship as-is.

To use a real screenshot instead:

```js
// src/data/content.js → projects[n]
image: '/images/whatsapp-clone.png',
```

That replaces the mockup in both the card and the modal. See
[`public/images/README.md`](public/images/README.md) for sizing notes.

### 5. Resume PDF

Put the PDF in `public/` and point at it:

```js
// src/data/content.js → profile
resume: '/Parv-Maurya-Resume.pdf',
```

A "Resume" button then appears in the navbar (and in the mobile menu). While `resume` is
`null` there's no button and no empty gap — nothing to clean up if you'd rather leave it out.

### 6. Everything else

`content.js` is organised in the same order as the page, and every section maps 1:1 to a
component in `src/components/`:

| Edit this export    | Changes this section                                     |
| ------------------- | -------------------------------------------------------- |
| `profile`           | Hero name, roles, tagline, location, email, availability |
| `navLinks`          | Navbar + footer navigation                               |
| `about`             | About copy, stat tiles, the three "how I work" cards     |
| `education`         | Education timeline                                       |
| `skillGroups`       | Technical skill cards (`level` drives the meter only)    |
| `networkingSkills`  | The interactive network topology graph                   |
| `certifications`    | Certifications, trainings and internships                |
| `projects`          | Project cards + case-study modals                        |
| `journey`           | The scroll-drawn learning-journey path                   |
| `interests`         | Interests grid                                           |
| `contact`, `footer` | Contact copy and footer lines                            |

Adding or removing array entries is safe — every section maps over its data, and the layouts
reflow. The navbar's active-link highlighting follows whatever order the sections end up in.

---

## How the contact form sends

There's no backend, so on submit the form composes a pre-filled email and hands it to the
visitor's mail client via `mailto:`. That works everywhere with zero setup and nothing
silently disappears.

To send server-side instead, replace the marked block in
[`src/components/Contact.jsx`](src/components/Contact.jsx) (`handleSubmit`) with a POST to a
form service — [Formspree](https://formspree.io) or [EmailJS](https://emailjs.com) are both
free and need no backend of your own. The validation, loading and success states already
handle a promise, so only the `await` line changes.

---

## Deploying

The build output is a plain static site in `dist/` — any static host works.

**Vercel / Netlify:** connect the repo; build command `npm run build`, output directory `dist`.

**GitHub Pages:** add your repo name as the base path in `vite.config.js`, then deploy `dist/`:

```js
export default defineConfig({ base: '/your-repo-name/', /* …rest unchanged */ })
```

---

## Project structure

```
src/
├─ App.jsx                 Composition root — section order lives here
├─ data/content.js         ⭐ All content. The only file you normally edit
├─ styles/index.css        Tailwind layers, design tokens, utilities
├─ lib/motion.js           Shared easing, viewport config, animation variants
├─ hooks/                  useMediaQuery, useSpotlight, useLockBodyScroll, …
└─ components/
   ├─ Preloader.jsx        Counter + curtain reveal on first load
   ├─ BackgroundFX.jsx     Particle network canvas, aurora, grid
   ├─ CustomCursor.jsx     Cursor ring (pointer devices only)
   ├─ Navbar.jsx           Sticky nav with scroll-spy
   ├─ Hero.jsx  About.jsx  Skills.jsx  NetworkingSkills.jsx
   ├─ Education.jsx  Certifications.jsx  Projects.jsx  ProjectModal.jsx
   ├─ Journey.jsx  Interests.jsx  Contact.jsx  Footer.jsx
   ├─ mockups/             PhoneMockup + BrowserMockup (the animated previews)
   └─ ui/                  Section, SectionHeading, CountUp, Typewriter, …
```

---

## Performance and accessibility notes

These are deliberate, and worth knowing if you're asked about them in an interview:

- **`prefers-reduced-motion` is respected everywhere.** Every animation either shortens or
  resolves straight to its final state — counters land on their number, the preloader skips,
  parallax and the custom cursor switch off.
- **The particle canvas pauses when off-screen or backgrounded** (`IntersectionObserver` +
  `visibilitychange`), so it costs nothing while you read the rest of the page. Node count
  scales with viewport area and device pixel ratio is capped at 2.
- **GSAP is used in exactly one place** (`Journey.jsx`), because `ScrollTrigger`'s `scrub`
  gives two-way, frame-accurate scroll linkage that Framer Motion's one-shot `whileInView`
  can't. Everywhere else Framer Motion is the lighter choice.
- **Code-split by vendor** (`react` / `motion` / `gsap` chunks) so the initial payload stays
  small.
- **Keyboard and screen-reader paths are real:** skip link, focus-visible rings, the
  case-study modal is a labelled `role="dialog"` that traps focus and closes on Escape, and
  form errors are wired up with `aria-invalid` / `aria-describedby`.
- **Fonts are bundled locally** via `@fontsource-variable`, so there's no render-blocking
  request to Google Fonts and the site works offline.
