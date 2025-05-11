// src/lib/types/modules/post.interface.ts

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  category: string;
  tags: string[];
  image?: string;
  readingTime?: string;
  views?: number;
  commentsCount?: number;
  slug?: string;
}
