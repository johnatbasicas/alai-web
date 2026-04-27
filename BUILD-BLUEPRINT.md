# BUILD-BLUEPRINT — alai.no

## Project Identity
- **Name:** alai-web
- **Type:** Static landing page + /ucenje/ research subpages
- **Live URL:** https://alai.no (also https://alai-web.pages.dev)
- **Repo:** https://github.com/johnatbasicas/alai-web (branch: master)
- **Repo root:** `~/ALAI/web`

## Tech Stack
| Layer | Tech |
|-------|------|
| HTML | HTML5 — semantic, hand-written |
| CSS | CSS3 — vanilla, no framework, CSS variables in `:root` |
| JS | Vanilla JS — no build, no bundler |
| Hosting | Cloudflare Pages (auto-deploy on git push to master) |
| CI | GitHub Actions — `cloudflare/wrangler-action@v3` |

**No build step.** Files are served as-is from `public/`. There is no npm install, no webpack, no transpiler.

## File Structure
```
~/ALAI/web/
├── public/                       ← deployed root
│   ├── index.html                ← main landing
│   ├── ucenje/                   ← research pages (noindex, hidden hub)
│   │   ├── index.html            ← hub
│   │   ├── bs.html / no.html / en.html
│   │   ├── mladi.html
│   │   ├── matematika.html
│   │   ├── teologija.html
│   │   ├── narod.html
│   │   ├── pcele.html
│   │   ├── laylatul-qadr.html
│   │   └── assets/
│   │       ├── style.css
│   │       ├── animations.css
│   │       └── app.js
├── DEPLOY-MAP.md                 ← deploy procedure
├── CLAUDE.md                     ← project conventions
└── BUILD-BLUEPRINT.md            ← this file
```

## URL Routing
Server: Cloudflare Pages (with `_redirects` if used).
- `/ucenje/index.html` ← entry
- `/ucenje/bs.html` ← extension required (NOT trailing slash)
- Static files served directly.

## JavaScript Conventions

### Language toggle (assets/app.js)
- Spans with `data-lang-show="bs|no|en"` are hidden by default via CSS.
- JS adds `lang-visible` class to spans matching active language.
- CSS: `[data-lang-show] { display: none; }` `[data-lang-show].lang-visible { display: revert; }`

### Scroll animations (assets/app.js + animations.css)
- Elements with `.fade-in` start at `opacity: 0`.
- IntersectionObserver adds `.visible` class when element enters viewport.
- Trigger config: `{ threshold: 0.1, rootMargin: '0px 0px -60px 0px' }`
- **KNOWN ISSUE:** fast continuous scroll can skip elements (esp. tables). Fix: use `threshold: 0` and/or add fallback timer that forces visibility after 2s.
- **CRITICAL CONTENT MUST NOT use `.fade-in`** — animations are decoration, not gates for content. Tables, data, and core information must be visible without JS.

### Animation classes
- `.fade-in` — opacity 0 → 1, transform translateY
- `.fade-in-delay-{1-4}` — staggered delay
- `.grid-animate-parent` / `.grid-cell` — staggered grid reveal
- `.svg-draw` — stroke-dasharray animation
- `.timeline-bar` — scaleY animation

## CSS Conventions
- CSS variables in `:root` (colors, fonts, spacing tokens)
- Mobile-first responsive (320px → 768px → 1024px)
- Max content width: 1200px, centered
- System font stack as fallback; custom fonts via `@font-face`
- Color tokens: `--ink`, `--parchment`, `--gold-light`, `--teal`, etc.

## Local Development
```bash
# Serve locally (any static server works)
cd ~/ALAI/web/public && python3 -m http.server 8765
# Open http://localhost:8765/ucenje/bs.html
```

No watch / hot reload. Refresh browser after edits.

## Deploy Procedure
See `DEPLOY-MAP.md`. Summary:
1. `git add public/` → `git commit` → `git push origin master`
2. GH Actions triggers `wrangler-action@v3` → deploys to Cloudflare Pages project `alai-web`
3. Production URL `https://alai.no` updates within 60s
4. Manual: `wrangler pages deploy public --project-name=alai-web --branch=master`

## Verification After Deploy
- `curl -sI https://alai.no | grep -i server` → should show `cloudflare`
- `curl -sI https://alai.no/ucenje/bs.html` → HTTP 200
- Playwright visual screenshot vs prior baseline
- Browser test: scroll through all sections, check `.fade-in` elements become visible

## Anti-Hallucination Rules
- NO build tools (no webpack, no Vite, no esbuild — vanilla only)
- NO external CDN dependencies for fonts or images
- NO framework imports (no React, no Vue, no jQuery)
- NO trailing slashes on subpage URLs (use `.html`)
- NO placeholder content (lorem ipsum, TBD)

## Boundaries
- Builder writes ONLY inside `public/`
- DEPLOY-MAP.md, BUILD-BLUEPRINT.md, CLAUDE.md are docs (not deployed)
- If something doesn't fit static-site model → STOP and consult Alem
