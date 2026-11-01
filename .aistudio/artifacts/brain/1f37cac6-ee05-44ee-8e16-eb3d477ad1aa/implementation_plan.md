# Implementation Plan: Corner Studio — Interactive Shopfront Website

A single-page marketing website for **Corner Studio**, a web agency designing and building websites for local businesses. The entire application is self-contained in one file (`index.html`) using pure HTML, CSS, and vanilla JavaScript with zero external frameworks, libraries, or image assets. Every graphic element—including shopfront awnings, windows, doors, and shutters—is drawn purely with CSS.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1 clarification:
> - **Theme Switching**: In addition to automatic `prefers-color-scheme: dark` and `:root[data-theme=dark]`, a subtle sun/moon toggle button is integrated cleanly into the sticky header navigation.
> - **Contact Form Trigger**: Contact form submission validates inputs, prevents default submission, and immediately triggers the `mailto:` client draft with formatted business parameters without intrusive extra UI dialogs.

---

## 1. Overview & Core Concept

- **What It Does**: Presents Corner Studio's core proposition: *"Your shop is open. Your website should be too."* Visitors experience an interactive cobalt-sky street where five local shops (Rosewood Bakery, Sharp & Co. Barbershop, Bloom Florist, Quick Fix Plumbing, and Chai Corner) stand with rolled-down "NO WEBSITE" shutters. On load, the shutters roll up sequentially to reveal custom micro-websites inside their windows, while shop signs transition from CLOSED to OPEN with a neon glow. Visitors can interactively toggle individual shutters or use a master segmented switch ("Without a website" vs. "With Corner Studio").
- **Target Audience / Persona**: Local business owners (bakeries, barbers, plumbers, florists, cafés, mechanics, dentists, fitness studios) seeking modern, fast, mobile-first websites with clear upfront pricing and zero technical jargon.
- **Key Value**: Demonstrates the tangible transformation a web presence delivers—turning a shuttered storefront into a thriving, 24/7 digital hub with instant bookings, calls, and orders.

---

## 2. User Experience & Visual Design

```
┌────────────────────────────────────────────────────────────────────────┐
│  Sticky Header: "Corner Studio" Wordmark ── Links ── [Theme] [Book Call]│
├────────────────────────────────────────────────────────────────────────┤
│  Hero: Eyebrow ── "Your shop is open. Your website should be too."     │
│        Subheading (live in 7 days) ── [Book a free call] [See pricing] │
│        Trust Proof Row: ✓ You own the site · ✓ Mobile · ✓ Google       │
├────────────────────────────────────────────────────────────────────────┤
│  The Cobalt Stage:                                                    │
│  [Sun] [Clouds]                                                        │
│  [ Segmented Switch: Without a website  |  With Corner Studio ]       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Bakery   │ │ Barber   │ │ Florist  │ │ Plumber  │ │ Café     │     │
│  │ Shutter  │ │ Shutter  │ │ Shutter  │ │ Shutter  │ │ Shutter  │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│  Pavement (Patterned Curb & Walkway)                                   │
├────────────────────────────────────────────────────────────────────────┤
│  Marquee Banner: Bakeries ✦ Barbers ✦ Dentists ✦ Plumbers ✦ Salons...  │
├────────────────────────────────────────────────────────────────────────┤
│  Why a Website: 4-Column Feature Cards with Lift & Hard Shadows        │
├────────────────────────────────────────────────────────────────────────┤
│  Pricing: 3 Tiers (Starter, Highlighted Business, Growth)              │
├────────────────────────────────────────────────────────────────────────┤
│  Process: 4 Clean Editorial Milestones (01 to 04)                      │
├────────────────────────────────────────────────────────────────────────┤
│  Contact: Cobalt Island with Quick WhatsApp CTA & Minimalist Form      │
├────────────────────────────────────────────────────────────────────────┤
│  Footer: Logo, Typographic Copyright, and Safe-Area Padding            │
└────────────────────────────────────────────────────────────────────────┘
```

- **Aesthetic Direction**: Warm paper-textured editorial canvas paired with an electric cobalt brand identity. High-contrast, tactile, and typographic with zero generic AI clutter.
- **Color Palette & Theme Tokens**:
  - Light mode: `--paper: #F2EDE2`, `--card: #FBF8F1`, `--ink: #151515`, `--muted: #6B665B`, `--cobalt: #1F3FB0`, `--sun: #FFC83D`, `--rule: rgba(21,21,21,.85)`.
  - Dark mode (`prefers-color-scheme: dark` and `[data-theme="dark"]`): `--paper: #14130f`, `--card: #1d1b16`, `--ink: #F2EDE2`, `--muted: #a39d8f`, `--cobalt: #3552d6`, `--rule: rgba(242,237,226,.8)`.
  - Shop palette colors remain vibrant and preserved across both themes.
- **Typography & Hierarchy**:
  - Display & Headings: `Newsreader` (optical size 6..72, weights 400 regular & italic, fallback `Georgia`).
  - Body & Micro-Labels: `Inter Tight` (weights 500 & 600, fallback `system-ui`).
  - Monospace & Numerals: Tabular figures for pricing and metrics.
