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
- `npm run prepare:publish` - stamp ready posts that have no publication date
- `npm run test:publication` - check publication stamping, retries and deployment handling
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

## Writing and publishing posts

Start an unpublished post in `content/posts/` with `draft: true` and leave out
`publishedAt`. Drafts appear first and are labelled **Draft** when running
`npm run dev` or viewing a Netlify Deploy Preview. They are excluded from
production pages, listings, navigation, RSS and the sitemap. `npm run preview`
serves the production build, so it does not include drafts.

When a post is ready, change its frontmatter to:

```yaml
draft: false
```

Leave out `publishedAt` and merge the PR into `main`. The **Publish** GitHub
Actions workflow prepares the release: it adds one UTC timestamp to ready,
undated posts, validates and builds the site, commits those dates back to
`main`, and deploys the built files to Netlify. No one needs to type a timestamp.
Drafts can be merged into `main` without being published.

Ready posts without dates are labelled **Ready to publish** in local and Netlify
previews. They are omitted from RSS and production until the publication job
dates them. A push that changes `content/posts/` or the Publish workflow runs the
post tests and date preparation; other `main` pushes still build and deploy
application changes without running those content scripts. Use **Publish** from
the Actions UI to publish a ready post when no post file has changed, or to retry
a failed release.
Existing dated posts without a `draft` field continue to work.

The job preserves existing publication dates, including on retries and later
edits. Dates are saved only after validation and the build pass, before upload,
so a failed upload can be retried without choosing a new date. After a failed
release, rerun **Publish** on `main` from the Actions UI. Manual runs always
check out current `main`. Keep `publishedAt` when editing a published post;
`updatedAt` remains optional revision metadata.

## CV Removal Redirects

The previous CV flow has been retired:

- `/cv/` -> `/` (301)
- `/cvraw/` -> `/` (301)
- `/dermot-hughes-cv.pdf` -> `/` (301)

## Deployment (Netlify)

Production deployment is owned by `.github/workflows/publish.yml`:

- Trigger: a push to `main`, including a merged PR, or a manual run on `main`.
- Runtime: Node `24`, dependencies installed from the lockfile.
- Checks: publication tests, Astro diagnostics, lint, then the static build.
- Upload: the job sends a ZIP of `dist/` to the Netlify API, then waits for
  Netlify to confirm it is the published deploy. Netlify does not build it again.
  See Netlify's [ZIP deployment API](https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api/#zip-file-method).
- Authentication: the existing `NETLIFY_TOKEN` repository Actions secret.
- Project lookup: `dermothughes.com`; set the optional `NETLIFY_SITE_ID` Actions
  variable to a Netlify Project ID if the domain changes. The job verifies
  access before changing publication dates.

`netlify.toml` skips automatic production builds so Netlify cannot deploy ahead
of publication preparation. PR and branch previews still use Netlify's build
service. Avoid production build hooks, which bypass Netlify's ignore command;
use the Publish workflow to retry or rebuild production.

The workflow has `contents: write` permission to save date metadata. Its bot
commit uses `GITHUB_TOKEN`, which does not recursively trigger the push
workflow ([GitHub token behaviour](https://docs.github.com/en/actions/concepts/security/github_token)). If branch protection is introduced, allow the publishing bot's
metadata commit or revise the workflow before enforcing it. Publishing jobs
run one at a time, use current `main`, and skip upload if a newer commit arrived
during the build. A concurrent push can reject the date commit; in that case
the newer job prepares the complete release, without force-pushing.
