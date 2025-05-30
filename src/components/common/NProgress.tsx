"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Suspense } from "react";

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 400,
  showSpinner: false,
  trickleSpeed: 100,
});

function NavigationProgressContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  // Custom styles for the progress bar
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

  // Handle route changes
  useEffect(() => {
    if (!pathname) return;

    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParamsString]);

  return null;
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressContent />
    </Suspense>
  );
}
