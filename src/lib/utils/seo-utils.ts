import type { Metadata, ResolvingMetadata } from "next";
import { BlogPost } from "@/lib/types/modules/blog.interface";

export const SITE_NAME = "Kiến Tạo Nhà Đẹp";
export const SITE_DESCRIPTION =
  "Xây dựng nhà ở đẹp, chất lượng cao, đáp ứng nhu cầu sống của gia đình bạn";
export const SITE_URL = "https://kientaonhadep.vn";

// Tạo metadata mặc định
export function generateDefaultMetadata(): Metadata {
  return {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      url: SITE_URL,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

// Tạo metadata cho bài viết
export function generateBlogPostMetadata(
  post: BlogPost,
  params: { slug: string }
): Metadata {
  const postUrl = `${SITE_URL}/bai-viet/${post.slug}`;
  const title = post.meta?.seoTitle || post.title;
  const description =
    post.meta?.seoDescription || post.excerpt || SITE_DESCRIPTION;
  const ogImage =
    post.meta?.socialPreviewImage ||
    post.featuredImage?.url ||
    `${SITE_URL}/og-image.jpg`;

  return {
    title: title,
    description: description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "article",
      url: postUrl,
      title: title,
      description: description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      section: post.categories?.[0]?.name,
      tags: post.tags?.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
    },
    alternates: {
      canonical: post.meta?.canonicalUrl || postUrl,
    },
  };
}

// Tạo metadata cho trang chuyên mục
export function generateCategoryMetadata(
  categoryName: string,
  categorySlug: string,
  description?: string
): Metadata {
  const categoryUrl = `${SITE_URL}/${categorySlug}`;
  const title = `${categoryName} - ${SITE_NAME}`;
  const categoryDescription =
    description || `Các bài viết về ${categoryName} từ ${SITE_NAME}`;

  return {
    title: title,
    description: categoryDescription,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      url: categoryUrl,
      title: title,
      description: categoryDescription,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: categoryName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: categoryDescription,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}

// Thêm hàm xử lý URL thumbnail video
export function getVideoThumbnail(videoData: any): string {
  if (!videoData) return `${SITE_URL}/og-image.jpg`;

  // Kiểm tra các cấu trúc có thể của thumbnail
  if (videoData.thumbnail) return videoData.thumbnail;
  if (videoData.thumbnails?.maxres?.url) return videoData.thumbnails.maxres.url;
  if (videoData.thumbnails?.high?.url) return videoData.thumbnails.high.url;
  if (videoData.thumbnails?.default?.url)
    return videoData.thumbnails.default.url;

  // Tạo URL thumbnail từ videoId nếu có
  if (videoData.videoId)
    return `https://img.youtube.com/vi/${videoData.videoId}/hqdefault.jpg`;

  return `${SITE_URL}/og-image.jpg`;
}
