# ALAI /ucenje — Design Specification

**Author:** Vizu / Brad Frost + Lea Verou principles  
**Date:** 2026-04-18  
**Project:** alai.no/ucenje — Quran Number 19 + 19-TET Sonification

---

## Design Rationale (max 300 words)

This site is a personal scholarly project by Alem Basic — not a SaaS product. The audience spans 10-year-olds to mathematical physicists, Muslims and non-Muslims alike. The design must serve contemplative reading, not sell anything.

The central influence is **Brill Academic Publisher** — restrained, serious, typographically meticulous — combined with **Pitchfork / The Creative Independent** editorial depth and audio integration, and **Are.na's** contemplative whitespace. The palette references Quranic manuscript tradition: parchment, ink, gold.

Every animation has a purpose: the 19-pointed star rotates to make the number embodied rather than abstract; the 6×19 grid reveals the mathematical structure visually; waveform bars make audio tangible before playback. None of these are decorative — they are the argument made visible.

The typography pairs **EB Garamond** (humanist serif, warm, readable at essay length) with **Amiri** (Arabic-script optimized for Quranic text, Uthmanic style). IBM Plex Mono serves mathematics and code. Arabic text appears only for genuine Quranic quotations, right-to-left, correctly spelled.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--ink` | `#1a1714` | Primary text, dark backgrounds |
| `--ink-soft` | `#2c2820` | Hover states on dark |
| `--parchment` | `#f5f0e8` | Section backgrounds, cards |
| `--parchment-dark` | `#ede7d5` | Hover states, badges |
| `--cream` | `#faf6ef` | Page background |
| `--gold` | `#c9a961` | Primary accent, borders |
| `--gold-light` | `#e8cfa0` | Dark-bg text, shimmer |
| `--gold-dark` | `#9e7c3f` | Hover gold, dark labels |
| `--teal` | `#2d7d7a` | Secondary accent (mathematics) |
| `--teal-light` | `#3a9e9a` | Teal hover |
| `--text-primary` | `#1a1714` | Body text |
| `--text-secondary` | `#4a4035` | Supporting text |
| `--text-muted` | `#7a6e5f` | Labels, metadata |
| `--text-faint` | `#a09080` | Footer, timestamps |

---

## Typography Stack

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Serif body | EB Garamond | 400, 400i, 500, 600, 700 | All body text, headings |
| Arabic | Amiri | 400, 400i, 700 | Quranic quotations only |
| Monospace | IBM Plex Mono | 400, 500 | Math, code, technical |
| System sans | -apple-system, Helvetica | — | Nav labels, badges, metadata |

**Scale:** xs(12px) sm(14px) base(16px) lg(18px) xl(20px) 2xl(24px) 3xl(30px) 4xl(36px) 5xl(48px) 6xl(60px)

**Line heights:** Body 1.75, headings 1.2, Arabic 2.0

---

## Animation Vocabulary

| Animation | CSS/SVG | Duration | Trigger | Purpose |
|-----------|---------|----------|---------|---------|
| `starRotate` | CSS `@keyframes` on SVG `<path>` | 120s/80s linear infinite | Page load | 19-pointed star rotates, makes number visceral |
| `ringPulse` | `opacity` keyframe on concentric circles | 4s ease-in-out infinite, staggered | Page load | Represents mathematical radiating structure |
| `heroIn` | `opacity + translateY` | 1.2s cubic-bezier(0.16,1,0.3,1) | Page load | Staggered hero entrance, 4 delay classes |
| `fade-in + .visible` | `opacity + translateY`, JS IntersectionObserver | 0.7s ease | Scroll into viewport | Content reveals as user reads down |
| `waveBar` | `scaleY` keyframe on div bars | 1.4–2.1s ease-in-out infinite, staggered | Page load | Decorative audio waveform |
| `shimmer` | Background-position on gradient text | 5s ease-in-out infinite | Page load | Bismillah gold shimmer |
| `digitReveal` | `opacity + translateY` on counter | 1.8s cubic ease-out | In viewport | Counter animates 0→19 |
| `acousticExpand` | `scale + opacity` on circles | 3s ease-out infinite | On audio play | Acoustic ring effect |
| Grid cell reveal | `.visible` class staggered | 15ms per cell | Grid in viewport | 114 surah cells build like mosaic |
| `svg-draw` | `stroke-dashoffset` | 2s ease | In viewport | SVG paths draw on |

**All animations disabled** under `prefers-reduced-motion: reduce`.

---

## Accessibility Notes

- WCAG AA contrast minimum throughout (4.5:1 text, 3:1 large text)
- All interactive elements have `:focus-visible` outline (2px gold, 3px offset)
- `.sr-only` class for screen-reader-only labels
- Audio players have `aria-label` on play buttons
- SVG decoratives have `aria-hidden="true"`
- Grid has `role="img"` with descriptive `aria-label`
- Arabic text uses `lang="ar"` attribute on every block
- Language switcher uses `aria-pressed` on toggle buttons
- `prefers-reduced-motion` kills all animations

---

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Mobile | < 480px | Font-size: 15px, padding reduced to space-4 |
| Tablet | < 768px | Nav links hidden, perspective-nav stacks, stat-grid 2-col |
| Desktop | 768px+ | Full layout, all nav visible |
| Wide | 1100px+ | Max-width container clamps |

---

## File Structure

```
/ucenje/
  index.html           — Hub (redesigned)
  mladi.html           — Za Mlade (redesigned)
  matematika.html      — Za Matematičare (redesigned)
  teologija.html       — Za Teologe (redesigned)
  narod.html           — Za Narod (redesigned)
  bs.html / no.html / en.html — Deep dive (existing, link targets)
  audio/
    index.html         — Audio player page (new)
    README.md          — Attribution + file manifest
    quran-basmala.mp3
    quran-fatiha.mp3
    quran-full-melody.mp3
    quran-grid-harmony.mp3
    quran-meccan-medinan.mp3
    quran-mirrors.mp3
    quran-surah96.mp3
  19-explorer/
    index.html         — Interactive math explorer (new)
  assets/
    style.css          — Design system + component styles
    animations.css     — All animation definitions
    app.js             — Language switcher, audio players, visualizations
    wavesurfer.min.js  — Audio waveform (local, no CDN)
  DESIGN-SPEC.md       — This file
```
