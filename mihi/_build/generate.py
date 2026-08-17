#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mi-Hi Solid Wood Products — one-shot site generator.
Website A (Renov Kitchen) conversion framework, rendered in Website B (Dream Kitchens)
design language, recoloured to Mi-Hi's warm-wood brand.
Emits the full page inventory: core pages, services hub + 7 service pages,
7x6 service x area matrix, blog hub + posts + categories, legal + sitemap.
"""
import os, html, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # mihi/

# ---------------------------------------------------------------- business facts
BIZ = "Mi-Hi Solid Wood Products"
TAG = "Bespoke Solid-Wood Joinery"
PHONE = "013 757 0940"
PHONE_TEL = "+27137570940"
MOBILE = "072 656 1328"
MOBILE_TEL = "+27726561328"
EMAIL_SHOW = "showroom@mihi.co.za"
EMAIL_DES = "designs@mihi.co.za"
ADDRESS = "140A Solomon St, Rocky Drift, White River, 1240"
HOURS = [("Monday – Friday", "8:00 – 16:30"), ("Saturday", "8:00 – 13:00"), ("Sunday", "Closed")]
YEARS = "40"

# ---------------------------------------------------------------- services
# slug, name, short, hero blurb, list of feature bullets, image
SERVICES = [
    ("kitchens", "Designer Kitchens",
     "Hand-built solid-wood kitchens designed around the way you live and cook.",
     "The centrepiece of the home, built to last a lifetime. We design, manufacture and install bespoke solid-wood and semi-solid kitchens finished in your choice of natural timber, Duco paint or high-gloss Melawood.",
     ["Full design consultation and 3D concept", "Solid wood, semi-solid, Melawood or Duco finishes",
      "Custom islands, curved joinery and glass-front cabinetry", "Integrated appliance and lighting planning",
      "Granite & quartz countertops fitted to match"], "project-01.jpg"),
    ("built-in-cupboards", "Built-In Cupboards",
     "Bedroom and storage cupboards made to measure, wall to wall and floor to ceiling.",
     "Every home is different, so every cupboard we build is too. From sliding-door wardrobes with mirror inlays to walk-in dressing rooms, we make storage that fits your space exactly.",
     ["Hinged, sliding and lattice door options", "Mirror, glass and solid-timber door panels",
      "Fully fitted interiors — shelving, rails, drawers", "Safe and jewellery-drawer integration",
      "Matched finishes across the whole home"], "project-04.jpg"),
    ("bars", "Bars & Entertainment Units",
     "Statement bars and entertainment areas built for hosting.",
     "A well-made bar turns a room into the heart of the party. We build freestanding and built-in bars with wine storage, brass and steel detailing, feature lighting and hard-wearing tops.",
     ["Built-in and freestanding bar designs", "Integrated wine racks and bar fridges",
      "Feature back-panels and shelving", "Granite, quartz or solid-timber counters",
      "Matching stools and cabinetry on request"], "project-06.jpg"),
    ("tv-units", "TV & Wall Units",
     "Media walls and TV units that hide the clutter and show off the craftsmanship.",
     "Combine solid wood and MDF for the best of both worlds — warm timber grain where it shows, clean painted panels where it counts. Cable management and floating shelving as standard.",
     ["Floating and full-wall media units", "Solid-wood and MDF combination builds",
      "Concealed cable management", "Display and closed storage mix",
      "Lighting and feature-niche options"], "project-08.jpg"),
    ("bathroom-vanities", "Bathroom Vanities",
     "Moisture-smart vanities with the warmth of real wood.",
     "Bathroom joinery has to look beautiful and survive daily humidity. We build sealed, moisture-resistant vanities in solid wood and Duco, topped with granite or quartz and fitted around your basin of choice.",
     ["Freestanding and wall-hung vanities", "Sealed, moisture-resistant construction",
      "Granite & quartz tops with under- or over-counter basins", "Matching mirror cabinets and storage",
      "Finishes coordinated with your tiling"], "project-11.jpg"),
    ("office-furniture", "Office & Study Furniture",
     "Home offices and studies built for focus and finished to impress.",
     "Purpose-built desks, wall-to-wall bookshelves and credenzas in solid wood — furniture that makes working from home feel like an upgrade, not a compromise.",
     ["Custom desks and workstations", "Full-wall bookcases and shelving",
      "Cable-managed, appliance-ready builds", "Filing and storage integration",
      "Boardroom and reception joinery for business"], "project-13.jpg"),
    ("countertops", "Granite & Quartz Countertops",
     "Premium stone tops, templated and fitted to millimetre precision.",
     "The finishing touch on any kitchen, bar or vanity. We supply and install granite and quartz countertops, cut and polished to your design and fitted seamlessly onto our cabinetry.",
     ["Granite and engineered-quartz options", "Precision templating and installation",
      "Undermount sink and hob cut-outs", "Waterfall ends and mitred edges",
      "Sealed and finished ready to use"], "project-03.jpg"),
]

# ---------------------------------------------------------------- areas
# slug, name, blurb fragment
AREAS = [
    ("white-river", "White River", "our home town, where our Rocky Drift workshop and showroom are based"),
    ("mbombela-nelspruit", "Mbombela (Nelspruit)", "the Lowveld's capital, a short drive from our White River workshop"),
    ("hazyview", "Hazyview", "the gateway to the Panorama Route and Kruger's southern gate"),
    ("sabie", "Sabie", "the forestry town at the heart of the Mpumalanga escarpment"),
    ("barberton", "Barberton", "the historic goldfields town in the De Kaap valley"),
    ("malelane", "Malelane", "the lowveld sugar-and-citrus town near the Kruger National Park"),
]

REVIEWS = [  # PLACEHOLDER copy — Stage 3 swaps in real Google/Facebook reviews
    ("Our kitchen is the talk of every dinner party. The solid-wood finish is flawless and the fit is perfect — you can see the craftsmanship in every joint.", "R. van der Merwe", "Kitchen · White River"),
    ("Mi-Hi built our bar and entertainment unit exactly as we imagined it. Professional from the first drawing to the final install.", "T. Nkosi", "Bar · Mbombela"),
    ("After nearly 40 years they still care about every detail. Our built-in cupboards fit wall to wall without a single gap.", "L. Botha", "Cupboards · Hazyview"),
]

# ---------------------------------------------------------------- blog
POSTS = [
    ("melawood-kitchens-cost-effective", "Melawood Kitchens: The Cost-Effective Choice",
     "Kitchens", "project-09.jpg",
     "Melawood offers the look of a premium kitchen at a friendlier price point. Here is where it makes sense, and where solid wood still wins."),
    ("maximizing-small-kitchen-spaces", "Maximizing Small Kitchen Spaces with Custom Designs",
     "Kitchens", "project-15.jpg",
     "Small footprint, big ideas. Custom joinery is how you claw back every usable centimetre in a compact South African kitchen."),
    ("modern-built-in-cupboard-added-safety", "A Modern Built-In Cupboard Design with Added Safety",
     "Built-In Cupboards", "project-04.jpg",
     "How a hidden safe drawer and considered internal layout turn a wardrobe into secure, everyday storage."),
    ("types-of-countertops-and-care", "Types of Countertops and How to Care for Them",
     "Countertops", "project-03.jpg",
     "Granite or quartz? We compare the two most popular countertop materials and how to keep them looking new."),
    ("braai-area-to-be-proud-of", "A Braai Area That Anyone Can Be Proud Of",
     "Bars", "project-06.jpg",
     "Built-in bars and braai joinery that stand up to Lowveld weekends and years of entertaining."),
    ("exquisite-bathroom-vanities", "Exquisite Craftsmanship in Every Bathroom Vanity",
     "Bathroom Vanities", "project-11.jpg",
     "Why a made-to-measure vanity outlasts and outclasses anything off the shelf."),
]
CATEGORIES = ["Kitchens", "Built-In Cupboards", "Bars", "TV Units", "Bathroom Vanities", "Countertops"]

GALLERY = [f"project-{i:02d}.jpg" for i in range(1, 19)]

# ================================================================ helpers
def esc(s): return html.escape(s, quote=True)

NAV = [  # (label, path-from-root)
    ("Home", "index.html"), ("About", "about.html"), ("Services", "services/index.html"),
    ("Gallery", "gallery.html"), ("Reviews", "reviews.html"), ("Blog", "blog/index.html"),
    ("Contact", "contact.html"),
]

def head(title, desc, root):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="stylesheet" href="{root}assets/css/fonts.css">
<link rel="stylesheet" href="{root}assets/css/site.css">
</head>
<body>"""

