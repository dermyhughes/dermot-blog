import { load } from 'cheerio';
import { getPostTagSlug } from '../lib/content';
import { getAllPosts, getSiteSettings } from '../lib/content-data';
import type { BlogPost } from '../lib/content-types';
import { siteUrl, withSiteUrl } from '../lib/site';
import siteConfig from '../utils/siteConfig';

export const prerender = true;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const cdata = (value: string) => `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

const generateItem = (post: BlogPost) => {
  if (post.draft || !post.publishedAt) return '';

  const fallbackPath = `/${getPostTagSlug(post)}/${post.slug}/`;
  const itemUrl = post.canonicalUrl || withSiteUrl(fallbackPath) || '';
  const html = post.html || '';
  const htmlContent = load(html, {
    decodeEntities: false,
    xmlMode: true,
  });

  const customElements: string[] = [];

  if (post.featureImage) {
    const imageUrl = withSiteUrl(`/images/posts/${post.featureImage}`) || '';
    customElements.push(`<media:content url="${escapeXml(imageUrl)}" medium="image" />`);

    htmlContent('p').first().before(`<img src="${imageUrl}" />`);
    htmlContent('img').attr('alt', post.title);
  }

  customElements.push(`<content:encoded>${cdata(htmlContent.html() || '')}</content:encoded>`);

  const categoryLabels = post.primaryTagLabel ? [post.primaryTagLabel] : post.tags;
  const categories = categoryLabels
    .map((category) => `<category>${escapeXml(category)}</category>`)
    .join('');

  return `<item>
  <title>${escapeXml(post.title)}</title>
  <description>${escapeXml(post.excerpt || '')}</description>
  <guid isPermaLink="false">${escapeXml(post.slug)}</guid>
  <link>${escapeXml(itemUrl)}</link>
  <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
  ${categories}
  ${customElements.join('')}
</item>`;
};

export async function GET() {
  const posts = await getAllPosts();
  const settings = getSiteSettings();

  const siteTitle = settings.title || 'No Title';
  const siteDescription = settings.description || 'No Description';
  const items = posts.map(generateItem).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>${escapeXml(siteTitle)}</title>
  <description>${escapeXml(siteDescription)}</description>
  <generator>astro</generator>
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
