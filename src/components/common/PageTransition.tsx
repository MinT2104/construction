"use client";

import {
  useState,
  useEffect,
  ReactNode,
  Suspense,
  memo,
  useCallback,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
// @ts-ignore
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProviderProps {
  children: ReactNode;
}

// Tối ưu: sử dụng memo để tránh render lại khi props không thay đổi
const LoadingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="absolute inset-0 z-[9999] flex items-start pt-40 justify-center bg-white/90 backdrop-blur-sm"
  >
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white py-4 px-10 rounded-lg flex flex-col items-center"
    >
      <div className="flex space-x-3 mb-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
            className="w-3 h-3 rounded-full bg-primary"
          />
        ))}
      </div>
      <p className="text-primary text-sm font-medium">Đang tải...</p>
    </motion.div>
  </motion.div>
));

LoadingIndicator.displayName = "LoadingIndicator";

const PageTransitionContent = ({ children }: PageTransitionProviderProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const searchParamsString = searchParams.toString();

  // Sử dụng useCallback để tránh tạo lại hàm
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Kích hoạt loading khi navigation thay đổi
  useEffect(() => {
    // Cần phải mount xong rồi mới có thể kiểm tra navigation
    if (!pathname) return;

    startLoading();

    // Dừng loading sau một khoảng thời gian
    const timer = setTimeout(() => {
      stopLoading();
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, searchParamsString, startLoading, stopLoading]);

  // Phân tách header, content và footer từ children
  const childrenArray = Array.isArray(children) ? children : [children];
  const header = childrenArray[0]; // Header là phần tử đầu tiên
  const footer = childrenArray[2]; // Footer là phần tử cuối cùng
  const content = childrenArray[1]; // Content là phần tử ở giữa

  return (
    <>
      {header}

      <div className="relative min-h-[60vh]">
        {content}

        <AnimatePresence>{isLoading && <LoadingIndicator />}</AnimatePresence>
      </div>

      {footer}
    </>
  );
};

export const PageTransitionProvider = memo(
  ({ children }: PageTransitionProviderProps) => {
    return (
      <Suspense fallback={<div></div>}>
        <PageTransitionContent>{children}</PageTransitionContent>
      </Suspense>
    );
  }
);

PageTransitionProvider.displayName = "PageTransitionProvider";

export default PageTransitionProvider;
