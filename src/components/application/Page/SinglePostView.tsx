import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/types/modules/post.interface";
import { PostHeader, SectionHeader } from "./components";
import { Tag, FileX } from "lucide-react";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import { blogService, PaginatedResponse } from "@/lib/services/blog.service";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { SITE_URL, SITE_NAME } from "@/lib/utils/seo-utils";

interface SinglePostViewProps {
  post: BlogPost;
  relatedPosts?: PaginatedResponse<BlogPost>;
}

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <FileX className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Không tìm thấy nội dung
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        Nội dung bài viết này đang được cập nhật hoặc không tồn tại.
      </p>
    </div>
  );
};

// JSON-LD Schema cho bài viết
const BlogPostSchema = ({ post }: { post: BlogPost }) => {
  if (!post) return null;

  // Chuẩn bị dữ liệu cho Schema
  const authorName = post.author?.name || SITE_NAME;
  const publishDate = post.createdAt;
  const modifiedDate = post.updatedAt;
  const postUrl = `${SITE_URL}/bai-viet/${post.slug}`;
  const imageUrl = post.featuredImage?.url || `${SITE_URL}/og-image.jpg`;

  // Schema Article
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.meta?.seoDescription || "",
    image: imageUrl,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface RelatedPostsProps {
  post: BlogPost;
  relatedPosts: PaginatedResponse<BlogPost>;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ post, relatedPosts }) => {
  const filteredPosts =
    relatedPosts?.rows?.filter((relatedPost) => relatedPost._id !== post._id) ||
    [];

  if (filteredPosts.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <SectionHeader
        title="Bài viết liên quan"
        variant="left"
        withDecoration={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredPosts.map((relatedPost) => (
          <Link
            href={`/bai-viet/${relatedPost.slug}`}
            key={relatedPost._id}
            className="block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={relatedPost.featuredImage?.url || ""}
                alt={relatedPost.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2 line-clamp-2">
                {relatedPost.title}
              </h4>
              <p className="text-gray-600 text-sm">
                {new Date(relatedPost.createdAt).toLocaleDateString("vi-VN")} •
                6 phút đọc
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const SinglePostView: React.FC<SinglePostViewProps> = ({
  post,
  relatedPosts = {
    rows: [],
    total: 0,
    page: 1,
    pageSize: 3,
    totalPages: 0,
  },
}) => {
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

  if (!post) return <EmptyState />;

  return (
    <article className="max-w-none">
      {/* Schema Markup */}
      <BlogPostSchema post={post} />

      {/* Header */}
      <PostHeader post={post} />

      {/* Content section */}
      <div className="container mx-auto px-4 md:px-0 max-w-4xl">
        <div className="flex flex-col gap-8">
          {/* Main content */}
          <div className="w-full">
            {/* Article content */}
            <div className="prose prose-lg prose-slate max-w-none">
              {post?.content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                ></div>
              ) : (
                <EmptyState />
              )}
            </div>

            {/* Tags - moved to bottom with improved design */}
            {post?.tags && post?.tags?.length > 0 && (
              <div className="mt-12 mb-10 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-gray-600" />
                  <span>Từ khoá</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post?.tags?.map((tag, index) => {
                    const colorStyle = getTagColor(index);
                    return (
                      <Link
                        href={`/tag/${tag.slug}`}
                        key={tag.slug}
                        className={`px-4 py-2 rounded-lg ${colorStyle.bg} ${colorStyle.text} text-sm font-medium ${colorStyle.hover} transition-colors flex items-center shadow-sm border border-gray-100`}
                      >
                        <span className="mr-1">#</span>
                        {tag.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related posts section */}
            <RelatedPosts post={post} relatedPosts={relatedPosts} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default SinglePostView;
