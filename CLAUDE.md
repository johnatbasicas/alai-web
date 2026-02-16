# ALAI

## Project Info
- Created: 2026-02-09
- Type: Landing Page
- Status: Active
- Description: Holding company website for ALAI AS, Norwegian tech holding. Subsidiaries: Basic Consulting (digital agency), Drop (fintech). Premium, minimalist Scandinavian design. Logo: bold ALAI wordmark with green AI dot. Colors: black, white, green accent. Language: English with Norwegian touch.

## Tech Stack
- HTML5 + CSS3 + Vanilla JS (NO frameworks, NO build tools)
- Single file: `public/index.html`
- Deploy: Vercel (static)
- Language: en (English)

## Structure
```
public/
  index.html    ← Entire site (HTML + inline CSS + inline JS)
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
