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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Plus, Trash2, Loader2, Search } from "lucide-react";
import {
  UnitPrice,
  ConstructionType,
  BuildPackage,
  InvestmentLevel,
  constructionService,
} from "@/lib/services/construction.service";

const UnitPricesPage = () => {
  // State
  const [unitPrices, setUnitPrices] = useState<UnitPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [constructionTypes, setConstructionTypes] = useState<ConstructionType[]>([]);
  const [buildPackages, setBuildPackages] = useState<BuildPackage[]>([]);
  const [investmentLevels, setInvestmentLevels] = useState<InvestmentLevel[]>([]);
  const [filters, setFilters] = useState({
    constructionTypeId: "",
    buildPackageId: "",
    investmentLevelId: "",
  });

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<UnitPrice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    constructionTypeId: "",
    buildPackageId: "",
    investmentLevelId: "",
    pricePerM2: 0,
    description: "",
  });

  // Load reference data
  const loadReferenceData = async () => {
    try {
      const [typesResponse, packagesResponse, levelsResponse] = await Promise.all([
        constructionService.getConstructionTypes(1, 100),
        constructionService.getBuildPackages(1, 100),
        constructionService.getInvestmentLevels(1, 100),
      ]);

      setConstructionTypes(typesResponse.rows);
      setBuildPackages(packagesResponse.rows);
      setInvestmentLevels(levelsResponse.rows);
    } catch (error) {
      console.error("Error loading reference data:", error);
      toast.error("Không thể tải dữ liệu tham chiếu");
    }
  };

  // Load data
  const loadUnitPrices = async () => {
    setIsLoading(true);
    try {
      let response;
      if (filters.constructionTypeId || filters.buildPackageId || filters.investmentLevelId) {
        response = await constructionService.filterUnitPrices({
          ...filters,
          page: currentPage,
          limit: pageSize,
        });
      } else {
        response = await constructionService.getUnitPrices(currentPage, pageSize);
      }
      setUnitPrices(response.rows);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading unit prices:", error);
      toast.error("Không thể tải dữ liệu đơn giá");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReferenceData();
  }, []);

  useEffect(() => {
    loadUnitPrices();
  }, [currentPage, pageSize, filters]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle form change
  const handleFormChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "pricePerM2" ? Number(value) : value,
    }));
  };

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === "_all" ? "" : value,
    }));
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      constructionTypeId: "",
      buildPackageId: "",
      investmentLevelId: "",
    });
    setCurrentPage(1);
  };

  // Open dialog for create/edit
  const handleOpenDialog = (price?: UnitPrice) => {
    if (price) {
      setSelectedPrice(price);
      setFormData({
        constructionTypeId: typeof price.constructionTypeId === 'string' 
          ? price.constructionTypeId 
          : price.constructionTypeId._id,
        buildPackageId: typeof price.buildPackageId === 'string'
          ? price.buildPackageId
          : price.buildPackageId._id,
        investmentLevelId: typeof price.investmentLevelId === 'string'
          ? price.investmentLevelId
          : price.investmentLevelId._id,
        pricePerM2: price.pricePerM2,
        description: price.description || "",
      });
    } else {
      setSelectedPrice(null);
      setFormData({
        constructionTypeId: "",
        buildPackageId: "",
        investmentLevelId: "",
        pricePerM2: 0,
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    // Validate form
    if (!formData.constructionTypeId || !formData.buildPackageId || !formData.investmentLevelId || formData.pricePerM2 <= 0) {
      toast.error("Vui lòng điền đầy đủ thông tin và đơn giá phải lớn hơn 0");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedPrice) {
        // Update
        const updated = await constructionService.updateUnitPrice(
          selectedPrice._id,
          formData
        );
        if (updated) {
          toast.success("Cập nhật đơn giá thành công");
          loadUnitPrices();
          setIsDialogOpen(false);
        } else {
          toast.error("Không thể cập nhật đơn giá");
        }
      } else {
        // Create
        const created = await constructionService.createUnitPrice(formData);
        if (created) {
          toast.success("Thêm đơn giá thành công");
          loadUnitPrices();
          setIsDialogOpen(false);
        } else {
          toast.error("Không thể thêm đơn giá");
        }
      }
    } catch (error) {
      console.error("Error submitting unit price:", error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = (price: UnitPrice) => {
    setSelectedPrice(price);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedPrice) return;

    setIsSubmitting(true);
    try {
      const success = await constructionService.deleteUnitPrice(selectedPrice._id);
      if (success) {
        toast.success("Xóa đơn giá thành công");
        loadUnitPrices();
      } else {
        toast.error("Không thể xóa đơn giá");
      }
    } catch (error) {
      console.error("Error deleting unit price:", error);
      toast.error("Có lỗi xảy ra khi xóa");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Get name from ID
  const getConstructionTypeName = (id: string | ConstructionType) => {
    if (typeof id !== 'string') return id.name;
    const type = constructionTypes.find((t) => t._id === id);
    return type ? type.name : "N/A";
  };

  const getBuildPackageName = (id: string | BuildPackage) => {
    if (typeof id !== 'string') return id.name;
    const pkg = buildPackages.find((p) => p._id === id);
    return pkg ? pkg.name : "N/A";
  };

  const getInvestmentLevelName = (id: string | InvestmentLevel) => {
    if (typeof id !== 'string') return id.name;
    const level = investmentLevels.find((l) => l._id === id);
    return level ? level.name : "N/A";
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
        <h1 className="text-2xl font-bold">Quản lý đơn giá</h1>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Thêm đơn giá
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-muted/40 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-medium mb-4">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="filter-type">Loại công trình</Label>
            <Select
              value={filters.constructionTypeId}
              onValueChange={(value) => handleFilterChange("constructionTypeId", value)}
            >
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="Tất cả loại công trình" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Tất cả loại công trình</SelectItem>
                {constructionTypes.filter(type => !!type._id && type._id !== "").map((type) => (
                  <SelectItem key={type._id} value={type._id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-package">Gói xây dựng</Label>
            <Select
              value={filters.buildPackageId}
              onValueChange={(value) => handleFilterChange("buildPackageId", value)}
            >
              <SelectTrigger id="filter-package">
                <SelectValue placeholder="Tất cả gói xây dựng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Tất cả gói xây dựng</SelectItem>
                {buildPackages.filter(pkg => !!pkg._id && pkg._id !== "").map((pkg) => (
                  <SelectItem key={pkg._id} value={pkg._id}>{pkg.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-level">Mức đầu tư</Label>
            <Select
              value={filters.investmentLevelId}
              onValueChange={(value) => handleFilterChange("investmentLevelId", value)}
            >
              <SelectTrigger id="filter-level">
                <SelectValue placeholder="Tất cả mức đầu tư" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Tất cả mức đầu tư</SelectItem>
                {investmentLevels.filter(level => !!level._id && level._id !== "").map((level) => (
                  <SelectItem key={level._id} value={level._id}>{level.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={resetFilters} className="gap-2">
            <Search className="h-4 w-4" /> Xóa bộ lọc
          </Button>
        </div>
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
                  <TableHead>Loại công trình</TableHead>
                  <TableHead>Gói xây dựng</TableHead>
                  <TableHead>Mức đầu tư</TableHead>
                  <TableHead className="text-right">Đơn giá (VNĐ/m²)</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="w-[150px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unitPrices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  unitPrices.map((price) => (
                    <TableRow key={price._id}>
                      <TableCell>
                        {getConstructionTypeName(price.constructionTypeId)}
                      </TableCell>
                      <TableCell>{getBuildPackageName(price.buildPackageId)}</TableCell>
                      <TableCell>{getInvestmentLevelName(price.investmentLevelId)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(price.pricePerM2)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {price.description || ""}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(price)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(price)}
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
              {selectedPrice ? "Chỉnh sửa đơn giá" : "Thêm đơn giá mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin đơn giá
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="constructionTypeId">Loại công trình</Label>
              <Select
                value={formData.constructionTypeId || undefined}
                onValueChange={(value) => handleFormChange("constructionTypeId", value)}
              >
                <SelectTrigger id="constructionTypeId">
                  <SelectValue placeholder="Chọn loại công trình" />
                </SelectTrigger>
                <SelectContent>
                  {constructionTypes.filter(type => !!type._id && type._id !== "").map((type) => (
                    <SelectItem key={type._id} value={type._id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="buildPackageId">Gói xây dựng</Label>
              <Select
                value={formData.buildPackageId || undefined}
                onValueChange={(value) => handleFormChange("buildPackageId", value)}
              >
                <SelectTrigger id="buildPackageId">
                  <SelectValue placeholder="Chọn gói xây dựng" />
                </SelectTrigger>
                <SelectContent>
                  {buildPackages.filter(pkg => !!pkg._id && pkg._id !== "").map((pkg) => (
                    <SelectItem key={pkg._id} value={pkg._id}>{pkg.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="investmentLevelId">Mức đầu tư</Label>
              <Select
                value={formData.investmentLevelId || undefined}
                onValueChange={(value) => handleFormChange("investmentLevelId", value)}
              >
                <SelectTrigger id="investmentLevelId">
                  <SelectValue placeholder="Chọn mức đầu tư" />
                </SelectTrigger>
                <SelectContent>
                  {investmentLevels.filter(level => !!level._id && level._id !== "").map((level) => (
                    <SelectItem key={level._id} value={level._id}>{level.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pricePerM2">Đơn giá (VNĐ/m²)</Label>
              <Input
                id="pricePerM2"
                type="number"
                min="0"
                step="1000"
                value={formData.pricePerM2}
                onChange={(e) => handleFormChange("pricePerM2", e.target.value)}
                placeholder="Nhập đơn giá"
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Nhập mô tả (không bắt buộc)"
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
              ) : selectedPrice ? (
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
            <AlertDialogTitle>Xác nhận xóa đơn giá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn giá này? Hành động này không thể hoàn tác.
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

export default UnitPricesPage; 