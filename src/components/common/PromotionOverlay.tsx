"use client";

import { promotionService } from "@/lib/services/promotion.service";
import { usePromotionOverlay } from "@/hooks/usePromotionOverlay";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const handleGetPromotionFeatured = async () => {
  const promotionFeatured = await promotionService.getPromotionFeatured();
  return promotionFeatured;
};

export const PromotionOverlay = () => {
  const { isVisible, handleClose } = usePromotionOverlay();
  const [promotion, setPromotion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const promotionFeatured = await handleGetPromotionFeatured();
        console.log(promotionFeatured);
        if (promotionFeatured?.success) {
          setPromotion(promotionFeatured.data);
        }
      } catch (error) {
        console.error("Error fetching promotion:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchPromotion();
    }
  }, [isVisible]);

  // Prevent body scroll when overlay is visible
  useEffect(() => {
    if (isVisible && !loading && promotion) {
      document.body.style.overflow = "hidden";
      // Trigger animation after a small delay
      setTimeout(() => setIsAnimating(true), 100);
    } else {
      document.body.style.overflow = "unset";
      setIsAnimating(false);
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible, loading, promotion]);

  if (!isVisible || loading || !promotion) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-0 z-[999] flex items-center justify-center transition-all duration-700 ease-out">
      {/* Background overlay with fade in effect */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-700 ease-out ${
          isAnimating ? "bg-opacity-50" : "bg-opacity-0"
        }`}
      />

      {/* Content container with scale and fade effects */}
      <div
        className={`relative z-10 transition-all duration-700 ease-out transform ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="relative">
          <Link href={`/khuyen-mai/${promotion.slug}`} className="block group">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={promotion.featuredImage?.url || ""}
                alt={promotion.featuredImage?.alt || ""}
                width={0}
                height={0}
                sizes="100%"
                className="md:max-w-screen-2xl max-w-screen-lg w-[400px] sm:w-[600px] md:w-[800px] lg:w-[1000px] h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>

          {/* Nút Close - đặt ở góc tấm ảnh với animation */}
          <button
            onClick={handleClose}
            className={`absolute -top-3 -right-3 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-gray-300 transform hover:scale-110 ${
              isAnimating
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
            aria-label="Đóng quảng cáo"
            style={{ transitionDelay: "400ms" }}
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
