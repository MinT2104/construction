"use client";

import { useState, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Check, ChevronDown } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import menuItems from "@/lib/constants/menu";

// Định nghĩa interface cho Category
interface Category {
  id: string;
  name: string;
  slug: string;
  isParent: boolean;
  parentId: string | null;
  type: "single" | "category" | "house-design" | undefined;
}

// Generate categories from menu items
const CATEGORIES: Category[] = menuItems
  .filter((item) => item.path)
  .flatMap((item) => {
    const mainCategory: Category = {
      id: item.path?.split("/").pop() || "",
      name: item.label,
      slug: item.path?.split("/").pop() || "",
      isParent: true,
      parentId: null,
      type: item.type,
    };

    // Nếu có submenu và không rỗng, thì thêm cả submenu items
    if (item.submenu && item.submenu.length > 0) {
      return item.submenu.map((subItem) => ({
        id: subItem.path?.split("/").pop() || "",
        name: subItem.label,
        slug: subItem.path?.split("/").pop() || "",
        isParent: false,
        parentId: item.path?.split("/").pop() || "",
        type: subItem.type,
      })) as Category[];
    }

    // Nếu không có submenu hoặc submenu rỗng, thêm mainCategory vào list hiển thị
    return [mainCategory];
  });

console.log("Tất cả các danh mục:", CATEGORIES);

const TAGS = [
  // Thiết kế
  { id: "design1", name: "Thiết kế biệt thự", slug: "thiet-ke-biet-thu" },
  { id: "design2", name: "Thiết kế nhà phố", slug: "thiet-ke-nha-pho" },
  { id: "design3", name: "Thiết kế nội thất", slug: "thiet-ke-noi-that" },
  { id: "design4", name: "Quy trình thiết kế", slug: "quy-trinh-thiet-ke" },
  { id: "design5", name: "Phong cách hiện đại", slug: "phong-cach-hien-dai" },
  { id: "design6", name: "Phong cách tối giản", slug: "phong-cach-toi-gian" },
  { id: "design7", name: "Phong cách cổ điển", slug: "phong-cach-co-dien" },

  // Xây nhà
  { id: "build1", name: "Xây nhà trọn gói", slug: "xay-nha-tron-goi" },
  { id: "build2", name: "Xây nhà phần thô", slug: "xay-nha-phan-tho" },
  { id: "build3", name: "Công trình tiêu biểu", slug: "cong-trinh-tieu-bieu" },
  { id: "build4", name: "Xây nhà TP HCM", slug: "xay-nha-tp-hcm" },
  { id: "build5", name: "Chi phí xây dựng", slug: "chi-phi-xay-dung" },
  { id: "build6", name: "Vật liệu xây dựng", slug: "vat-lieu-xay-dung" },
  { id: "build7", name: "Tiến độ thi công", slug: "tien-do-thi-cong" },

  // Sửa nhà
  { id: "repair1", name: "Sửa nhà trọn gói", slug: "sua-nha-tron-goi" },
  { id: "repair2", name: "Cải tạo nhà cũ", slug: "cai-tao-nha-cu" },
  { id: "repair3", name: "Sửa nhà nâng tầng", slug: "sua-nha-nang-tang" },
  { id: "repair4", name: "Đơn giá sửa nhà", slug: "don-gia-sua-nha" },

  // Mẫu nhà đẹp
  { id: "model1", name: "Mẫu nhà phố", slug: "mau-nha-pho" },
  { id: "model2", name: "Mẫu biệt thự", slug: "mau-biet-thu" },
  { id: "model3", name: "Mẫu nhà cấp 4", slug: "mau-nha-cap-4" },
  { id: "model4", name: "Mẫu nội thất", slug: "mau-noi-that" },
  { id: "model5", name: "Mẫu chung cư", slug: "mau-chung-cu" },

  // Cẩm nang và Tư vấn
  { id: "guide1", name: "Phong thủy", slug: "phong-thuy" },
  { id: "guide2", name: "Luật xây dựng", slug: "luat-xay-dung" },
  { id: "guide3", name: "Tư vấn giám sát", slug: "tu-van-giam-sat" },
  { id: "guide4", name: "Cẩm nang xây nhà", slug: "cam-nang-xay-nha" },
  { id: "guide5", name: "Kinh nghiệm xây nhà", slug: "kinh-nghiem-xay-nha" },

  // Báo giá
  { id: "price1", name: "Báo giá thiết kế", slug: "bao-gia-thiet-ke" },
  { id: "price2", name: "Báo giá xây dựng", slug: "bao-gia-xay-dung" },
  { id: "price3", name: "Báo giá sửa chữa", slug: "bao-gia-sua-chua" },

  // Kỹ thuật
  { id: "tech1", name: "Kết cấu", slug: "ket-cau" },
  { id: "tech2", name: "Móng nhà", slug: "mong-nha" },
  { id: "tech3", name: "Hệ thống điện", slug: "he-thong-dien" },
  { id: "tech4", name: "Hệ thống nước", slug: "he-thong-nuoc" },
  { id: "tech5", name: "Mái nhà", slug: "mai-nha" },
];

