"use client";
import React, { useEffect, useState } from "react";
import { ArrowUp, Home } from "lucide-react"; // Bạn có thể thay đổi icon tùy ý
import { usePathname, useRouter } from "next/navigation";
const HomeNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <button
      onClick={() => {
        router.push("/");
      }}
      className="fixed bottom-16 sm:bottom-6 right-2 sm:right-6 z-50 rounded-full bg-primary hover:bg-primary/90 border border-white text-white p-2 sm:p-3 shadow-lg transition-all duration-300"
      aria-label="Về trang chủ"
    >
      <Home className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
};

export default HomeNavigation;
