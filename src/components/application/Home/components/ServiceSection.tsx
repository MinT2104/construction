import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { blogService } from "@/lib/services/blog.service";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import { videoService } from "@/lib/services/video.service";

// Placeholder data for blog posts - replace with your actual data source
const blogPosts = [
  {
    id: "1",
    title: "10 Xu Hướng Thiết Kế Chiếu Sáng Nội Thất Năm 2025",
    excerpt:
      "Ánh sáng đóng một vai trò quan trọng trong việc định hình không gian sống. Khám phá những xu hướng chiếu sáng mới nhất để làm mới ngôi nhà của bạn.",
    image: "/images/mock_blogs/blog_1.avif", // Replace with actual image path
    slug: "/lighting-trends-2025",
    category: "Thiết kế nội thất",
    date: "2024-07-28",
  },
  {
    id: "2",
    title: "Quy Trình Xây Dựng Nhà Phố Từ A-Z Cho Người Mới",
    excerpt:
      "Hướng dẫn chi tiết các bước cần thiết để xây dựng một ngôi nhà phố hoàn chỉnh, từ khâu chuẩn bị hồ sơ, thiết kế, thi công đến hoàn thiện.",
    image: "/images/mock_blogs/blog_2.avif", // Replace with actual image path
    slug: "/townhouse-construction-process",
    category: "Thi công xây dựng",
    date: "2024-07-25",
  },
  {
    id: "3",
    title: "Giải Pháp Thiết Kế Nhà Ống Thông Minh Tối Ưu Diện Tích",
    excerpt:
      "Khám phá những ý tưởng thiết kế sáng tạo và giải pháp thông minh giúp không gian nhà ống trở nên rộng rãi, thoáng đãng và tiện nghi hơn.",
    image: "/images/mock_blogs/blog_3.avif", // Replace with actual image path
    slug: "/smart-tube-house-design",
    category: "Thiết kế kiến trúc",
    date: "2024-07-22",
  },
  {
    id: "4",
    title: "Cải Tạo Trạm Điện Cảng Sài Gòn Hiệp Phước Công Ty M-Pacific",
    excerpt:
      "Cảng Sài Gòn Hiệp Phước, một trong những cửa ngõ giao thương hàng hải huyết mạch của khu vực phía Nam, đóng vai trò then chốt trong sự...",
    image: "/images/mock_blogs/blog_4.avif", // Replace with actual image path
    slug: "/tram-dien-hiep-phuoc",
    category: "Thiết kế kiến trúc",
    date: "2024-07-22",
  },
];

// New placeholder data for project articles
const projectArticles = [
  // For 2x2 grid (first 4)
  {
    id: "p1",
    title: "Cải Tạo Trạm Điện Cảng Sài Gòn Hiệp Phước Công Ty M-Pacific",
    excerpt:
      "Cảng Sài Gòn Hiệp Phước, một trong những cửa ngõ giao thương hàng hải huyết mạch của khu vực phía Nam, đóng vai trò then chốt trong sự...",
    image: "/images/mock_blogs/blog_1.avif", // Replace with actual image path
    slug: "/tram-dien-hiep-phuoc",
  },
  {
    id: "p2",
    title: "Hồi sinh tổ ấm: Quá trình sửa chữa nhà trọn gói Anh Hoàn ở Thủ Đức",
    excerpt:
      "Nằm yên bình trong con phố nhỏ tại TP. Thủ Đức, căn nhà 2 tầng kích thước 5x15m của gia đình anh Hoàn đã chứng kiến bao thăng...",
    image: "/images/mock_blogs/blog_2.avif", // Replace with actual image path
    slug: "/sua-nha-anh-hoan",
  },
  {
    id: "p3",
    title: "Từ cũ kỹ đến hiện đại: Hành trình cải tạo nhà Chị Thư ở Tân Bình",
    excerpt:
      "Trong con hẻm nhỏ yên bình của quận Tân Bình, ẩn mình một căn nhà phố hai tầng quen thuộc, nơi đã lưu giữ bao dấu ấn thời...",
    image: "/images/mock_blogs/blog_3.avif", // Replace with actual image path
    slug: "/cai-tao-nha-chi-thu",
  },
  {
    id: "p4",
    title: "Công trình sửa nhà Cô Nguyên trọn gói 3 tầng ở Quận 2",
    excerpt:
      "Chi phí sửa nhà 3 tầng trọn gói là bao nhiêu? Từ các hạng mục sửa chữa, Chuyên gia xây dựng hàng đầu Việt Quang Group lập kế...",
    image: "/images/mock_blogs/blog_4.avif", // Replace with actual image path
    slug: "/sua-nha-co-nguyen",
  },
  // For right list (next 5 or more)
  {
    id: "p5",
    title: "Cải tạo nâng tầng nhà 3 tầng 4x12m Anh Nghĩa ở quận Gò Vấp",
    excerpt:
      "Cải tạo nâng tầng có cần xin phép xây dựng không? Hồ sơ cần có để bắt đầu kế hoạch...",
    image: "/images/mock_blogs/blog_5.avif", // Replace with actual image path
    slug: "/nang-tang-anh-nghia",
  },
];

