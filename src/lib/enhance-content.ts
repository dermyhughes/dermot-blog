import { load } from 'cheerio';
import { buildGhostSrcset } from './images';
import { siteUrl } from './site';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface EnhancedContent {
  html: string;
  toc: TocEntry[];
}

const CONTENT_IMAGE_SIZES = '(max-width: 720px) 100vw, 720px';

const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';

const mergeRel = (existing: string | undefined, additions: string[]) => {
  const tokens = new Set((existing || '').split(/\s+/).filter(Boolean));
  additions.forEach((token) => tokens.add(token));
  return Array.from(tokens).join(' ');
};

const SITE_ORIGIN = new URL(`${siteUrl}/`).origin;

/* Origin comparison, not prefix — a lookalike host such as
   https://example.com.evil.tld would pass a startsWith(siteUrl) test.
   Unparseable absolute URLs are treated as external so they still
   get hardened. */
const isExternalUrl = (href: string) => {
  if (!/^https?:\/\//i.test(href)) {
    return false;
  }

  try {
    return new URL(href).origin !== SITE_ORIGIN;
  } catch {
    return true;
  }
};

/**
 * Build-time enrichment of Ghost HTML: anchored headings + TOC data,
 * lazy responsive images, hardened external links, and code blocks
 * wrapped in a terminal-style frame with a copy affordance.
 */
export const enhanceContent = (html?: string | null): EnhancedContent => {
  if (!html) {
    return { html: '', toc: [] };
  }

  const $ = load(html);
  const toc: TocEntry[] = [];
  const usedIds = new Set<string>();

  const claimId = (candidate: string) => {
    let id = candidate;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${candidate}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);
    return id;
  };

  $('h2, h3').each((_, element) => {
    const $heading = $(element);
    const text = $heading.text().replace(/\s+/g, ' ').trim();

    if (!text) {
      return;
    }

    const id = claimId($heading.attr('id') || slugifyHeading(text));
    $heading.attr('id', id);

    const level = element.tagName.toLowerCase() === 'h2' ? 2 : 3;
    toc.push({ id, text, level });

    const anchor = $('<a class="heading-anchor" aria-hidden="true" tabindex="-1">#</a>').attr(
      'href',
      `#${id}`,
    );
    $heading.append(anchor);
  });

  $('img').each((_, element) => {
    const $image = $(element);

    if (!$image.attr('loading')) {
      $image.attr('loading', 'lazy');
    }

    $image.attr('decoding', 'async');

    const src = $image.attr('src');

    if (src && !$image.attr('srcset')) {
      const srcset = buildGhostSrcset(src);

      if (srcset) {
        $image.attr('srcset', srcset);
        $image.attr('sizes', $image.attr('sizes') || CONTENT_IMAGE_SIZES);
      }
    }
  });

  $('a[href]').each((_, element) => {
    const $link = $(element);
    const href = $link.attr('href') || '';

    if (isExternalUrl(href)) {
      $link.attr('target', '_blank');
      $link.attr('rel', mergeRel($link.attr('rel'), ['noopener', 'noreferrer']));
    }
  });

  $('pre').each((_, element) => {
    const $pre = $(element);

    if ($pre.parents('.code-frame').length > 0) {
      return;
    }

    const classAttr = `${$pre.attr('class') || ''} ${$pre.children('code').attr('class') || ''}`;
    const langMatch = classAttr.match(/language-([\w-]+)/);
    const lang = langMatch ? langMatch[1] : 'code';

    $pre.wrap('<div class="code-frame"></div>');
    $pre.before(
      `<div class="code-frame-bar">` +
        `<span class="code-frame-dots" aria-hidden="true"><i></i><i></i><i></i></span>` +
        `<span class="code-frame-lang">${lang}</span>` +
        `<button type="button" class="code-frame-copy" aria-label="Copy code to clipboard">copy</button>` +
        `</div>`,
    );
  });

  return { html: $('body').html() || '', toc };
};
