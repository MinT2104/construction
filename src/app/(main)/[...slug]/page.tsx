import { notFound } from "next/navigation";
import menuItems from "@/lib/constants/menu";
import { findMenuItemByPath } from "@/lib/utils/menu-utils";
import {
  fetchPostBySlug,
  fetchPostsByCategory,
} from "@/lib/services/post.service";
import { blogService } from "@/lib/services/blog.service";
import { videoService } from "@/lib/services/video.service";
import { promotionService } from "@/lib/services/promotion.service";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { Post } from "@/lib/types/modules/post.interface";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import {
  getAllVideosResponse,
  VideoResponse,
} from "@/lib/types/modules/video.interface";
import {
  generateBlogPostMetadata,
  generateCategoryMetadata,
  SITE_NAME,
  getVideoThumbnail,
} from "@/lib/utils/seo-utils";
import { Metadata, ResolvingMetadata } from "next";
import TAGS from "@/lib/constants/tags";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamic imports with loading fallbacks
const PageLayout = dynamic(
  () => import("@/components/application/Page/PageLayout"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 min-h-screen"></div>
    ),
  }
);

const SinglePostView = dynamic(
  () => import("@/components/application/Page/SinglePostView"),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    ),
  }
);

const CategoryView = dynamic(
  () => import("@/components/application/Page/CategoryView"),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    ),
  }
);

const HouseDesignView = dynamic(
  () => import("@/components/application/Page/HouseDesignView"),
  {
    loading: () => (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded"></div>
        ))}
      </div>
    ),
  }
);

const DefaultView = dynamic(
  () => import("@/components/application/Page/DefaultView"),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    ),
  }
);

const VideoView = dynamic(
  () => import("@/components/application/Page/VideoView"),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="aspect-video bg-gray-200 rounded"></div>
      </div>
    ),
  }
);

// Dynamic imports cho components để giảm bundle size

// Sử dụng kiểu tham số chính xác cho Next.js 14
type Props = {
  params: Promise<{ slug: string[] }>;
};

// Cấu hình ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate mỗi giờ

// Tối ưu hiệu suất với generateStaticParams
export async function generateStaticParams() {
  // Lấy các slug phổ biến để pre-render
  const popularPaths = [
    { slug: ["xay-nha", "cong-trinh-tieu-bieu"] },
    { slug: ["mau-nha-dep"] },
    { slug: ["videos"] },
  ];

  // Trả về các tham số cho các trang phổ biến
  return popularPaths;
}

// Hàm sinh metadata động
export async function generateMetadata(
  { params }: { params: { slug: string[] } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug: slugParams } = params;
  const path = `/${slugParams.join("/")}`;
  const slug = slugParams[slugParams.length - 1];

  // Nếu là bài viết
  if (slugParams.includes("bai-viet")) {
    try {
      const post = await blogService.getPostBySlug(slug);
      if (post) {
        return generateBlogPostMetadata(post, { slug });
      }
    } catch (error) {
      console.error("Error generating blog post metadata:", error);
    }
  }

  // Nếu là trang video
  if (slugParams.includes("videos") && slugParams.length > 1) {
    try {
      const videoId = slugParams[1];
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const encodedUrl = encodeURIComponent(url);
      const videoResponse = await videoService.getVideoByUrl(encodedUrl);

      if (!videoResponse || !videoResponse.data) {
        // Trả về một đối tượng Metadata hợp lệ thay vì parent
        return {
          title: `Video - ${SITE_NAME}`,
          description: `Xem video trên ${SITE_NAME}`,
        };
      }

      const thumbnailUrl = getVideoThumbnail(videoResponse.data);

      return {
        title: `${videoResponse.data.title || "Video"} - ${SITE_NAME}`,
        description:
          videoResponse.data.description ||
          `Xem video ${videoResponse.data.title || ""} trên ${SITE_NAME}`,
        openGraph: {
          type: "video.other",
          url: `https://www.youtube.com/watch?v=${videoId}`,
          title: videoResponse.data.title || "Video",
          description:
            videoResponse.data.description ||
            `Xem video ${videoResponse.data.title || ""} trên ${SITE_NAME}`,
          siteName: SITE_NAME,
          images: [
            {
              url: thumbnailUrl,
              width: 1280,
              height: 720,
              alt: videoResponse.data.title || "Video thumbnail",
            },
          ],
        },
      };
    } catch (error) {
      console.error("Error generating video metadata:", error);
      // Trả về một đối tượng Metadata hợp lệ thay vì parent
      return {
        title: `Video - ${SITE_NAME}`,
        description: `Xem video trên ${SITE_NAME}`,
      };
    }
  }

  // Trang danh mục hoặc trang thông thường
  const currentItem = findMenuItemByPath(menuItems, path) as BaseMenuItem;
  if (currentItem) {
    // Nếu là trang category hoặc single, lấy bài viết để lấy meta
    if (currentItem.type === "category" || currentItem.type === "single") {
      try {
        const categoryPosts = await blogService.getBlogsByCategory(slug, 1, 1);
        if (categoryPosts.rows.length > 0) {
          const firstPost = categoryPosts.rows[0] as BlogPost;

          // Sử dụng meta từ bài viết (cho cả single và category)
          return generateCategoryMetadata(
            currentItem.label,
            slug,
            currentItem.description,
            {
              seoTitle: firstPost.meta?.seoTitle,
              seoDescription: firstPost.meta?.seoDescription,
              canonicalUrl: firstPost.meta?.canonicalUrl,
              socialPreviewImage:
                firstPost.meta?.socialPreviewImage ||
                firstPost.featuredImage?.url,
            }
          );
        }
      } catch (error) {
        console.error("Error fetching posts for metadata:", error);
      }
    }

    // Fallback về metadata mặc định cho house-design hoặc khi không có bài viết
    return generateCategoryMetadata(
      currentItem.label,
      slug,
      currentItem.description
    );
  }

  // Nếu không tìm thấy item, tạo metadata mặc định cho đường dẫn
  return {
    title: `${
      slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")
    } - ${SITE_NAME}`,
    description: `Thông tin về ${slug.replace(/-/g, " ")} từ ${SITE_NAME}`,
  };
}