// Featured video data
const featuredVideos = [
  {
    id: "v1",
    title:
      "Báo giá chi phí sửa nhà diện tích 36m2 - Đơn giá sửa nhà 2025 | Trọng Hoài 0936267359",
    videoId: "3Im7cso2ZZM",
    thumbnail: "https://i.ytimg.com/vi/3Im7cso2ZZM/maxresdefault.jpg",
    duration: "24:15",
  },
  {
    id: "v2",
    title:
      "Hướng dẫn thi công văn phòng | Báo giá thi công văn phòng | Trọng Hoài 0936267359",
    videoId: "kFIN0Wd9lik",
    thumbnail: "https://i.ytimg.com/vi/3Im7cso2ZZM/maxresdefault.jpg",
    duration: "08:53",
  },
];

const handleGetFeaturedPosts = async () => {
  const featuredPosts = await blogService.getBlogFeatured();
  return featuredPosts;
};

const handleGetFeaturedVideos = async () => {
  const featuredVideos = await videoService.getTrongHoaiXayDungVideos(2);
  return featuredVideos;
};

async function ServiceSection() {
  const [featuredPosts, featuredVideos] = await Promise.all([
    handleGetFeaturedPosts(),
    handleGetFeaturedVideos(),
  ]);

  if (!featuredPosts || !featuredPosts.data) return null;

  const featuredPostsData = featuredPosts.data as BlogPost;

  console.log("featuredPostsData", featuredPostsData);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary uppercase mb-2">
            Bài viết nổi bật
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-primary w-16"></div>
            <p className="mx-4 text-muted-foreground">
              Kinh nghiệm thực tế và các giải pháp tối ưu trong lĩnh vực kiến
              trúc và xây dựng.
            </p>
            <div className="h-0.5 bg-primary w-16"></div>
          </div>
        </div>

        {/* Blog Posts Grid & Project List */}
        <div className="grid grid-cols-1 md:grid-cols-5 items-start gap-4">
          {/* Left Section with Featured Blog and Videos */}
          <div className="md:col-span-3 mb-12 md:mb-0 space-y-6">
            {/* Featured Blog Card with Overlay Text */}
            <div className="relative overflow-hidden rounded-lg h-[400px] group">
              <Link
                href={`/bai-viet/${featuredPostsData?.slug || ""}`}
                className="block absolute inset-0"
              >
                <Image
                  src={featuredPostsData?.featuredImage?.url || ""}
                  alt={featuredPostsData?.title || ""}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-3">
                    {featuredPostsData?.categories?.[0]?.name || ""}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {featuredPostsData?.title || ""}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4">
                    {featuredPostsData?.excerpt || ""}
                  </p>
                  <span className="inline-flex items-center text-white font-medium text-sm group-hover:underline">
                    Đọc thêm
                    <svg
                      className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5-5 5"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>

            {/* Featured Videos Header */}
            <div className="flex items-center pt-4 mb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                Video nổi bật
              </h3>
              <div className="ml-4 h-0.5 bg-primary/60 flex-grow"></div>
              <Link
                href="/videos"
                className="text-primary text-sm font-medium hover:underline ml-4 flex items-center"
              >
                Xem tất cả
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                </svg>
              </Link>
            </div>

            {/* Featured Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredVideos.data.videos.map((video) => (
                <Link
                  key={video.id}
                  href={`/videos/${video.id}`}
                  className="relative group rounded-lg overflow-hidden shadow-md border border-border/40 bg-card hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={video.thumbnails.high.url}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-7 h-7 text-white ml-1"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex-grow bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                    <h4 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-primary/70"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                        </svg>
                        Thời lượng: {video.duration}
                      </span>
                      <span className="text-xs font-medium text-primary flex items-center">
                        Xem video
                        <svg
                          className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Project List Section (Right) */}
          <div className="md:col-span-2">
            <div className="space-y-5">
              {projectArticles.map((project) => (
                <Link
                  href={project.slug}
                  key={project.id}
                  className="block h-full group p-4 bg-card hover:bg-accent/5 rounded-lg border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1.5">
                        {project.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {project.excerpt}
                      </p>
                      <span className="text-xs text-primary font-medium flex items-center group-hover:font-semibold">
                        Xem chi tiết
                        <svg
                          className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="default"
            className="bg-primary text-white hover:bg-primary/90 px-6 py-4 h-auto text-base font-medium"
          >
            <Link href="/services">Xem tất cả dịch vụ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ServiceSection;