def header(root, active=""):
    def _link(l, p):
        cls = ' style="color:var(--accent)"' if l == active else ''
        return f'<li><a href="{root}{p}"{cls}>{l}</a></li>'
    links = "".join(_link(l, p) for l, p in NAV)
    links += f'<li class="m-cta"><a class="btn btn-primary" href="{root}contact.html" style="display:inline-flex">Free Design Estimate</a></li>'
    return f"""
<header class="site-header">
  <div class="container nav">
    <a class="brand" href="{root}index.html" aria-label="{esc(BIZ)} home">
      <img src="{root}assets/img/brand/mihi-logo-white.png" alt="{esc(BIZ)} logo">
    </a>
    <nav aria-label="Primary">
      <ul class="nav-links" id="navLinks">{links}</ul>
    </nav>
    <div class="nav-cta">
      <a class="nav-phone" href="tel:{PHONE_TEL}">{PHONE}</a>
      <a class="btn btn-primary" href="{root}contact.html">Free Design Estimate</a>
      <button class="nav-toggle" aria-label="Menu" onclick="document.getElementById('navLinks').classList.toggle('open')">&#9776;</button>
    </div>
  </div>
</header>"""

def footer(root):
    svc_links = "".join(f'<li><a href="{root}services/{s}.html">{n}</a></li>' for s, n, *_ in SERVICES)
    area_links = "".join(f'<li><a href="{root}areas/kitchens-{a}.html">{n}</a></li>' for a, n, _ in AREAS)
    return f"""
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <img src="{root}assets/img/brand/mihi-logo-white.png" alt="{esc(BIZ)}">
        <p>Bespoke solid-wood kitchens, cupboards and cabinetry, hand-built in White River and installed across the Mpumalanga Lowveld for {YEARS} years.</p>
        <p><a href="tel:{PHONE_TEL}">{PHONE}</a> &nbsp;·&nbsp; <a href="tel:{MOBILE_TEL}">{MOBILE}</a><br>
        <a href="mailto:{EMAIL_DES}">{EMAIL_DES}</a></p>
      </div>
      <div><h4>Services</h4><ul>{svc_links}</ul></div>
      <div><h4>Service Areas</h4><ul>{area_links}</ul></div>
      <div>
        <h4>Visit the Showroom</h4>
        <ul>
          <li>{ADDRESS}</li>
          <li>Mon–Fri 8:00–16:30</li>
          <li>Sat 8:00–13:00</li>
          <li><a href="{root}contact.html">Book a consultation →</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 {esc(BIZ)}. All rights reserved.</span>
      <span><a href="{root}privacy.html">Privacy</a> · <a href="{root}terms.html">Terms</a> · <a href="{root}site-map.html">Sitemap</a></span>
    </div>
  </div>
</footer>
<script src="{root}assets/js/site.js"></script>
</body></html>"""

