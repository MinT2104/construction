import React from "react";
import PostCard from "@/components/common/PostCard";
import { Post } from "@/lib/types/modules/post.interface";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { SectionHeader } from "./components";

interface CategoryViewProps {
  posts: Post[];
  currentItem: BaseMenuItem;
}

const CategoryView: React.FC<CategoryViewProps> = ({ posts, currentItem }) => {
  return (
    <div className="container mx-auto px-4">
      <SectionHeader
        title={currentItem.label}
        variant="primary"
        subtitle={`Khám phá ${
          posts.length
        } bài viết mới nhất về chủ đề ${currentItem.label.toLowerCase()}`}
        className="mb-12"
      />

      <div className="max-w-4xl mx-auto">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} layout="single" />
        ))}
      </div>
    </div>
  );
};

export default CategoryView;
