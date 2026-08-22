# public/images

Anything in `public/` is served from the site root, so a file saved here as
`profile.jpg` is referenced in code as **`/images/profile.jpg`** (no `public`, no `./`).

Nothing in this folder is required — the site is complete without it. Add files only when
you want to replace a generated visual with a real one.

## Profile photo

| | |
| --- | --- |
| Save as | `profile.jpg` (or `.png` / `.webp`) |
| Size | square, ~600×600 px |
| Then set | `photo: '/images/profile.jpg'` in `src/data/content.js` → `profile` |

Leave `photo: null` and an animated monogram avatar is used instead.

## Project screenshots

| | |
| --- | --- |
| Save as | `whatsapp-clone.png`, `food-delivery.png` |
| Size | landscape, ~1200×750 px (roughly 16:10) |
| Then set | `image: '/images/whatsapp-clone.png'` on that project in `src/data/content.js` |

Leave `image: null` and the project keeps its **animated mockup** — a live Android phone for
the chat app, a live browser window for the food-delivery site. Those are rendered
components rather than pictures, so they stay crisp at any screen size and animate on their
own. A flat screenshot is often the *less* impressive option here, so compare both before
you switch.

## Tips

- Compress before committing — [Squoosh](https://squoosh.app) will usually cut a PNG by
  70% with no visible loss. `.webp` is smaller again and supported everywhere.
- Keep filenames lowercase with hyphens; some static hosts are case-sensitive even when
  Windows isn't.
- For a phone screenshot, crop out the status bar and rounded corners — the mockup frame
  already provides those.