def img(root, name): return f"{root}assets/img/projects/{name}"

def reviews_block(root):
    cards = ""
    for txt, who, role in REVIEWS:
        initial = who[0]
        cards += f"""
      <div class="review-card">
        <div class="stars">★★★★★</div>
        <p>“{esc(txt)}”</p>
        <div class="who"><i>{initial}</i><span><b>{esc(who)}</b><small>{esc(role)}</small></span></div>
      </div>"""
    return cards

def page_hero(root, eyebrow, title, lead, crumbs=None):
    cr = ""
    if crumbs:
        parts = " / ".join(f'<a href="{root}{p}">{l}</a>' if p else l for l, p in crumbs)
        cr = f'<div class="crumbs">{parts}</div>'
    return f"""
<section class="page-hero">
  <div class="container">
    {cr}
    <span class="eyebrow">{esc(eyebrow)}</span>
    <h1>{esc(title)}</h1>
    <p class="lead">{esc(lead)}</p>
  </div>
</section>"""

def cta_band(root, img_name="project-05.jpg"):
    return f"""
<section class="cta-band section">
  <div class="cta-band__bg"><img src="{img(root,img_name)}" alt=""></div>
  <div class="container">
    <span class="eyebrow" style="color:var(--accent)">Let's build yours</span>
    <h2>Ready to design something you'll be proud of for decades?</h2>
    <p class="lead">Book a free design consultation at our White River showroom, or send us your plans and we'll come back with ideas.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <a class="btn btn-primary" href="{root}contact.html">Get a Free Design Estimate</a>
      <a class="btn btn-outline-light" href="tel:{PHONE_TEL}">Call {PHONE}</a>
    </div>
  </div>
</section>"""

def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

PAGES = []  # (path, title) for sitemap

# ================================================================ HOME
def build_home():
    root = ""
    svc_cards = ""
    for s, n, short, *_rest in SERVICES:
        image = _rest[2]
        svc_cards += f"""
      <a class="svc-card" href="services/{s}.html">
        <div class="thumb"><img src="{img(root,image)}" alt="{esc(n)} by {esc(BIZ)}"></div>
        <div class="body"><h3>{esc(n)}</h3><p>{esc(short)}</p><span class="more">Explore {esc(n)} →</span></div>
      </a>"""
    steps = [
        ("01", "Consult", "We meet at your home or our showroom, measure up and understand how you live."),
        ("02", "Design", "You receive a considered design and a clear, itemised quote — no surprises."),
        ("03", "Craft", "Your joinery is hand-built in our White River workshop by makers, not machines."),
        ("04", "Install", "Our own team fits everything on site, cleanly and precisely, and finishes to perfection."),
    ]
    steps_html = "".join(f'<div class="step"><div class="num">{n}</div><h3>{t}</h3><p>{d}</p></div>' for n, t, d in steps)
    mats = [("Solid Wood", "Full hardwood construction for heirloom pieces that last generations."),
            ("Semi-Solid", "A balanced blend of solid timber and engineered cores for value and stability."),
            ("Melawood", "Durable, low-maintenance melamine surfaces in a huge range of finishes."),
            ("Duco Paint", "Smooth, hand-sprayed painted finishes in any colour, matt or high-gloss.")]
    mats_html = "".join(f'<div class="mat"><b>{t}</b><p>{d}</p></div>' for t, d in mats)
    def _gtile(i, g):
        cls = ' class="wide"' if i in (0, 7) else ''
        return f'<a href="gallery.html"{cls}><img src="{img(root,g)}" alt="Mi-Hi joinery project"></a>'
    gal = "".join(_gtile(i, g) for i, g in enumerate(GALLERY[:8]))
    stats = [(YEARS, "Years crafting"), ("7", "Product ranges"), ("100%", "Made in White River"), ("6", "Lowveld towns served")]
    stats_html = "".join(f'<div class="stat"><b>{b}</b><span>{s}</span></div>' for b, s in stats)

    c = head(f"{BIZ} | Bespoke Solid-Wood Kitchens & Joinery | White River, Mpumalanga",
             "Mi-Hi Solid Wood Products designs, builds and installs bespoke solid-wood kitchens, built-in cupboards, bars, TV units, vanities and granite tops across White River and the Mpumalanga Lowveld. Almost 40 years of craftsmanship.", root)
    c += header(root, "Home")
    # hero
    c += f"""
<section class="hero">
  <div class="hero__bg"><img src="{img(root,'project-01.jpg')}" alt="Solid-wood designer kitchen by Mi-Hi"></div>
  <div class="container hero__inner">
    <span class="eyebrow">Solid Wood · Since the 1980s · White River</span>
    <h1>Kitchens and joinery worth keeping for a lifetime.</h1>
    <p class="lead">For almost {YEARS} years, Mi-Hi Solid Wood Products has designed and hand-built bespoke solid-wood kitchens, cupboards and cabinetry for homes across the Mpumalanga Lowveld.</p>
    <div class="hero__cta">
      <a class="btn btn-primary" href="contact.html">Get a Free Design Estimate</a>
      <a class="btn btn-outline-light" href="gallery.html">See our work</a>
    </div>
    <div class="hero__meta">
      <div><b>{YEARS} yrs</b><span>Of craftsmanship</span></div>
      <div><b>Solid wood</b><span>Semi-solid · Melawood · Duco</span></div>
      <div><b>White River</b><span>Own workshop & showroom</span></div>
    </div>
  </div>
</section>"""
    # trust strip
    c += f"""
<div class="trust"><div class="container">
  <span>Almost {YEARS} Years Of Craftsmanship</span><span class="dot">◆</span>
  <span>Design · Manufacture · Install</span><span class="dot">◆</span>
  <span>Solid Wood Specialists</span><span class="dot">◆</span>
  <span>Family-Run In White River</span>
</div></div>"""
    # reviews
    c += f"""
<section class="section">
  <div class="container">
    <div class="section-head center"><span class="eyebrow">What our clients say</span><h2>Trusted in Lowveld homes for decades</h2></div>
    <div class="reviews-grid">{reviews_block(root)}</div>
    <div class="text-center" style="margin-top:36px"><a class="btn btn-ghost" href="reviews.html">Read more reviews</a></div>
  </div>
</section>"""
    # owner-led local trust (split)
    c += f"""
<section class="section bg-surface">
  <div class="container split">
    <img src="{img(root,'project-14.jpg')}" alt="Mi-Hi workshop craftsmanship">
    <div>
      <span class="eyebrow">Owner-led & local</span>
      <h2>Made by hand in White River, not shipped in a flat pack.</h2>
      <p class="lead">Every Mi-Hi project is drawn, built and installed by our own team from our Rocky Drift workshop. You deal with the people who make your kitchen — from the first sketch to the final handle.</p>
      <ul class="ticks">
        <li>Almost {YEARS} years serving Lowveld homeowners</li>
        <li>One team for design, manufacture and installation</li>
        <li>Real solid-wood specialists, not resellers</li>
      </ul>
      <a class="btn btn-primary" href="about.html">Our story</a>
    </div>
  </div>
</section>"""
    # services overview
    c += f"""
<section class="section">
  <div class="container">
    <div class="section-head"><span class="eyebrow">What we build</span><h2>Bespoke joinery for every room in the home</h2><p class="lead">Seven specialities, one standard of craftsmanship. Explore what we make.</p></div>
    <div class="svc-grid">{svc_cards}</div>
  </div>
</section>"""
    # materials
    c += f"""
<section class="section bg-surface">
  <div class="container">
    <div class="section-head center"><span class="eyebrow">Finishes & materials</span><h2>Solid wood, and everything in between</h2></div>
    <div class="mat-grid">{mats_html}</div>
  </div>
</section>"""
    # gallery
    c += f"""
<section class="section">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Our work</span><h2>A few pieces we're proud of</h2></div>
    <div class="gallery-grid">{gal}</div>
    <div class="text-center" style="margin-top:36px"><a class="btn btn-ghost" href="gallery.html">View the full gallery</a></div>
  </div>
</section>"""
    # process
    c += f"""
<section class="section bg-surface">
  <div class="container">
    <div class="section-head center"><span class="eyebrow">How we work</span><h2>Four steps from idea to installed</h2></div>
    <div class="steps">{steps_html}</div>
  </div>
</section>"""
    # stats
    c += f"""
<section class="section stats">
  <div class="container"><div class="stats-grid">{stats_html}</div></div>
</section>"""
    # local / areas
    area_chips = "".join(f'<a class="chip" href="areas/kitchens-{a}.html">{n}</a>' for a, n, _ in AREAS)
    c += f"""
<section class="section">
  <div class="container">
    <div class="section-head center"><span class="eyebrow">Where we work</span><h2>Proudly serving the Mpumalanga Lowveld</h2><p class="lead">From our White River base we design and install throughout the region.</p></div>
    <div class="chip-row" style="justify-content:center">{area_chips}</div>
  </div>
</section>"""
    # booking form
    c += booking_section(root)
    # final CTA
    c += cta_band(root)
    c += footer(root)
    write("index.html", c)
    PAGES.append(("index.html", "Home"))

