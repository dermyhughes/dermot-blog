import type { GhostPost } from './ghost-types';

/* view-transition-name must be a valid CSS custom-ident; the prefix
   keeps names starting with a letter even for numeric slugs. */
const getPostTransitionName = (post: GhostPost) =>
  `post-media-${post.slug.replace(/[^a-zA-Z0-9_-]/g, '')}`;

export default getPostTransitionName;
