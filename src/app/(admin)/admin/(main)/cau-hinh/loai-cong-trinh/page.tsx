"use client";

import { useEffect, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { ConstructionType, constructionService } from "@/lib/services/construction.service";

const ConstructionTypesPage = () => {
  // State
  const [constructionTypes, setConstructionTypes] = useState<ConstructionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ConstructionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
  });

  // Load data
  const loadConstructionTypes = async () => {
    setIsLoading(true);
    try {
      const response = await constructionService.getConstructionTypes(currentPage, pageSize);
      setConstructionTypes(response.rows);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading construction types:", error);
      toast.error("Không thể tải dữ liệu loại công trình");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConstructionTypes();
  }, [currentPage, pageSize]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open dialog for create/edit
  const handleOpenDialog = (type?: ConstructionType) => {
    if (type) {
      setSelectedType(type);
      setFormData({
        name: type.name,
      });
    } else {
      setSelectedType(null);
      setFormData({
        name: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên loại công trình");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedType) {
        // Update
        const updated = await constructionService.updateConstructionType(
          selectedType._id,
          formData
        );
        if (updated) {
          toast.success("Cập nhật loại công trình thành công");
          loadConstructionTypes();
          setIsDialogOpen(false);
        } else {
          toast.error("Không thể cập nhật loại công trình");
        }
      } else {
        // Create
        const created = await constructionService.createConstructionType(formData);
        if (created) {
          toast.success("Thêm loại công trình thành công");
          loadConstructionTypes();
          setIsDialogOpen(false);
        } else {
          toast.error("Không thể thêm loại công trình");
        }
      }
    } catch (error) {
      console.error("Error submitting construction type:", error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = (type: ConstructionType) => {
    setSelectedType(type);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedType) return;

    setIsSubmitting(true);
    try {
      const success = await constructionService.deleteConstructionType(selectedType._id);
      if (success) {
        toast.success("Xóa loại công trình thành công");
        loadConstructionTypes();
      } else {
        toast.error("Không thể xóa loại công trình");
      }
    } catch (error) {
      console.error("Error deleting construction type:", error);
      toast.error("Có lỗi xảy ra khi xóa");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

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
    <div className="container mx-auto py-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý loại công trình</h1>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Thêm loại công trình
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên loại công trình</TableHead>
                  <TableHead className="w-[200px]">Ngày tạo</TableHead>
                  <TableHead className="w-[150px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {constructionTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  constructionTypes.map((type) => (
                    <TableRow key={type._id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        {type.createdAt
                          ? new Date(type.createdAt).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(type)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(type)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedType ? "Chỉnh sửa loại công trình" : "Thêm loại công trình mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin loại công trình
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Tên loại công trình</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Nhập tên loại công trình (vd: Nhà phố, Biệt thự)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : selectedType ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa loại công trình</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại công trình "{selectedType?.name}"? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các đơn giá liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConstructionTypesPage; 