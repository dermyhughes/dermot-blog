import { load } from 'cheerio';
import ghostHelpers from '@tryghost/helpers';
import type { GhostPost, GhostTag } from '../lib/ghost-types';
import { getPostTagSlug } from '../lib/content';
import { getAllPosts, getGhostSettings } from '../lib/ghost';
import { siteUrl, withSiteUrl } from '../lib/site';
import siteConfig from '../utils/siteConfig';

const tagsHelper = ghostHelpers.tags;

export const prerender = true;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const cdata = (value: string) => `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

const getPublicTagNames = (post: GhostPost) => {
  const tags = tagsHelper(post, { visibility: 'public', fn: (tag: GhostTag) => tag }) as GhostTag[];
  return tags.map((tag) => tag.name);
};

const generateItem = (post: GhostPost) => {
  const fallbackPath = `/${getPostTagSlug(post)}/${post.slug}/`;
  const itemUrl = post.canonical_url || withSiteUrl(fallbackPath) || '';
  const html = post.html || '';
  const htmlContent = load(html, {
    decodeEntities: false,
    xmlMode: true,
  });

  const customElements: string[] = [];

  if (post.feature_image) {
    customElements.push(`<media:content url="${escapeXml(post.feature_image)}" medium="image" />`);

    htmlContent('p').first().before(`<img src="${post.feature_image}" />`);
    htmlContent('img').attr('alt', post.title);
  }

  customElements.push(`<content:encoded>${cdata(htmlContent.html() || '')}</content:encoded>`);

  const categories = getPublicTagNames(post)
    .map((category) => `<category>${escapeXml(category)}</category>`)
    .join('');

  return `<item>
  <title>${escapeXml(post.title)}</title>
  <description>${escapeXml(post.excerpt || '')}</description>
  <guid isPermaLink="false">${escapeXml(post.id)}</guid>
  <link>${escapeXml(itemUrl)}</link>
  <pubDate>${post.published_at ? new Date(post.published_at).toUTCString() : ''}</pubDate>
  ${categories}
  ${customElements.join('')}
</item>`;
};

export async function GET() {
  const [settings, posts] = await Promise.all([getGhostSettings(), getAllPosts()]);

  const siteTitle = settings.title || 'No Title';
  const siteDescription = settings.description || 'No Description';
  const items = posts.map(generateItem).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>${escapeXml(siteTitle)}</title>
  <description>${escapeXml(siteDescription)}</description>
  <generator>Ghost 2.9</generator>
  <link>${escapeXml(`${siteUrl}/`)}</link>
  <atom:link href="${escapeXml(
    `${siteUrl}/rss/`,
  )}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />
  <image>
    <url>${escapeXml(withSiteUrl(`/${siteConfig.siteIcon}`) || '')}</url>
    <title>${escapeXml(siteTitle)}</title>
    <link>${escapeXml(`${siteUrl}/`)}</link>
  </image>
  <ttl>60</ttl>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=UTF-8',
    },
  });
}
