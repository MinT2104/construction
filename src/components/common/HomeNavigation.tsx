"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import dynamic from "next/dynamic";

const ScrollToTop = dynamic(() => import("@/components/common/ScrollToTop"), {
  ssr: false,
  loading: () => null,
});

const HomeNavigation: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 justify-between items-center fixed bottom-16 sm:bottom-6 right-2 sm:right-6 z-50">
      <ScrollToTop />
      <button
        onClick={() => {
          router.push("/");
        }}
        className=" rounded-full bg-primary hover:bg-primary/90 border border-white text-white p-2 sm:p-3 shadow-lg transition-all duration-300"
        aria-label="Về trang chủ"
      >
        <Home className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default HomeNavigation;
