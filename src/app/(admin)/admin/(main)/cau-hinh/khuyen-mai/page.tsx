"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import {
  PaginatedResponse,
  promotionService,
} from "@/lib/services/promotion.service";
import { Promotion } from "@/lib/types/modules/promotion.interface";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AdminPromotionPage = () => {
  const router = useRouter();

  // State for data management
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updatingFeaturedId, setUpdatingFeaturedId] = useState<string | null>(
    null
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadPromotions = async () => {
    setIsLoading(true);
    try {
      const response: PaginatedResponse<Promotion> =
        await promotionService.getPromotionsWithPagination(
          currentPage,
          pageSize
        );
      setPromotions(response.rows);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading promotions:", error);
      toast.error("Lỗi khi tải danh sách khuyến mãi");
      setPromotions([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  // Handle delete promotion
  const handleDeletePromotion = (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async (deleteId: string) => {
    setIsDeleting(true);
    try {
      await promotionService.deletePromotion(deleteId);
      toast.success("Khuyến mãi đã được xóa thành công!");
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteId(null);
      setCurrentPage(1);
      loadPromotions();
    } catch (error: any) {
      console.error("Error deleting promotion:", error);
      toast.error(
        error.message || "Xóa khuyến mãi thất bại. Vui lòng thử lại."
      );
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  // Toggle featured status
  const handleToggleFeatured = async (promotion: Promotion) => {
    try {
      setUpdatingFeaturedId(promotion._id);
      await promotionService.updateFeatured(
        promotion._id,
        !promotion.isFeatured
      );
      toast.success(
        `Khuyến mãi đã được ${
          promotion.isFeatured ? "bỏ nổi bật" : "đặt làm nổi bật"
        }`
      );
      loadPromotions();
    } catch (error) {
      console.error("Error updating featured promotion:", error);
      toast.error("Lỗi khi cập nhật trạng thái nổi bật");
    } finally {
      setUpdatingFeaturedId(null);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, [currentPage, pageSize]);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
          style={{ cursor: "pointer" }}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);

    if (endPage - startPage < maxVisiblePages - 2) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 2));
    }

    // Show ellipsis if needed before middle pages
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            style={{ cursor: "pointer" }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed after middle pages
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            style={{ cursor: "pointer" }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Quản lý khuyến mãi
      </h1>

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-lg">
        {/* Table header with actions */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Danh sách khuyến mãi
          </h2>
          <button
            onClick={() =>
              router.push("/admin/cau-hinh/khuyen-mai/tao-khuyen-mai")
            }
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
            Thêm khuyến mãi
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-b-xl">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : promotions.length === 0 ? (
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
                    Ngày bắt đầu
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Ngày kết thúc
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
                  <td colSpan={9} className="px-6 py-10 text-center">
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
                        Không có khuyến mãi nào.
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
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
                    Nổi bật
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
                {promotions.map((promotion) => (
                  <tr
                    key={promotion._id}
                    className="hover:bg-slate-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {promotion.title}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-start">
                        {updatingFeaturedId === promotion._id ? (
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
                              checked={promotion.isFeatured === true}
                              onCheckedChange={() =>
                                handleToggleFeatured(promotion)
                              }
                              disabled={updatingFeaturedId === promotion._id}
                              className={`${
                                promotion.isFeatured === true
                                  ? "bg-amber-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <span className="text-sm text-gray-600">
                              {promotion.isFeatured === true
                                ? "Nổi bật"
                                : "Thường"}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/cau-hinh/khuyen-mai/chinh-sua/${promotion._id}`
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
                          onClick={() => handleDeletePromotion(promotion._id)}
                          disabled={isDeleting && deleteId === promotion._id}
                          className="inline-flex items-center px-3 py-2 bg-rose-50 border border-rose-300 rounded-md text-xs font-medium text-rose-700 hover:bg-rose-100 hover:border-rose-400 transition-colors shadow-sm"
                        >
                          {isDeleting && deleteId === promotion._id ? (
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
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && promotions.length > 0 && totalPages > 1 && (
          <div className="py-4 border-t border-gray-200">
            <Pagination className="py-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{
                      cursor: currentPage > 1 ? "pointer" : "not-allowed",
                      opacity: currentPage > 1 ? 1 : 0.5,
                    }}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={{
                      cursor:
                        currentPage < totalPages ? "pointer" : "not-allowed",
                      opacity: currentPage < totalPages ? 1 : 0.5,
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="text-center text-sm text-gray-600 mt-2">
              Hiển thị {Math.min((currentPage - 1) * pageSize + 1, totalItems)}{" "}
              - {Math.min(currentPage * pageSize, totalItems)} của {totalItems}{" "}
              khuyến mãi
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khuyến mãi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể
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
              {isDeleting ? "Đang xóa..." : "Xóa khuyến mãi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default AdminPromotionPage;
