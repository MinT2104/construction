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
  {
    id: "p6",
    title: "Cải tạo nhà phố trọn gói nhà cấp 4 5x21m Anh Quang ở Thủ Đức",
    excerpt:
      "Ngôi nhà của bạn đang cần sửa chữa những hạng mục nào? Đối với từng dự án cải tạo nhà...",
    image: "/images/mock_blogs/blog_6.avif", // Replace with actual image path
    slug: "/cai-tao-anh-quang",
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
          {/* Blog Posts Section (Left) */}
          <div className="md:col-span-3 mb-12 md:mb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blogPosts.slice(0, 4).map(
                (
                  post // Displaying first 4 blog posts
                ) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden transition-all duration-300 flex flex-col bg-card rounded-lg border border-border max-h-[476px] min-h-[476px]"
                  >
                    <Link href={post.slug} className="block group">
                      <div className="relative w-full h-52 sm:h-56 overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-5 sm:p-6 flex flex-col flex-grow">
                      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                        <Link
                          href={`/blog/category/${post.category
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="inline-block"
                        >
                          <span className="font-semibold uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors text-[11px] sm:text-xs">
                            {post.category}
                          </span>
                        </Link>
                        <span className="text-[11px] sm:text-xs">
                          {new Date(post.date).toLocaleDateString("vi-VN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <Link href={post.slug} className="block mb-2">
                        <CardTitle className="text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </CardTitle>
                      </Link>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 flex-grow line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Button
                        asChild
                        variant="link"
                        className="p-0 h-auto self-start text-primary hover:text-primary/80 group mt-auto"
                      >
                        <Link
                          href={post.slug}
                          className="font-semibold text-sm sm:text-base inline-flex items-center"
                        >
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
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>

          {/* Project List Section (Right) */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {" "}
              {/* Using space-y for vertical list items */}
              {projectArticles.map(
                (
                  project // Using projects from 5th item onwards
                ) => (
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
                )
              )}
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
