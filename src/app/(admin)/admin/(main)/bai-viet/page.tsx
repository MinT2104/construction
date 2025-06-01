"use client";

import { useEffect, useState } from "react";
import menuItems from "@/lib/constants/menu";
import {
  BlogPost,
  BlogPostCreate,
  BlogPostUpdate,
  FormValues,
} from "@/lib/types/modules/blog.interface";
import { blogService, PaginatedResponse } from "@/lib/services/blog.service";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

const AdminBlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [currentSubMenuItems, setCurrentSubMenuItems] = useState<
    BaseMenuItem[] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [updatingFeaturedId, setUpdatingFeaturedId] = useState<string | null>(
    null
  );
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (selectedCategory) {
      const activeMainItem = menuItems.find(
        (item) => item.path === selectedCategory
      );
      if (
        activeMainItem &&
        activeMainItem.submenu &&
        activeMainItem.submenu.length > 0
      ) {
        setCurrentSubMenuItems(activeMainItem.submenu as BaseMenuItem[]);
      } else {
        setCurrentSubMenuItems(null);
      }
    } else {
      setCurrentSubMenuItems(null);
    }
    setSelectedSubCategory(null);
  }, [selectedCategory]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      let filterPath;

      // Fix the category slug formation
      if (selectedSubCategory) {
        // If submenu item is selected, use only its path
        filterPath = selectedSubCategory.split("/").pop();
      } else if (selectedCategory) {
        // If only main category is selected, use its path
        filterPath = selectedCategory.split("/").pop();
      }

      if (filterPath) {
        const response = await blogService.getBlogsByCategory(
          filterPath,
          currentPage,
          pageSize
        );
        setPosts(response.rows);
        setTotalItems(response.total);
        setTotalPages(response.totalPages);
      } else {
        const response = await blogService.getPostsWithPagination(
          currentPage,
          pageSize
        );
        setPosts(response.rows);
        setTotalItems(response.total);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, selectedSubCategory, currentPage, pageSize]);

  const handleCreatePost = async (postData: FormValues) => {
    try {
      await blogService.createPost(postData);
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdatePost = async (postData: FormValues) => {
    if (!selectedPost) return;

    try {
      // Chuẩn bị dữ liệu để cập nhật
      const { status, featuredImage, ...restData } = postData;

      // Đảm bảo alt luôn có giá trị
      const processedFeaturedImage = featuredImage
        ? {
            url: featuredImage.url,
            alt: featuredImage.alt || "",
          }
        : undefined;

      const updateData: BlogPostUpdate = {
        _id: selectedPost._id,
        status: status === "archived" ? "draft" : status,
        featuredImage: processedFeaturedImage,
        ...restData,
      };

      await blogService.updatePost(updateData);
      loadPosts();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async (deleteId: string) => {
    setIsDeleting(true);
    try {
      const success = await blogService.deletePost(deleteId);
      toast.success("Bài viết đã được xóa thành công!");
      loadPosts(); // Tải lại danh sách bài viết
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error(error.message || "Xóa bài viết thất bại. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  // Define which top-level menu items are relevant for blog categories
  const relevantBlogCategoryLabels = [
    "Giới thiệu",
    "Thiết kế",
    "Xây nhà",
    "Sửa nhà",
    "Mẫu Nhà Đẹp",
    "Báo Giá",
    "Tư vấn giám sát",
    "Cẩm nang XD",
    "Liên Hệ",
  ];
  const blogCategoryMenuItems = menuItems.filter((item) =>
    relevantBlogCategoryLabels.includes(item.label)
  );

  const router = useRouter();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Add this pagination component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="px-4 py-5 sm:px-6 mt-4 bg-white border-t border-gray-200 rounded-b-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Page size selector - moved to top on mobile, left on desktop */}
          <div className="flex items-center order-2 sm:order-1">
            <span className="text-sm text-gray-700 mr-2">Hiển thị:</span>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded-md border-gray-300 py-1.5 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-3 text-sm text-gray-700 hidden sm:inline">
              mục / trang
            </span>
          </div>

          {/* Results summary */}
          <div className="order-1 sm:order-2 text-center">
            <p className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">
                {posts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, totalItems)}
              </span>{" "}
              trong <span className="font-medium">{totalItems}</span> bài viết
            </p>
          </div>

          {/* Mobile pagination */}
          <div className="flex justify-center sm:hidden order-3 mt-2">
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                }`}
              >
                <span className="sr-only">Trang đầu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.79 5.23a.75.75 0 01-.02 1.06L2.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                }`}
              >
                Trước
              </button>
              <button className="relative inline-flex items-center px-3 py-2 border bg-white text-sm font-medium text-gray-700">
                {currentPage} / {totalPages}
              </button>
              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                }`}
              >
                Sau
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                }`}
              >
                <span className="sr-only">Trang cuối</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M13.21 14.77a.75.75 0 01.02-1.06L17.168 10l-3.938-3.71a.75.75 0 011.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>

          {/* Desktop pagination */}
          <div className="hidden sm:flex justify-end order-3">
            <nav
              className="inline-flex items-center rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2.5 py-2 rounded-l-md border text-sm transition-colors duration-150 ease-in-out ${
                  currentPage === 1
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300 hover:border-indigo-300"
                }`}
                aria-label="First page"
                title="Trang đầu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.79 5.23a.75.75 0 01-.02 1.06L2.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2.5 py-2 border-t border-b border-l text-sm transition-colors duration-150 ease-in-out ${
                  currentPage === 1
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300 hover:border-indigo-300"
                }`}
                aria-label="Previous page"
                title="Trang trước"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border-t border-b border-l text-sm font-medium focus:z-10 focus:outline-none transition-colors duration-150 ease-in-out ${
                    page === currentPage
                      ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                  }`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2.5 py-2 border-t border-b border-l text-sm transition-colors duration-150 ease-in-out ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300 hover:border-indigo-300"
                }`}
                aria-label="Next page"
                title="Trang sau"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2.5 py-2 rounded-r-md border text-sm transition-colors duration-150 ease-in-out ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 border-gray-300 hover:border-indigo-300"
                }`}
                aria-label="Last page"
                title="Trang cuối"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M13.21 14.77a.75.75 0 01.02-1.06L17.168 10l-3.938-3.71a.75.75 0 011.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // Hàm để chuyển đổi trạng thái bài viết
  const handleToggleStatus = async (post: BlogPost) => {
    try {
      setUpdatingStatusId(post._id);

      // Tạo object cập nhật với trạng thái ngược lại
      const updateData: BlogPostUpdate = {
        _id: post._id,
        status: post.status === "published" ? "draft" : "published",
      };

      // Gọi API cập nhật trạng thái
      const updatedPost = await blogService.updatePost(updateData);

      if (updatedPost) {
        // Cập nhật danh sách bài viết với trạng thái mới
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              status: updateData.status as "draft" | "published",
            };
          }
          return p;
        });
        setPosts(updatedPosts);

        // Hiển thị thông báo thành công
        toast.success(
          `Bài viết đã được ${
            updateData.status === "published"
              ? "xuất bản"
              : "chuyển về bản nháp"
          }`
        );
      } else {
        throw new Error("Cập nhật trạng thái thất bại");
      }
    } catch (error: any) {
      console.error("Error toggling post status:", error);
      toast.error(error.message || "Cập nhật trạng thái thất bại");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Hàm để chuyển đổi trạng thái nổi bật của bài viết
  const handleToggleFeatured = async (post: BlogPost) => {
    try {
      setUpdatingFeaturedId(post._id);

      // Cập nhật trạng thái featured ngược lại từ trạng thái hiện tại
      const isFeatured = !post.isFeatured;

      // Gọi API cập nhật trạng thái nổi bật
      const response = await blogService.updateFeatured(post._id, isFeatured);

      if (response) {
        // Cập nhật danh sách bài viết với trạng thái mới
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              isFeatured: isFeatured,
            };
          }
          return p;
        });
        setPosts(updatedPosts);
        loadPosts();

        // Hiển thị thông báo thành công
        toast.success(
          `Bài viết đã được ${isFeatured ? "đặt làm nổi bật" : "bỏ nổi bật"}`
        );
      } else {
        throw new Error("Cập nhật trạng thái nổi bật thất bại");
      }
    } catch (error: any) {
      console.error("Error toggling post featured status:", error);
      toast.error(error.message || "Cập nhật trạng thái nổi bật thất bại");
    } finally {
      setUpdatingFeaturedId(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Quản lý bài viết
      </h1>

      {/* Horizontal Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out border shadow-sm ${
            !selectedCategory
              ? "bg-indigo-600 text-white border-indigo-700"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
          }`}
        >
          Tất cả
        </button>
        {blogCategoryMenuItems.map((item) => {
          const hasPath = item.path && typeof item.path === "string";
          return (
            <button
              key={item.path || item.label}
              onClick={() => {
                if (hasPath && item.path) {
                  setSelectedCategory(item.path);
                }
              }}
              disabled={!hasPath}
              className={`relative px-4 py-2 pr-10 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out border shadow-sm ${
                selectedCategory === item.path && hasPath
                  ? "bg-indigo-600 text-white border-indigo-700"
                  : hasPath
                  ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              }`}
            >
              {item.label}
              {hasPath && item.type && (
                <span
                  className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-sm font-semibold border ${
                    item.type === "single"
                      ? "bg-sky-100 text-sky-700 border-sky-200"
                      : item.type === "category" || item.type === "house-design"
                      ? "bg-lime-100 text-lime-700 border-lime-200"
                      : "bg-gray-200 text-gray-500 border-gray-300"
                  }`}
                >
                  {item.type === "single"
                    ? "Đơn"
                    : item.type === "category" || item.type === "house-design"
                    ? "DS"
                    : item.type}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-category Filter Row */}
      {currentSubMenuItems && currentSubMenuItems.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center pl-4 border-l-2 border-indigo-500">
          <button
            onClick={() => setSelectedSubCategory(null)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out border shadow-sm ${
              !selectedSubCategory
                ? "bg-indigo-500 text-white border-indigo-600"
                : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
            }`}
          >
            Tất cả (con)
          </button>
          {currentSubMenuItems.map((subItem) => {
            const hasPath = subItem.path && typeof subItem.path === "string";
            return (
              <button
                key={subItem.path || subItem.label}
                onClick={() => {
                  if (hasPath && subItem.path) {
                    setSelectedSubCategory(subItem.path);
                  }
                }}
                disabled={!hasPath}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out border shadow-sm ${
                  selectedSubCategory === subItem.path && hasPath
                    ? "bg-indigo-500 text-white border-indigo-600"
                    : hasPath
                    ? "bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                }`}
              >
                {subItem.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-lg">
        {/* Table header with actions */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Danh sách bài viết
          </h2>
          <button
            onClick={() => router.push("/admin/bai-viet/tao-bai-viet")}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center shadow-sm border border-indigo-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 mr-1.5"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Thêm bài viết
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-b-xl">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : posts.length === 0 ? (
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Tiêu đề
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Danh mục
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Hiển thị
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Nổi bật
                  </th>
                  {/* // ngày tạo */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Ngày tạo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Ngày cập nhật
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center w-full h-40">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      <span className="text-sm text-gray-500 font-medium">
                        Không có bài viết nào.
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <>
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Tiêu đề
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Danh mục
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Hiển thị
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Nổi bật
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Lượt xem
                    </th>
                    {/* // ngày tạo */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Ngày tạo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Ngày cập nhật
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {posts && posts.length > 0 ? (
                    posts.map((post) => (
                      <tr
                        key={post._id}
                        className="hover:bg-slate-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {post.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {post.categories && post.categories.length > 0
                            ? post.categories[0]?.name
                            : ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              post.status === "published"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {post.status === "published"
                              ? "Đã xuất bản"
                              : "Bản nháp"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-start">
                            {updatingStatusId === post._id ? (
                              <div className="h-6 flex items-center">
                                <svg
                                  className="animate-spin h-4 w-4 text-indigo-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={post.status === "published"}
                                  onCheckedChange={() =>
                                    handleToggleStatus(post)
                                  }
                                  disabled={updatingStatusId === post._id}
                                  className={`${
                                    post.status === "published"
                                      ? "bg-emerald-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                                <span className="text-sm text-gray-600">
                                  {post.status === "published"
                                    ? "Hiển thị"
                                    : "Ẩn"}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-start">
                            {updatingFeaturedId === post._id ? (
                              <div className="h-6 flex items-center">
                                <svg
                                  className="animate-spin h-4 w-4 text-amber-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={post.isFeatured === true}
                                  onCheckedChange={() =>
                                    handleToggleFeatured(post)
                                  }
                                  disabled={updatingFeaturedId === post._id}
                                  className={`${
                                    post.isFeatured === true
                                      ? "bg-amber-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                                <span className="text-sm text-gray-600">
                                  {post.isFeatured === true
                                    ? "Nổi bật"
                                    : "Thường"}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {post.viewCount || 0}
                        </td>
                        {/* // ngày tạo */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {new Date(post.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {new Date(post.updatedAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {post.status === "published" ? (
                              <a
                                href={`/bai-viet/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-2 bg-teal-50 border border-teal-300 rounded-md text-xs font-medium text-teal-700 hover:bg-teal-100 hover:border-teal-400 transition-colors shadow-sm"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="h-4 w-4 mr-1.5"
                                >
                                  <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Xem
                              </a>
                            ) : (
                              <span
                                className="inline-flex items-center px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-xs font-medium text-gray-400 cursor-not-allowed shadow-sm"
                                title="Bài viết chưa xuất bản"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="h-4 w-4 mr-1.5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Xem
                              </span>
                            )}
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/bai-viet/sua-bai-viet/${post._id}`
                                )
                              }
                              className="inline-flex items-center px-3 py-2 bg-indigo-50 border border-indigo-300 rounded-md text-xs font-medium text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400 transition-colors shadow-sm"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              disabled={isDeleting && deleteId === post._id}
                              className="inline-flex items-center px-3 py-2 bg-rose-50 border border-rose-300 rounded-md text-xs font-medium text-rose-700 hover:bg-rose-100 hover:border-rose-400 transition-colors shadow-sm"
                            >
                              {isDeleting && deleteId === post._id ? (
                                <>
                                  <svg
                                    className="animate-spin h-4 w-4 mr-1.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Đang xóa...
                                </>
                              ) : (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Xóa
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center justify-center w-full h-40">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-300 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                          <span className="text-sm text-gray-500 font-medium">
                            Không có bài viết nào.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 0 && <Pagination />}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={isDeleting}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete(deleteId ?? "")}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Đang xóa..." : "Xóa bài viết"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster richColors position="top-right" />
    </div>
  );
};

// Helper function to get category label from path
function getCategoryLabel(items: typeof menuItems, path: string): string {
  for (const item of items) {
    if (item.path === path) return item.label;
    if (item.submenu) {
      const found = item.submenu.find((sub) => sub.path === path);
      if (found) return found.label;
    }
  }
  return path;
}

export default AdminBlogPage;
