"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { blogService } from "@/lib/services/blog.service";

async function ProjectShowCaseSection() {
  let houseCategoryPosts: any[] = [];
  let featuredPosts: any[] = [];

  try {
    // Parallel fetch for better performance
    const [houseData, featuredData] = await Promise.all([
      blogService.getBlogsByCategory("mau-nha-dep", 1, 6),
      blogService.getBlogFeatured(),
    ]);

    houseCategoryPosts = houseData?.rows || [];
    featuredPosts = featuredData?.data || [];
  } catch (error) {
    console.error("Error fetching project showcase data:", error);
  }

  const houseDesignPosts = houseCategoryPosts.slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Dự án tiêu biểu
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Những Công Trình Nổi Bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những dự án xây dựng ấn tượng nhất của chúng tôi, từ nhà ở
            gia đình đến các công trình thương mại
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {houseDesignPosts.map((post: any, index: number) => (
            <Card
              key={post._id}
              className="group hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={post.featuredImage?.url || "/images/placeholder.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {index < 3 && (
                  <Badge
                    variant="default"
                    className="absolute top-4 left-4 bg-primary text-white"
                  >
                    Nổi bật
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link href={`/bai-viet/${post.slug}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Xem chi tiết
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/mau-nha-dep">
            <Button size="lg">Xem Tất Cả Dự Án</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProjectShowCaseSection;