async function Page({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug: slugParams } = await params;
  const path = `/${slugParams.join("/")}`;
  const slug = slugParams[slugParams.length - 1];

  // Validate path
  if (path.includes("//") || path.includes("..") || path.length > 100) {
    notFound();
  }

  // Handle promotion
  if (slugParams.includes("khuyen-mai")) {
    return await renderPromotionPage(slugParams);
  }

  // Handle blog posts
  if (slugParams.includes("bai-viet")) {
    return await renderBlogPost(slug, slugParams);
  }

  // Handle videos
  if (slugParams.includes("videos")) {
    return await renderVideoPage(slugParams);
  }

  if (slugParams.includes("tags")) {
    return await renderTagPage(slugParams, searchParams);
  }

  // Handle other pages
  return await renderRegularPage(path, slug, slugParams, searchParams);
}

async function renderBlogPost(slug: string, slugParams: string[]) {
  const fetchedPost = await blogService.getPostBySlug(slug);

  // Tăng lượt xem cho bài viết
  try {
    await blogService.incrementView(slug);
    console.log(`Incremented view count for post: ${slug}`);
  } catch (error) {
    console.error(`Failed to increment view for post ${slug}:`, error);
  }

  if (!fetchedPost) return notFound();

  const post = { ...fetchedPost } as BlogPost;
  const categoryInfo = { isUseSidebar: true };

  const menuItemData = [
    {
      label: post.title || "",
      path: `/bai-viet/${post.slug}`,
    },
  ];

  const relatedPosts = await blogService.getBlogsByCategory(
    post.categories?.[1]?.slug || "",
    1,
    3
  );

  return (
    <PageLayout
      slug={slugParams}
      menuItems={menuItemData}
      parentMenuItem={categoryInfo}
    >
      <SinglePostView post={post} relatedPosts={relatedPosts} />
    </PageLayout>
  );
}

async function renderPromotionPage(slugParams: string[]) {
  const fetchedPost = await promotionService.getPromotionBySlug(slugParams[1]);

  if (!fetchedPost) return notFound();

  const post = { ...fetchedPost } as BlogPost;
  const categoryInfo = { isUseSidebar: true };

  const menuItemData = [
    {
      label: post.title || "",
      path: `/khuyen-mai/${post.slug}`,
    },
  ];

  return (
    <PageLayout
      slug={slugParams}
      menuItems={menuItemData}
      parentMenuItem={categoryInfo}
    >
      <SinglePostView post={post} />
    </PageLayout>
  );
}

async function renderVideoPage(slugParams: string[]) {
  // List of videos
  if (slugParams.length === 1) {
    const videoResponse: getAllVideosResponse =
      await videoService.getTrongHoaiXayDungVideos();

    const menuItemData = [{ label: "Videos", path: "/videos" }];

    return (
      <PageLayout
        slug={slugParams}
        menuItems={menuItemData}
        parentMenuItem={{ isUseSidebar: true }}
      >
        <VideoView isList={true} videoResponse={videoResponse} />
      </PageLayout>
    );
  }

  // Single video
  const videoId = slugParams[1];
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const encodedUrl = encodeURIComponent(url);

  const videoResponse: VideoResponse = await videoService.getVideoByUrl(
    encodedUrl
  );

  const menuItemData = [
    { label: "Videos", path: "/videos" },
    { label: videoResponse.data.title, path: `/videos/${videoId}` },
  ];

  return (
    <PageLayout
      slug={slugParams}
      menuItems={menuItemData}
      parentMenuItem={{ isUseSidebar: true }}
    >
      <VideoView isList={false} videoResponse={videoResponse} />
    </PageLayout>
  );
}

