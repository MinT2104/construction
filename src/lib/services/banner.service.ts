import { Banner, HeroItem } from "@/lib/types/modules/banner.interface";
import axiosInstance from "@/lib/configs/axiosInstance";
import { bannerEndpoints } from "@/lib/endpoints/banner.endpoint";

// Cache data
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_STALE_TTL = 60 * 1000; // 1 minute - time when data is considered "stale"

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class BannerService {
  private static instance: BannerService;
  private cache: Map<string, CacheItem<any>>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): BannerService {
    if (!BannerService.instance) {
      BannerService.instance = new BannerService();
    }
    return BannerService.instance;
  }

  // Cache check and fetch data if needed
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

  // Clear cache when data changes
  private invalidateCache(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Delete by pattern
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Get all banner data (only one document expected)
  async getAllBanner(): Promise<Banner | null> {
    const cacheKey = "all-banner";

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const response = await axiosInstance.get(
            bannerEndpoints.getAllBanner
          );
          return (
            response.data.data || {
              headerBanner: "",
              heroBanner: [],
              updatedAt: new Date().toISOString(),
            }
          );
        } catch (error) {
          console.error("Error fetching banner:", error);
          return {
            headerBanner: "",
            heroBanner: [],
            updatedAt: new Date().toISOString(),
          };
        }
      },
      { staleWhileRevalidate: true }
    );
  }

  // Get just the header banner
  async getHeaderBanner(): Promise<string> {
    const cacheKey = "header-banner";

    return this.getWithCache(
      cacheKey,
      async () => {
        try {
          const banner = await this.getAllBanner();
          return banner?.headerBanner || "";
        } catch (error) {
          console.error("Error fetching header banner:", error);
          return "";
        }
      },
      { staleWhileRevalidate: true }
    );
  }

  // Update header banner
  async updateHeaderBanner(url: string): Promise<Banner | null> {
    try {
      const response = await axiosInstance.put(
        bannerEndpoints.updateHeaderBanner,
        { url }
      );

      // Invalidate cache
      this.invalidateCache();

      return response.data.data;
    } catch (error) {
      console.error("Error updating header banner:", error);
      throw error;
    }
  }

  // Get banner by ID (in this case, we only have one banner)
  async getById(): Promise<Banner | null> {
    return this.getAllBanner();
  }

  // Add a hero banner item
  async addHeroBanner(
    heroItem: Omit<HeroItem, "createdAt" | "updatedAt">
  ): Promise<Banner | null> {
    try {
      const response = await axiosInstance.post(
        bannerEndpoints.addHeroBanner,
        heroItem
      );

      // Invalidate cache
      this.invalidateCache();

      return response.data.data;
    } catch (error) {
      console.error("Error adding hero banner:", error);
      throw error;
    }
  }

  // Update a hero banner item
  async updateHeroBanner(
    id: string,
    updateData: Partial<HeroItem>
  ): Promise<Banner | null> {
    try {
      const response = await axiosInstance.put(
        bannerEndpoints.updateHeroBanner(id),
        updateData
      );

      // Invalidate cache
      this.invalidateCache();

      return response.data.data;
    } catch (error) {
      console.error(`Error updating hero banner with id ${id}:`, error);
      throw error;
    }
  }

  // Delete a hero banner item
  async deleteHeroBanner(id: string): Promise<Banner | null> {
    try {
      const response = await axiosInstance.delete(
        bannerEndpoints.deleteHeroBanner(id)
      );

      // Invalidate cache
      this.invalidateCache();

      return response.data.data;
    } catch (error) {
      console.error(`Error deleting hero banner with id ${id}:`, error);
      throw error;
    }
  }

  // Toggle hero banner visibility
  async toggleHeroBannerVisibility(id: string): Promise<Banner | null> {
    try {
      const response = await axiosInstance.patch(
        bannerEndpoints.toggleHeroBannerVisibility(id)
      );

      // Invalidate cache
      this.invalidateCache();

      return response.data.data;
    } catch (error) {
      console.error(
        `Error toggling hero banner visibility for id ${id}:`,
        error
      );
      throw error;
    }
  }

  // Create a new banner (not commonly used as we usually just update the existing one)
  async createBanner(banner: Partial<Banner>): Promise<Banner | null> {
    try {
      const response = await axiosInstance.post(
        bannerEndpoints.createBanner,
        banner
      );

      // Invalidate cache
      this.invalidateCache();

      return response.data.data;
    } catch (error) {
      console.error("Error creating banner:", error);
      throw error;
    }
  }

  // Update banner by ID
  async updateBanner(
    id: string,
    banner: Partial<Banner>
  ): Promise<Banner | null> {
    try {
      const response = await axiosInstance.put(
        bannerEndpoints.updateBanner(id),
        banner
      );

      // Invalidate cache
      this.invalidateCache();

      return response.data.data;
    } catch (error) {
      console.error(`Error updating banner with id ${id}:`, error);
      throw error;
    }
  }

  // Delete banner by ID
  async deleteBanner(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(bannerEndpoints.deleteBanner(id));

      // Invalidate cache
      this.invalidateCache();

      return true;
    } catch (error) {
      console.error(`Error deleting banner with id ${id}:`, error);
      throw error;
    }
  }
}

export const bannerService = BannerService.getInstance();
