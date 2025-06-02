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
      className="fixed bottom-6 right-6 z-50 rounded-full bg-primary hover:bg-primary/90 border border-white text-white p-3 shadow-lg transition-all duration-300"
      aria-label="Scroll to top"
    >
      <Home className="w-5 h-5" />
    </button>
  );
};

export default HomeNavigation;
