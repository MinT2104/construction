import {
  Promotion,
  PromotionCreate,
  PromotionUpdate,
  FormValues,
} from "@/lib/types/modules/promotion.interface";
import axiosInstance from "@/lib/configs/axiosInstance";
import { blogEndpoints } from "@/lib/endpoints/blog.endpoint";
import { promotionEndpoints } from "../endpoints/promotion.endpoint";

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

  async getAllBlog(query?: any): Promise<PaginatedResponse<Promotion[]>> {
    const cacheKey = `all-promotions-${JSON.stringify(query || {})}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response: any = await axiosInstance.get(
            promotionEndpoints.getAllPromotion,
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

  async getPosts(categoryPath?: string): Promise<Promotion[]> {
    const cacheKey = `posts-${categoryPath || "all"}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            promotionEndpoints.getAllPromotion,
            {
              params: categoryPath ? { categoryPath } : undefined,
            }
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching promotion posts:", error);
          throw error;
        }
      },
      { staleWhileRevalidate: true }
    );
  }

  async getPromotionsWithPagination(
    page: number = 1,
    limit: number = 10,
    categoryPath?: string
  ): Promise<PaginatedResponse<Promotion>> {
    const cacheKey = `paginated-promotions-${
      categoryPath || "all"
    }-${page}-${limit}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            promotionEndpoints.getAllPromotion,
            {
              params: {
                page,
                limit,
                categoryPath,
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
          console.error("Error fetching paginated blog posts:", error);
          return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
        }
      },
      { staleWhileRevalidate: true }
    );
  }

  async getPromotionBySlug(slug: string): Promise<Promotion | null> {
    const cacheKey = `promotion-slug-${slug}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            promotionEndpoints.getPromotionBySlug.replace(":slug", slug)
          );
          return response.data.data;
        } catch (error) {
          console.error(`Error fetching promotion with slug ${slug}:`, error);
          return null;
        }
      },
      { staleWhileRevalidate: true, ttl: 10 * 60 * 1000 } // Cache longer for single posts
    );
  }

  async createPost(post: FormValues): Promise<Promotion> {
    try {
      console.log("Sending to API:", post);
      const response = await axiosInstance.post(
        promotionEndpoints.createPromotion,
        post
      );

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

  async getPromotionById(id: string): Promise<any | null> {
    const cacheKey = `promotion-id-${id}`;

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            promotionEndpoints.getPromotionById.replace(":id", id)
          );
          return response.data;
        } catch (error: any) {
          console.error(`Error fetching promotion with id ${id}:`, error);
          return null;
        }
      },
      { ttl: 5 * 60 * 1000 } // 5 phút cho admin content
    );
  }

  async updatePromotion(post: PromotionUpdate): Promise<Promotion | null> {
    try {
      const response = await axiosInstance.put(
        promotionEndpoints.updatePromotion.replace(":id", post._id),
        post
      );

      // Xóa cache khi cập nhật bài viết
      this.invalidateCache(`promotion-id-${post._id}`);
      // Kiểm tra và xóa cache theo slug nếu có
      const postData = post as any;
      if (postData.slug) {
        this.invalidateCache(`promotion-slug-${postData.slug}`);
      }
      this.invalidateCache("promotions-category");
      this.invalidateCache("all-promotions");

      return response.data;
    } catch (error) {
      console.error(`Error updating promotion with id ${post._id}:`, error);
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
      console.log(`Sending delete request for blog post with id: ${id}`);
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
}

export const blogService = BlogService.getInstance();