def booking_section(root):
    opts = "".join(f'<option>{n}</option>' for _, n, *_ in SERVICES)
    return f"""
<section class="section booking">
  <div class="container split">
    <div>
      <span class="eyebrow" style="color:var(--accent)">Free design estimate</span>
      <h2 style="color:#fff">Tell us about your project</h2>
      <p class="lead" style="color:#eaddcb">Send us a few details and we'll be in touch to arrange a consultation. Prefer to talk? Call <a href="tel:{PHONE_TEL}" style="color:var(--accent)">{PHONE}</a>.</p>
      <ul class="ticks">
        <li>No-obligation design consultation</li>
        <li>Clear, itemised quotes</li>
        <li>Visit our Rocky Drift showroom</li>
      </ul>
    </div>
    <form class="form-card" onsubmit="return false">
      <h3>Request a callback</h3>
      <p class="form-note" style="margin-bottom:18px">Placeholder form — connected during back-end setup.</p>
      <div class="grid-2">
        <div class="field"><label>Name</label><input type="text" placeholder="Your name"></div>
        <div class="field"><label>Phone</label><input type="tel" placeholder="Your number"></div>
      </div>
      <div class="field"><label>Email</label><input type="email" placeholder="you@email.com"></div>
      <div class="field"><label>Project</label><select>{opts}<option>Something else</option></select></div>
      <div class="field"><label>Details</label><textarea placeholder="Tell us what you have in mind"></textarea></div>
      <button class="btn btn-primary" type="submit" style="width:100%">Send my request</button>
    </form>
  </div>
</section>"""

