# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Astro 5** (static site generation) with **React 18** for interactive components
- Content lives in local Markdown files via **Astro Content Collections** — no external CMS
- **TypeScript** (strict mode) with path alias `@/*` → `src/*`
- **SCSS** with CSS variables for theming; no CSS-in-JS

## Environment Variables

```
SITEURL=https://dermothughes.com          # optional, used for canonical URLs
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

File-based Astro routing maps to local content:

| Route | File | Content |
|---|---|---|
| `/` and `/page/:n/` | `pages/index.astro`, `pages/page/[page].astro` | Paginated posts |
| `/:tag/:slug/` | `pages/[tag]/[slug].astro` | Individual posts |
| `/:slug/` | `pages/[slug].astro` | Pages **or** tag archives |
| `/:slug/page/:n/` | `pages/[slug]/page/[page].astro` | Paginated tag archives |

`pages/[slug].astro` detects at build time whether a slug belongs to a page or a tag, from two separate content collections — a collision would surface as a duplicate static-route build error.

All URLs use trailing slashes (enforced in `astro.config.mjs`).

### Data Layer

`content/posts/*.md` and `content/pages/*.md` — Markdown source, frontmatter + pre-rendered HTML body, defined by the collections in `src/content.config.ts`.

`src/lib/content-data.ts` — Reads the content collections. All post/page reads are re-derived per call (Astro caches collection reads internally), sorted newest-first. `getAllTags()`/`getTagBySlug()` read from the static `src/lib/tags.ts` list rather than a collection.

`src/lib/content.ts` — Pagination helpers, post path builders, reading time calculator.

`src/lib/enhance-content.ts` — Build-time enrichment of post/page HTML (cheerio): heading ids + anchor links + TOC extraction, hardened external links, code blocks wrapped in copyable "code frames". Applied in `PostArticle` (posts, with TOC) and `ArticleContent` (pages).

`src/lib/post-images.ts` — Resolves a feature-image filename to its `src/assets/posts/` module via `import.meta.glob`, for Astro's `<Image>` component (WebP, responsive `srcset`). Inline body images referenced in post HTML live in `public/images/posts/` instead — `set:html` content can't use `<Image>`, so those render at original resolution.

`src/lib/site.ts` — Canonical URL construction from `SITEURL`.

### Component Organisation

```
src/
├── pages/          # Astro routing (thin, delegate to ui/ components; import via @/ alias)
├── ui/             # All UI lives here — add new components in the appropriate subdirectory
│   ├── foundations/   # Design tokens (tokens.scss), reset, base typography, Koenig editor styles
│   ├── styles/        # Shared SCSS partials: cross-component mixins + style contracts included by components
│   ├── icons/         # Icon component with the inline-SVG registry
│   ├── layout/        # Layout, SiteHeader, SiteFooter, SiteBanner, TagHeader, ArticleContent, PostArticle
│   ├── meta/          # MetaData (head tags, OpenGraph/Twitter, JSON-LD)
│   ├── navigation/    # Navigation (Astro), ThemeToggle (React), SocialLinks
│   ├── posts/         # PostFeed, PostCard
│   └── pagination/    # Pagination component
├── lib/            # Business logic, content data layer, types
└── utils/          # Theme management, site config helpers
```

Pages are thin — they call content-data functions and pass data down to `ui/` components. Components are imported directly by file path (no barrel); pages use the `@/` alias.

Shared visual patterns live in `src/ui/styles/_mixins.scss` (`raised-card` for the lifting card surface, `chromatic-ghosts` for the pink/cyan text-ghost effect) — extend those rather than re-implementing the pattern in a component. Shared formatting helpers (`formatPostDate`, `padIndex`) live in `src/lib/content.ts`. Inline SVGs are registered once in `src/ui/icons/Icon.astro`.

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

Netlify builds with `NODE_ENV=production npm run build`, publishing `dist/`. Rebuilds trigger on git push — new posts are added as Markdown files in `content/posts/`.

## Agent skills

### Issue tracker

Issues tracked via GitHub Issues using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

All five canonical labels use their default names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` at the repo root with `docs/adr/` for architectural decisions. See `docs/agents/domain.md`.