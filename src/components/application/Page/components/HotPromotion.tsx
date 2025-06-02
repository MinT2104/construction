import { promotionService } from "@/lib/services/promotion.service";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Promotion } from "@/lib/types/modules/promotion.interface";

const handleGetPromotionFeatured = async () => {
  const promotionFeatured = await promotionService.getPromotionFeatured();
  return promotionFeatured;
};

const HotPromotion = async () => {
  const promotionFeatured = await handleGetPromotionFeatured();
  if (!promotionFeatured?.success)
    return (
      <div className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Khuyến mãi hot
          </span>
        </h3>
        <div className="text-center py-8 text-muted-foreground h-36 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-600 text-lg font-semibold">
            Không có khuyến mãi hot
          </p>
        </div>
      </div>
    );

  const promotionFeaturedData = promotionFeatured.data as Promotion;
  return (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Khuyến mãi hot
        </span>
      </h3>
      <Link
        href={`/khuyen-mai/${promotionFeaturedData.slug}`}
        className="block group"
      >
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src={promotionFeaturedData.featuredImage?.url || ""}
            alt={promotionFeaturedData.featuredImage?.alt || ""}
            width={600}
            height={300}
            className="w-full h-36 object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
    </div>
  );
};

export default HotPromotion;