# ================================================================ SERVICES
def build_services():
    root = "../"
    # hub
    cards = ""
    for s, n, short, blurb, feats, image in SERVICES:
        cards += f"""
      <a class="svc-card" href="{s}.html">
        <div class="thumb"><img src="{img(root,image)}" alt="{esc(n)}"></div>
        <div class="body"><h3>{esc(n)}</h3><p>{esc(short)}</p><span class="more">Explore →</span></div>
      </a>"""
    c = head(f"Our Services | Bespoke Joinery | {BIZ}",
             "Explore Mi-Hi's bespoke joinery services: designer kitchens, built-in cupboards, bars, TV units, bathroom vanities, office furniture and granite countertops.", root)
    c += header(root, "Services")
    c += page_hero(root, "What we build", "Bespoke joinery, room by room",
                   "Seven specialities under one roof, each hand-built in solid wood, semi-solid, Melawood or Duco to suit your home and budget.",
                   crumbs=[("Home", "index.html"), ("Services", "")])
    c += f'<section class="section"><div class="container"><div class="svc-grid">{cards}</div></div></section>'
    c += booking_section(root)
    c += cta_band(root)
    c += footer(root)
    write("services/index.html", c)
    PAGES.append(("services/index.html", "Services"))

    # individual service pages
    for idx, (s, n, short, blurb, feats, image) in enumerate(SERVICES):
        feats_html = "".join(f"<li>{esc(f)}</li>" for f in feats)
        other = "".join(
            f'<a class="svc-card" href="{s2}.html"><div class="thumb"><img src="{img(root,i2)}" alt="{esc(n2)}"></div><div class="body"><h3>{esc(n2)}</h3><span class="more">Explore →</span></div></a>'
            for s2, n2, _sh, _b, _f, i2 in SERVICES if s2 != s)
        gal_imgs = [GALLERY[(idx*2) % len(GALLERY)], GALLERY[(idx*2+1) % len(GALLERY)], GALLERY[(idx*2+2) % len(GALLERY)]]
        gal = "".join(f'<a href="{root}gallery.html"><img src="{img(root,g)}" alt="{esc(n)} detail"></a>' for g in gal_imgs)
        area_links = "".join(f'<a href="{root}areas/{s}-{a}.html">{n} in {an} <span>→</span></a>' for a, an, _ in AREAS)
        c = head(f"{n} | {BIZ} | White River & the Lowveld",
                 f"{short} Bespoke {n.lower()} designed, built and installed by Mi-Hi Solid Wood Products in White River and across the Mpumalanga Lowveld.", root)
        c += header(root, "Services")
        c += page_hero(root, "Service", n, short,
                       crumbs=[("Home", "index.html"), ("Services", "services/index.html"), (n, "")])
        c += f"""
<section class="section">
  <div class="container split">
    <div class="prose">
      <span class="eyebrow">Made to measure</span>
      <h2>{esc(n)}, built around you</h2>
      <p>{esc(blurb)}</p>
      <ul class="ticks">{feats_html}</ul>
      <a class="btn btn-primary" href="{root}contact.html">Discuss your {esc(n.lower())}</a>
    </div>
    <img src="{img(root,image)}" alt="{esc(n)} by {esc(BIZ)}">
  </div>
</section>
<section class="section bg-surface">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Recent work</span><h2>{esc(n)} we've crafted</h2></div>
    <div class="gallery-grid">{gal}</div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Local service</span><h2>{esc(n)} across the Lowveld</h2></div>
    <div class="link-grid">{area_links}</div>
  </div>
</section>
<section class="section bg-surface">
  <div class="container">
    <div class="section-head center"><span class="eyebrow">More from Mi-Hi</span><h2>Other things we build</h2></div>
    <div class="svc-grid">{other}</div>
  </div>
</section>"""
        c += cta_band(root, image)
        c += footer(root)
        write(f"services/{s}.html", c)
        PAGES.append((f"services/{s}.html", n))

# ================================================================ AREAS (service x area matrix)
def build_areas():
    root = "../"
    # hub
    rows = ""
    for a, an, ablurb in AREAS:
        links = " · ".join(f'<a href="{s}-{a}.html">{n}</a>' for s, n, *_ in SERVICES)
        rows += f'<div style="padding:22px 0;border-bottom:1px solid var(--line)"><h3 style="margin-bottom:8px">{esc(an)}</h3><p style="color:var(--ink-soft);font-size:15px">{links}</p></div>'
    c = head(f"Service Areas | {BIZ} | Mpumalanga Lowveld",
             "Mi-Hi Solid Wood Products designs and installs bespoke joinery across White River, Mbombela (Nelspruit), Hazyview, Sabie, Barberton and Malelane.", root)
    c += header(root, "Services")
    c += page_hero(root, "Where we work", "Serving the Mpumalanga Lowveld",
                   "From our White River workshop we design, build and install throughout the region. Find your town and service below.",
                   crumbs=[("Home", "index.html"), ("Service Areas", "")])
    c += f'<section class="section"><div class="container" style="max-width:900px">{rows}</div></section>'
    c += cta_band(root)
    c += footer(root)
    write("areas/index.html", c)
    PAGES.append(("areas/index.html", "Service Areas"))

    for s, n, short, blurb, feats, image in SERVICES:
        for a, an, ablurb in AREAS:
            feats_html = "".join(f"<li>{esc(f)}</li>" for f in feats[:4])
            other_areas = "".join(f'<a class="chip" href="{s}-{a2}.html">{n} in {an2}</a>' for a2, an2, _ in AREAS if a2 != a)
            other_svc = "".join(f'<a href="{s2}-{a}.html">{n2} in {an} <span>→</span></a>' for s2, n2, *_ in SERVICES if s2 != s)
            title = f"{n} in {an} | {BIZ}"
            desc = f"Bespoke {n.lower()} for homes in {an}. Designed, hand-built and installed by Mi-Hi Solid Wood Products, based in nearby White River."
            c = head(title, desc, root)
            c += header(root, "Services")
            c += page_hero(root, f"{an} · Mpumalanga", f"{n} in {an}",
                           f"Bespoke {n.lower()} for {an} homes — {ablurb}.",
                           crumbs=[("Home", "index.html"), ("Areas", "areas/index.html"), (f"{n} · {an}", "")])
            c += f"""
<section class="section">
  <div class="container split">
    <div class="prose">
      <span class="eyebrow">{esc(an)}</span>
      <h2>{esc(n)}, hand-built for {esc(an)}</h2>
      <p>{esc(blurb)}</p>
      <p>{esc(an)} is {esc(ablurb)} — so {esc(an)} homeowners get the same hands-on design, manufacture and installation service we're known for, without the flat-pack compromise.</p>
      <ul class="ticks">{feats_html}</ul>
      <a class="btn btn-primary" href="{root}contact.html">Get a free estimate in {esc(an)}</a>
    </div>
    <img src="{img(root,image)}" alt="{esc(n)} in {esc(an)}">
  </div>
</section>
<section class="section bg-surface">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Also in {esc(an)}</span><h2>Other joinery for {esc(an)} homes</h2></div>
    <div class="link-grid">{other_svc}</div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head"><span class="eyebrow">{esc(n)} nearby</span><h2>{esc(n)} in other Lowveld towns</h2></div>
    <div class="chip-row">{other_areas}</div>
  </div>
</section>"""
            c += cta_band(root, image)
            c += footer(root)
            write(f"areas/{s}-{a}.html", c)
            PAGES.append((f"areas/{s}-{a}.html", f"{n} in {an}"))

