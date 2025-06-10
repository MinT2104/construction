"use client";
import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // Bạn có thể thay đổi icon tùy ý

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-28 sm:bottom-20 right-2 sm:right-6 z-50 rounded-full bg-primary hover:bg-primary/90 border border-white text-white p-2 sm:p-3 shadow-lg transition-all duration-300"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
};

export default ScrollToTop;
