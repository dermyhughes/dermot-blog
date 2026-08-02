import type { BlogTag } from './content-types';

const tags: BlogTag[] = [
  {
    name: 'Blog',
    slug: 'blog',
    description: 'Thoughts, musings, and whatever else I decide to dump from my mind.',
    postCount: 12,
  },
  {
    name: 'Showcase',
    slug: 'showcase',
    description:
      "Items intended for my portfolio. Past work with clients, or just things I've experimented with and would like to show off!",
    postCount: 6,
  },
];

export default tags;