# ================================================================ ABOUT
def build_about():
    root = ""
    c = head(f"About Us | {YEARS} Years of Craftsmanship | {BIZ}",
             f"Mi-Hi Solid Wood Products has hand-built bespoke solid-wood joinery in White River for almost {YEARS} years. Meet the family-run workshop behind the kitchens.", root)
    c += header(root, "About")
    c += page_hero(root, "Our story", f"Almost {YEARS} years of solid wood",
                   "Mi-Hi Solid Wood Products has been designing and building bespoke joinery from White River for the better part of four decades.",
                   crumbs=[("Home", "index.html"), ("About", "")])
    c += f"""
<section class="section">
  <div class="container split">
    <img src="{img(root,'project-02.jpg')}" alt="Mi-Hi craftsmanship">
    <div class="prose">
      <span class="eyebrow">Who we are</span>
      <h2>A White River workshop, run by makers</h2>
      <p>For almost {YEARS} years, Mi-Hi Solid Wood Products has rendered luxury and exclusiveness to homes across the Mpumalanga Lowveld. We specialise in designer kitchens, built-in cupboards, bars, TV units, bathroom vanities, office furniture and granite &amp; quartz tops — in solid wood, semi-solid wood, Melawood and Duco paint.</p>
      <p>Everything we make is designed, manufactured and installed by our own team from our Rocky Drift workshop. No middlemen, no outsourcing — just craftspeople who care about the joint you'll never see as much as the finish you will.</p>
      <ul class="ticks">
        <li>Family-run since the 1980s</li>
        <li>Design, manufacture and installation in-house</li>
        <li>Solid-wood specialists with a full range of finishes</li>
      </ul>
    </div>
  </div>
</section>
<section class="section bg-surface">
  <div class="container">
    <div class="section-head center"><span class="eyebrow">How we work</span><h2>From first sketch to final handle</h2></div>
    <div class="steps">
      <div class="step"><div class="num">01</div><h3>Consult</h3><p>We measure up and learn how you live and cook.</p></div>
      <div class="step"><div class="num">02</div><h3>Design</h3><p>A considered design and a clear, itemised quote.</p></div>
      <div class="step"><div class="num">03</div><h3>Craft</h3><p>Hand-built in White River by our own makers.</p></div>
      <div class="step"><div class="num">04</div><h3>Install</h3><p>Fitted cleanly and precisely by our own team.</p></div>
    </div>
  </div>
</section>"""
    c += cta_band(root, "project-07.jpg")
    c += footer(root)
    write("about.html", c)
    PAGES.append(("about.html", "About"))

# ================================================================ CONTACT
def build_contact():
    root = ""
    hours = "".join(f'<li style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:9px 0"><span>{d}</span><b>{h}</b></li>' for d, h in HOURS)
    c = head(f"Contact & Free Design Estimate | {BIZ} | White River",
             f"Contact Mi-Hi Solid Wood Products in White River. Visit our Rocky Drift showroom, call {PHONE}, or request a free design estimate online.", root)
    c += header(root, "Contact")
    c += page_hero(root, "Get in touch", "Let's start your project",
                   "Visit the showroom, give us a call, or send your details and we'll arrange a free design consultation.",
                   crumbs=[("Home", "index.html"), ("Contact", "")])
    c += f"""
<section class="section">
  <div class="container split">
    <div class="prose">
      <span class="eyebrow">Find us</span>
      <h2>Rocky Drift showroom, White River</h2>
      <p style="font-size:19px"><b>{ADDRESS}</b></p>
      <p>
        Phone: <a href="tel:{PHONE_TEL}" style="color:var(--accent)"><b>{PHONE}</b></a><br>
        Mobile: <a href="tel:{MOBILE_TEL}" style="color:var(--accent)"><b>{MOBILE}</b></a><br>
        Showroom: <a href="mailto:{EMAIL_SHOW}" style="color:var(--accent)">{EMAIL_SHOW}</a><br>
        Design: <a href="mailto:{EMAIL_DES}" style="color:var(--accent)">{EMAIL_DES}</a>
      </p>
      <h3 style="margin-top:1.4em">Opening hours</h3>
      <ul style="list-style:none;padding:0;max-width:340px">{hours}</ul>
    </div>
    <form class="form-card" onsubmit="return false">
      <h3>Request a free design estimate</h3>
      <p class="form-note" style="margin-bottom:18px">Placeholder form — connected during back-end setup.</p>
      <div class="grid-2">
        <div class="field"><label>Name</label><input type="text" placeholder="Your name"></div>
        <div class="field"><label>Phone</label><input type="tel" placeholder="Your number"></div>
      </div>
      <div class="field"><label>Email</label><input type="email" placeholder="you@email.com"></div>
      <div class="field"><label>Town</label><input type="text" placeholder="e.g. White River"></div>
      <div class="field"><label>Project details</label><textarea placeholder="Tell us what you have in mind"></textarea></div>
      <button class="btn btn-primary" type="submit" style="width:100%">Send my request</button>
    </form>
  </div>
</section>"""
    c += footer(root)
    write("contact.html", c)
    PAGES.append(("contact.html", "Contact"))

