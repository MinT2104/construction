import { notFound } from "next/navigation";
import menuItems from "@/lib/constants/menu";
import { findMenuItemByPath } from "@/lib/utils/menu-utils";
import {
  fetchPostBySlug,
  fetchPostsByCategory,
} from "@/lib/services/post.service";
import { blogService } from "@/lib/services/blog.service";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { Post } from "@/lib/types/modules/post.interface";
import {
  PageLayout,
  SinglePostView,
  CategoryView,
  HouseDesignView,
  DefaultView,
} from "@/components/application/Page";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import VideoView from "@/components/application/Page/VideoView";
import { videoService } from "@/lib/services/video.service";
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
    return generateCategoryMetadata(
      currentItem.label,
      slug,
      currentItem.description || ""
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

// Giữ kết quả data fetching vào memory cache
const memoryCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 phút

async function cachedFetch(key: string, fetchFn: () => Promise<any>) {
  const now = Date.now();
  const cached = memoryCache.get(key);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const data = await fetchFn();
    memoryCache.set(key, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error(`Error fetching data for key ${key}:`, error);
    // Nếu có dữ liệu cache cũ, vẫn có thể sử dụng
    if (cached) {
      return cached.data;
    }
    throw error;
  }
}

async function Page({ params }: Props) {
  const { slug: slugParams } = await params;
  const path = `/${slugParams.join("/")}`;
  const slug = slugParams[slugParams.length - 1];

  // Validate path
  if (path.includes("//") || path.includes("..") || path.length > 100) {
    notFound();
  }

  // Handle blog posts
  if (slugParams.includes("bai-viet")) {
    return await renderBlogPost(slug, slugParams);
  }

  // Handle videos
  if (slugParams.includes("videos")) {
    return await renderVideoPage(slugParams);
  }

  // Handle other pages
  return await renderRegularPage(path, slug, slugParams);
}

async function renderBlogPost(slug: string, slugParams: string[]) {
  // Sử dụng cache
  const cacheKey = `blog-post-${slug}`;
  const fetchedPost = await cachedFetch(cacheKey, () =>
    blogService.getPostBySlug(slug)
  );

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
    { label: "Trang chủ", path: "/" },
    {
      label: post.categories?.[0]?.name || "",
      path: `/bai-viet/${post.categories?.[0]?.slug}`,
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
    // Sử dụng cache
    const cacheKey = "videos-list";
    const videoResponse: getAllVideosResponse = await cachedFetch(
      cacheKey,
      () => videoService.getTrongHoaiXayDungVideos()
    );

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

  // Sử dụng cache
  const cacheKey = `video-${videoId}`;
  const videoResponse: VideoResponse = await cachedFetch(cacheKey, () =>
    videoService.getVideoByUrl(encodedUrl)
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

async function renderRegularPage(
  path: string,
  slug: string,
  slugParams: string[]
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
    // Sử dụng cache
    const cacheKey = `single-category-${slug}`;
    const fetchedPost = await cachedFetch(cacheKey, () =>
      blogService.getBlogsByCategory(slug)
    );

    if (!fetchedPost) return notFound();

    const post = fetchedPost.rows[0] as BlogPost;
    pageContent = <SinglePostView post={post || null} />;
    // end single
  } else if (
    currentItem.type === "category" &&
    !currentItem.path.includes("/mau-nha-dep")
  ) {
    // start category
    // Sử dụng cache
    const cacheKey = `category-posts-${slug}`;
    const fetchedPosts = await cachedFetch(cacheKey, () =>
      blogService.getBlogsByCategory(slug)
    );

    const posts = fetchedPosts.rows.map((post: any) => ({
      ...post,
    })) as BlogPost[];
    pageContent = <CategoryView posts={posts} currentItem={currentItem} />;
    // end category
  } else if (
    currentItem.type === "house-design" ||
    currentItem.path.includes("/mau-nha-dep")
  ) {
    // start house design
    // Sử dụng cache
    const cacheKey = `house-design-${slug}`;
    const fetchedPost = await cachedFetch(cacheKey, () =>
      blogService.getBlogsByCategory(slug)
    );

    if (!fetchedPost) return notFound();

    const posts = fetchedPost.rows.map((post: any) => ({
      ...post,
    })) as BlogPost[];
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
