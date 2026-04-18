# ALAI

## BookStack — Provjeri PRVO
Prije traženja bilo čega — provjeri BookStack (https://docs.basicconsulting.no). Centralna baza znanja za tools, skills, hooks, agents, rules, projekte, klijente, dokumentaciju. Ako odgovor postoji tamo — NE TRAŽI dalje.

## Project Info
- Created: 2026-02-09
- Type: Landing Page
- Status: Active
- Description: Holding company website for ALAI AS, Norwegian tech holding. Subsidiaries: Basic Consulting (digital agency), Drop (fintech). Premium, minimalist Scandinavian design. Logo: bold ALAI wordmark with green AI dot. Colors: black, white, green accent. Language: English with Norwegian touch.

## Tech Stack
- HTML5 + CSS3 + Vanilla JS (NO frameworks, NO build tools)
- Deploy: **Cloudflare Pages** (auto-deploy on git push to master)
- Language: en (English)

## ⚠️ Deployment — READ THIS FIRST
- **Live URL:** https://alai.no (DNS migration pending — see below)
- **Hosting:** Cloudflare Pages
- **Preview URL:** https://alai-web.pages.dev (LIVE — ucenje redesign active)
- **Repo root:** `~/ALAI/web` ← THIS is the correct repo
- **Git repo:** https://github.com/johnatbasicas/alai-web.git
- **Deploy:** Automatic on `git push origin master` (Cloudflare Pages watches repo)
- **Manual deploy:** `wrangler pages deploy public --project-name=alai-web --branch=master`
- ❌ `~/projects/ALAI/landing` — stale Next.js + Firebase experiment, NOT live, IGNORE
- ❌ Vercel `ucenje-deploy` project — DEPRECATED, blocked by team config error (2026-04-18)

## DNS Migration (PENDING — Alem action required)
**Status:** Cloudflare Pages project created, site deployed and working at https://alai-web.pages.dev
**Blocker:** alai.no nameservers still at one.com, need to point to Cloudflare
**Action required:**
1. Login to one.com: https://one.com (alembasic@gmail.com)
2. Navigate to: alai.no → DNS settings
3. Update nameservers from one.com defaults to:
   - aspen.ns.cloudflare.com
   - wells.ns.cloudflare.com
4. Wait 5-60 minutes for propagation
5. Verify: `curl -sI https://alai.no | grep server` → should show "cloudflare"

**Once nameservers are updated:**
- Custom domain alai.no will auto-activate on Cloudflare Pages
- SSL certificate will be auto-issued
- All traffic will route through Cloudflare (faster, more reliable than Vercel)
- Ucenje redesign will be live

## Structure
```
public/
  index.html          ← Main site
  ucenje/             ← Hidden learning pages (noindex)
    index.html        ← Entry — links to subpages via .html extension (NOT trailing slash)
    mladi.html
    matematika.html
    teologija.html
    narod.html
    bs.html / no.html / en.html
```

## Required Sections (in order)
1. **Navigation** — Logo + links, sticky, mobile hamburger menu
2. **Hero** — Headline + subheadline + CTA button + background image/gradient
3. **About** — Company story, mission, values
4. **Services** — 3-6 service cards with icons
5. **Testimonials** — 2-4 client quotes with names
6. **CTA Banner** — "Get a quote" call-to-action leading to contact form
7. **Contact** — Form (name, email, message) + address + phone + map placeholder
8. **Footer** — Copyright + social links + back-to-top

## Design Rules
- Mobile-first responsive (min 320px, breakpoints: 768px, 1024px)
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Max content width: 1200px, centered
- Consistent color palette (define CSS variables in :root)
- Smooth scroll between sections
- Accessible: semantic HTML, alt text, ARIA labels, contrast ratio 4.5:1+

## Anti-Hallucination Rules
- NO placeholder text (lorem ipsum, "coming soon", TBD)
- ALL content must be realistic and relevant to: Holding company website for ALAI AS, Norwegian tech holding. Subsidiaries: Basic Consulting (digital agency), Drop (fintech). Premium, minimalist Scandinavian design. Logo: bold ALAI wordmark with green AI dot. Colors: black, white, green accent. Language: English with Norwegian touch.
- ALL images use CSS gradients or emoji/unicode — NO external image URLs
- Phone/email/address must be plausible for the business type
- Testimonial names must sound natural for the locale
- Prices must be in local currency and realistic

## Quality Checklist
- [ ] Valid HTML5 (no unclosed tags)
- [ ] All 8 sections present and populated
- [ ] Responsive on mobile (320px) and desktop (1200px+)
- [ ] No external dependencies (CDN, fonts, images)
- [ ] CSS variables for colors defined in :root
- [ ] Smooth scroll working
- [ ] Form has basic JS validation
- [ ] Footer has current year

## System Tools (shared, DO NOT duplicate)
- Tasks: ~/system/tools/task.sh
- Build: node ~/system/tools/build-project.js
- Full manifest: ~/system/tools/manifest.md

## Rules
Global rules apply: ~/system/rules/
Anti-hallucination: ~/system/rules/agent-anti-hallucination.md

## Boundaries
This project is a self-contained landing page.
Builder writes ONLY to `public/index.html`.
If something doesn't belong inside this project's borders, STOP and ask Alem.
