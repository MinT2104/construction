"use client";
// @ts-ignore
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Banner, HeroItem } from "@/lib/types/modules/banner.interface";
const HeroBannerSection = ({
  heroBanner,
}: {
  heroBanner: Banner["heroBanner"];
}) => {
  const bannerImages = heroBanner
    .filter((item: HeroItem) => item.isShow)
    .map((item: HeroItem) => ({
      src: item.url,
      alt: item.name,
    }));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-sliding functionality
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] min-h-[300px] sm:min-h-[400px] md:min-h-[520px] max-h-[720px] overflow-hidden shadow-2xl">
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={bannerImages[currentImageIndex]?.src || ""}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {bannerImages[currentImageIndex]?.src && (
              <Image
                src={bannerImages[currentImageIndex]?.src || ""}
                alt={bannerImages[currentImageIndex]?.alt || ""}
                fill
                className="object-cover"
                priority
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons with improved styling */}
      <button
        onClick={prevImage}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          className="sm:w-5 sm:h-5 md:w-6 md:h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          className="sm:w-5 sm:h-5 md:w-6 md:h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </section>
  );
};

export default HeroBannerSection;
