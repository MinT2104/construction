import React from "react";
import Image from "next/image";
import Link from "next/link";
import PostCard from "@/components/common/PostCard";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { SectionHeader } from "./components";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface CategoryViewProps {
  posts: BlogPost[];
  currentItem: BaseMenuItem;
}

const CategoryView: React.FC<CategoryViewProps> = ({ posts, currentItem }) => {
  return (
    <div className="container mx-auto px-4 md:px-0 max-w-4xl">
      <SectionHeader
        title={currentItem.label}
        variant="primary"
        subtitle={
          posts.length > 0
            ? `Khám phá ${
                posts.length
              } bài viết mới nhất về chủ đề ${currentItem.label.toLowerCase()}`
            : ""
        }
        className="mb-8"
      />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              href={`/bai-viet/${post.slug}`}
              key={post._id}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={post.featuredImage?.url || "/images/placeholder.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  {post.readingTime && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readingTime} phút đọc</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-primary font-medium text-sm">
                  <span className="group-hover:underline">Xem chi tiết</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <svg
            className="w-20 h-20 mx-auto text-gray-300 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            Chưa có bài viết nào về {currentItem.label.toLowerCase()}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Chúng tôi đang chuẩn bị những nội dung hữu ích và sẽ cập nhật trong
            thời gian tới.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition duration-300 inline-block"
          >
            Quay lại trang chủ
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryView;
