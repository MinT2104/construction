"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, Save } from "lucide-react";

// Import custom components
import MainContentForm from "./components/MainContentForm";
import CategoryTagSelector from "./components/CategoryTagSelector";
import MetadataSettings from "./components/MetadataSettings";
import ImageSettings from "./components/ImageSettings";
import SeoSettings from "./components/SeoSettings";
import { BlogStatus } from "@/lib/enums";
import { BlogValidation } from "@/lib/enums";
import { slugify } from "@/lib/utils/slugify";
import React from "react";
import { formSchema, FormValues } from "@/lib/types/modules/blog.interface";
import { blogService } from "@/lib/services/blog.service";
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

    const subCategories: Category[] = [];
    // Nếu có submenu và không rỗng, thì thêm cả submenu items
    if (item.submenu && item.submenu.length > 0) {
      subCategories.push(
        ...item.submenu.map((subItem) => ({
          id: subItem.path?.split("/").pop() || "",
          name: subItem.label,
          slug: subItem.path?.split("/").pop() || "",
          isParent: false,
          parentId: item.path?.split("/").pop() || "",
          type: subItem.type,
        }))
      );
    }

    // Nếu không có submenu hoặc submenu rỗng, thêm mainCategory vào list hiển thị
    return [mainCategory, ...subCategories];
  });

