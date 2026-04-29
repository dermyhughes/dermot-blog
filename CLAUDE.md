# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Astro 5** (static site generation) with **React 18** for interactive components
- **Ghost** as headless CMS via Content API v5.0
- **TypeScript** (strict mode) with path alias `@/*` → `src/*`
- **SCSS** with CSS variables for theming; no CSS-in-JS

## Environment Variables

Required before running dev or build:

```
GHOST_API_URL=https://blog.dermothughes.com
GHOST_CONTENT_API_KEY=<key>
SITEURL=https://dermothughes.com          # optional, used for canonical URLs
GHOST_ALLOW_OFFLINE_FALLBACK=true         # optional, allows build when Ghost unreachable (dev mode enables this automatically)
```

Alternatively, create a `.ghost.json` (or `.ghost`) file in the project root with `development` / `production` keys — `ghost.ts` reads this as a fallback to env vars:

```json
{
  "development": { "apiUrl": "...", "contentApiKey": "..." },
  "production":  { "apiUrl": "...", "contentApiKey": "..." }
}
```

## Commands

```bash
npm run dev              # start Astro dev server
npm run build            # build static site into dist/
npm run preview          # preview production build locally
npm run check            # Astro type/content checks
npm run lint             # ESLint on src/**/*.{js,jsx,ts,tsx,json}
npm run lint:fix         # auto-fix ESLint issues
npm run format           # Prettier format
npm run test:visual:setup   # install Playwright Chromium + WebKit
npm run test:visual         # run visual regression tests (requires preview server)
npm run test:visual:update  # update snapshot baselines
```

Visual tests run against `http://127.0.0.1:4173`. Run `npm run preview` in a separate terminal before running visual tests. There are no unit tests — only visual regression with Playwright.

## Architecture

### Routing

File-based Astro routing maps to Ghost content:

| Route | File | Content |
|---|---|---|
| `/` and `/page/:n/` | `pages/index.astro`, `pages/page/[page].astro` | Paginated posts |
| `/:tag/:slug/` | `pages/[tag]/[slug].astro` | Individual posts |
| `/:slug/` | `pages/[slug].astro` | Ghost pages **or** tag archives |
| `/:slug/page/:n/` | `pages/[slug]/page/[page].astro` | Paginated tag archives |

`pages/[slug].astro` detects at build time whether a slug belongs to a Ghost page or a tag. Build fails if a Ghost page slug collides with a Ghost tag slug.

All URLs use trailing slashes (enforced in `astro.config.mjs`).

### Data Layer

`src/lib/ghost.ts` — Ghost API client. All API calls are cached at module level using promises, so each data type is fetched once per build. Dev mode allows builds to proceed when Ghost is unreachable (returns empty arrays).

`src/lib/content.ts` — Pagination helpers, post path builders, reading time calculator.

`src/lib/site.ts` — Canonical URL construction from `SITEURL`.

### Component Organisation

```
src/
├── pages/          # Astro routing (thin, delegate to ui/ components)
├── components/     # Legacy shims only — re-export from ui/ for backwards compat; do not add new components here
├── ui/             # All UI lives here — add new components in the appropriate subdirectory
│   ├── foundations/   # Design tokens (tokens.scss), reset, base typography, Koenig editor styles
│   ├── layout/        # SiteHeader, SiteFooter, SiteBanner, TagHeader, ArticleContent
│   ├── navigation/    # Navigation (Astro), ThemeToggle (React), SocialLinks
│   ├── posts/         # PostFeed, PostCard, PostArticle
│   └── pagination/    # Pagination component
├── lib/            # Business logic, Ghost API, types
└── utils/          # Theme management, site config helpers
```

Pages are thin — they call Ghost API functions and pass data down to `ui/` components.

Only `ThemeToggle` uses React (`client:load`). Everything else is Astro or plain HTML/SCSS.

An RSS feed is generated at build time via `src/pages/rss.ts`.

### Theming

Theme (light/dark) is stored in `localStorage` under the key `preferred-theme` and applied as `data-theme` on `<html>`. An inline script in the `<head>` sets the attribute before first paint to prevent FOUC. CSS variables for both themes live in `src/ui/foundations/tokens.scss`.

### Styling Conventions

- SCSS modules (`.module.scss`) for component-scoped styles
- Design tokens as CSS custom properties defined in `tokens.scss` — use these rather than hardcoded values
- Responsive breakpoints: `980px` (tablet) and `680px` (mobile)
- Spacing scale: `3xs` (0.25rem) through `4xl` (8rem)

### Deployment

Netlify builds with `NODE_ENV=production npm run build`, publishing `dist/`. Ghost webhooks trigger Netlify rebuilds on content changes.

## Agent skills

### Issue tracker

Issues tracked via GitHub Issues using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

All five canonical labels use their default names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` at the repo root with `docs/adr/` for architectural decisions. See `docs/agents/domain.md`.