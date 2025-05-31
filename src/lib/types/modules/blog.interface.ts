import { z } from "zod";
import { BlogStatus, BlogValidation } from "@/lib/enums";

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  slug: string;
  excerpt?: string;
  isFeatured?: boolean;
  featuredImage?: {
    url: string;
    alt: string;
  };
  meta?: {
    seoDescription?: string;
    seoTitle?: string;
    canonicalUrl?: string;
    socialPreviewImage?: string;
  };
  categories?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  tags?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  author?: {
    _id: string;
    name: string;
    imageUrl: string;
    bio: string;
  };
  viewCount?: number;
  readingTime?: number;
}

export interface BlogPostCreate {
  title: string;
  content: string;
  status: "draft" | "published";
  excerpt?: string;
  featuredImage?: {
    url: string;
    alt: string;
  };
  meta?: {
    seoDescription?: string;
    seoTitle?: string;
    canonicalUrl?: string;
    socialPreviewImage?: string;
  };
  categories?: Array<{
    name: string;
    slug: string;
  }>;
  tags?: Array<{
    name: string;
    slug: string;
  }>;

  isFeatured?: boolean;
  publishDate?: Date;
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {
  _id: string;
}

// Helper function to strip HTML tags for validation
const stripHtml = (html: string) => {
  // Create a DOMParser to handle HTML properly
  if (typeof window !== "undefined") {
    // Client-side: use DOM APIs
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  } else {
    // Server-side: use regex (less accurate but works)
    return html.replace(/<[^>]*>/g, "");
  }
};

// Zod Schema with enhanced validation
export const formSchema = z.object({
  title: z
    .string()
    .min(
      BlogValidation.TITLE.MIN_LENGTH,
      `Tiêu đề tối thiểu ${BlogValidation.TITLE.MIN_LENGTH} ký tự`
    )
    .max(
      BlogValidation.TITLE.MAX_LENGTH,
      `Tiêu đề tối đa ${BlogValidation.TITLE.MAX_LENGTH} ký tự`
    ),
  content: z
    .string()
    .refine(
      (html) => stripHtml(html).length >= BlogValidation.CONTENT.MIN_LENGTH,
      {
        message: `Nội dung tối thiểu ${BlogValidation.CONTENT.MIN_LENGTH} ký tự (không tính mã HTML)`,
      }
    ),
  excerpt: z
    .string()
    .max(
      BlogValidation.EXCERPT.MAX_LENGTH,
      `Tóm tắt không nên quá ${BlogValidation.EXCERPT.MAX_LENGTH} ký tự`
    )
    .optional(),
  shortDescription: z
    .string()
    .min(
      BlogValidation.EXCERPT.MIN_LENGTH,
      `Mô tả ngắn tối thiểu ${BlogValidation.EXCERPT.MIN_LENGTH} ký tự`
    )
    .max(
      BlogValidation.EXCERPT.MAX_LENGTH,
      `Mô tả ngắn không nên quá ${BlogValidation.EXCERPT.MAX_LENGTH} ký tự`
    )
    .optional(),
  featuredImage: z
    .object({
      url: z.string().min(1, "Vui lòng tải lên ảnh bìa cho bài viết"),
      alt: z
        .string()
        .max(
          BlogValidation.IMAGE_ALT.MAX_LENGTH,
          `Alt ảnh nên ngắn gọn, tối đa ${BlogValidation.IMAGE_ALT.MAX_LENGTH} ký tự`
        )
        .optional(),
    })
    .optional(),
  meta: z
    .object({
      canonicalUrl: z
        .string()
        .url("Canonical URL không hợp lệ")
        .optional()
        .or(z.literal("")),
      socialPreviewImage: z
        .string()
        .url("URL ảnh preview không hợp lệ")
        .optional()
        .or(z.literal("")),
      seoDescription: z
        .string()
        .max(
          BlogValidation.SEO.DESCRIPTION_MAX_LENGTH,
          `Mô tả SEO không nên quá ${BlogValidation.SEO.DESCRIPTION_MAX_LENGTH} ký tự`
        )
        .optional(),
      seoTitle: z
        .string()
        .max(
          BlogValidation.SEO.TITLE_MAX_LENGTH,
          `Tiêu đề SEO không nên quá ${BlogValidation.SEO.TITLE_MAX_LENGTH} ký tự`
        )
        .optional(),
    })

    .optional(),
  categories: z
    .array(
      z.object({
        name: z.string(),
        slug: z.string(),
      })
    )
    .min(1, "Vui lòng chọn ít nhất một danh mục"),
  tags: z
    .array(
      z.object({
        name: z.string(),
        slug: z.string(),
      })
    )
    .min(1, "Vui lòng chọn ít nhất một thẻ"),
  status: z.enum([BlogStatus.DRAFT, BlogStatus.PUBLISHED, BlogStatus.ARCHIVED]),
  publishDate: z.date(),
  isFeatured: z.boolean(),
});

export type FormValues = z.infer<typeof formSchema>;