# ================================================================ REVIEWS
def build_reviews():
    root = ""
    more = REVIEWS + [
        ("From design to installation everything was on time and beautifully finished. Highly recommended.", "M. Sithole", "TV Unit · Sabie"),
        ("The quality of the solid wood is exceptional. Our vanity still looks brand new years later.", "A. Pretorius", "Vanity · Barberton"),
        ("They understood exactly what we wanted and improved on it. True craftsmen.", "J. Coetzee", "Office · Malelane"),
    ]
    cards = ""
    for txt, who, role in more:
        cards += f'<div class="review-card"><div class="stars">★★★★★</div><p>“{esc(txt)}”</p><div class="who"><i>{who[0]}</i><span><b>{esc(who)}</b><small>{esc(role)}</small></span></div></div>'
    c = head(f"Reviews | {BIZ}", "What Lowveld homeowners say about Mi-Hi Solid Wood Products' bespoke kitchens and joinery.", root)
    c += header(root, "Reviews")
    c += page_hero(root, "What our clients say", "Trusted in Lowveld homes",
                   "Almost four decades of kitchens, cupboards and cabinetry — and the homeowners who live with them every day.",
                   crumbs=[("Home", "index.html"), ("Reviews", "")])
    c += f'<section class="section"><div class="container"><div class="reviews-grid">{cards}</div><p class="form-note text-center" style="margin-top:30px">Testimonials shown are representative placeholders pending the client\'s live Google &amp; Facebook reviews.</p></div></section>'
    c += cta_band(root)
    c += footer(root)
    write("reviews.html", c)
    PAGES.append(("reviews.html", "Reviews"))

# ================================================================ GALLERY
def build_gallery():
    root = ""
    def _tile(i, g):
        cls = ' class="wide"' if i % 7 == 0 else ''
        return f'<a href="#" onclick="return false"{cls}><img src="{img(root,g)}" alt="Mi-Hi joinery project {i+1}"></a>'
    tiles = "".join(_tile(i, g) for i, g in enumerate(GALLERY))
    c = head(f"Gallery | Our Work | {BIZ}", "A gallery of bespoke solid-wood kitchens, cupboards, bars and vanities hand-built by Mi-Hi Solid Wood Products.", root)
    c += header(root, "Gallery")
    c += page_hero(root, "Our work", "Craftsmanship you can see",
                   "A selection of kitchens, cupboards, bars, vanities and units built and installed by our team.",
                   crumbs=[("Home", "index.html"), ("Gallery", "")])
    c += f'<section class="section"><div class="container"><div class="gallery-grid">{tiles}</div></div></section>'
    c += cta_band(root)
    c += footer(root)
    write("gallery.html", c)
    PAGES.append(("gallery.html", "Gallery"))

