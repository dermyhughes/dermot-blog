import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { load } from 'cheerio';
import { parse } from 'yaml';

const dist = new URL('../../dist/', import.meta.url);
const content = new URL('../../content/posts/', import.meta.url);
const posts = readdirSync(content)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const source = readFileSync(new URL(file, content), 'utf8');
    const [, frontmatter, html] = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    const data = parse(frontmatter);
    return { ...data, slug: file.slice(0, -3), html };
  })
  .filter((post) => !post.draft && post.publishedAt);

const pageFor = (post) =>
  load(readFileSync(new URL(`${post.primaryTag || 'blog'}/${post.slug}/index.html`, dist), 'utf8'));

const assertAsset = (src) => {
  const url = new URL(src, 'https://example.test');
  assert.ok(
    existsSync(new URL(`.${decodeURI(url.pathname)}`, dist)),
    `Missing built image: ${src}`,
  );
};

test('embedded images keep their content and reserve space while using optimised assets', () => {
  let count = 0;
  for (const post of posts) {
    const original = load(post.html);
    const $ = pageFor(post);
    const originals = original('img').toArray();
    const rendered = $('.post-full-content img').toArray();
    assert.equal(rendered.length, originals.length, post.slug);
    rendered.forEach((element, index) => {
      const image = $(element);
      assert.equal(image.attr('alt'), original(originals[index]).attr('alt'), post.slug);
      const originalImage = original(originals[index]);
      const src = originalImage.attr('src') || '';
      const managed = src.startsWith('/images/posts/') && /\.(png|jpg|jpeg|webp|avif|svg)$/i.test(src);
      if (!managed || originalImage.attr('srcset') || originalImage.parents('picture').length) {
        assert.equal(image.attr('src'), src);
        assert.equal(image.attr('srcset'), originalImage.attr('srcset'));
        return;
      }
      assert.ok(Number(image.attr('width')) > 0, post.slug);
      assert.ok(Number(image.attr('height')) > 0, post.slug);
      assert.equal(image.attr('loading'), 'lazy', post.slug);
      assert.equal(image.attr('decoding'), 'async', post.slug);
      assert.ok(image.attr('src').startsWith('/_astro/'), post.slug);
      assertAsset(image.attr('src'));
      if (!image.attr('src').endsWith('.svg')) {
        assert.ok(image.attr('src').endsWith('.webp'), post.slug);
        assert.ok(image.attr('sizes'), post.slug);
        assert.ok(image.attr('srcset'), post.slug);
        image
          .attr('srcset')
          .split(',')
          .forEach((candidate) => assertAsset(candidate.trim().split(' ')[0]));
      }
      // Public originals remain available at the URLs already used by older feeds.
      assertAsset(original(originals[index]).attr('src'));
      count += 1;
    });
  }
  assert.ok(count > 0, 'Expected embedded images in the published content');
});

test('article images get priority and feed cards defer loading', () => {
  for (const post of posts.filter((item) => item.featureImage)) {
    const image = pageFor(post)('.post-feature img');
    assert.equal(image.attr('loading'), 'eager');
    assert.equal(image.attr('fetchpriority'), 'high');
    assertAsset(image.attr('src'));
  }
  for (const route of ['index.html', 'blog/index.html', 'showcase/index.html']) {
    const $ = load(readFileSync(new URL(route, dist), 'utf8'));
    $('.post-card-image').each((_, element) => {
      assert.equal($(element).attr('loading'), 'lazy');
      assert.notEqual($(element).attr('fetchpriority'), 'high');
      assertAsset($(element).attr('src'));
    });
  }
});

test('social previews and RSS use real optimised assets and matching dimensions', () => {
  const feed = load(readFileSync(new URL('rss', dist), 'utf8'), { xmlMode: true });
  const siteOrigin = new URL(feed('channel > link').text()).origin;
  for (const post of posts.filter((item) => item.featureImage)) {
    const $ = pageFor(post);
    const image = $('meta[property="og:image"]').attr('content');
    assertAsset(image);
    assert.ok(image.includes('/_astro/'));
    assert.equal($('meta[name="twitter:image"]').attr('content'), image);
    assert.ok(Number($('meta[property="og:image:width"]').attr('content')) > 0);
    assert.ok(Number($('meta[property="og:image:height"]').attr('content')) > 0);
    const item = feed('item').filter(
      (_, element) => feed(element).find('guid').text() === post.slug,
    );
    assert.equal(item.find('media\\:content').attr('url'), image);
    const body = load(item.find('content\\:encoded').text());
    body('img').each((_, element) => {
      const src = body(element).attr('src');
      assert.ok(src.startsWith('https://') || src.startsWith('http://'), post.slug);
      if (new URL(src).origin === siteOrigin) assertAsset(src);
    });
  }
});
