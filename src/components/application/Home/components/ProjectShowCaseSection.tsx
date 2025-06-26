"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { memo, useState, useRef, useEffect } from "react";
import { blogService } from "@/lib/services/blog.service";
import { BlogPost } from "@/lib/types/modules/blog.interface";

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
    console.error(`Error fetching ${key}:`, error);
    return null;
  }
}

// Lazy loading wrapper cho heavy content
const LazyContent = memo(({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[200px]">
      {isVisible ? (
        children
      ) : (
        <div className="animate-pulse bg-gray-200 rounded-lg min-h-[200px] flex items-center justify-center">
          <div className="text-gray-400">Đang tải...</div>
        </div>
      )}
    </div>
  );
});

LazyContent.displayName = "LazyContent";

// Component cho từng project card với optimization
const ProjectCard = memo(
  ({ blog, index }: { blog: BlogPost; index: number }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
      <Card className="group overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-gray-100 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {!imageError ? (
            <Image
              src={blog.featuredImage?.url || "/images/houses/house_1.avif"}
              alt={blog.title}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading={index < 4 ? "eager" : "lazy"} // First 4 images load eagerly
              priority={index < 4}
              quality={index < 4 ? 85 : 75} // Higher quality for visible images
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="text-2xl mb-2">🏠</div>
                <div className="text-sm">Hình ảnh không khả dụng</div>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button
              asChild
              size="sm"
              className="w-full bg-white text-primary hover:bg-gray-100 font-medium"
            >
              <Link href={`/${blog.slug}`}>Xem chi tiết</Link>
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors duration-200">
              <Link href={`/${blog.slug}`} className="hover:underline">
                {blog.title}
              </Link>
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {blog.excerpt || "Dự án thiết kế và thi công chuyên nghiệp"}
            </p>
          </div>

          <div className="text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">Dự án</span>
          </div>
        </div>
      </Card>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

// Main component
const ProjectShowCaseSection = memo(() => {
  const [listPosts, setListPosts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await cachedFetch("project-showcase", () =>
          blogService.getBlogsByCategory("mau-nha-dep", 1, 12)
        );
        setListPosts(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <LazyContent>
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Những Dự Án Nổi Bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Khám phá những mẫu nhà đẹp được thiết kế và thi công bởi đội ngũ
              chuyên gia của chúng tôi
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {listPosts?.rows
              ?.slice(0, 12)
              .map((blog: BlogPost, index: number) => (
                <ProjectCard key={blog._id} blog={blog} index={index} />
              ))}
          </div>

          {/* View More Button */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="px-8 py-3 text-base font-medium"
            >
              <Link href="/mau-nha-dep">
                Xem Thêm Dự Án
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </LazyContent>
  );
});

ProjectShowCaseSection.displayName = "ProjectShowCaseSection";

export default ProjectShowCaseSection;