# ================================================================ BLOG
def build_blog():
    root = "../"
    cards = ""
    for slug, title, cat, image, excerpt in POSTS:
        cards += f"""
      <a class="svc-card" href="{slug}.html">
        <div class="thumb"><img src="{img(root,image)}" alt="{esc(title)}"></div>
        <div class="body"><span class="more">{esc(cat)}</span><h3 style="margin:8px 0">{esc(title)}</h3><p>{esc(excerpt)}</p></div>
      </a>"""
    cat_links = "".join(f'<a class="chip" href="categories/{c.lower().replace(" ","-")}.html">{c}</a>' for c in CATEGORIES)
    c = head(f"Blog & Tips | {BIZ}", "Design tips, material guides and project stories from Mi-Hi Solid Wood Products.", root)
    c += header(root, "Blog")
    c += page_hero(root, "Blog & tips", "Ideas from the workshop",
                   "Design inspiration, material guides and stories from almost 40 years of building solid-wood joinery.",
                   crumbs=[("Home", "index.html"), ("Blog", "")])
    c += f'<section class="section"><div class="container"><div class="chip-row" style="margin-bottom:36px">{cat_links}</div><div class="svc-grid">{cards}</div></div></section>'
    c += cta_band(root)
    c += footer(root)
    write("blog/index.html", c)
    PAGES.append(("blog/index.html", "Blog"))

    # posts
    for slug, title, cat, image, excerpt in POSTS:
        related = "".join(
            f'<a class="svc-card" href="{s2}.html"><div class="thumb"><img src="{img(root,i2)}" alt="{esc(t2)}"></div><div class="body"><h3 style="font-size:18px">{esc(t2)}</h3></div></a>'
            for s2, t2, _c, i2, _e in POSTS if s2 != slug)
        c = head(f"{title} | {BIZ}", excerpt, root)
        c += header(root, "Blog")
        c += page_hero(root, cat, title, excerpt,
                       crumbs=[("Home", "index.html"), ("Blog", "blog/index.html"), (title, "")])
        c += f"""
<section class="section"><div class="container">
  <img src="{img(root,image)}" alt="{esc(title)}" style="border-radius:2px;width:100%;aspect-ratio:16/7;object-fit:cover;margin-bottom:40px">
  <div class="prose" style="margin:0 auto">
    <p class="lead">{esc(excerpt)}</p>
    <p>This article is part of Mi-Hi's design journal. The full post content migrates from the client's existing blog during the SEO stage — the structure, imagery and layout are in place and ready to receive it.</p>
    <h2>Why it matters</h2>
    <p>Good joinery is a long-term decision. Whether you're weighing up materials, planning a layout or caring for a finished piece, the choices you make now shape how a room works for the next twenty years.</p>
    <h2>Talk to the makers</h2>
    <p>Have a project in mind? <a href="{root}contact.html" style="color:var(--accent)">Get a free design estimate</a> and we'll help you get it right.</p>
  </div>
</div></section>
<section class="section bg-surface"><div class="container">
  <div class="section-head"><span class="eyebrow">Keep reading</span><h2>More from the journal</h2></div>
  <div class="svc-grid">{related}</div>
</div></section>"""
        c += footer(root)
        write(f"blog/{slug}.html", c)
        PAGES.append((f"blog/{slug}.html", title))

    # categories
    for cat in CATEGORIES:
        cslug = cat.lower().replace(" ", "-")
        in_cat = [p for p in POSTS if p[2] == cat]
        if in_cat:
            cards = "".join(f'<a class="svc-card" href="../{slug}.html"><div class="thumb"><img src="{img("../../","")}{image}" alt="{esc(title)}"></div><div class="body"><h3 style="font-size:19px">{esc(title)}</h3><p>{esc(excerpt)}</p></div></a>' for slug, title, c2, image, excerpt in in_cat)
        else:
            cards = '<p class="lead">New articles in this category are on the way.</p>'
        root2 = "../../"
        c = head(f"{cat} — Blog | {BIZ}", f"Articles about {cat.lower()} from Mi-Hi Solid Wood Products.", root2)
        c += header(root2, "Blog")
        c += page_hero(root2, "Category", cat, f"Design tips and project stories about {cat.lower()}.",
                       crumbs=[("Home", "index.html"), ("Blog", "blog/index.html"), (cat, "")])
        c += f'<section class="section"><div class="container"><div class="svc-grid">{cards}</div></div></section>'
        c += cta_band(root2)
        c += footer(root2)
        write(f"blog/categories/{cslug}.html", c)
        PAGES.append((f"blog/categories/{cslug}.html", f"{cat} (Blog)"))

# ================================================================ LEGAL + SITEMAP
def build_legal():
    root = ""
    for slug, title, body in [
        ("privacy", "Privacy Policy", "This placeholder privacy policy will be finalised before launch. Mi-Hi Solid Wood Products respects your privacy and only uses the details you share to respond to your enquiry."),
        ("terms", "Terms of Service", "These placeholder terms will be finalised before launch and cover quotations, deposits, lead times, installation and guarantees on Mi-Hi's bespoke joinery."),
    ]:
        c = head(f"{title} | {BIZ}", f"{title} for {BIZ}.", root)
        c += header(root)
        c += page_hero(root, "Legal", title, "", crumbs=[("Home", "index.html"), (title, "")])
        c += f'<section class="section"><div class="container prose"><p class="lead">{esc(body)}</p><p>For any questions, contact us at <a href="mailto:{EMAIL_DES}" style="color:var(--accent)">{EMAIL_DES}</a> or call <a href="tel:{PHONE_TEL}" style="color:var(--accent)">{PHONE}</a>.</p></div></section>'
        c += footer(root)
        write(f"{slug}.html", c)
        PAGES.append((f"{slug}.html", title))

def build_sitemap():
    root = ""
    groups = {"Main": [], "Services": [], "Service Areas": [], "Blog": [], "Legal": []}
    for path, title in PAGES:
        if path.startswith("services/"): groups["Services"].append((path, title))
        elif path.startswith("areas/"): groups["Service Areas"].append((path, title))
        elif path.startswith("blog/"): groups["Blog"].append((path, title))
        elif path in ("privacy.html", "terms.html"): groups["Legal"].append((path, title))
        else: groups["Main"].append((path, title))
    body = ""
    for g, items in groups.items():
        if not items: continue
        links = "".join(f'<a href="{root}{p}">{esc(t)} <span>→</span></a>' for p, t in items)
        body += f'<div style="margin-bottom:44px"><span class="eyebrow">{g}</span><div class="link-grid">{links}</div></div>'
    c = head(f"Site Map | {BIZ}", "All pages on the Mi-Hi Solid Wood Products website.", root)
    c += header(root)
    c += page_hero(root, "Site map", "Every page, one place", "", crumbs=[("Home", "index.html"), ("Site map", "")])
    c += f'<section class="section"><div class="container">{body}</div></section>'
    c += footer(root)
    write("site-map.html", c)

# ================================================================ JS
def build_js():
    js = """// Mi-Hi — minimal interactions (no analytics, no backend)
document.addEventListener('click',function(e){
  var links=document.getElementById('navLinks');
  if(links&&links.classList.contains('open')&&!e.target.closest('#navLinks')&&!e.target.closest('.nav-toggle')){links.classList.remove('open');}
});"""
    write("assets/js/site.js", js)

# ================================================================ RUN
if __name__ == "__main__":
    build_home(); build_services(); build_areas(); build_about()
    build_contact(); build_reviews(); build_gallery(); build_blog()
    build_legal(); build_sitemap(); build_js()
    print(f"Generated {len(PAGES)+1} pages (+ sitemap, js).")
    for p, _ in PAGES[:5]: print("  ", p)
    print("   ...")
