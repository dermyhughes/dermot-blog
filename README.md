# Dermot Hughes Blog and Portfolio

Astro static site. Content lives in local Markdown files via Astro Content Collections — no external CMS.

## Requirements

- Node 24 (`.nvmrc` is set to `24`)
- npm 10+

## Environment Variables

Set these before running dev/build:

- `SITEURL` (optional override for canonical URLs; defaults to `https://dermothughes.com`)

## Scripts

- `npm run dev` - start Astro dev server
- `npm run build` - build static site into `dist/`
- `npm run preview` - preview production build
- `npm run check` - run Astro type/content checks
- `npm run lint` - run ESLint for JS/TS files
- `npm run test:visual:setup` - install Playwright browser binaries (Chromium + WebKit)
- `npm run test:visual` - run Playwright visual regression tests
- `npm run test:visual:update` - create/update visual snapshot baselines

## Routing

- Home: `/` and `/page/:n/`
- Posts: `/:tag/:slug/`
- Pages: `/:slug/`
- Tags: `/:tagSlug/` and `/:tagSlug/page/:n/`
- RSS: `/rss`

Pages and tags are separate content collections; a colliding slug would surface as a duplicate static-route build error.

## CV Removal Redirects

The previous CV flow has been retired:

- `/cv/` -> `/` (301)
- `/cvraw/` -> `/` (301)
- `/dermot-hughes-cv.pdf` -> `/` (301)

## Deployment (Netlify)

`netlify.toml` is configured for Astro output:

- Build command: `NODE_ENV=production npm run build`
- Publish directory: `dist/`
- Build runtime: Node `24`

Rebuilds trigger on git push — new posts are added as Markdown files in `content/posts/`.
