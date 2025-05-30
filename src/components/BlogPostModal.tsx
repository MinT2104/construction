"use client";

import { useEffect, useState } from "react";
import { BlogPost, FormValues } from "@/lib/types/modules/blog.interface";
import menuItems from "@/lib/constants/menu";

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: FormValues) => Promise<void>;
  post?: BlogPost;
}

const BlogPostModal = ({
  isOpen,
  onClose,
  onSubmit,
  post,
}: BlogPostModalProps) => {
  const [formData, setFormData] = useState<FormValues>({
    title: "",
    content: "",
    categories: [],
    tags: [],
    status: "draft",
    publishDate: new Date(),
    isFeatured: false,
  });

  useEffect(() => {
    if (post) {
      // Chuyển đổi từ BlogPost sang FormValues
      setFormData({
        title: post.title,
        content: post.content,
        categories:
          post.categories?.map((cat) => ({ name: cat.name, slug: cat.slug })) ||
          [],
        tags:
          post.tags?.map((tag) => ({ name: tag.name, slug: tag.slug })) || [],
        status: post.status,
        publishDate: new Date(post.createdAt),
        isFeatured: false,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage
          ? {
              url: post.featuredImage.url,
              alt: post.featuredImage.alt || "",
            }
          : undefined,
        meta: post.meta,
      });
    } else {
      // Giá trị mặc định
      setFormData({
        title: "",
        content: "",
        categories: [],
        tags: [],
        status: "draft",
        publishDate: new Date(),
        isFeatured: false,
      });
    }
  }, [post]);

  const camNangXD = menuItems.find((item) => item.label === "Cẩm nang XD");
  const categories = camNangXD?.submenu || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.title ||
      !formData.content ||
      formData.categories.length === 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          {post ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Danh mục</label>
            <select
              onChange={(e) => {
                const selectedCategory = categories.find(
                  (cat) => cat.path === e.target.value
                );
                if (selectedCategory) {
                  const slug = selectedCategory.path?.replace(/\//g, "") || "";
                  setFormData({
                    ...formData,
                    categories: [{ name: selectedCategory.label, slug }],
                  });
                }
              }}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.path} value={category.path}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full p-2 border rounded h-40"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "draft" | "published",
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {post ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPostModal;
