# ElectroLoop Web

Landing page for **ElectroLoop** — Gestión RAEE certificada de punta a punta. Built with Astro 4, Tailwind CSS 3, and TypeScript.

## Tech Stack

- [Astro 4](https://astro.build) — static site generator with zero-JS by default
- [Tailwind CSS 3](https://tailwindcss.com) — utility-first CSS
- [TypeScript 5](https://www.typescriptlang.org) — type safety
- [Formspree](https://formspree.io) — serverless form handling
- Google Fonts — Inter

---

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: Node 20 LTS)
- npm 9+

### Installation

```bash
# 1. Clone or download the project
cd electroloop-web

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The site will be available at `http://localhost:4321`.

### Build for production

```bash
npm run build
```

Output is generated in `./dist/`.

### Preview production build

```bash
npm run preview
```

---

## Project Structure

```
electroloop-web/
├── public/
│   ├── favicon.svg          # SVG favicon (copper on deep blue)
│   └── robots.txt           # Crawler rules
├── src/
│   ├── components/
│   │   ├── Navbar.astro     # Fixed top navbar with hamburger + lang toggle
│   │   ├── Hero.astro       # Full-viewport hero with circuit bg
│   │   ├── ValueProps.astro # 4-card "Why ElectroLoop?" section
│   │   ├── Services.astro   # 3 alternating service blocks
│   │   ├── Process.astro    # 5-step timeline (horizontal/vertical)
│   │   ├── Impact.astro     # 4 animated counter cards
│   │   ├── Sectors.astro    # 6 sector cards with hover tooltips
│   │   ├── Compliance.astro # Ley REP certifications
│   │   ├── About.astro      # Mission, team, values
│   │   ├── Contact.astro    # Formspree form + WhatsApp button
│   │   ├── Footer.astro     # Full footer with 4 columns
│   │   └── LanguageToggle.astro  # Standalone language switcher
│   ├── i18n/
│   │   ├── es.json          # Spanish translations (default)
│   │   └── en.json          # English translations
│   ├── layouts/
│   │   └── Layout.astro     # HTML shell with meta tags, scripts, Schema.org
│   ├── pages/
│   │   └── index.astro      # Main page (assembles all components)
│   └── styles/
│       └── global.css       # Brand CSS vars, animations, utilities
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
└── package.json
```

---

## Formspree Setup

The contact form uses [Formspree](https://formspree.io) for serverless submission.

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy the form ID (e.g., `xpzgkwrv`)
3. Open `src/components/Contact.astro`
4. Replace `XXXXXXXX` in the form action URL:

```html
<!-- Before -->
<form action="https://formspree.io/f/XXXXXXXX" ...>

<!-- After -->
<form action="https://formspree.io/f/xpzgkwrv" ...>
```

5. Configure your Formspree dashboard:
   - Set the notification email
   - Enable spam filtering
   - Optionally configure a redirect URL after submission

---

## WhatsApp Button

The floating WhatsApp button in `Contact.astro` needs to be updated with the real number:

```html
<!-- Find this line in Contact.astro -->
<a href="https://wa.me/56912345678?text=...">

<!-- Replace 56912345678 with the real number (country code + number, no spaces or dashes) -->
<a href="https://wa.me/56987654321?text=...">
```

---

## i18n (Language Toggle)

The site supports Spanish (default) and English. The system works as follows:

1. Both JSON files (`es.json`, `en.json`) are loaded into `window.__i18n` in `Layout.astro`
2. Every translatable element has a `data-i18n="key.path"` attribute
3. The `LanguageToggle` component dispatches a `languagechange` CustomEvent
4. `Layout.astro` listens for the event and calls `applyTranslations(lang)`
5. The selected language is persisted in `localStorage` under key `electroloop-lang`

### Adding new translations

1. Add the key/value to both `src/i18n/es.json` and `src/i18n/en.json`
2. Add `data-i18n="your.key.path"` to the HTML element

---

## Brand Customization

### Colors

Defined in `tailwind.config.cjs` and `src/styles/global.css`:

| Token         | Hex       | Usage                          |
|---------------|-----------|--------------------------------|
| `deep-blue`   | `#0B1B32` | Dominant — backgrounds, navbar |
| `copper`      | `#B97333` | Accent — CTAs, borders, icons  |
| `steel`       | `#8E9297` | Secondary text, subtle borders |
| `ceramic`     | `#F4F4F4` | Light section backgrounds      |
| `footer-dark` | `#060D1A` | Footer background              |

### Typography

Font: **Inter** (loaded from Google Fonts). Weight variants: 300, 400, 500, 600, 700, 800, 900.

To change the font, update the `@import` in `src/styles/global.css` and the `fontFamily` in `tailwind.config.cjs`.

### Logo wordmark

The logo is text-based: `ELECTRO` in white/`#0B1B32` + `LOOP` in `#B97333`. To replace with an SVG logo, edit `Navbar.astro` and `Footer.astro`.

---

## Placeholder Replacement Checklist

Before going live, replace all placeholders:

- [ ] **Formspree ID** — `Contact.astro` line: `action="https://formspree.io/f/XXXXXXXX"`
- [ ] **WhatsApp number** — `Contact.astro` line: `href="https://wa.me/56912345678"`
- [ ] **Phone number** — `Contact.astro` and `Footer.astro`: `+56 2 2345 6789`
- [ ] **Email** — `Contact.astro` and `Footer.astro`: `contacto@electroloop.cl`
- [ ] **Address** — `Contact.astro`: `Av. Del Parque 4680, Huechuraba, Santiago, Chile`
- [ ] **Google Maps embed** — `Contact.astro`: map placeholder div
- [ ] **Team members** — `About.astro`: names, roles, and avatar photos
- [ ] **Sector icons** — `Sectors.astro`: replace SVG icons with real brand logos if available
- [ ] **Impact stats** — `Impact.astro`: replace with real verified data
- [ ] **Certificate download** — `Compliance.astro`: link to real PDF certificate
- [ ] **Social media URLs** — `Footer.astro`: LinkedIn, Twitter/X, Instagram
- [ ] **OG image** — add `/public/og-image.jpg` (1200×630px) for social sharing
- [ ] **Canonical URL** — `Layout.astro`: confirm `site: 'https://electroloop.cl'` in `astro.config.mjs`
- [ ] **Schema.org data** — `Layout.astro`: update geo coordinates, opening hours

---

## Deployment

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

Or connect your Git repository to Netlify for automatic deploys on push.

Add a `netlify.toml` at the root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Or connect your repository in the Vercel dashboard. Build settings:
- Framework Preset: Astro
- Build Command: `npm run build`
- Output Directory: `dist`

### Manual / VPS

```bash
npm run build
# Upload ./dist/ to your web server (nginx, Apache, etc.)
```

---

## Environment Configuration

No environment variables are required for the base build. If you add server-side features:

Create a `.env` file at the project root (never commit this file):

```bash
# Example future variables
PUBLIC_FORMSPREE_ID=your_form_id
PUBLIC_GOOGLE_MAPS_KEY=your_key
```

Access in Astro with `import.meta.env.PUBLIC_VARIABLE_NAME`.

---

## Performance Notes

- All animations respect `prefers-reduced-motion`
- Google Fonts loaded with `display=swap` for fast initial paint
- Images: add `loading="lazy"` when replacing image placeholders
- SVG icons are inline — no extra HTTP requests
- Tailwind purges unused CSS at build time

---

## License

Proprietary — ElectroLoop SpA. All rights reserved.
