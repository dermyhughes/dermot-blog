import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/posts' }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }).optional(),
    tags: z.array(z.string()).default([]),
    primaryTag: z.string().optional(),
    primaryTagLabel: z.string().optional(),
    featureImage: z.string().optional(),
    excerpt: z.string().optional(),
    featured: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    canonicalUrl: z.string().optional(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.string().datetime({ offset: true }),
    featureImage: z.string().optional(),
    excerpt: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const collections = { posts: postsCollection, pages: pagesCollection };
