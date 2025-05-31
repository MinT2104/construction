"use client";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { BlogPost } from "@/lib/types/modules/blog.interface";

const SharePost: React.FC<{ post: BlogPost }> = ({ post }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
    });
  };

  return (
    <div className="flex justify-end items-center mb-8 border-b border-gray-200 pb-6">
      <Button
        variant="outline"
        className="flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
        onClick={copyLink}
      >
        <Copy className="w-4 h-4 mr-2" />
        Sao chép liên kết
      </Button>
    </div>
  );
};

export default SharePost;
