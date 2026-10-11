import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/posts/*', {
  eager: true,
});

const getPostImage = (filename?: string | null): ImageMetadata | undefined =>
  filename ? images[`/src/assets/posts/${filename}`]?.default : undefined;

export const getShareImage = async (filename?: string | null) => {
  const image = getPostImage(filename);
  if (!image) return undefined;

  // JPEG keeps social previews and feed images small and widely supported.
  // Astro passes SVGs through without rasterising them.
  const width = Math.min(image.width, 1000);
  return getImage({
    src: image,
    width,
    height: image.format === 'svg' ? undefined : Math.round((width * 523) / 1000),
    format: image.format === 'svg' ? 'svg' : 'jpeg',
    fit: 'cover',
  });
};

export default getPostImage;
