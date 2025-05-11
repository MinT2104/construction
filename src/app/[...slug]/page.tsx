import { notFound } from "next/navigation";
import menuItems from "@/lib/constants/menu";
import { findMenuItemByPath } from "@/lib/utils/menu-utils";
import Breadcrumb from "@/components/common/Breadcrumb";
import Sidebar from "@/components/common/Sidebar";
import {
  fetchPostBySlug,
  fetchPostsByCategory,
} from "@/lib/services/post.service";
import PostCard from "@/components/common/PostCard";
import { BaseMenuItem, MenuItemType } from "@/lib/types/common/menu.interface";
import Image from "next/image";
import { Post } from "@/lib/types/modules/post.interface";
import Link from "next/link";

// Sử dụng kiểu tham số chính xác cho Next.js 14
type Props = {
  params: Promise<{ slug: string[] }>;
};

async function Page({ params }: Props) {
  const { slug: slugParams } = await params;
  const path = `/${slugParams.join("/")}`;
  const menuItem = findMenuItemByPath(menuItems, path);

  if (!menuItem) {
    notFound();
  }

  // Find parent menu item
  const parentMenuItem = menuItems.find(
    (item) =>
      item.submenu?.some((subItem) => subItem.path === path) ||
      item.path === path
  );

  const currentItem = menuItem as BaseMenuItem;
  const slug = slugParams[slugParams.length - 1];

  const PageLayout = ({
    children,
    slug,
    menuItems,
    parentMenuItem,
  }: {
    children: React.ReactNode;
    slug: string[];
    menuItems: MenuItemType[];
    parentMenuItem?: MenuItemType;
  }) => (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb slug={slug} menuItems={menuItems} />
      <div className="flex flex-col lg:flex-row gap-6 mt-12">
        <div className="flex-grow lg:w-[70%]">{children}</div>
        {parentMenuItem?.isUseSidebar && (
          <div className="lg:w-[30%]">
            <Sidebar />
          </div>
        )}
      </div>
    </div>
  );

  // Xử lý nội dung trang dựa trên type
  let pageContent;

  if (currentItem.type === "single") {
    const post = await fetchPostBySlug(slug);
    if (!post) return notFound();

    pageContent = (
      <article className="max-w-none">
        {/* Hero section */}
        <div className="relative w-full h-[500px] mb-8">
          <Image
            src={post.image || "/images/default-post-cover.jpg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </time>
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{post.author}</span>
                    </div>
                  )}
                  {post.readingTime && (
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{post.readingTime}</span>
                    </div>
                  )}
                  {post.views && (
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{post.views} lượt xem</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="w-full">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Article content */}
              <div className="prose prose-lg prose-slate max-w-none">
                {post.content}
              </div>

              {/* Related posts section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* This would be populated with actual related posts */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src="/images/houses/house_2.avif"
                        alt="Related post"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 line-clamp-2">
                        Tổng Hợp 5 Phong Cách Thiết Kế Nội Thất Được Ưa Chuộng
                        2025
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {new Date("2025-01-01").toLocaleDateString("vi-VN")} • 5
                        phút đọc
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src="/images/houses/house_3.avif"
                        alt="Related post"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 line-clamp-2">
                        5 Sai Lầm Khi Tự Thiết Kế Nhà Mà Ai Cũng Gặp
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {new Date("2024-12-12").toLocaleDateString("vi-VN")} • 4
                        phút đọc
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src="/images/houses/house_4.avif"
                        alt="Related post"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 line-clamp-2">
                        Tối Ưu Hóa Không Gian Nhỏ Với Thiết Kế Thông Minh
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {new Date("2025-01-07").toLocaleDateString("vi-VN")} • 6
                        phút đọc
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  } else if (currentItem.type === "category") {
    const posts = await fetchPostsByCategory(slug);

    pageContent = (
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          {currentItem.label}
        </h1>
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post as Post} />
          ))}
        </div>
      </div>
    );
  } else if (
    currentItem.type === "house-design" ||
    currentItem.path.includes("/mau-nha-dep")
  ) {
    // Giả lập dữ liệu mẫu nhà đẹp
    const houseDesigns = [
      {
        title: "Nhà Phố 3 Tầng Hiện Đại",
        description:
          "Thiết kế nhà phố 3 tầng với không gian mở, tối ưu ánh sáng tự nhiên",
        image: "/images/houses/house_1.avif",
        link: "/designs/modern-house-1",
        type: "Nhà phố",
      },
      {
        title: "Biệt Thự Vườn 2 Tầng",
        description:
          "Biệt thự vườn kết hợp kiến trúc hiện đại và không gian xanh",
        image: "/images/houses/house_2.avif",
        link: "/designs/garden-villa-1",
        type: "Biệt thự",
      },
      {
        title: "Nhà Phố Mặt Tiền 5m",
        description:
          "Thiết kế thông minh cho nhà phố mặt tiền hẹp tại khu đô thị",
        image: "/images/houses/house_3.avif",
        link: "/designs/narrow-house-1",
        type: "Nhà phố",
      },
      {
        title: "Biệt Thự Nghỉ Dưỡng",
        description: "Không gian nghỉ dưỡng sang trọng với hồ bơi và sân vườn",
        image: "/images/houses/house_4.avif",
        link: "/designs/resort-villa-1",
        type: "Biệt thự",
      },
      {
        title: "Nhà Phố 4 Tầng",
        description: "Thiết kế hiện đại với không gian kinh doanh tầng trệt",
        image: "/images/houses/house_5.avif",
        link: "/designs/commercial-house-1",
        type: "Nhà phố",
      },
      {
        title: "Biệt Thự Song Lập",
        description: "Thiết kế biệt thự song lập với kiến trúc đương đại",
        image: "/images/houses/house_6.avif",
        link: "/designs/duplex-villa-1",
        type: "Biệt thự",
      },
      {
        title: "Biệt Thự Vườn Hiện Đại",
        description:
          "Biệt thự vườn kết hợp kiến trúc hiện đại và không gian xanh",
        image: "/images/houses/house_7.avif",
        link: "/designs/modern-garden-villa",
        type: "Biệt thự",
      },
      {
        title: "Căn Hộ Cao Cấp",
        description:
          "Căn hộ cao cấp với không gian thoáng đãng và thiết kế hiện đại",
        image: "/images/houses/house_8.avif",
        link: "/designs/luxury-apartment",
        type: "Căn hộ",
      },
    ];

    pageContent = (
      <div>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary uppercase mb-2">
            {currentItem.label}
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-primary w-16"></div>
            <p className="mx-4 text-muted-foreground">
              Mẫu thiết kế nhà đẹp mới nhất
            </p>
            <div className="h-0.5 bg-primary w-16"></div>
          </div>
        </div>

        {/* Pinterest-style masonry layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {houseDesigns.map((design, index) => (
            <div
              key={`${design.title}-${index}`}
              className="break-inside-avoid mb-4"
            >
              <Link
                href={design.link}
                className={`group relative block overflow-hidden rounded-xl border border-border/40 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-md ${
                  // Alternate heights for visual interest
                  index % 3 === 0
                    ? "aspect-[3/4]"
                    : index % 3 === 1
                    ? "aspect-[4/5]"
                    : "aspect-[1/1]"
                }`}
              >
                <Image
                  src={design.image}
                  alt={design.title}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Permanent overlay gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Additional hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                <span className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full text-xs backdrop-blur-sm">
                  {design.type}
                </span>

                {/* Content - Always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg mb-1 drop-shadow-md">
                    {design.title}
                  </h3>
                  <p className="text-white/90 text-sm line-clamp-2 drop-shadow-md">
                    {design.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // Default case
    pageContent = (
      <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold tracking-tight">
          {currentItem.label}
        </h1>
        <div className="mt-6">
          <p>Nội dung cho trang: {currentItem.label}</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      slug={slugParams}
      menuItems={menuItems}
      parentMenuItem={parentMenuItem}
    >
      {pageContent}
    </PageLayout>
  );
}

export default Page;
