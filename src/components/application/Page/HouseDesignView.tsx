import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { SectionHeader } from "./components";
import { BlogPost } from "@/lib/types/modules/blog.interface";

interface HouseDesignViewProps {
  currentItem: BlogPost[];
}

const HouseDesignView: React.FC<HouseDesignViewProps> = ({ currentItem }) => {
  // Sample house design data

  return (
    <div>
      <SectionHeader
        title={"Mẫu nhà đẹp"}
        variant="centered"
        subtitle="Mẫu thiết kế nhà đẹp mới nhất với sự kết hợp hoàn hảo giữa công năng và thẩm mỹ"
      />

      {currentItem.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-24 h-24 mb-4 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Không có mẫu nhà nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Hiện chưa có mẫu thiết kế nhà nào được thêm vào.
          </p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {currentItem.map((design: BlogPost, index: number) => (
            <HouseDesignCard
              key={`${design.title}-${index}`}
              design={design}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface HouseDesignCardProps {
  design: BlogPost;
  index: number;
}

const HouseDesignCard: React.FC<HouseDesignCardProps> = ({ design, index }) => {
  return (
    <div className="break-inside-avoid mb-4">
      <Link
        href={`/bai-viet/${design.slug}`}
        className={`group relative block overflow-hidden rounded-xl border border-border/40 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-md ${
          // Alternate heights for visual interest
          index % 3 === 0
            ? "aspect-[3/4]"
            : index % 3 === 1
            ? "aspect-[4/5]"
            : "aspect-[1/1]"
        }`}
      >
        <Image
          src={design.featuredImage?.url || ""}
          alt={design.title}
          width={400}
          height={500}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Permanent overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Additional hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        <span className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full text-xs backdrop-blur-sm">
          {design.categories?.[0]?.name || ""}
        </span>

        {/* Content - Always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg mb-1 drop-shadow-md">
            {design.title}
          </h3>
          <p className="text-white/90 text-sm line-clamp-2 drop-shadow-md">
            {design.excerpt}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default HouseDesignView;
