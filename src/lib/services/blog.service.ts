import {
  BlogPost,
  BlogPostCreate,
  BlogPostUpdate,
  FormValues,
} from "@/lib/types/modules/blog.interface";
import axiosInstance from "@/lib/configs/axiosInstance";
import { blogEndpoints } from "@/lib/endpoints/blog.endpoint";

// Cache data
const CACHE_TTL = 5 * 60 * 1000; // 5 phút
const CACHE_STALE_TTL = 60 * 1000; // 1 phút - thời gian dữ liệu được coi là "stale"

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Define pagination response interface
export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class BlogService {
  private static instance: BlogService;
  private cache: Map<string, CacheItem<any>>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  // Kiểm tra cache và thực hiện fetch dữ liệu nếu cần
  private async getWithCache<T>(
    cacheKey: string,
    fetcher: () => Promise<T>,
    options: { ttl?: number; staleWhileRevalidate?: boolean } = {}
  ): Promise<T> {
    const now = Date.now();
    const ttl = options.ttl || CACHE_TTL;
    const cached = this.cache.get(cacheKey);

    // Cache valid - return immediately
    if (cached && now - cached.timestamp < ttl) {
      return cached.data;
    }

    // Cache stale but usable - return cached data and revalidate in background
    if (cached && options.staleWhileRevalidate) {
      // Background revalidation
      this.revalidateCache(cacheKey, fetcher);
      return cached.data;
    }

    // No cache or expired - fetch fresh data
    return this.revalidateCache(cacheKey, fetcher);
  }

  // Revalidate cache and return fresh data
  private async revalidateCache<T>(
    cacheKey: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    try {
      const freshData = await fetcher();
      this.cache.set(cacheKey, {
        data: freshData,
        timestamp: Date.now(),
      });
      return freshData;
    } catch (error) {
      // If error and we have stale data, return it
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.warn(
          `Error fetching fresh data, using stale cache for ${cacheKey}`
        );
        return cached.data;
      }
      throw error;
    }
  }

  // Xóa cache khi có thay đổi dữ liệu
  private invalidateCache(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Xóa theo pattern
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  async getAllBlog(query?: any): Promise<PaginatedResponse<BlogPost[]>> {
    const cacheKey = `all-blogs-${JSON.stringify(query || {})}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response: any = await axiosInstance.get(
            blogEndpoints.getAllBlog,
            {
              params: query || {},
            }
          );
          return response.data.data;
        } catch (error) {
          console.error("Error fetching all blog posts:", error);
          return {
            rows: [],
            total: 0,
            page: query?.page || 1,
            pageSize: query?.limit || 10,
            totalPages: 0,
          };
        }
      },
      { staleWhileRevalidate: true }
    );
  }

  async getPosts(categoryPath?: string): Promise<BlogPost[]> {
    const cacheKey = `posts-${categoryPath || "all"}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(blogEndpoints.getAllBlog, {
            params: categoryPath ? { categoryPath } : undefined,
          });
          return response.data;
        } catch (error) {
          console.error("Error fetching blog posts:", error);
          throw error;
        }
      },
      { staleWhileRevalidate: true }
    );
  }

  async getPostsWithPagination(
    page: number = 1,
    limit: number = 10,
    categoryPath?: string
  ): Promise<PaginatedResponse<BlogPost>> {
    try {
      const response = await axiosInstance.get(blogEndpoints.getAllBlog, {
        params: {
          page,
          limit,
          categoryPath,
        },
      });
      return (
        response.data.data || {
          rows: [],
          total: 0,
          page,
          pageSize: limit,
          totalPages: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching paginated blog posts:", error);
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await axiosInstance.get(
        blogEndpoints.getBlogSlug.replace(":slug", slug)
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }
  }

  async getPublicPost(slug: string): Promise<BlogPost | null> {
    const cacheKey = `public-post-${slug}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            blogEndpoints.getPublicBlog.replace(":slug", slug)
          );
          return response.data;
        } catch (error) {
          console.error(
            `Error fetching public blog post with slug ${slug}:`,
            error
          );
          return null;
        }
      },
      { staleWhileRevalidate: true, ttl: 10 * 60 * 1000 } // Cache longer for public posts
    );
  }

  async getBlogsByCategory(
    categorySlug: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<BlogPost>> {
    const cacheKey = `blogs-category-${categorySlug}-${page}-${limit}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            blogEndpoints.getBlogCategory.replace(
              ":categorySlug",
              categorySlug
            ),
            {
              params: {
                page,
                limit,
              },
            }
          );
          return (
            response.data.data || {
              rows: [],
              total: 0,
              page,
              pageSize: limit,
              totalPages: 0,
            }
          );
        } catch (error) {
          console.error(
            `Error fetching blogs for category ${categorySlug}:`,
            error
          );
          return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
        }
      },
      { staleWhileRevalidate: true }
    );
  }

  async createPost(post: FormValues): Promise<BlogPost> {
    try {
      const response = await axiosInstance.post(blogEndpoints.createBlog, post);

      // Xóa cache khi tạo bài viết mới
      this.invalidateCache();

      return response.data;
    } catch (error: any) {
      console.error("Error creating blog post:", error);

      // Thông báo lỗi chi tiết hơn
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Tạo bài viết thất bại";
      throw new Error(errorMessage);
    }
  }

  async getPostById(id: string): Promise<any | null> {
    const cacheKey = `post-id-${id}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            blogEndpoints.getBlogById.replace(":id", id)
          );
          return response.data;
        } catch (error: any) {
          console.error(`Error fetching blog post with id ${id}:`, error);
          return null;
        }
      },
      { ttl: 5 * 60 * 1000 } // 5 phút cho admin content
    );
  }

  async updatePost(post: BlogPostUpdate): Promise<BlogPost | null> {
    try {
      const response = await axiosInstance.put(
        blogEndpoints.updateBlog.replace(":id", post._id),
        post
      );

      // Xóa cache khi cập nhật bài viết
      this.invalidateCache(`post-id-${post._id}`);
      // Kiểm tra và xóa cache theo slug nếu có
      const postData = post as any;
      if (postData.slug) {
        this.invalidateCache(`post-slug-${postData.slug}`);
      }
      this.invalidateCache("blogs-category");
      this.invalidateCache("all-blogs");

      return response.data;
    } catch (error) {
      console.error(`Error updating blog post with id ${post._id}:`, error);
      return null;
    }
  }

  async updateStatus(slug: string, status: string) {
    try {
      const response = await axiosInstance.patch(
        blogEndpoints.updateStatus.replace(":slug", slug),
        { status }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating status for blog post with slug ${slug}:`,
        error
      );
      return null;
    }
  }

  async updateFeatured(id: string, featured: Boolean) {
    try {
      const response = await axiosInstance.patch(
        blogEndpoints.updateFeatured.replace(":id", id),
        { featured }
      );

      // Xóa cache khi cập nhật trạng thái featured
      this.invalidateCache(`post-id-${id}`);
      this.invalidateCache("blogs-category");
      this.invalidateCache("all-blogs");

      return response.data;
    } catch (error) {
      console.error(`Error updating featured blog post with id ${id}:`, error);
      return null;
    }
  }

  async getBlogFeatured(): Promise<any> {
    const cacheKey = "blog-featured";

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            blogEndpoints.getBlogFeatured
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching featured blog posts:", error);
          return null;
        }
      },
      { staleWhileRevalidate: true, ttl: 10 * 60 * 1000 } // Cache longer for featured content
    );
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(blogEndpoints.deleteBlog.replace(":id", id));

      // Xóa cache khi xóa bài viết
      this.invalidateCache();

      return true;
    } catch (error: any) {
      console.error(`Error deleting blog post with id ${id}:`, error);

      // Thông báo lỗi chi tiết hơn
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Xóa bài viết thất bại";
      throw new Error(errorMessage);
    }
  }

  async incrementView(slug: string) {
    try {
      const response = await axiosInstance.patch(
        blogEndpoints.incrementView.replace(":slug", slug)
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error incrementing view for blog post with slug ${slug}:`,
        error
      );
      return null;
    }
  }

  async getBlogsByTag(
    tag: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<BlogPost>> {
    const cacheKey = `blogs-tag-${tag}-${page}-${limit}`;

    try {
      const response = await axiosInstance.get(
        blogEndpoints.getBlogByTag.replace(":slug", tag),
        {
          params: {
            page,
            limit,
          },
        }
      );
      return (
        response.data.data || {
          rows: [],
          total: 0,
          page,
          pageSize: limit,
          totalPages: 0,
        }
      );
    } catch (error) {
      console.error(`Error fetching blogs by tag ${tag}:`, error);
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    }
  }
}

export const blogService = BlogService.getInstance();
