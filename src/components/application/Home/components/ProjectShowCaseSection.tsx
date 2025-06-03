import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { blogService } from "@/lib/services/blog.service";
import { BlogPost } from "@/lib/types/modules/blog.interface";

const handleGetShowcaseBlog = async () => {
  try {
    const projects = await blogService.getBlogsByCategory(
      "cong-trinh-tieu-bieu",
      1,
      8
    );
    return projects;
  } catch (error) {
    console.error("Error fetching showcase blogs:", error);
    return { rows: [], total: 0, page: 1, pageSize: 8, totalPages: 0 };
  }
};

// Tối ưu với memo để tránh render lại không cần thiết
const ProjectCard = memo(
  ({ blog, index }: { blog: BlogPost; index: number }) => {
    const slug = blog.slug;
    const isFirstRow = index < 4; // Các project ở hàng đầu tiên

    return (
      <Card
        key={blog._id}
        className="overflow-hidden bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        {/* Logo overlay */}
        <div className="relative">
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-white/80 p-1 rounded">
              <Image
                src="/images/logo.png"
                alt="Việt Quang Logo"
                width={40}
                height={40}
              />
            </div>
          </div>

          {/* Hình ảnh dự án */}
          <Link
            href={`/bai-viet/${slug}`}
            className="block"
            prefetch={isFirstRow}
          >
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={blog.featuredImage?.url || ""}
                alt={blog.featuredImage?.alt || ""}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority={isFirstRow}
                loading={isFirstRow ? "eager" : "lazy"}
              />
            </div>
          </Link>
        </div>

        {/* Thông tin dự án */}
        <CardContent className="p-4">
          <Link href={`/bai-viet/${slug}`} prefetch={isFirstRow}>
            <CardTitle className="text-primary font-bold text-lg mb-2 hover:text-primary/80 transition-colors">
              {blog.title}
            </CardTitle>
          </Link>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

const ProjectShowCaseSection = async () => {
  const projects = await handleGetShowcaseBlog();
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary uppercase mb-2">
            Công Trình Xây Dựng Tiêu Biểu
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-primary w-16"></div>
            <p className="mx-4 text-muted-foreground">
              Các công trình đã hoàn thành của công ty
            </p>
            <div className="h-0.5 bg-primary w-16"></div>
          </div>
        </div>

        {/* Grid dự án */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.rows.map((blog, index) => (
            <ProjectCard key={blog._id} blog={blog} index={index} />
          ))}
        </div>

        {/* Nút xem tất cả */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="default"
            className="bg-primary text-white hover:bg-primary/90 px-6 py-4 h-auto text-base font-medium"
          >
            <Link href="/xay-nha/cong-trinh-tieu-bieu" prefetch={true}>
              Xem tất cả công trình
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default memo(ProjectShowCaseSection);
