export interface BlogPost {
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  primaryTag?: string;
  primaryTagLabel?: string;
  featureImage?: string;
  excerpt?: string;
  readingTime?: number;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  html: string;
  plaintext?: string;
}

export interface BlogPage {
  title: string;
  slug: string;
  publishedAt: string;
  featureImage?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  html: string;
}

export interface BlogTag {
  name: string;
  slug: string;
  description?: string;
  featureImage?: string;
  postCount: number;
}

export interface SiteSettings {
  title: string;
  description: string;
  navigation: { label: string; url: string }[];
  twitter?: string;
  icon?: string;
  coverImage?: string;
}
