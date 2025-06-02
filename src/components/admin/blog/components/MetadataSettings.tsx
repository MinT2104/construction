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
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
