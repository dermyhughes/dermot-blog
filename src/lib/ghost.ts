import GhostContentAPI from '@tryghost/content-api';
import fs from 'node:fs';
import path from 'node:path';
import type { GhostPage, GhostPost, GhostSettings, GhostTag } from './ghost-types';

type GhostRuntimeConfig = {
  apiUrl?: string;
  contentApiKey?: string;
};

type GhostConfigFile = {
  development?: GhostRuntimeConfig;
  production?: GhostRuntimeConfig;
};

const readGhostConfigFile = (): GhostConfigFile => {
  const configCandidates = ['.ghost.json', '.ghost'];

  return (
    configCandidates.reduce<GhostConfigFile | null>((resolvedConfig, candidate) => {
      if (resolvedConfig) {
        return resolvedConfig;
      }

      const filePath = path.join(process.cwd(), candidate);

      if (!fs.existsSync(filePath)) {
        return null;
      }

      try {
        const rawConfig = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawConfig) as GhostConfigFile;
      } catch {
        return null;
      }
    }, null) || {}
  );
};

const environment = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const fileConfig = readGhostConfigFile()[environment] || {};
const allowGhostOfflineFallback =
  process.env.NODE_ENV === 'development' || process.env.GHOST_ALLOW_OFFLINE_FALLBACK === 'true';

const apiUrl = process.env.GHOST_API_URL || fileConfig.apiUrl;
const contentApiKey = process.env.GHOST_CONTENT_API_KEY || fileConfig.contentApiKey;

if (!apiUrl || !contentApiKey || /<key>/.test(contentApiKey)) {
  throw new Error(
    'GHOST_API_URL and GHOST_CONTENT_API_KEY are required to build. Set them in Netlify environment variables or .ghost.json/.ghost.',
  );
}

const api = new GhostContentAPI({
  url: apiUrl,
  key: contentApiKey,
  version: 'v5.0',
});

const POST_INCLUDE = 'tags,authors';
const TAG_INCLUDE = 'count.posts';
const DEFAULT_GHOST_SETTINGS: GhostSettings = {
  title: 'Dermot Hughes',
  description: '',
  navigation: [],
};

let settingsPromise: Promise<GhostSettings> | null = null;
let postsPromise: Promise<GhostPost[]> | null = null;
let pagesPromise: Promise<GhostPage[]> | null = null;
let tagsPromise: Promise<GhostTag[]> | null = null;
let collisionCheckPromise: Promise<void> | null = null;
const loggedGhostFallbacks = new Set<string>();

const sortByPublishedAtDesc = <T extends { published_at?: string | null }>(entries: T[]) =>
  entries.sort((a, b) => {
    const left = a.published_at ? new Date(a.published_at).getTime() : 0;
    const right = b.published_at ? new Date(b.published_at).getTime() : 0;

    return right - left;
  });

const normalizePost = (post: GhostPost): GhostPost => ({
  ...post,
  tags: post.tags || [],
  primary_tag: post.primary_tag || null,
});

const normalizePage = (page: GhostPage): GhostPage => ({
  ...page,
});

const getErrorCode = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const maybeCode = (error as { code?: unknown }).code;
  if (typeof maybeCode === 'string') {
    return maybeCode;
  }

  const maybeCause = (error as { cause?: unknown }).cause;
  if (maybeCause && typeof maybeCause === 'object') {
    const causeCode = (maybeCause as { code?: unknown }).code;
    if (typeof causeCode === 'string') {
      return causeCode;
    }
  }

  return undefined;
};

const isRecoverableGhostNetworkError = (error: unknown) => {
  const code = getErrorCode(error);
  return (
    code === 'ENOTFOUND' || code === 'EAI_AGAIN' || code === 'ECONNREFUSED' || code === 'ETIMEDOUT'
  );
};

const logGhostFallback = (resource: string, error: unknown) => {
  if (loggedGhostFallbacks.has(resource)) {
    return;
  }

  loggedGhostFallbacks.add(resource);
  const code = getErrorCode(error);
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(
    `[ghost] Falling back to empty ${resource} because Ghost API is unreachable${
      code ? ` (${code})` : ''
    }: ${message}\n`,
  );
};

const withGhostFallback = async <T>(resource: string, fallback: T, request: () => Promise<T>) => {
  try {
    return await request();
  } catch (error) {
    if (!isRecoverableGhostNetworkError(error)) {
      throw error;
    }

    if (!allowGhostOfflineFallback) {
      throw error;
    }

    logGhostFallback(resource, error);
    return fallback;
  }
};

export const getGhostSettings = async () => {
  if (!settingsPromise) {
    settingsPromise = withGhostFallback(
      'settings',
      DEFAULT_GHOST_SETTINGS,
      () => api.settings.browse() as Promise<GhostSettings>,
    );
  }

  return settingsPromise;
};

export const getAllPosts = async () => {
  if (!postsPromise) {
    postsPromise = withGhostFallback('posts', [] as GhostPost[], async () => {
      const posts = (await api.posts.browse({
        include: POST_INCLUDE,
        limit: 'all',
        order: 'published_at desc',
        filter: 'visibility:public',
      })) as GhostPost[];

      return sortByPublishedAtDesc(posts.map(normalizePost));
    });
  }

  return postsPromise;
};

export const getAllPages = async () => {
  if (!pagesPromise) {
    pagesPromise = withGhostFallback('pages', [] as GhostPage[], async () => {
      const pages = (await api.pages.browse({
        include: POST_INCLUDE,
        limit: 'all',
        order: 'published_at desc',
        filter: 'visibility:public',
      })) as GhostPage[];

      return sortByPublishedAtDesc(pages.map(normalizePage));
    });
  }

  return pagesPromise;
};

export const getAllTags = async () => {
  if (!tagsPromise) {
    tagsPromise = withGhostFallback('tags', [] as GhostTag[], async () => {
      const tags = (await api.tags.browse({
        include: TAG_INCLUDE,
        limit: 'all',
        order: 'name asc',
        filter: 'visibility:public',
      })) as GhostTag[];

      return tags
        .filter((tag) => tag.visibility !== 'internal')
        .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    });
  }

  return tagsPromise;
};

export const getPostBySlug = async (slug: string) => {
  const posts = await getAllPosts();

  return posts.find((post) => post.slug === slug) || null;
};

export const getPageBySlug = async (slug: string) => {
  const pages = await getAllPages();

  return pages.find((page) => page.slug === slug) || null;
};

export const getTagBySlug = async (slug: string) => {
  const tags = await getAllTags();

  return tags.find((tag) => tag.slug === slug) || null;
};

export const getPostsByTagSlug = async (tagSlug: string) => {
  const posts = await getAllPosts();

  return posts.filter((post) => post.tags.some((tag) => tag.slug === tagSlug));
};

export const assertNoPageTagCollisions = async () => {
  if (!collisionCheckPromise) {
    collisionCheckPromise = Promise.all([getAllPages(), getAllTags()]).then(([pages, tags]) => {
      const pageSlugs = new Set(pages.map((page) => page.slug));
      const collisions = tags
        .map((tag) => tag.slug)
        .filter((tagSlug) => pageSlugs.has(tagSlug))
        .sort();

      if (collisions.length > 0) {
        throw new Error(
          `Ghost page/tag slug collisions detected: ${collisions.join(
            ', ',
          )}. Rename either the page slug or tag slug before building.`,
        );
      }
    });
  }

  return collisionCheckPromise;
};
