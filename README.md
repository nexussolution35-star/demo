# 2luv — Static 1:1 Clone

A self-contained, static 1:1 clone of the rendered pages from
[`www.2-luv.com`](https://www.2-luv.com) (the "2luv" digital love-letter site),
rebuilt from a set of captured HTML snapshots.

All markup, CSS, fonts, images, videos and icons are mirrored locally and every
reference in the HTML was rewritten from the original absolute origin
(`https://www.2-luv.com/…`, `https://media.2-luv.com/…`) to a local path, so the
site renders identically with **no calls back to the original origin** for
visual assets.

## Pages

| Route | File | Source |
|-------|------|--------|
| `/` | `index.html` | redirect → `/en/` |
| `/en` | `en/index.html` | landing page |
| `/en/cookies` | `en/cookies/index.html` | cookie policy |
| `/en/privacy` | `en/privacy/index.html` | privacy policy |
| `/en/letter/dd602b2fb0` | `en/letter/dd602b2fb0/index.html` | a shared letter ("MJ"), shown behind the payment gate |

The original route manifest is preserved at `_reference/routes.json`, and the
reference screenshots the clone was verified against are in
`_reference/screenshots/`.

## Directory layout

```
index.html                 root redirect to /en/
en/…/index.html            the four captured pages, at their real routes
_astro/                    Astro-generated CSS/JS (landing + legal pages)
_app/                      SvelteKit assets for the letter viewer (CSS only; see note)
fonts/  icons/  images/     mirrored static assets
videos/                    hero + "how it works" clips and posters
media/                     blog images + letter photo (see note)
metrics/                   mirror of the Google tag script
manifest.json favicon.ico llms.txt   site metadata
.nojekyll                  tells GitHub Pages to serve the _astro / _app dirs
```

## Running locally

Serve the repository root with any static file server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/en/
```

Because the pages live at their real routes (`en/index.html`,
`en/letter/dd602b2fb0/index.html`, …), the same tree works unchanged on GitHub
Pages, Netlify, Vercel, S3, nginx, etc.

## Notes on fidelity

These are captures of server-rendered pages, so the clone is a faithful
reproduction of what the pages looked like when captured. Two things could not
be mirrored and are called out for honesty:

- **The letter's personal photo** (`media/gift-images/temp/…jpg`) was served from
  an Azure Blob URL signed with a SAS token that expired on 2026-07-11, so the
  original returns HTTP 403 and is unrecoverable. A neutral placeholder image is
  in its place. On the letter page this photo sits behind the blurred payment
  gate, so the visible layout is unaffected.
- **The letter viewer's JavaScript bundle** (`_app/immutable/chunks|nodes/*.js`)
  had already been redeployed on the live site under new content hashes and now
  returns 404, so the interactive hydration scripts for that page could not be
  fetched. The captured HTML is the fully server-rendered snapshot, so the page
  still displays correctly; it simply isn't re-hydrated into the live SPA.

Runtime-only, non-visual endpoints (the `api.2-luv.com` backend, Google/Azure
analytics) are left pointing at their original hosts and have no effect on
rendering.
