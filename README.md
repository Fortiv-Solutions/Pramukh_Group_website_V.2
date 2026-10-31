# Pramukh Group — cinematic website

A single-page, scroll-choreographed site for Pramukh Group. Layout and motion follow the supplied reference video (`e532c0db3ec3e37713db72dcb692d22a.mp4`). Colour comes from the Marina Bay reference site. All copy and figures come from pramukh.com.

```bash
npm install
npm run media   # build /public/media from /assets (only needed after changing the asset map)
npm run dev     # http://localhost:3000
npm run build && npm start
```

**Stack:** Next.js 16 (App Router, static export of `/`), React 19, TypeScript, CSS Modules, GSAP 3.15 (ScrollTrigger and SplitText), Lenis smooth scroll, and `next/font` (Marcellus and Hanken Grotesk). No other runtime dependencies.

> `/assets` (1.2 GB of source material) is never served. Only the 38 optimised files in `/public/media` (17 MB) ship. Exclude `/assets` from any deploy upload, for example with `.vercelignore`.

---

## 1. Reference storyboard → site sections

| Ref. time | Reference scene | Site section | Notes |
|---|---|---|---|
| 0.0–3.5s | Aerial hero, centred caps headline, pill CTA, floating white nav | **01 Hero** | One Tapi aerial loop cut from the project film (129.6–133.4s, ping-pong). |
| 0.5–1.5s | White wipe → image reveal, headline rises | Hero intro | Ten **louvre slats** part from the centre while the aerial settles from a 1.32× push-in. |
| 3.5–4.5s | Light panel rides up over the hero | Hero → Intro | CSS-sticky hero, then the intro slides over it with rounded top corners. The hero darkens and its copy lifts away. |
| 4–8.5s | Meta row, two small images, statement, stat cards counting | **02 Intro** | Statement inks in word by word. Four verified stats count up. |
| — | — | **03 Portfolio** | Brief extra: editorial index with sticky wipe preview and city filter. |
| 9–18s | Pinned full-bleed image, floating tan card, `[ ]` side labels, slat transition between slides | **04 What we build** | Pinned stage. Each new background opens through a 12-slat louvre mask, and cards trade places. |
| 18.5–22.5s | "Where excellence is standard", horizontal card track | **05 Philosophy** | Pinned horizontal travel with a progress hairline. |
| — | — | **06 All-in Ownership™** | Brief extra: olive section, sticky image panel, four stages, closing statement. |
| 22.5–25s | Giant marquee line moving with scroll | Showcase lead-in | "Creating spaces that stand the test of time ✱" |
| 25.5–33s | Pinned dark split: image left, index `[N.01]`, big number, details right | **07 Featured projects** | Image layers slide up, and the inset composition alternates (left inset, right portrait, full bleed, top-left). The index is clickable. |
| 33–35s | Testimonial cards | **08 Trust** | No testimonials are published, so this uses the founder's three founding promises, city history and the current pipeline. |
| 35.5–36.8s | Marquee, centred CTA, contacts, oversized wordmark | **09 CTA + footer** | Wordmark letters are the real logo paths, rising in sequence. |

## 2. Animation breakdown

