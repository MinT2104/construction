import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

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
    duration: "24:15",
  },
  {
    id: "v2",
    title:
      "Hướng dẫn thi công văn phòng | Báo giá thi công văn phòng | Trọng Hoài 0936267359",
    videoId: "kFIN0Wd9lik",
    duration: "08:53",
  },
];

function ServiceSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary uppercase mb-2">
            Hạng mục dịch vụ kiến trúc và xây dựng
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
              <Link href={blogPosts[0].slug} className="block absolute inset-0">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-3">
                    {blogPosts[0].category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {blogPosts[0].title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4">
                    {blogPosts[0].excerpt}
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
              {featuredVideos.map((video) => (
                <div
                  key={video.id}
                  className="relative group rounded-lg overflow-hidden shadow-md border border-border/40 bg-card hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}?rel=0&showinfo=0&modestbranding=1`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    ></iframe>
                  </div>
                  <div className="p-3 sm:p-4 flex-grow bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                    <h4 className="font-medium text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
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
                        {video.duration}
                      </span>
                      <Link
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary hover:underline flex items-center"
                      >
                        Xem trên YouTube
                        <svg
                          className="w-3 h-3 ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project List Section (Right) */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {" "}
              {/* Using space-y for vertical list items */}
              {projectArticles.map((project) => (
                <Link
                  href={project.slug}
                  key={project.id}
                  className="block group p-3 sm:p-4 bg-card rounded-lg border border-border transition-all duration-300 max-h-[148px] min-h-[148px]"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-0.5 sm:mb-1">
                        {project.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 mb-1 sm:mb-1.5">
                        {project.excerpt}
                      </p>
                      <span className="text-xs text-primary font-semibold group-hover:underline">
                        Xem chi tiết
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
