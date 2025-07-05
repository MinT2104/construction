import { Banner, HeroItem } from "@/lib/types/modules/banner.interface";
import axiosInstance from "@/lib/configs/axiosInstance";
import { bannerEndpoints } from "@/lib/endpoints/banner.endpoint";

class BannerService {
  private static instance: BannerService;

  private constructor() {}

  public static getInstance(): BannerService {
    if (!BannerService.instance) {
      BannerService.instance = new BannerService();
    }
    return BannerService.instance;
  }

  // Get all banner data (only one document expected)
  async getAllBanner(): Promise<Banner | null> {
    try {
      const response = await axiosInstance.get(bannerEndpoints.getAllBanner);
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
  }

  // Get just the header banner
  async getHeaderBanner(): Promise<string> {
    try {
      const banner = await this.getAllBanner();
      return banner?.headerBanner || "";
    } catch (error) {
      console.error("Error fetching header banner:", error);
      return "";
    }
  }

  // Update header banner
  async updateHeaderBanner(url: string): Promise<Banner | null> {
    try {
      const response = await axiosInstance.put(
        bannerEndpoints.updateHeaderBanner,
        { url }
      );
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
      return response.data.data;
    } catch (error) {
      console.error("Error updating hero banner:", error);
      throw error;
    }
  }

  // Delete a hero banner item
  async deleteHeroBanner(id: string): Promise<Banner | null> {
    try {
      const response = await axiosInstance.delete(
        bannerEndpoints.deleteHeroBanner(id)
      );
      return response.data.data;
    } catch (error) {
      console.error("Error deleting hero banner:", error);
      throw error;
    }
  }

  // Toggle hero banner visibility
  async toggleHeroBannerVisibility(id: string): Promise<Banner | null> {
    try {
      const response = await axiosInstance.patch(
        bannerEndpoints.toggleHeroBannerVisibility(id)
      );
      return response.data.data;
    } catch (error) {
      console.error("Error toggling hero banner visibility:", error);
      throw error;
    }
  }

  // Create new banner (creates the first/main banner document)
  async createBanner(banner: Partial<Banner>): Promise<Banner | null> {
    try {
      const response = await axiosInstance.post(
        bannerEndpoints.createBanner,
        banner
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating banner:", error);
      throw error;
    }
  }

  // Update banner
  async updateBanner(
    id: string,
    banner: Partial<Banner>
  ): Promise<Banner | null> {
    try {
      const response = await axiosInstance.put(
        bannerEndpoints.updateBanner(id),
        banner
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  }

  // Delete banner
  async deleteBanner(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(bannerEndpoints.deleteBanner(id));
      return true;
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  }
}

export const bannerService = BannerService.getInstance();