| Section | Desktop (≥1024px, motion allowed) | Below 1024px | Reduced motion |
|---|---|---|---|
| Preloader | On the light #F4F6F8 ground with a warm edge glow, the exact logo (`assets/pramukh-logo.svg` paths) assembles in CSS from first paint: the monogram rises, PRAMUKH ® letters rise from a row mask, the tagline follows, and "Designed. Delivered. Trusted." reveals word by word. The counter waits for fonts and page load (min 2.5s, max 6s), then the letters lift out and the panel fades into the hero louvre, which is the same colour. | Same, compact layout. | Skipped. |
| Hero | Slats `scaleY→0` (stagger from centre, `expo.inOut`), media `scale 1.32→1` over 2.8s, headline lines rise from masks, copy rises. On scroll: scrubbed scale, shade and copy lift. | Same. | Static poster. No video, no slats. |
| Nav | Two-step menu (after the "Two-step menu" Framer reference). Over the hero: transparent, full width. Past it: a frozen light (#F4F6F8) floating pill, compact with the monogram, Menu and a gold Enquire. Step one: hovering widens the pill to full width and the full logo returns. Step two: Menu drops it open into three columns (Discover, Ongoing by city, Company). The cards and rows rise in a stagger, the dividers draw in, a line sweeps under the hovered row, and a faint monogram outline sits in the open column. Esc, a focus trap, click-outside and scroll lock are supported. | Pill spans the width; columns stack; monogram-only logo on phones. | Instant. |
| Intro | City gallery: four photo panels as an accordion (Silvassa, Surat, Vapi, Daman). Hover, focus or tap opens one wide with its fact, its ongoing-project count and a link; the rest narrow to dimmed strips. The statement word opacity is scrubbed; stat cards stagger and count up. | Phones: vertical accordion. | Static, first panel open. |
| Portfolio | Hovering or focusing a row wipes its image up over the last one (`inset(100%→0)`). Rows re-stagger on filter. | Swipe rail with snap and inline images. | Instant swap. |
| What we build | Stage clip opens to full bleed, then a pin of 2.2 viewport heights. The `--louvre` mask runs 0→100% per slide, and the mask is removed afterwards to avoid seams. | Stacked slides, each opening its louvre once. | Stacked. |
| Philosophy | Pin with track `x` scrubbed to its overflow width. | Native swipe rail. | Swipe rail. |
| Ownership | Sticky panel, scrubbed image wipes per stage, progress rail, closing line word reveal. | Inline image per stage. | Inline images. |
| Showcase | Marquee `xPercent` scrub. Pin of 3.45 viewport heights with layer clip-wipes, inset parallax and info crossfades. The index jumps to each project. | Stacked image and info blocks. | Stacked. |
| Trust | Promise cards slide in from the right, city images parallax. | Promise rail. | Static. |
| Footer | Background scale scrub, CSS marquee, wordmark glyphs rise. | Same. | Static. |

Engineering rules followed:
- Every timeline lives in `useGSAP` plus `gsap.matchMedia`, so it is reverted on unmount and on breakpoint change.
- Only transform, opacity, clip-path and mask are animated.
- Hidden pinned cards use opacity plus `pointer-events`, not `visibility`, so keyboard users can still reach them. Focusing a card scrolls the stage to it.

## 3. Design tokens (`src/app/globals.css`)

| Token | Value | Source |
|---|---|---|
| `--c-espresso` | `#332820` | Marina Bay primary |
| `--c-sand` | `#D6CBBC` | Marina Bay secondary (floating cards) |
| `--c-olive` | `#242B16` | Marina Bay accent (Ownership section) |
| `--c-cream` | `#FBEEDB` | Marina Bay cream (light gradients) |
| `--c-tan` | `#CBB295` | Marina Bay tan (accents on dark) |
| `--c-gold` | `#C4A359` | Pramukh logo gold |

- **Display:** Marcellus, a flared Roman capital face. It stands in for the reference's licensed Penumbra Flare and echoes the PRAMUKH wordmark.
- **Body/UI:** Hanken Grotesk, standing in for Sweet Sans.
- The type scale is fluid (`--t-mega` … `--t-micro`).
- Easing is `expo.out` for reveals and `power2/3.inOut` for wipes.
- Breakpoints: 640 / 1024.

## 4. Content and verification

Content lives in `src/content/` (`site.ts` and `projects.ts`), and each value comes from a pramukh.com page. Deliberate omissions:
- **No testimonials.** None are published.
- **No "How we got here" timeline.** The live site still shows lorem-ipsum placeholder text for those entries.
- **No leadership titles.** Only the founder's name is published, so he is the only person named.
- **Marina Bay has no status.** None is published.
- **No Samruddhi, Lemon Tree or Treat imagery.** None was supplied, so they appear in copy only.

## 5. Assets

The supplied `/assets` folder contains 1,174 files:
- ~25 project banners and galleries
- ~280 monthly construction-update photos
- ~300 amenity renders
- ~80 floor plans
- 4 films
- logo, monogram, team portraits, and city aerials and maps

**Single source of truth:** `scripts/media.config.mjs` lists every image the site uses, with its alt text, along with the two video cut points and the frame grabs. `npm run media` resizes them with sharp (mozjpeg), encodes the 1080p and 720p hero loops with ffmpeg, and writes `src/content/media.generated.ts` (dimensions and blur placeholders). Components reference images by key (`<Img k="one-tapi/hero" …/>`), so to swap an image you edit one line and re-run the script. Project images are only ever used for their own project.

## 6. Architecture

```
src/app/            layout (fonts, metadata, JSON-LD), page, globals.css, icon.svg
src/content/        site.ts, projects.ts, media.ts (+ generated manifest)
src/lib/gsap.ts     plugin registration, shared media queries
src/components/
  SmoothScroll.tsx  Lenis ↔ ScrollTrigger bridge, scroll API context
  TextReveals.tsx   one entrance system for otherwise static text: data-reveal (rise) and data-reveal="lines" (masked lines); mounted last so pin spacing is measured
  brand/            logo paths extracted from pramukh-logo.svg
  ui/               Img, SplitReveal, Button/TextLink, Counter
  sections/         Nav, Hero, Intro, Portfolio, Build, Philosophy, Ownership, Showcase, Trust, Footer
scripts/            media.config.mjs, prepare-media.mjs
```

## 7. QA (production build, Chromium)

| Lighthouse 13.6 | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Mobile (simulated 4G, 4× CPU) | 94–97 across runs | 100 | 100 | 100 | 1.1s | 0.004 | 190–270ms |
| Desktop | 100 | 100 | 100 | 100 | 0.3s | 0.026 | 60ms |

Scroll captures at 1440×900, 820×1180 and 390×844, plus a reduced-motion pass: no console errors and no horizontal overflow. Interaction checks covered:
- mobile menu: open, focus moves into the menu, Esc closes and returns focus, anchor navigation works
- portfolio filter and hover preview
- keyboard focus into pinned cards
- showcase index jumps

Not tested: real iOS Safari and Android devices, and Firefox. Check pinned sections there before launch.
