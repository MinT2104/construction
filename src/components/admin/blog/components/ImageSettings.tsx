"use client";

import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MediaService from "@/lib/services/media.service";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, UploadCloud, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageSettingsProps {
  form: UseFormReturn<any>;
}

export default function ImageSettings({ form }: ImageSettingsProps) {
  const featuredImageUrl = form.watch("featuredImage.url");
  const socialPreviewImageUrl = form.watch("meta.socialPreviewImage");

  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [isUploadingSocial, setIsUploadingSocial] = useState(false);

  // Refs for file inputs
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const socialImageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    file: File,
    fieldName: "featuredImage.url" | "meta.socialPreviewImage",
    setLoading: (isLoading: boolean) => void
  ) => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await MediaService.upload(formData);
      if (response && response.data && response.data.url) {
        form.setValue(fieldName, response.data.url, { shouldValidate: true });
        toast.success("Tải ảnh lên thành công!");
      } else if (response && response.url) {
        form.setValue(fieldName, response.url, { shouldValidate: true });
        toast.success("Tải ảnh lên thành công!");
      } else {
        console.error("Upload response from API is not as expected:", response);
        toast.error("Không nhận được URL ảnh từ server.");
      }
    } catch (error) {
      console.error("Lỗi tải ảnh lên:", error);
      toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (
    fieldName: "featuredImage.url" | "meta.socialPreviewImage",
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    form.setValue(fieldName, "", { shouldValidate: true });
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset file input
    }
  };

  const triggerFileInput = (
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    if (inputRef.current) {
      inputRef.current?.click();
    }
  };

  // Helper to render upload UI
  const renderUploadArea = (
    label: string,
    imageUrl: string | undefined,
    isUploading: boolean,
    fieldName: "featuredImage.url" | "meta.socialPreviewImage",
    setLoading: (isLoading: boolean) => void,
    inputRef: React.RefObject<HTMLInputElement | null>,
    errorMessages: any,
    isRequired: boolean = false
  ) => {
    return (
      <FormItem className="space-y-2">
        <FormLabel className="flex items-center mb-2">
          {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
        {!imageUrl && !isUploading && (
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors ${
              errorMessages?.message ? "border-red-500" : ""
            }`}
            onClick={() => triggerFileInput(inputRef)}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(
                  e.dataTransfer.files[0],
                  fieldName,
                  setLoading
                );
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="space-y-1 text-center">
              <UploadCloud
                className={`mx-auto h-12 w-12 ${
                  errorMessages?.message ? "text-red-400" : "text-gray-400"
                }`}
              />
              <p className="text-sm text-muted-foreground">
                Kéo và thả hoặc{" "}
                <span className="font-semibold text-primary">
                  nhấp để tải lên
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF tối đa 10MB
              </p>
            </div>
          </div>
        )}
        <FormControl>
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only" // Visually hide the default input
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0], fieldName, setLoading);
              }
            }}
            disabled={isUploading}
          />
        </FormControl>
        {isUploading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Đang tải lên...</span>
          </div>
        )}
        <FormMessage>{errorMessages?.message}</FormMessage>
        {imageUrl && !isUploading && (
          <div className="mt-2 relative group w-full h-48 rounded-md overflow-hidden border">
            <Image
              src={imageUrl}
              alt={`Preview ${label}`}
              layout="fill"
              objectFit="cover"
              unoptimized
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={() => handleRemoveImage(fieldName, inputRef)}
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        )}
      </FormItem>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hình ảnh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {renderUploadArea(
          "Ảnh bìa",
          featuredImageUrl,
          isUploadingFeatured,
          "featuredImage.url",
          setIsUploadingFeatured,
          featuredImageInputRef,
          (form.formState.errors.featuredImage as any)?.url,
          true // Mark as required
        )}

        <FormField
          control={form.control}
          name="featuredImage.alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alt text Ảnh bìa</FormLabel>
              <FormControl>
                <Input
                  placeholder="Mô tả ảnh đại diện"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {renderUploadArea(
          "Ảnh xem trước trên MXH",
          socialPreviewImageUrl,
          isUploadingSocial,
          "meta.socialPreviewImage",
          setIsUploadingSocial,
          socialImageInputRef,
          (form.formState.errors.meta as any)?.socialPreviewImage
        )}
      </CardContent>
    </Card>
  );
}