async function renderTagPage(
  slugParams: string[],
  searchParams?: { [key: string]: string | string[] | undefined }
) {
  const tag = slugParams[1];
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const pageSize = 3; // Default page size

  const fetchedPosts = await blogService.getBlogsByTag(tag, page, pageSize);

  if (!fetchedPosts) return notFound();

  const posts = fetchedPosts.rows.map((post: any) => ({
    ...post,
  })) as BlogPost[];

  const tagItem: BaseMenuItem = {
    label: TAGS.find((t: any) => t.slug === tag)?.name || "",
    path: `/tags/${tag}`,
    type: "category",
  };

  return (
    <PageLayout
      slug={slugParams}
      menuItems={[
        {
          label: TAGS.find((t: any) => t.slug === tag)?.name || "",
          path: `/tags/${tag}`,
        },
      ]}
      parentMenuItem={{ isUseSidebar: true }}
    >
      <CategoryView
        posts={posts}
        currentItem={tagItem}
        pagination={{
          currentPage: fetchedPosts.page,
          totalPages: fetchedPosts.totalPages,
          totalItems: fetchedPosts.total,
          pageSize: fetchedPosts.pageSize,
          path: `/tags/${tag}`,
        }}
      />
    </PageLayout>
  );
}

async function renderRegularPage(
  path: string,
  slug: string,
  slugParams: string[],
  searchParams?: { [key: string]: string | string[] | undefined }
) {
  // Find menu items
  const parentMenuItem = menuItems.find(
    (item) =>
      item.submenu?.some((subItem) => subItem.path === path) ||
      item.path === path
  );

  const currentItem = findMenuItemByPath(menuItems, path) as BaseMenuItem;

  if (!currentItem || !parentMenuItem) {
    notFound();
  }

  let pageContent;
  let menuItemData = null;

  if (currentItem.type === "single") {
    // start single
    const fetchedPost = await blogService.getBlogsByCategory(slug);

    if (!fetchedPost) return notFound();

    menuItemData = [
      {
        label: currentItem.label,
        path: currentItem.path,
      },
    ];

    const relatedPosts = await blogService.getBlogsByCategory(slug, 1, 3);

    const post = fetchedPost.rows[0] as BlogPost;
    pageContent = (
      <SinglePostView post={post || null} relatedPosts={relatedPosts} />
    );
    // end single
  } else if (
    currentItem.type === "category" &&
    !currentItem.path.includes("/mau-nha-dep")
  ) {
    // start category
    const page = searchParams?.page ? Number(searchParams.page) : 1;
    const pageSize = 10; // Default page size

    const fetchedPosts = await blogService.getBlogsByCategory(
      slug,
      page,
      pageSize
    );

    const posts = fetchedPosts.rows.map((post: any) => ({
      ...post,
    })) as BlogPost[];

    menuItemData = [
      {
        label: currentItem.label,
        path: currentItem.path,
      },
    ];

    pageContent = (
      <CategoryView
        posts={posts}
        currentItem={currentItem}
        pagination={{
          currentPage: fetchedPosts.page,
          totalPages: fetchedPosts.totalPages,
          totalItems: fetchedPosts.total,
          pageSize: fetchedPosts.pageSize,
          path: currentItem.path,
        }}
      />
    );
    // end category
  } else if (
    currentItem.type === "house-design" ||
    currentItem.path.includes("/mau-nha-dep")
  ) {
    // start house design
    const fetchedPost = await blogService.getBlogsByCategory(slug);

    if (!fetchedPost) return notFound();

    const posts = fetchedPost.rows.map((post: any) => ({
      ...post,
    })) as BlogPost[];

    menuItemData = [
      {
        label: currentItem.label,
        path: currentItem.path,
      },
    ];

    pageContent = <HouseDesignView currentItem={posts} />;
    // end house design
  } else {
    // start default
    pageContent = <DefaultView currentItem={currentItem} />;
    // end default
  }

  return (
    <PageLayout
      slug={slugParams}
      menuItems={menuItemData}
      parentMenuItem={parentMenuItem}
    >
      {pageContent}
    </PageLayout>
  );
}

export default Page;
