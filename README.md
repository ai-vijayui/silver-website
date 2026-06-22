# Silver Group — React + Vite + Tailwind

Premium commercial real estate marketing website for Silver Group, Surat.

## Stack

- **React 19** + **Vite 8**
- **React Router** — client-side routing
- **Tailwind CSS v4** — design tokens
- **Section styles** — bundled site CSS for layout parity

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment variables

Copy `.env.example` to `.env`:

| Variable | Purpose |
|----------|---------|
| `VITE_WEB3FORMS_ACCESS_KEY` | Contact & brochure form submissions |
| `VITE_CALLMEBOT_API_KEY` | Optional WhatsApp alerts on form submit |
| `VITE_TOUR_URL` | 360° virtual tour embed URL |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  components/layout/   Header, Footer, Layout
  pages/               Route pages
  pages/content/       Page section markup
  config/site.js       Site constants, form & map config
  hooks/               React hooks
  lib/siteInit.js      Forms, maps, animations, interactions
  styles/site-bundle.css
public/
  images/              Static assets
```

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About Us |
| `/projects` | Silver Infinity |
| `/contact` | Contact & enquiry |
| `/virtual-tour` | 360° tour |
