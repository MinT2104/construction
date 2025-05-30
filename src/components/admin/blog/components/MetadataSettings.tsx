"use client";

import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BlogStatus } from "@/lib/enums";

interface MetadataSettingsProps {
  form: UseFormReturn<any>; // Adjust 'any' to your specific Zod schema type
}

export default function MetadataSettings({ form }: MetadataSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thuộc tính bài viết</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={BlogStatus.DRAFT}>Bản nháp</SelectItem>
                  <SelectItem value={BlogStatus.PUBLISHED}>Xuất bản</SelectItem>
                  <SelectItem value={BlogStatus.ARCHIVED}>Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-background">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isFeatured"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="isFeatured" className="cursor-pointer">
                  Bài viết nổi bật
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
