import {
  BlogPost,
  BlogPostCreate,
  BlogPostUpdate,
  FormValues,
} from "@/lib/types/modules/blog.interface";
import axiosInstance from "@/lib/configs/axiosInstance";
import { blogEndpoints } from "@/lib/endpoints/blog.endpoint";

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

  private constructor() {}

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  async getAllBlog(query?: any): Promise<PaginatedResponse<BlogPost[]>> {
    try {
      const response: any = await axiosInstance.get(blogEndpoints.getAllBlog, {
        params: query || {},
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      // Return default empty response instead of throwing the error
      return {
        rows: [],
        total: 0,
        page: query?.page || 1,
        pageSize: query?.limit || 10,
        totalPages: 0,
      };
    }
  }

  async getPosts(categoryPath?: string): Promise<BlogPost[]> {
    try {
      const response = await axiosInstance.get(blogEndpoints.getAllBlog, {
        params: categoryPath ? { categoryPath } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }
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
  }

  async getBlogsByCategory(
    categorySlug: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<BlogPost>> {
    try {
      const response = await axiosInstance.get(
        blogEndpoints.getBlogCategory.replace(":categorySlug", categorySlug),
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
  }

  async createPost(post: FormValues): Promise<BlogPost> {
    try {
      console.log("Sending to API:", post);
      const response = await axiosInstance.post(blogEndpoints.createBlog, post);
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
    try {
      const response = await axiosInstance.get(
        blogEndpoints.getBlogById.replace(":id", id)
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching blog post with id ${id}:`, error);
      return null;
    }
  }

  async updatePost(post: BlogPostUpdate): Promise<BlogPost | null> {
    try {
      const response = await axiosInstance.put(
        blogEndpoints.updateBlog.replace(":id", post._id),
        post
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating blog post with id ${post._id}:`, error);
      return null;
    }
  }

  async updateFeatured(id: string, featured: Boolean) {
    try {
      const response = await axiosInstance.patch(
        blogEndpoints.updateFeatured.replace(":id", id),
        { featured }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating featured blog post with id ${id}:`, error);
      return null;
    }
  }

  async getBlogFeatured(): Promise<any> {
    try {
      const response = await axiosInstance.get(blogEndpoints.getBlogFeatured);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured blog posts:", error);
      return null;
    }
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      console.log(`Sending delete request for blog post with id: ${id}`);
      await axiosInstance.delete(blogEndpoints.deleteBlog.replace(":id", id));
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
}

export const blogService = BlogService.getInstance();
