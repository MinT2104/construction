"use client";

import { Button } from "@/components/ui/button";
import { blogService } from "@/lib/services/blog.service";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatDuration } from "@/lib/utils";
import ProjectListActiveSection from "./ProjectListActiveSection";
import CategoryTabs from "./CategoryTabs";

// Define tabs
export const categoryTabs = [
  {
    label: "Thiết kế biệt thự",
    path: "/thiet-ke/thiet-ke-biet-thu",
    slug: "thiet-ke-biet-thu",
  },
  {
    label: "Thiết kế nhà phố",
    path: "/thiet-ke/thiet-ke-nha-pho",
    slug: "thiet-ke-nha-pho",
  },
  {
    label: "Thiết kế nội thất",
    path: "/thiet-ke/thiet-ke-noi-that",
    slug: "thiet-ke-noi-that",
  },
  {
    label: "Thi công xây dựng",
    path: "/xay-nha/xay-dung-nha-dep",
    slug: "xay-dung-nha-dep",
  },
  { label: "Sửa chữa cải tạo", path: "/sua-nha", slug: "sua-nha" },
  {
    label: "Cẩm nang xây dựng",
    path: "/cam-nang/cam-nang-xay-nha",
    slug: "cam-nang-xay-nha",
  },
];

interface ActiveAspectProps {
  searchParams?: { category?: string };
}

const ActiveAspect = ({ searchParams }: ActiveAspectProps) => {
  // Default to first tab if no category provided
  const initialCategory = searchParams?.category || categoryTabs[0].slug;

  // State for posts and loading
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed values
  const gridPosts = posts.slice(0, 4);
  const listPosts = posts.slice(4, 9);

  // Function to fetch posts by category
  const fetchPostsByCategory = async (categorySlug: string) => {
    if (!categorySlug) return;

    setIsLoading(true);
    try {
      const response = await blogService.getBlogsByCategory(
        categorySlug,
        1,
        10
      );
      const fetchedPosts = response?.rows as unknown as BlogPost[];
      setPosts(fetchedPosts || []);
    } catch (error) {
      console.error(
        `Error fetching posts for category ${categorySlug}:`,
        error
      );
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load based on URL
  useEffect(() => {
    fetchPostsByCategory(initialCategory);
  }, [initialCategory]);

  // Handle tab change
  const handleTabChange = (slug: string) => {
    setActiveCategory(slug);
    fetchPostsByCategory(slug);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary uppercase mb-2">
            Lĩnh vực hoạt động
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-primary w-16"></div>
            <p className="mx-4 text-muted-foreground">
              Các lĩnh vực hoạt động của công ty
            </p>
            <div className="h-0.5 bg-primary w-16"></div>
          </div>
        </div>

        {/* Client Component for Tab Navigation */}
        <CategoryTabs
          tabs={categoryTabs}
          activeCategory={activeCategory}
          onTabChange={handleTabChange}
        />

        {/* Blog Posts Grid & Project List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section with Featured Blog */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg overflow-hidden shadow-sm border border-border/40 bg-card animate-pulse"
                  >
                    <div className="relative aspect-video w-full bg-gray-200 dark:bg-gray-800"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                {gridPosts.length > 0 ? (
                  gridPosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/bai-viet/${post.slug}`}
                      className="relative group rounded-lg overflow-hidden shadow-sm border border-border/40 bg-card hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={post.featuredImage?.url || ""}
                          alt={post.featuredImage?.alt || ""}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                      </div>
                      <div className="p-3 sm:p-4 flex-grow bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                        <h4 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2 opacity-90 group-hover:opacity-100">
                          {post.excerpt}
                        </p>

                        {/* Thông tin bổ sung */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-primary font-medium flex items-center group-hover:font-semibold">
                            Xem chi tiết
                            <svg
                              className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform duration-300"
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

                          {/* Thời gian đọc */}
                          <span className="text-xs text-gray-500 flex items-center">
                            <svg
                              className="h-3 w-3 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {post.readingTime || "5 phút"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 flex items-center justify-center h-64 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <p className="text-gray-500 text-center">
                      Không tìm thấy bài viết nào trong danh mục này
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Project List Section (Right) */}
          <div className="lg:col-span-5">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 h-full">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex h-[110px] md:h-[120px] items-center space-x-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse"
                  >
                    <div className="relative w-28 h-full bg-gray-200 dark:bg-gray-800"></div>
                    <div className="flex-grow space-y-2 p-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 h-full">
                {listPosts.length > 0 ? (
                  listPosts.map((project) => (
                    <ProjectListActiveSection
                      key={project._id}
                      project={project}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <p className="text-gray-500 text-center">
                      Không tìm thấy bài viết nào trong danh mục này
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nút xem tất cả */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="default"
            className="bg-primary text-white hover:bg-primary/90 px-6 py-4 h-auto text-base font-medium"
          >
            <Link
              href={
                categoryTabs.find((tab) => tab.slug === activeCategory)?.path ||
                ""
              }
              prefetch={false}
            >
              Xem tất cả bài viết
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ActiveAspect;
