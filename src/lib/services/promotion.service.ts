import {
  Promotion,
  PromotionCreate,
  PromotionUpdate,
  FormValues,
} from "@/lib/types/modules/promotion.interface";
import axiosInstance from "@/lib/configs/axiosInstance";
import { blogEndpoints } from "@/lib/endpoints/blog.endpoint";
import { promotionEndpoints } from "../endpoints/promotion.endpoint";

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

  private constructor() {}

  public static getInstance(): PromotionService {
    if (!PromotionService.instance) {
      PromotionService.instance = new PromotionService();
    }
    return PromotionService.instance;
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
    try {
      const response = await axiosInstance.get(
        promotionEndpoints.getPromotionBySlug.replace(":slug", slug)
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching promotion with slug ${slug}:`, error);
      return null;
    }
  }

  async createPromotion(post: FormValues): Promise<Promotion> {
    try {
      const response = await axiosInstance.post(
        promotionEndpoints.createPromotion,
        post
      );
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
    try {
      const response = await axiosInstance.get(
        promotionEndpoints.getPromotionById.replace(":id", id)
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching promotion with id ${id}:`, error);
      return null;
    }
  }

  async updatePromotion(post: PromotionUpdate): Promise<Promotion | null> {
    try {
      const response = await axiosInstance.put(
        promotionEndpoints.updatePromotion.replace(":id", post._id),
        post
      );
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
      return response.data;
    } catch (error) {
      console.error(`Error updating featured promotion with id ${id}:`, error);
      return null;
    }
  }

  async getPromotionFeatured(): Promise<any> {
    try {
      const response = await axiosInstance.get(
        promotionEndpoints.getPromotionFeatured
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching featured promotions:", error);
      return null;
    }
  }

  async deletePromotion(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(
        promotionEndpoints.deletePromotion.replace(":id", id)
      );
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
