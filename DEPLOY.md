# Deploying — getting a shareable link

Your site is a plain static build in **`dist/`**. Any static host works, and none of
this requires a server or a paid plan. Pick one option below. I can't create the link for
you (it needs a login on your account), but each path here takes about a minute.

Whenever you change the site, run `npm run build` again to refresh `dist/` before redeploying.

---

## Option 1 — Netlify Drop (fastest, no account, no command line) ⭐

1. Go to **<https://app.netlify.com/drop>**
2. Drag the **`dist`** folder onto the page
   (or drag the ready-made **`portfolio-site.zip`** in this project — same result)
3. Wait a few seconds. You get a public URL like `https://calm-otter-1234.netlify.app`
4. That link works on any phone, anywhere. Share it directly.

To make the URL nicer or keep it permanent, create a free Netlify account when prompted and
open **Site settings → Change site name** (e.g. `parv-maurya.netlify.app`). Without an account
the link still works but Netlify may retire it after a while — signing in (free) keeps it.

---

## Option 2 — Vercel

**Dashboard (no CLI):** sign in at <https://vercel.com> → *Add New → Project* → drag the
project folder or import it from GitHub. Framework preset: **Vite**. Build command
`npm run build`, output directory `dist`. Deploy → you get a `*.vercel.app` link.

**CLI:**

```bash
npm i -g vercel
vercel
```

Answer the prompts (accept the defaults; it detects Vite). The link is printed at the end.

---

## Option 3 — GitHub Pages

Pages serves from a sub-path (`username.github.io/repo-name/`), so the build needs to know
that path. **Only for GitHub Pages** — do not set this for Netlify/Vercel.

1. In `vite.config.js`, add your repo name as `base`:

   ```js
   export default defineConfig({
     base: '/your-repo-name/',   // <-- add this line
     plugins: [react()],
     // …rest unchanged
   })
   ```

2. `npm run build`
3. Push `dist/` to a `gh-pages` branch (or use the [`gh-pages`](https://www.npmjs.com/package/gh-pages)
   package: `npm i -D gh-pages`, then add `"deploy": "gh-pages -d dist"` to `scripts` and run
   `npm run deploy`).
4. In the repo on GitHub: **Settings → Pages → Source: `gh-pages` branch**. The link appears there.

---

## Which should I use?

- **Just need a link to send, today** → Option 1 (Netlify Drop). Nothing to install.
- **Want it tied to your GitHub and auto-updating on every push** → Option 2 (Vercel) with the
  GitHub import, or Option 3.

The APK (`Parv-Maurya-Portfolio.apk`) and a hosted link do the same job two ways: the APK
installs as an app icon; the link opens in any browser with nothing to install. Sharing the
link is usually the easier one for recruiters.
