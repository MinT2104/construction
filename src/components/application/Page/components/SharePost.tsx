"use client";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const SharePost: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <div className="flex justify-end items-center mb-8 border-b border-gray-200 pb-6">
      <Button
        variant="outline"
        className="flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
        onClick={copyLink}
      >
        {isCopied ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        {isCopied ? "Đã sao chép" : "Sao chép liên kết"}
      </Button>
    </div>
  );
};

export default SharePost;
