"use client";

import { useEffect, memo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Suspense } from "react";

// Configure NProgress chỉ một lần ngoài component
NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 400,
  showSpinner: false,
  trickleSpeed: 100,
});

// Sử dụng memo để tránh render lại không cần thiết
const NavigationProgressContent = memo(() => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  // Thêm styles cho progress bar trong useEffect chỉ chạy một lần
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      #nprogress .bar {
        background: linear-gradient(to right, #07693F, #1aaf6c) !important;
        height: 3px !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px #07693F, 0 0 5px #07693F !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Tối ưu xử lý route changes
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Sử dụng tham chiếu cho chuỗi searchParams để tránh so sánh
    const currentRoute = `${pathname}?${searchParamsString}`;
    const routeChangeStart = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        NProgress.start();
      }, 100); // Thêm timeout nhỏ để tránh flash progress bar cho navigation nhanh
    };

    const routeChangeComplete = () => {
      clearTimeout(timer);
      NProgress.done();
    };

    // Kiểm tra nếu pathname đã được xác định
    if (pathname) {
      routeChangeStart();

      // Tạo timeout để kết thúc progress bar trong mọi trường hợp
      timer = setTimeout(() => {
        NProgress.done();
      }, 500); // Đảm bảo progress bar hoàn thành sau tối đa 500ms
    }

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParamsString]);

  return null;
});

NavigationProgressContent.displayName = "NavigationProgressContent";

// Sử dụng memo cho component chính
const NavigationProgress = memo(() => {
  return (
    <Suspense fallback={null}>
      <NavigationProgressContent />
    </Suspense>
  );
});

NavigationProgress.displayName = "NavigationProgress";

export default NavigationProgress;
