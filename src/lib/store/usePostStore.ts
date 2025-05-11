// src/lib/store/usePostStore.ts

import { create } from "zustand";
import { Post } from "@/lib/types/modules/post.interface";
import {
  fetchPostBySlug,
  fetchPostsByCategory,
} from "@/lib/services/post.service";
interface PostStore {
  posts: Post[];
  post: Post | null;
  setPosts: (posts: Post[]) => void;
  fetchPosts: (categorySlug: string) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
}

const usePostStore = create<PostStore>((set) => ({
  posts: [],
  post: null,
  setPosts: (posts: Post[]) => set({ posts }),

  fetchPosts: async (categorySlug: string) => {
    const posts = await fetchPostsByCategory(categorySlug);
    set({ posts: posts as Post[] });
  },

  fetchPostBySlug: async (slug: string) => {
    const post = await fetchPostBySlug(slug);
    set({ post: post as Post });
  },
}));

export default usePostStore;
