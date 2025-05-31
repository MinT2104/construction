import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import { Button } from "@/components/ui/button";
import { Share, Share2 } from "lucide-react";
import { toast } from "sonner";
import SharePost from "./SharePost";

interface PostHeaderProps {
  post: BlogPost;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  const readingTime = post.readingTime
    ? `${post.readingTime} phút đọc`
    : "10 phút đọc";

  return (
    <div className="container mx-auto px-4 pt-8 md:pt-12 max-w-4xl">
      {/* Category badge */}
      <Link
        href={`/danh-muc/${post.categories?.[0]?.slug}`}
        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-6 hover:bg-gray-200 transition-colors"
      >
        {post.categories?.[0]?.name}
      </Link>

      {/* Post title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Post subtitle/description */}
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        {post?.excerpt || ""}
      </p>

      {/* Author and metadata */}
      <div className="flex items-center mb-8">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src={post.author?.imageUrl || "https://placehold.co/400"}
            alt={post.author?.name || "Author"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {post.author?.name}
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <span>{readingTime}</span>
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
      <SharePost post={post} />

      {/* Featured image */}
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] mb-12 rounded-lg overflow-hidden">
        <Image
          src={post.featuredImage?.url || "/images/blog-post-header.jpg"}
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
