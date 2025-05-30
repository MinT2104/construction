"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, Save, ArrowLeft } from "lucide-react";

// Import custom components
import MainContentForm from "./components/MainContentForm";
import CategoryTagSelector from "./components/CategoryTagSelector";
import MetadataSettings from "./components/MetadataSettings";
import ImageSettings from "./components/ImageSettings";
import SeoSettings from "./components/SeoSettings";
import { BlogStatus } from "@/lib/enums";
import { BlogValidation } from "@/lib/enums";
import React from "react";
import {
  formSchema,
  FormValues,
  BlogPost,
  BlogPostUpdate,
} from "@/lib/types/modules/blog.interface";
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

export default function EditPostView() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);

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
  const { watch, setValue, getValues, reset } = form;

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        setIsLoading(true);
        // Sử dụng API lấy bài viết theo ID thay vì slug
        const data = await blogService.getPostById(postId);
        const postData = data.data;

        if (!postData) {
          toast.error("Không tìm thấy bài viết");
          router.push("/admin/bai-viet");
          return;
        }

        setPost(postData);

        // Map post data to form values
        const formValues: FormValues = {
          title: postData.title,
          content: postData.content,
          status: postData.status,
          publishDate: new Date(postData.createdAt),
          isFeatured: false, // Giả định không có trường này trong API response
          meta: {
            canonicalUrl: postData.meta?.canonicalUrl || "",
            socialPreviewImage: postData.meta?.socialPreviewImage || "",
            seoTitle: postData.meta?.seoTitle || "",
            seoDescription: postData.meta?.seoDescription || "",
          },
          featuredImage: {
            url: postData.featuredImage?.url || "",
            alt: postData.featuredImage?.alt || "",
          },
          excerpt: postData.excerpt || "",
          shortDescription: postData.excerpt || "",
          // Map categories from API response to categories in form
          categories: postData.categories
            ? mapCategoriesToFormCategories(postData.categories.slice(0, 1))
            : [],
          // Map tags from API response to tags in form
          tags: postData.tags ? mapTagsToFormTags(postData.tags) : [],
        };

        // Set content for the rich text editor
        setContent(postData.content);

        // Reset form with fetched values
        reset(formValues);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Lỗi khi tải bài viết");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, reset, router]);

  // Map categories from API response to form format
  const mapCategoriesToFormCategories = (apiCategories: any[]) => {
    // Find the corresponding categories in CATEGORIES
    const formattedCategories = apiCategories.map((apiCategory) => {
      const matchedCategory = CATEGORIES.find(
        (cat) => cat.slug === apiCategory.slug
      );
      if (matchedCategory) {
        return {
          ...matchedCategory,
          _id: apiCategory._id, // Keep the _id from API for reference
        };
      }
      return {
        id: apiCategory.slug,
        name: apiCategory.name,
        slug: apiCategory.slug,
        isParent: true, // Assume it's a parent if not found
        parentId: null,
        type: "category", // Default type if not found
        _id: apiCategory._id,
      };
    });

    return formattedCategories;
  };

  // Map tags from API response to form format
  const mapTagsToFormTags = (apiTags: any[]) => {
    return apiTags.map((tag) => ({
      id: tag.slug,
      name: tag.name,
      slug: tag.slug,
      _id: tag._id,
    }));
  };

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    console.log("EditPostView handleContentChange:", {
      length: newContent.length,
      textLength: newContent.replace(/<[^>]*>/g, "").length,
    });

    // Update local state
    setContent(newContent);
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

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!post || !post._id) {
      toast.error("Không tìm thấy thông tin bài viết để cập nhật");
      return;
    }

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

      // Tìm thông tin parent category nếu có
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
      const blogData: BlogPostUpdate = {
        _id: post._id,
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
      };

      console.log("Sending blog data to API:", blogData);

      // Gọi API cập nhật bài viết
      const response = await blogService.updatePost(blogData);

      if (response) {
        toast.success("Bài viết đã được cập nhật thành công!");
        router.push("/admin/bai-viet");
      } else {
        throw new Error("Cập nhật bài viết thất bại");
      }
    } catch (error: any) {
      console.error("Error updating blog post:", error);

      // Hiển thị thông báo lỗi chi tiết từ API hoặc thông báo mặc định
      const errorMessage =
        error.message || "Cập nhật bài viết thất bại. Vui lòng thử lại.";
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-lg text-gray-600">Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <FormProvider {...form}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Quay lại
            </Button>
            <h1 className="text-3xl font-bold">Chỉnh sửa bài viết</h1>
          </div>
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
                          Cập nhật bài viết
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
