import { getCollection } from 'astro:content';
import siteConfig from '../utils/siteConfig';
import tags from './tags';
import type { BlogPost, BlogPage, BlogTag, SiteSettings } from './content-types';

function extractPlaintext(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const getSiteSettings = (): SiteSettings => ({
  title: siteConfig.shortTitle,
  description: 'Designer. Developer. Pixel Pusher.',
  navigation: [
    { label: 'Home', url: '/' },
    { label: 'Showcase', url: '/showcase/' },
    { label: 'Blog', url: '/blog/' },
  ],
  twitter: '@DermyHughes',
  icon: siteConfig.siteIcon,
});

// ─── Posts ──────────────────────────────────────────────────────

export const getAllPosts = async (): Promise<BlogPost[]> => {
  const isPreview =
    import.meta.env.DEV || ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT || '');
  const entries = await getCollection('posts', ({ data }) => isPreview || !data.draft);
  return entries
    .map((entry) => {
      if (!isPreview && !entry.data.publishedAt) {
        throw new Error(`${entry.id}: run npm run prepare:publish before a production build.`);
      }
      const html = entry.rendered?.html ?? '';
      return {
        ...entry.data,
        slug: entry.id,
        html,
        plaintext: extractPlaintext(html),
      };
    })
    .sort((a, b) => {
      const leftUnpublished = a.draft || !a.publishedAt;
      const rightUnpublished = b.draft || !b.publishedAt;
      if (leftUnpublished !== rightUnpublished) return leftUnpublished ? -1 : 1;
      const left = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const right = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return right - left;
    });
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
};

export const getPostsByTagSlug = async (tagSlug: string): Promise<BlogPost[]> => {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.includes(tagSlug));
};

// ─── Pages ──────────────────────────────────────────────────────

export const getAllPages = async (): Promise<BlogPage[]> => {
  const entries = await getCollection('pages');
  return entries
    .map((entry) => ({
      ...entry.data,
      slug: entry.id,
      html: entry.rendered?.html ?? '',
    }))
    .sort((a, b) => {
      const left = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const right = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return right - left;
    });
};

export const getPageBySlug = async (slug: string): Promise<BlogPage | null> => {
  const pages = await getAllPages();
  return pages.find((p) => p.slug === slug) ?? null;
};

// ─── Tags ───────────────────────────────────────────────────────

export const getAllTags = async (): Promise<BlogTag[]> => tags;

export const getTagBySlug = async (slug: string): Promise<BlogTag | null> =>
  tags.find((t) => t.slug === slug) ?? null;
