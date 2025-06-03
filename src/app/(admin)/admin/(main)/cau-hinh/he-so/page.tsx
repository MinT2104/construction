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
import { Textarea } from "@/components/ui/textarea";
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
import { Coefficient, constructionService } from "@/lib/services/construction.service";

const CoefficientManagementPage = () => {
  // State
  const [coefficients, setCoefficients] = useState<Coefficient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoefficient, setSelectedCoefficient] = useState<Coefficient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    coefficient: 1,
    notes: "",
  });

  // Load data
  const loadCoefficients = async () => {
    setIsLoading(true);
    try {
      const response = await constructionService.getCoefficients(currentPage, pageSize);
      setCoefficients(response.rows);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading coefficients:", error);
      toast.error("Không thể tải dữ liệu hệ số");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoefficients();
  }, [currentPage, pageSize]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "coefficient" ? parseFloat(value) || 0 : value,
    }));
  };

  // Open dialog for create/edit
  const handleOpenDialog = (coefficient?: Coefficient) => {
    if (coefficient) {
      setSelectedCoefficient(coefficient);
      setFormData({
        code: coefficient.code,
        name: coefficient.name,
        coefficient: coefficient.coefficient,
        notes: coefficient.notes || "",
      });
    } else {
      setSelectedCoefficient(null);
      setFormData({
        code: "",
        name: "",
        coefficient: 1,
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    // Validate form
    if (!formData.code.trim() || !formData.name.trim() || formData.coefficient <= 0) {
      toast.error("Vui lòng điền đầy đủ thông tin và hệ số phải lớn hơn 0");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedCoefficient) {
        // Update
        const updated = await constructionService.updateCoefficient(
          selectedCoefficient._id,
          formData
        );
        if (updated) {
          toast.success("Cập nhật hệ số thành công");
          loadCoefficients();
          setIsDialogOpen(false);
        } else {
          toast.error("Không thể cập nhật hệ số");
        }
      } else {
        // Create
        const created = await constructionService.createCoefficient(formData);
        if (created) {
          toast.success("Thêm hệ số thành công");
          loadCoefficients();
          setIsDialogOpen(false);
        } else {
          toast.error("Không thể thêm hệ số");
        }
      }
    } catch (error) {
      console.error("Error submitting coefficient:", error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = (coefficient: Coefficient) => {
    setSelectedCoefficient(coefficient);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedCoefficient) return;

    setIsSubmitting(true);
    try {
      const success = await constructionService.deleteCoefficient(selectedCoefficient._id);
      if (success) {
        toast.success("Xóa hệ số thành công");
        loadCoefficients();
      } else {
        toast.error("Không thể xóa hệ số");
      }
    } catch (error) {
      console.error("Error deleting coefficient:", error);
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
        <h1 className="text-2xl font-bold">Quản lý hệ số quy đổi diện tích</h1>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Thêm hệ số
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
                  <TableHead className="w-[100px]">Mã</TableHead>
                  <TableHead>Tên hệ số</TableHead>
                  <TableHead className="w-[150px] text-center">Giá trị</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead className="w-[150px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coefficients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  coefficients.map((coefficient) => (
                    <TableRow key={coefficient._id}>
                      <TableCell className="font-medium">{coefficient.code}</TableCell>
                      <TableCell>{coefficient.name}</TableCell>
                      <TableCell className="text-center">{coefficient.coefficient}</TableCell>
                      <TableCell>{coefficient.notes}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(coefficient)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(coefficient)}
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
              {selectedCoefficient ? "Chỉnh sửa hệ số" : "Thêm hệ số mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin hệ số quy đổi diện tích
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Mã hệ số</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="Nhập mã hệ số (vd: floor, roof_btct)"
                />
              </div>
              <div>
                <Label htmlFor="coefficient">Giá trị hệ số</Label>
                <Input
                  id="coefficient"
                  name="coefficient"
                  type="number"
                  step="0.1"
                  value={formData.coefficient}
                  onChange={handleFormChange}
                  placeholder="Nhập giá trị hệ số"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="name">Tên hệ số</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Nhập tên hệ số"
              />
            </div>
            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                placeholder="Nhập ghi chú (không bắt buộc)"
                rows={3}
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
              ) : selectedCoefficient ? (
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
            <AlertDialogTitle>Xác nhận xóa hệ số</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hệ số "{selectedCoefficient?.name}"? Hành động này không thể hoàn tác.
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

export default CoefficientManagementPage; 