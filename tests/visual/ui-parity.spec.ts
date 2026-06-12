import { expect, test } from '@playwright/test';

type RouteTarget = {
  path: string;
  optional?: boolean;
};

const ensureTrailingSlash = (path: string) => {
  if (path === '/') {
    return '/';
  }

  return `${path.replace(/\/+$/, '')}/`;
};

const slugifyRoute = (path: string) => {
  if (path === '/') {
    return 'home';
  }

  return ensureTrailingSlash(path)
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\//g, '__');
};

const discoverTargets = async (page: import('@playwright/test').Page): Promise<RouteTarget[]> => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const firstPostHref = process.env.VISUAL_POST_ROUTE || (await page.locator('a.post-card').first().getAttribute('href'));

  if (!firstPostHref) {
    throw new Error('Unable to discover a post route. Set VISUAL_POST_ROUTE.');
  }

  const normalizedPostHref = ensureTrailingSlash(firstPostHref);
  const postMatch = normalizedPostHref.match(/^\/([^/]+)\/([^/]+)\/$/);

  if (!postMatch) {
    throw new Error(
      `Discovered post route '${normalizedPostHref}' does not match '/:tag/:slug/'. Set VISUAL_POST_ROUTE.`,
    );
  }

  const tagSlug = postMatch[1];
  const tagRoute = ensureTrailingSlash(process.env.VISUAL_TAG_ROUTE || `/${tagSlug}/`);
  const tagPageTwoRoute = ensureTrailingSlash(process.env.VISUAL_TAG_PAGE2_ROUTE || `${tagRoute}page/2/`);

  const oneSegmentNavHref = process.env.VISUAL_PAGE_ROUTE
    ? ensureTrailingSlash(process.env.VISUAL_PAGE_ROUTE)
    : ensureTrailingSlash(
        (
          await page
            .locator("a.site-nav-item[href^='/']")
            .evaluateAll((nodes) => nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href') || ''))
        ).find((href) => {
          const normalizedHref = href.endsWith('/') ? href : `${href}/`;
          const parts = normalizedHref.split('/').filter(Boolean);

          return (
            normalizedHref !== '/' &&
            !normalizedHref.startsWith('/page/') &&
            parts.length === 1 &&
            normalizedHref !== tagRoute
          );
        }) || '/'
      );

  return [
    { path: '/' },
    { path: '/page/2/', optional: true },
    { path: tagRoute },
    { path: tagPageTwoRoute, optional: true },
    { path: normalizedPostHref },
    { path: oneSegmentNavHref },
    { path: '/404/' },
  ];
};

test('captures route parity screenshots', async ({ page }, testInfo) => {
  await page.route('https://source.unsplash.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"></svg>',
    });
  });

  // The 404 page fetches a random cat — pin it for deterministic snapshots.
  await page.route('https://api.thecatapi.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="480"%3E%3Crect width="640" height="480" fill="%23241a3d"/%3E%3C/svg%3E',
          width: 640,
          height: 480,
        },
      ]),
    });
  });

  const targets = await discoverTargets(page);

  for (const target of targets) {
    const response = await page.goto(target.path);

    if (!response) {
      throw new Error(`No response while loading route ${target.path}`);
    }

    if (response.status() >= 400) {
      if (target.optional) {
        testInfo.annotations.push({
          type: 'skip-optional-route',
          description: `${target.path} returned ${response.status()}`,
        });
        continue;
      }

      throw new Error(`Route ${target.path} returned HTTP ${response.status()}`);
    }

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot(`${slugifyRoute(target.path)}.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  }
});
