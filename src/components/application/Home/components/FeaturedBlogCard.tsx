"use client";

import { BlogPost } from "@/lib/types/modules/blog.interface";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { blogService } from "@/lib/services/blog.service";

interface FeaturedBlogCardProps {
  featuredPostsData: BlogPost;
}

const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({
  featuredPostsData,
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg h-[400px] flex-1 group">
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
  );
};

export default FeaturedBlogCard;
