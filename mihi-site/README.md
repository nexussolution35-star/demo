# Mi-Hi Solid Wood Products — Static Site

Bespoke solid-wood joinery site for Mi-Hi Solid Wood Products (White River, Mpumalanga).
Built in the Nexus Solution **Design lane**: Website A (CN9) conversion framework, rendered in
Website B's premium visual language, with Mi-Hi's own brand assets and accent colour.

**100% self-hosted — zero external network calls at runtime** (fonts, CSS, JS, images all local).

## Structure (43 pages)

```
index.html                     Home — full Website A section sequence
about.html                     Owner-led story / trust
services.html                  Services hub
services/                      7 individual service pages
  designer-kitchens · built-in-cupboards · bathroom-vanities
  bars · tv-units · office-furniture · granite-quartz-tops
service-areas.html             Areas hub
service-areas/                 6 area pages
  white-river · mbombela-nelspruit · hazyview · sabie · barberton · malelane
<service>-<area>.html          18 service×area long-tail pages (3 primary services × 6 areas)
gallery.html                   Filterable portfolio + lightbox
request-a-quote.html           Bespoke Quote / Consultation (repurposed from A's Financing)
contact.html                   Contact + showroom details
blog.html                      Blog index
blog/                          4 long-form articles

assets/
  css/styles.css               Design system (Website B skin, Mi-Hi taupe accent)
  css/fonts.css                @font-face → local woff2
  fonts/                       Bricolage Grotesque + Open Sans (self-hosted woff2)
  js/main.js                   All interactions (no framework, no analytics)
  images/                      35 real Mi-Hi photos + logo (self-hosted)
```

## Design system
- **Type:** Bricolage Grotesque (display) + Open Sans (body)
- **Colour:** near-black `#111` + white + Mi-Hi wood-taupe accent `#978673` (brand's own; NOT Website B's lime)
- **Structure:** Website A homepage order kept exactly (hero → reviews → about → services → why → gallery → process → offer → blog → FAQ → service-area → CTA)

## Requested reference features (C/D)
- **C1** synced auto-cycling hero (image + headline + CTA change together)
- **C2** "How We Work → Get In Touch" path (process → contact)
- **D1** hide-on-scroll / reveal-on-scroll navigation
- **D2** three interactive icon features with hover microinteraction

## Interactivity (vanilla JS)
Hero auto-cycle, hide-on-scroll nav, services dropdown, mobile slide-in menu, gallery
filter + lightbox, FAQ accordion, scroll reveal (progressive enhancement — content visible
without JS), smooth-scroll anchors. **Forms are placeholder UI only** — the Back-End lane
wires GHL/CRM, chat widget, domain and analytics later in Lovable.

## Preview locally
```
cd mihi-site && python3 -m http.server 8000
```
Paths are root-relative, so serve from this folder root (or deploy to a host root, e.g. Surge).

## Handoff notes (for SEO lane)
- Old-site URL list (35 URLs from mihi.co.za) preserved with the capture for redirect mapping.
- Canonical/OG URLs use placeholder `https://mihi.example` — set real domain in the Back-End lane.
- **Trading hours confirmed by client:** Mon–Fri 8:00–16:30 · Sat 8:00–13:00.