interface CategoryTagSelectorProps {
  form: UseFormReturn<any>;
}

export default function CategoryTagSelector({
  form,
}: CategoryTagSelectorProps) {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const categories = form.watch("categories") || [];
  const visibleCategories = categories.filter((cat: any) => !cat.isHidden);
  const tags = form.watch("tags") || [];

  // Refs để truy cập trực tiếp vào input elements
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Xử lý focus khi dropdown mở
  useEffect(() => {
    if (dropdownOpen && categoryInputRef.current) {
      setTimeout(() => {
        categoryInputRef.current?.focus();
      }, 10);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (tagsDropdownOpen && tagInputRef.current) {
      setTimeout(() => {
        tagInputRef.current?.focus();
      }, 10);
    }
  }, [tagsDropdownOpen]);

  const handleAddCategory = (category: Category) => {
    // Tìm danh mục cha tương ứng nếu có
    const parentCategory = category.parentId
      ? CATEGORIES.find((cat: Category) => cat.id === category.parentId)
      : null;

    // In thông tin để debug
    console.log("Đã chọn danh mục:", category);
    console.log("Danh mục cha tương ứng:", parentCategory);

    // Cập nhật form - Lưu đầy đủ thông tin bao gồm danh mục và danh mục cha nếu có
    if (!category.isParent && parentCategory) {
      // Nếu là danh mục con và tìm thấy danh mục cha
      const selectedCategory = {
        ...category,
        parent: parentCategory,
      };

      console.log("Đã thêm danh mục với thông tin đầy đủ:", selectedCategory);
      form.setValue("categories", [selectedCategory]);
    } else {
      // Nếu là danh mục cha hoặc không tìm thấy danh mục cha
      console.log("Đã thêm danh mục không có parent:", category);
      form.setValue("categories", [category]);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    const currentCategories = form.getValues("categories") || [];

    const categoryToRemove = currentCategories.find(
      (cat: any) => cat.id === categoryId
    );

    if (categoryToRemove && !categoryToRemove.isParent) {
      form.setValue("categories", []);
    } else {
      form.setValue("categories", []);
    }
  };

  const handleAddTag = (tag: any) => {
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.find((t: any) => t.id === tag.id)) {
      form.setValue("tags", [...currentTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((t: any) => t.id !== tagId)
    );
  };

  // Hàm xử lý thay đổi filter danh mục
  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategoryFilter(e.target.value);
    // Giữ dropdown mở khi đang search
    setDropdownOpen(true);
  };

  // Phân loại danh mục theo cấu trúc menu
  const groupCategoriesByMenu = (categories: Category[]) => {
    // Tạo cấu trúc nhóm giống với cấu trúc menu
    const groups: Record<string, Category[]> = {};

    // Lấy tất cả top-level menu items (main categories)
    const mainMenuCategories = menuItems.filter((item) => item.path);

    // Tạo một nhóm cho mỗi main menu item
    mainMenuCategories.forEach((menuItem) => {
      const mainId = menuItem.path?.split("/").pop() || "";
      groups[mainId] = [];

      // Tìm danh mục tương ứng với menu item này
      const mainCategory = categories.find(
        (cat) => cat.id === mainId && cat.isParent
      );

      // Nếu tìm thấy, thêm vào nhóm
      if (mainCategory) {
        groups[mainId].push(mainCategory);
      }

      // Thêm tất cả submenu items nếu có
      if (menuItem.submenu && menuItem.submenu.length > 0) {
        menuItem.submenu.forEach((subItem) => {
          const subId = subItem.path?.split("/").pop() || "";
          const subCategory = categories.find(
            (cat) => cat.id === subId && !cat.isParent
          );

          if (subCategory) {
            groups[mainId].push(subCategory);
          }
        });
      }
    });

    return groups;
  };

  // Lọc danh mục theo filter
  const filteredCategories = CATEGORIES.filter((category: Category) =>
    category.name.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  // Loại bỏ các danh mục trùng lặp bằng cách giữ lại id duy nhất
  const uniqueCategories = Array.from(
    new Map(filteredCategories.map((item) => [item.id, item])).values()
  );

  // Nhóm danh mục theo cấu trúc menu
  const groupedCategoriesByMenu = groupCategoriesByMenu(uniqueCategories);

  // Hàm xử lý thay đổi filter thẻ
  const handleTagFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagFilter(e.target.value);
    // Giữ dropdown mở khi đang search
    setTagsDropdownOpen(true);
  };

  // Lọc thẻ tags theo filter
  const filteredTags = TAGS.filter((tag) =>
    tag.name.toLowerCase().includes(tagFilter.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh mục & Thẻ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <FormField
          control={form.control}
          name="categories"
          rules={{
            validate: {
              required: (value) =>
                (value && value.length > 0) ||
                "Vui lòng chọn ít nhất một danh mục",
            },
          }}
          render={() => (
            <FormItem>
              <FormLabel className="flex items-center mb-2">
                Danh mục <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <div className="space-y-2">
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-white border-gray-200 hover:bg-gray-50 transition-colors"
                      type="button"
                    >
                      <span className="flex items-center">
                        <span className="text-gray-500">Chọn danh mục</span>
                        {visibleCategories.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            {visibleCategories.length}
                          </Badge>
                        )}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[500px] max-h-[400px] overflow-auto p-2 rounded-lg shadow-lg border border-gray-100"
                    align="start"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-1 py-2 sticky top-0 bg-white z-10">
                      <Input
                        ref={categoryInputRef}
                        placeholder="Tìm danh mục..."
                        value={categoryFilter}
                        onChange={handleCategoryFilterChange}
                        className="h-9 border-gray-200 focus-visible:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </div>
                    <ScrollArea className="h-[280px] pr-2">
                      {uniqueCategories.length > 0 ? (
                        <>
                          {/* Lặp qua các nhóm danh mục theo menu */}
                          {Object.keys(groupedCategoriesByMenu).map(
                            (menuId) => {
                              const categories =
                                groupedCategoriesByMenu[menuId];
                              if (categories.length === 0) return null;

                              // Tìm thông tin về menu item này
                              const menuItem = menuItems.find(
                                (item) => item.path?.split("/").pop() === menuId
                              );
                              if (!menuItem) return null;

                              return (
                                <div key={menuId}>
                                  {/* Header của nhóm */}
                                  <div
                                    className={cn(
                                      "px-2 py-1.5 sticky bg-gray-100 font-medium text-sm my-1 rounded",
                                      menuItem.type === "single"
                                        ? "text-sky-700 bg-sky-50"
                                        : menuItem.type === "house-design"
                                        ? "text-lime-700 bg-lime-50"
                                        : "text-indigo-700 bg-indigo-50"
                                    )}
                                  >
                                    {menuItem.label}
                                    {menuItem.type && (
                                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-white/60">
                                        {menuItem.type === "single"
                                          ? "Đơn"
                                          : menuItem.type === "house-design"
                                          ? "Mẫu nhà"
                                          : "Danh mục"}
                                      </span>
                                    )}
                                  </div>

                                  {/* Danh sách các mục trong nhóm */}
                                  {categories.map((category: Category) => {
                                    // Kiểm tra xem đây là main hay sub category
                                    const isMainCategory =
                                      category.id === menuId;

                                    return (
                                      <DropdownMenuItem
                                        key={category.id}
                                        onClick={() => {
                                          handleAddCategory(category);
                                          setDropdownOpen(false);
                                        }}
                                        className={cn(
                                          "cursor-pointer flex items-center p-2 my-1 rounded-md hover:bg-gray-50 transition-colors",
                                          !isMainCategory &&
                                            "ml-3 border-l-2 border-l-gray-200 pl-3"
                                        )}
                                      >
                                        <div className="flex items-center w-full">
                                          <div
                                            className={cn(
                                              "w-5 h-5 rounded-full flex items-center justify-center mr-2",
                                              categories.some(
                                                (c: any) => c.id === category.id
                                              )
                                                ? "bg-blue-100"
                                                : "border border-gray-200"
                                            )}
                                          >
                                            <Check
                                              className={cn(
                                                "h-3 w-3 text-blue-600",
                                                categories.some(
                                                  (c: any) =>
                                                    c.id === category.id
                                                )
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                          </div>

                                          {/* Tên danh mục */}
                                          <span
                                            className={cn(
                                              "font-medium",
                                              isMainCategory && "font-semibold"
                                            )}
                                          >
                                            {category.name}
                                          </span>

                                          {/* Thẻ phân loại */}
                                          {category.type && (
                                            <span
                                              className={cn(
                                                "ml-2 text-xs px-1.5 py-0.5 rounded",
                                                category.type === "single"
                                                  ? "bg-sky-100 text-sky-700"
                                                  : category.type ===
                                                    "house-design"
                                                  ? "bg-lime-100 text-lime-700"
                                                  : "bg-indigo-100 text-indigo-700"
                                              )}
                                            >
                                              {category.type === "single"
                                                ? "Đơn"
                                                : category.type ===
                                                  "house-design"
                                                ? "Mẫu nhà"
                                                : "Danh mục"}
                                            </span>
                                          )}

                                          {/* Chỉ định danh mục con */}
                                          {!category.isParent && (
                                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded">
                                              Con
                                            </span>
                                          )}
                                        </div>
                                      </DropdownMenuItem>
                                    );
                                  })}
                                </div>
                              );
                            }
                          )}
                        </>
                      ) : (
                        <div className="text-center py-6 text-sm text-gray-500">
                          Không tìm thấy danh mục
                        </div>
                      )}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex flex-wrap gap-2 mt-3">
                  {visibleCategories.map((category: any) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="py-1.5 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      {category.name}
                      <button
                        type="button"
                        className="ml-2 rounded-full h-4 w-4 bg-blue-100 hover:bg-blue-200 flex items-center justify-center outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                        onClick={() => handleRemoveCategory(category.id)}
                      >
                        <X className="h-2.5 w-2.5 text-blue-600" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          rules={{
            validate: {
              required: (value) =>
                (value && value.length > 0) || "Vui lòng chọn ít nhất một thẻ",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center mb-2">
                Thẻ <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <div className="space-y-2">
                <DropdownMenu
                  open={tagsDropdownOpen}
                  onOpenChange={setTagsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between bg-white border-gray-200 hover:bg-gray-50 transition-colors"
                      )}
                      type="button"
                    >
                      <span className="flex items-center">
                        <span className="text-gray-500">Chọn thẻ</span>
                        {tags.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                          >
                            {tags.length}
                          </Badge>
                        )}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-72 max-h-[400px] overflow-auto p-2 rounded-lg shadow-lg border border-gray-100"
                    align="start"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="px-1 py-2 sticky top-0 bg-white z-10">
                      <Input
                        ref={tagInputRef}
                        placeholder="Tìm thẻ..."
                        value={tagFilter}
                        onChange={handleTagFilterChange}
                        className="h-9 border-gray-200 focus-visible:ring-indigo-500"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </div>
                    <ScrollArea className="h-[280px] pr-2">
                      {filteredTags.length > 0 ? (
                        filteredTags.map((tag) => (
                          <DropdownMenuItem
                            key={tag.id}
                            onClick={() => {
                              handleAddTag(tag);
                              // Không đóng dropdown sau khi chọn tag để người dùng có thể chọn nhiều
                            }}
                            className="cursor-pointer flex items-center p-2 my-1 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center w-full">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center mr-2",
                                  tags.find((t: any) => t.id === tag.id)
                                    ? "bg-indigo-100"
                                    : "border border-gray-200"
                                )}
                              >
                                <Check
                                  className={cn(
                                    "h-3 w-3 text-indigo-600",
                                    tags.find((t: any) => t.id === tag.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </div>
                              <span className="font-medium">{tag.name}</span>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="text-center py-6 text-sm text-gray-500">
                          Không tìm thấy thẻ
                        </div>
                      )}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag: any) => (
                    <Badge
                      key={tag.id}
                      className="py-1.5 px-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                      {tag.name}
                      <button
                        type="button"
                        className="ml-2 rounded-full h-4 w-4 bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
                        onClick={() => handleRemoveTag(tag.id)}
                      >
                        <X className="h-2.5 w-2.5 text-indigo-600" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
