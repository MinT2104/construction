import { Post } from "@/lib/types/modules/post.interface";
import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg flex">
      {post.image && (
        <Link
          href={`/bai-viet/${post.slug || post.id}`}
          className="relative w-1/3 min-w-[200px] overflow-hidden"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 33vw, 25vw"
          />
        </Link>
      )}
      <div className="p-5 flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/bai-viet/${post.slug || post.id}`}>{post.title}</Link>
        </h2>
        <p className="text-gray-600 text-base mb-4 line-clamp-3">
          {post.content}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-sm rounded-full text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-500 font-medium">
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </time>
          {post.author && (
            <>
              <span className="mx-2 text-gray-400">•</span>
              <span>{post.author}</span>
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