export default function CreateBlogPost() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  console.log("CATEGORIES", CATEGORIES);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      status: BlogStatus.DRAFT,
      publishDate: new Date(),
      isFeatured: false,
      meta: {
        canonicalUrl: "",
        socialPreviewImage: "",
      },
      featuredImage: {
        url: "",
        alt: "",
      },
      excerpt: "",
      shortDescription: "",
      categories: [],
      tags: [],
    },
    mode: "onChange",
  });

  // Watch for values that need special handling
  const { watch, setValue, getValues } = form;

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    console.log("CreatePostView handleContentChange:", {
      length: newContent.length,
      textLength: newContent.replace(/<[^>]*>/g, "").length,
    });

    // Update local state
    setContent(newContent);

    // This was previously causing an infinite loop because MainContentForm also calls setValue
    // Now MainContentForm handles the form update
  }, []);

  // Log form errors for debugging
  useEffect(() => {
    const subscription = form.watch(() => {
      // Check content specifically
      const contentValue = getValues("content");
      if (contentValue && contentValue !== content) {
        console.log("Form content changed but not in sync with state:", {
          formContentLength: contentValue.length,
          stateContentLength: content.length,
        });
      }

      if (Object.keys(form.formState.errors).length > 0) {
        console.log("Form errors:", form.formState.errors);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, content, getValues]);

  // Log content changes
  useEffect(() => {
    if (content) {
      console.log("Content updated:", {
        length: content.length,
        textLength: content.replace(/<[^>]*>/g, "").length,
        excerpt: content.replace(/<[^>]*>/g, "").substring(0, 50) + "...",
      });
    }
  }, [content]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    console.log("Submitting form with values:", values);

    // Ensure content is properly set in form values
    if (content && content !== values.content) {
      console.log("Content in state and form don't match, updating form value");
      values.content = content;
    }

    const contentTextLength = values.content.replace(/<[^>]*>/g, "").length;
    console.log("Content text length:", contentTextLength);

    // Double check if content is valid
    if (contentTextLength < BlogValidation.CONTENT.MIN_LENGTH) {
      toast.error(
        `Nội dung cần tối thiểu ${BlogValidation.CONTENT.MIN_LENGTH} ký tự (hiện tại: ${contentTextLength})`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Lấy danh mục đã chọn
      const selectedCategory = values.categories[0] as unknown as any; // Lấy danh mục đầu tiên (và duy nhất)

      if (!selectedCategory) {
        toast.error("Vui lòng chọn ít nhất một danh mục");
        setIsSubmitting(false);
        return;
      }

      console.log("Danh mục đã chọn từ form:", selectedCategory);

      // Chuẩn bị thông tin thẻ tags
      const tagsData = values.tags;

      // Chuẩn bị danh sách categories để gửi đi
      const categoriesToSubmit = [];

      // Thêm danh mục đã chọn
      categoriesToSubmit.push({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
      });

      const filteredCategories = CATEGORIES.find(
        (cat) => cat.slug === selectedCategory.slug
      );

      const parentCategory = CATEGORIES.find(
        (cat) => cat.slug === filteredCategories?.parentId
      );

      if (parentCategory) {
        categoriesToSubmit.push({
          name: parentCategory.name,
          slug: parentCategory.slug,
        });
      }

      // Chuẩn bị dữ liệu cho API
      const blogData: FormValues = {
        title: values.title,
        content: values.content,
        categories: categoriesToSubmit,
        tags: tagsData,
        status: values.status as "draft" | "published",
        excerpt: values.shortDescription || values.excerpt || "",
        featuredImage: {
          url: values.featuredImage?.url || "",
          alt: values.featuredImage?.alt || "",
        },
        // Thêm các meta data
        meta: {
          seoDescription: values?.meta?.seoDescription || "",
          seoTitle: values?.meta?.seoTitle || "",
          canonicalUrl: values?.meta?.canonicalUrl || "",
          socialPreviewImage: values?.meta?.socialPreviewImage || "",
        },
        isFeatured: values.isFeatured || false,
        publishDate: values.publishDate || new Date(),
      };

      console.log("Sending blog data to API:", blogData);

      // Gọi API tạo bài viết
      await blogService.createPost(blogData);

      toast.success("Bài viết đã được tạo thành công!");
      router.push("/admin/bai-viet");
    } catch (error: any) {
      console.error("Error creating blog post:", error);

      // Hiển thị thông báo lỗi chi tiết từ API hoặc thông báo mặc định
      const errorMessage =
        error.message || "Tạo bài viết thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      confirm("Bạn có chắc chắn muốn hủy? Các thay đổi chưa lưu sẽ bị mất.")
    ) {
      router.back();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <FormProvider {...form}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tạo bài viết mới</h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? "Chỉnh sửa" : "Xem trước"}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6">
                {!previewMode ? (
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="content">Nội dung</TabsTrigger>
                      <TabsTrigger value="categories">
                        Danh mục & Thẻ
                      </TabsTrigger>
                      <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-6">
                      <MainContentForm
                        form={form}
                        richTextValue={content}
                        onRichTextChange={handleContentChange}
                      />
                    </TabsContent>

                    <TabsContent value="categories" className="space-y-6">
                      <CategoryTagSelector form={form} />
                    </TabsContent>

                    <TabsContent value="seo" className="space-y-6">
                      <SeoSettings form={form} />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-muted">
                      <CardTitle>Xem trước bài viết</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {form.watch("featuredImage.url") && (
                        <div className="mb-6 aspect-video w-full overflow-hidden rounded-md bg-muted">
                          <img
                            src={form.watch("featuredImage.url")}
                            alt={
                              form.watch("featuredImage.alt") ||
                              form.watch("title")
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                        {form.watch("title") || "Tiêu đề bài viết"}
                      </h1>

                      {form.watch("shortDescription") && (
                        <p className="text-xl text-muted-foreground mb-8">
                          {form.watch("shortDescription")}
                        </p>
                      )}

                      <div
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            content ||
                            "<p>Nội dung bài viết sẽ hiển thị ở đây...</p>",
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="lg:sticky lg:top-20">
                  <MetadataSettings form={form} />

                  <div className="mt-6">
                    <ImageSettings form={form} />
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-1"
                    >
                      {isSubmitting ? (
                        <React.Fragment>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Save className="h-4 w-4 mr-1" />
                          Tạo bài viết
                        </React.Fragment>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </FormProvider>
      <Toaster richColors position="top-right" />
    </div>
  );
}
