"use client";

import { useEffect, useState, useCallback } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { slugify } from "@/lib/utils/slugify";
import EnhancedRichTextEditor from "./EnhancedRichTextEditor";
import { BlogValidation as PromotionValidation } from "@/lib/enums";

interface MainContentFormProps {
  form: UseFormReturn<any>; // Adjust 'any' to your specific Zod schema type if possible
  richTextValue: string;
  onRichTextChange: (value: string) => void;
}

export default function MainContentForm({
  form,
  richTextValue,
  onRichTextChange,
}: MainContentFormProps) {
  const titleValue = form.watch("title");
  const slugValue = form.watch("slug");
  const shortDescValue = form.watch("shortDescription") || "";

  const [titleCharCount, setTitleCharCount] = useState(titleValue?.length || 0);
  const [shortDescCharCount, setShortDescCharCount] = useState(
    shortDescValue.length
  );

  // Hàm đếm ký tự đồng nhất
  const countCharacters = useCallback((text: string) => {
    if (!text) return 0;
    return text.length;
  }, []);

  useEffect(() => {
    setTitleCharCount(countCharacters(titleValue));
  }, [titleValue, countCharacters]);

  useEffect(() => {
    setShortDescCharCount(countCharacters(shortDescValue));
  }, [shortDescValue, countCharacters]);

  useEffect(() => {
    if (titleValue && (!slugValue || slugValue === "")) {
      form.setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, slugValue, form]);

  // Handle rich text changes
  const handleRichTextChange = useCallback(
    (value: string) => {
      // Directly set the form value
      form.setValue("content", value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Also notify parent component
      onRichTextChange(value);
    },
    [form, onRichTextChange]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nội dung chính</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center mb-2">
                Tiêu đề <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề bài viết" {...field} />
              </FormControl>
              <div className="mt-1 text-sm text-muted-foreground flex justify-between">
                <span>Số ký tự: {titleCharCount}</span>
                <span
                  className={
                    titleCharCount < PromotionValidation.TITLE.MIN_LENGTH ||
                    titleCharCount > PromotionValidation.TITLE.MAX_LENGTH
                      ? "text-red-500"
                      : ""
                  }
                >
                  Yêu cầu: {PromotionValidation.TITLE.MIN_LENGTH} -{" "}
                  {PromotionValidation.TITLE.MAX_LENGTH} ký tự
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center mb-2">
                Mô tả ngắn <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả ngắn gọn (tối đa 160 ký tự cho SEO)"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value ?? ""} // Handle potential undefined value
                />
              </FormControl>
              <div className="mt-1 text-sm text-muted-foreground flex justify-between">
                <span>Số ký tự: {shortDescCharCount}</span>
                <span
                  className={
                    shortDescCharCount <
                      PromotionValidation.EXCERPT.MIN_LENGTH ||
                    shortDescCharCount > PromotionValidation.EXCERPT.MAX_LENGTH
                      ? "text-red-500"
                      : ""
                  }
                >
                  Yêu cầu: {PromotionValidation.EXCERPT.MIN_LENGTH} -{" "}
                  {PromotionValidation.EXCERPT.MAX_LENGTH} ký tự
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center mb-2">
                Nội dung <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <EnhancedRichTextEditor
                    value={richTextValue}
                    onChange={handleRichTextChange}
                    height="500px"
                    minLength={PromotionValidation.CONTENT.MIN_LENGTH}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
