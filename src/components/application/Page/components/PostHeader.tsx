import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/types/modules/post.interface";

interface PostHeaderProps {
  post: Post;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      {/* Category badge */}
      <Link
        href={`/danh-muc/${post.category}`}
        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-6 hover:bg-gray-200 transition-colors"
      >
        {post.category}
      </Link>

      {/* Post title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Post subtitle/description */}
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        Hướng dẫn chi tiết giúp bạn tạo ra những bài viết blog chất lượng, thu
        hút độc giả và đạt hiệu quả cao trong năm 2024.
      </p>

      {/* Author and metadata */}
      <div className="flex items-center mb-8">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src="/images/avatar-placeholder.jpg"
            alt={post.author || "Author"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{post.author}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <span>{post.readingTime || "10 phút đọc"}</span>
            <span className="mx-1">•</span>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>

      {/* Interaction buttons */}
      <div className="flex justify-end items-center mb-8 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-900 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>
          <button className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-900 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Featured image */}
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] mb-12 rounded-lg overflow-hidden">
        <Image
          src={post.image || "/images/blog-post-header.jpg"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default PostHeader;
