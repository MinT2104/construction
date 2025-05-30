import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/types/modules/post.interface";
import { PostHeader, SectionHeader } from "./components";
import { Tag } from "lucide-react";

interface SinglePostViewProps {
  post: Post;
}

const SinglePostView: React.FC<SinglePostViewProps> = ({ post }) => {
  // Giả lập màu sắc ngẫu nhiên cho tags
  const tagColors = [
    { bg: "bg-blue-50", text: "text-blue-700", hover: "hover:bg-blue-100" },
    { bg: "bg-green-50", text: "text-green-700", hover: "hover:bg-green-100" },
    {
      bg: "bg-purple-50",
      text: "text-purple-700",
      hover: "hover:bg-purple-100",
    },
    { bg: "bg-amber-50", text: "text-amber-700", hover: "hover:bg-amber-100" },
    { bg: "bg-rose-50", text: "text-rose-700", hover: "hover:bg-rose-100" },
    { bg: "bg-teal-50", text: "text-teal-700", hover: "hover:bg-teal-100" },
  ];

  // Hàm lấy màu theo chỉ số để mỗi tag có một màu nhất định
  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  return (
    <article className="max-w-none">
      {/* Header */}
      <PostHeader post={post} />

      {/* Content section */}
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col gap-8">
          {/* Main content */}
          <div className="w-full">
            {/* Article content */}
            <div className="prose prose-lg prose-slate max-w-none">
              {post.content}
            </div>

            {/* Tags - moved to bottom with improved design */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 mb-10 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-gray-600" />
                  <span>Từ khoá</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => {
                    const colorStyle = getTagColor(index);
                    return (
                      <Link
                        href={`/tag/${tag}`}
                        key={tag}
                        className={`px-4 py-2 rounded-lg ${colorStyle.bg} ${colorStyle.text} text-sm font-medium ${colorStyle.hover} transition-colors flex items-center shadow-sm border border-gray-100`}
                      >
                        <span className="mr-1">#</span>
                        {tag}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related posts section */}
            <RelatedPosts />
          </div>
        </div>
      </div>
    </article>
  );
};

const RelatedPosts: React.FC = () => {
  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <SectionHeader
        title="Bài viết liên quan"
        variant="left"
        withDecoration={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* This would be populated with actual related posts */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-48">
            <Image
              src="/images/houses/house_2.avif"
              alt="Related post"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h4 className="font-bold text-lg mb-2 line-clamp-2">
              Tổng Hợp 5 Phong Cách Thiết Kế Nội Thất Được Ưa Chuộng 2025
            </h4>
            <p className="text-gray-600 text-sm">
              {new Date("2025-01-01").toLocaleDateString("vi-VN")} • 5 phút đọc
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-48">
            <Image
              src="/images/houses/house_3.avif"
              alt="Related post"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h4 className="font-bold text-lg mb-2 line-clamp-2">
              5 Sai Lầm Khi Tự Thiết Kế Nhà Mà Ai Cũng Gặp
            </h4>
            <p className="text-gray-600 text-sm">
              {new Date("2024-12-12").toLocaleDateString("vi-VN")} • 4 phút đọc
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-48">
            <Image
              src="/images/houses/house_4.avif"
              alt="Related post"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h4 className="font-bold text-lg mb-2 line-clamp-2">
              Tối Ưu Hóa Không Gian Nhỏ Với Thiết Kế Thông Minh
            </h4>
            <p className="text-gray-600 text-sm">
              {new Date("2025-01-07").toLocaleDateString("vi-VN")} • 6 phút đọc
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostView;
