import { Post } from "@/lib/types/modules/post.interface";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import { BlogPost } from "@/lib/types/modules/blog.interface";

interface PostCardProps {
  post: BlogPost;
  layout?: "default" | "single";
}

export default function PostCard({ post, layout = "default" }: PostCardProps) {
  // Tạo màu sắc ngẫu nhiên cho tags
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

  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  if (layout === "single") {
    return (
      <article className="group max-w-4xl mx-auto mb-16 border border-gray-200 rounded-xl overflow-hidden pb-4">
        {/* Image container */}
        {post.featuredImage && (
          <Link
            href={`/bai-viet/${post.slug}`}
            className="relative block w-full h-[400px] rounded-t-xl overflow-hidden mb-6"
          >
            <Image
              src={post.featuredImage?.url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        )}

        {/* Content */}
        <div className="px-4">
          {/* Category */}
          <Link
            href={`/danh-muc/${post.categories?.[0]?.slug}`}
            className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-4 hover:bg-gray-200 transition-colors"
          >
            {post.categories?.[0]?.name}
          </Link>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
            <Link href={`/bai-viet/${post.slug}`}>{post.title}</Link>
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 text-lg mb-6 line-clamp-3">
            {post.excerpt?.slice(0, 150) + "..."}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag, index) => {
              const colorStyle = getTagColor(index);
              return (
                <Link
                  href={`/tag/${tag.slug}`}
                  key={tag.slug}
                  className={`px-3 py-1 rounded-md ${colorStyle.bg} ${colorStyle.text} text-sm font-medium ${colorStyle.hover} transition-colors flex items-center`}
                >
                  <span className="mr-1">#</span>
                  {tag.name}
                </Link>
              );
            })}
          </div>

          {/* Meta */}
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5" />
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </time>
            </div>

            {post.author && (
              <div className="flex items-center ml-4">
                <User className="h-4 w-4 mr-1.5" />
                <span>{post.author.name}</span>
              </div>
            )}

            {post.readingTime && (
              <div className="flex items-center ml-4">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>{post.readingTime}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Default layout (horizontal card)
  return (
    <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg flex">
      {post.featuredImage && (
        <Link
          href={`/bai-viet/${post.slug}`}
          className="relative w-1/3 min-w-[200px] overflow-hidden"
        >
          <Image
            src={post.featuredImage?.url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 33vw, 25vw"
          />
        </Link>
      )}
      <div className="p-5 flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/bai-viet/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-gray-600 text-base mb-4 line-clamp-3">
          {post.content}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag, index) => {
            const colorStyle = getTagColor(index);
            return (
              <Link
                href={`/tag/${tag.slug}`}
                key={tag.slug}
                className={`px-2 py-1 rounded-md ${colorStyle.bg} ${colorStyle.text} text-xs ${colorStyle.hover} transition-colors flex items-center`}
              >
                #{tag.name}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center text-sm text-gray-500 font-medium">
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </time>
          {post.author && (
            <>
              <span className="mx-2 text-gray-400">•</span>
              <span>{post.author.name}</span>
            </>
          )}
          {post.readingTime && (
            <>
              <span className="mx-2 text-gray-400">•</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
