import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { load } from 'cheerio';

// Import the original files for Astro's image service while keeping their
// public URLs available for old links and readers downloading the originals.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/public/images/posts/*.{png,PNG,jpg,jpeg,webp,avif,svg}',
  { eager: true },
);

const optimizeContentImages = async (html?: string | null): Promise<string> => {
  if (!html) return '';

  const $ = load(html);
  await Promise.all(
    $('img')
      .toArray()
      .map(async (element) => {
        const $image = $(element);
        const src = $image.attr('src') || '';
        const image = images[`/public${src}`]?.default;

        // Leave remote images and author-supplied responsive/art-directed images alone.
        if (!image || $image.attr('srcset') || $image.parents('picture').length) return;

        const wide = $image.parents('.kg-width-wide').length > 0;
        const width = Math.min(image.width, wide ? 1180 : 700);
        const widths = wide ? [480, 700, 1180, 1770, 2360] : [320, 480, 700, 1050, 1400];
        const optimized = await getImage({
          src: image,
          width,
          widths: image.format === 'svg' ? undefined : widths,
          format: image.format === 'svg' ? 'svg' : 'webp',
        });

        $image.attr('src', optimized.src);
        $image.attr('width', String(optimized.attributes.width));
        $image.attr('height', String(optimized.attributes.height));
        $image.attr('loading', $image.attr('loading') || 'lazy');
        $image.attr('decoding', 'async');

        if (optimized.srcSet.attribute) {
          $image.attr('srcset', optimized.srcSet.attribute);
          $image.attr(
            'sizes',
            wide
              ? 'min(1180px, calc(100vw - 40px))'
              : 'min(700px, calc(100vw - clamp(36px, 8vw, 96px)))',
          );
        }
      }),
  );

  return $('body').html() || '';
};

export default optimizeContentImages;
