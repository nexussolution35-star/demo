# Mi-Hi Solid Wood Products — Static Site (v2)

Bespoke solid-wood joinery site for Mi-Hi Solid Wood Products (White River, Mpumalanga).
Nexus Solution **Design lane** rebuild: Website A (CN9) conversion framework rendered in
**Website B's warm-wood design language**. **Website A + B only — no Reference C/D elements.**

**100% self-hosted — zero external network calls at runtime** (fonts, CSS, JS, images all local).

## Structure (79 pages)

```
index.html                     Home — full Website A section sequence
about.html · contact.html · reviews.html · gallery.html
request-a-quote.html           Bespoke Quote / Consultation
services/index.html            Services hub
services/                      7 service pages
  kitchens · built-in-cupboards · bathroom-vanities · bars
  tv-units · office-furniture · countertops
areas/index.html               Service-areas hub
areas/<area>.html              6 area landing pages
areas/<service>-<area>.html    42 service×area matrix pages (full 7×6)
blog/index.html + 6 articles + blog/categories/ (6 category pages)
privacy.html · terms.html · site-map.html

assets/
  css/site.css + fonts.css     Website B design system (warm-wood tokens)
  fonts/                       Bricolage Grotesque 800 + Open Sans 400/600/700 (woff2)
  js/site.js                   nav, FAQ accordion, gallery lightbox, placeholder forms
  img/brand/                   Mi-Hi white logo + favicons
  img/projects/ (18) img/capture/ (35)  real Mi-Hi photography
```

## Design system (from Website B)
- **Type:** Bricolage Grotesque 800 (display) + Open Sans 400/600/700 (body)
- **Colour:** ink `#211a13` · cream `#faf7f2` · espresso `#241c15` dark bands · warm-gold accent `#a8814f`
- **Geometry:** 1200px container, near-sharp 2px cards, pill buttons, 120px section rhythm
- Homepage order (Website A, kept exactly): hero+meta → trust → reviews → owner split → services → materials → gallery → process → stats → blog → areas → FAQ → CTA band → booking form

## References
- **A + B only.** No Reference C or D elements (no auto-cycling hero, no hide-on-scroll nav, no icon-hover trio).
- Website B is Mi-Hi's own brand, so its real photos/logo are reused (real-over-generic). No stock, no invented badges.

## Preview locally
```
cd mihi-site && python3 -m http.server 8000
```
Root-relative paths — serve from this folder root (or a host root, e.g. Surge).

## Handoff (SEO lane)
- Old-site 35-URL list preserved with the capture for redirect mapping.
- Canonical/OG URLs use placeholder `https://mihi.example` — real domain set in Back-End lane.
- Trading hours confirmed: Mon–Fri 8:00–16:30 · Sat 8:00–13:00.
- Forms are placeholder UI only (Back-End lane wires GHL/chat/analytics later).
