import type { GhostPost, GhostTag } from './ghost-types';
import siteConfig from '../utils/siteConfig';

export const POSTS_PER_PAGE = siteConfig.postsPerPage;

export interface PaginationContext {
  previousPagePath?: string;
  nextPagePath?: string;
  humanPageNumber: number;
  numberOfPages: number;
}

export const getPostTagSlug = (post: GhostPost) => post.primary_tag?.slug || 'post';

export const getPostPath = (post: GhostPost) => `/${getPostTagSlug(post)}/${post.slug}/`;

export const getHomePagePath = (pageNumber: number) =>
  pageNumber <= 1 ? '/' : `/page/${pageNumber}/`;

export const getTagPagePath = (tagSlug: string, pageNumber: number) =>
  pageNumber <= 1 ? `/${tagSlug}/` : `/${tagSlug}/page/${pageNumber}/`;

export const getPublicTags = (tags: GhostTag[] = []) =>
  tags.filter((tag) => tag.visibility !== 'internal');

export const formatReadingTime = (post: GhostPost) => {
  if (typeof post.reading_time === 'number' && post.reading_time > 0) {
    return `${post.reading_time} min read`;
  }

  const plainText = post.plaintext || '';
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));

  return `${minutes} min read`;
};

export const paginateItems = <T>(items: T[], pageSize: number, pageNumber: number) => {
  const numberOfPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePageNumber = Math.min(Math.max(pageNumber, 1), numberOfPages);
  const startIndex = (safePageNumber - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    pageNumber: safePageNumber,
    numberOfPages,
  };
};

export const buildPaginationContext = (
  pageNumber: number,
  numberOfPages: number,
  pathBuilder: (page: number) => string,
): PaginationContext => ({
  previousPagePath: pageNumber > 1 ? pathBuilder(pageNumber - 1) : undefined,
  nextPagePath: pageNumber < numberOfPages ? pathBuilder(pageNumber + 1) : undefined,
  humanPageNumber: pageNumber,
  numberOfPages,
});