- **Component Styling & Layout**:
  - **Shop Anatomy**: CSS Container Queries (`cqw` units) ensure each shop maintains proportional layout regardless of screen width. Features include a striped awning, framed shop window, mini simulated browser window, handle bar, angled "NO WEBSITE" stamp, architectural entrance door with brass doorknob, and dynamic OPEN/CLOSED neon badge.
  - **The Street**: Flex row with hidden scrollbars, snap scrolling on mobile, centered positioning, and continuous sidewalk paving lines.
  - **Marquee**: Seamless infinite CSS translation looping local business types with cobalt stars (`✦`).
  - **Cards & Interactive Elements**: Hover elevations with tactile hard shadows (`6px 6px 0 var(--ink)`).
- **Motion & Accessibility**:
  - Staggered shutter sequence with custom cubic-bezier ease curve (`cubic-bezier(.7, 0, .2, 1)`).
  - Respects `prefers-reduced-motion: reduce` by disabling transitions and immediately revealing all content.
  - Full keyboard accessibility with focus rings and semantic ARIA states (`aria-pressed`, `aria-label`, `aria-hidden`).

---

## 3. Key Product Decisions & Trade-Offs

- **Single-File Architecture (`index.html`)**:
  - *Chosen Approach*: Deliver the complete page, embedded CSS styles, SVG icons, and vanilla JavaScript within `index.html`.
  - *Why*: Strict user prompt requirement; allows instant zero-dependency static deployment to any static host, CDN, or preview container.
- **Pure CSS Artwork (Zero Images)**:
  - *Chosen Approach*: Construct awnings, shutters, door frames, stamps, and sun/clouds via CSS gradients, container queries, and pseudo-elements.
  - *Why*: Eliminates network latency, broken image states, and external asset vulnerabilities while enabling responsive vector scaling.
- **Editable Single-Block Configuration**:
  - *Chosen Approach*: Expose all client details (`A`) and shop definitions (`S`) in a prominent `/* ===== EDIT ME ===== */` block at the beginning of the `<script>` tag.
  - *Why*: Enables rapid customization of agency contact details, turnaround times, and client portfolio items without touching core markup or scripts.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                 index.html (Single File)                    │
├─────────────────────────────────────────────────────────────┤
│  <head>: Fonts, SEO Tags, CSS Tokens, Container Queries     │
│  <header>: Sticky Navigation & Theme Switcher               │
│  <main>: Hero, Interactive Stage, Marquee, Why, Plans, Form │
│  <footer>: Agency Branding & Colophon                       │
│  <script>:                                                  │
│    ├── Config Block: A (Agency) & S (Shops)                 │
│    ├── DOM Builder: Renders Shops, Pricing, Marquee         │
│    ├── Shutter Controller & Master Segmented Slider Sync    │
│    ├── Scroll Intersection Observer (Reveal Animations)     │
│    └── Contact Form Mailto Handler                          │
└─────────────────────────────────────────────────────────────┘
```

### Data Structures (`EDIT ME` Block)

```javascript
/* ===== EDIT ME ===== */
const A = {
  name: 'Corner Studio',
  email: 'hello@yourstudio.com',
  wa: '0000000000',
  cur: '$',
  days: 7
};

const S = [
  { t: 'Rosewood Bakery', aw: '#C8553D', sg: '#2B2D42', c: '#FFF4E0', b: '#C8553D', hd: 'Fresh bread, every morning.', cta: 'Order now', st: '+42% online orders' },
  { t: 'Sharp & Co.', aw: '#15161A', sg: '#7a5c1e', c: '#E8E2D4', b: '#15161A', hd: 'A proper cut, booked in 30 seconds.', cta: 'Book a chair', st: '+58% bookings' },
  { t: 'Bloom Florist', aw: '#E8A5B5', sg: '#2F5D50', c: '#FFF1F4', b: '#2F5D50', hd: 'Flowers, delivered today.', cta: 'Shop bouquets', st: '3× more orders' },
  { t: 'Quick Fix', aw: '#F2B705', sg: '#1B2A41', c: '#FFF8DC', b: '#1B2A41', hd: 'Burst pipe? We’re on our way.', cta: 'Call now', st: '+64% calls' },
  { t: 'Chai Corner', aw: '#2F5D50', sg: '#5B2A4A', c: '#F6EFE0', b: '#5B2A4A', hd: 'Your cosy corner for chai.', cta: 'See menu', st: '+120 visits/wk' }
];
```

### Interactive State Mapping

| Action | Source Trigger | State Mutation & Effect |
| :--- | :--- | :--- |
| **Individual Shop Tap** | Shop `<button>` click / keypress | Toggles `.open` class and `aria-pressed`. Shutter slides `translateY(-102%)`. Tag changes to "OPEN" with mint glow. Re-evaluates open shop count; switches indicator if majority changed. |
| **Segment Switch Click** | "Without a website" / "With Corner Studio" | Recalculates sliding pill position (`offsetWidth`, `offsetLeft`). Staggers shutter open/close operations left-to-right at 220ms intervals. |
| **Initial Page Load** | `window.load` / DOM Ready | Mounts closed shops, positions switch instantly without transition. At 900ms, animates switch to "With Corner Studio" and cascades shutter rolls. |
| **Scroll Reveal** | `IntersectionObserver` on `.rv` elements | Adds `.in` class bringing elements to full opacity and resting translate position over 0.8s. |
| **Contact Form Submit** | Form `<form>` submit event | Prevents browser reload, validates required fields, formats URI encoded email body, and opens user's email client. |
| **Theme Toggle** | Header sun/moon button | Toggles `data-theme="dark"` / `"light"` on document root element. |
