import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/posts/*', {
  eager: true,
});

const getPostImage = (filename?: string | null): ImageMetadata | undefined =>
  filename ? images[`/src/assets/posts/${filename}`]?.default : undefined;

export default getPostImage;
