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

class PromotionService {
  private static instance: PromotionService;
  private cache: Map<string, CacheItem<any>>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): PromotionService {
    if (!PromotionService.instance) {
      PromotionService.instance = new PromotionService();
    }
    return PromotionService.instance;
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

  async getPromotionsWithPagination(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Promotion>> {
    try {
      const response = await axiosInstance.get(
        promotionEndpoints.getAllPromotion,
        {
          params: {
            page,
            limit,
          },
        }
      );
      return (
        response.data.data ||
        ({
          rows: [],
          total: 0,
          page,
          pageSize: limit,
          totalPages: 0,
        } as PaginatedResponse<Promotion[]>)
      );
    } catch (error) {
      console.error("Error fetching paginated blog posts:", error);
      return { rows: [], total: 0, page, pageSize: limit, totalPages: 0 };
    }
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

  async createPromotion(post: FormValues): Promise<Promotion> {
    try {
      const response = await axiosInstance.post(
        promotionEndpoints.createPromotion,
        post
      );

      // Xóa cache khi tạo bài viết mới
      this.invalidateCache();

      return response.data;
    } catch (error: any) {
      console.error("Error creating promotion:", error);

      // Thông báo lỗi chi tiết hơn
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Tạo khuyến mãi thất bại";
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
        promotionEndpoints.updateFeatured.replace(":id", id),
        { featured }
      );

      // Xóa cache khi cập nhật trạng thái featured
      this.invalidateCache(`promotion-id-${id}`);
      this.invalidateCache("promotions-category");
      this.invalidateCache("all-promotions");

      return response.data;
    } catch (error) {
      console.error(`Error updating featured promotion with id ${id}:`, error);
      return null;
    }
  }

  async getPromotionFeatured(): Promise<any> {
    const cacheKey = "promotion-featured";

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            promotionEndpoints.getPromotionFeatured
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching featured promotion posts:", error);
          return null;
        }
      },
      { staleWhileRevalidate: true, ttl: 10 * 60 * 1000 } // Cache longer for featured content
    );
  }

  async deletePromotion(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(
        promotionEndpoints.deletePromotion.replace(":id", id)
      );

      // Xóa cache khi xóa bài viết
      this.invalidateCache();

      return true;
    } catch (error: any) {
      console.error(`Error deleting promotion with id ${id}:`, error);

      // Thông báo lỗi chi tiết hơn
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Xóa khuyến mãi thất bại";
      throw new Error(errorMessage);
    }
  }
}

export const promotionService = PromotionService.getInstance();
