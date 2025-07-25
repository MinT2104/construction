"use client";
import React, { useEffect, useState } from "react";
import { ArrowUp } from "@/lib/icons";

const ScrollToTop: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="rounded-full bg-primary hover:bg-primary/90 border border-white text-white p-2 sm:p-3 shadow-lg transition-all duration-300"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
};

export default ScrollToTop;
