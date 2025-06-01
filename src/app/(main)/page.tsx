import HeroBannerSection from "@/components/application/Home/components/HeroBannerSection";
import PriceInfoSection from "@/components/application/Home/components/PriceInfoSection";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Sử dụng dynamic import cho các component không cần thiết ngay lập tức
const CalculatorSection = dynamic(
  () => import("@/components/application/Home/components/CalculatorSection"),
  {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse"></div>,
    ssr: true,
  }
);

const ServiceSection = dynamic(
  () => import("@/components/application/Home/components/ServiceSection"),
  {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse"></div>,
    ssr: true,
  }
);

const ProjectShowCaseSection = dynamic(
  () =>
    import("@/components/application/Home/components/ProjectShowCaseSection"),
  {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse"></div>,
    ssr: true,
  }
);

const HouseDesignSection = dynamic(
  () => import("@/components/application/Home/components/HouseDesignSection"),
  {
    loading: () => <div className="h-96 bg-gray-50 animate-pulse"></div>,
    ssr: true,
  }
);

export default function Home() {
  return (
    <Suspense fallback={<div></div>}>
      <div>
        {/* Top Banner - Thương hiệu 13 năm */}

        {/* Hero Section - Banner giới thiệu with animation */}
        <HeroBannerSection />
        <PriceInfoSection />
        {/* Cost Calculator Section - Standalone section with eye-catching design */}
        <CalculatorSection />

        {/* Services Section - Hạng mục dịch vụ kiến trúc và xây dựng */}
        <ServiceSection />

        {/* Projects Showcase - Công trình xây dựng tiêu biểu */}
        <ProjectShowCaseSection />
        {/* Latest House Designs - Mẫu nhà đẹp mới nhất */}
        <HouseDesignSection />
        {/* Contact Section - Liên hệ */}
        {/* Floating Contact Buttons */}

        <div className="fixed left-4 bottom-4 z-50 flex flex-col space-y-3">
          <a
            href="tel:0936267359"
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </a>
          <a
            href="https://zalo.me/0936267359"
            className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
          >
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.49 10.272v-.45h1.347v6.322h-1.347v-.453c0-.016 0-.032-.003-.048a.111.111 0 00-.04-.057 5.145 5.145 0 01-2.356-.77 3.9 3.9 0 01-.899-.707 2.821 2.821 0 01-.707-1.13 2.38 2.38 0 01.44-2.163 3.399 3.399 0 011.347-.989 5.723 5.723 0 012.018-.555zm-1.379.842a3.44 3.44 0 00-1.015.666 1.44 1.44 0 00-.37 1.376c.062.197.17.377.317.535.2.21.432.388.688.527a4.452 4.452 0 001.759.62v-3.724a4.092 4.092 0 00-1.379 0zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.57 12.104c0 .299-.094.722-.284 1.276a2.695 2.695 0 01-.506.872 2.03 2.03 0 01-.728.504 2.449 2.449 0 01-.934.18h-7.129a2.449 2.449 0 01-.934-.18 2.03 2.03 0 01-.728-.504 2.695 2.695 0 01-.506-.872c-.19-.554-.285-.977-.285-1.276V9.896c0-.299.094-.722.285-1.276a2.695 2.695 0 01.506-.872 2.03 2.03 0 01.728-.504 2.45 2.45 0 01.934-.18h7.129c.328 0 .64.06.934.18.273.12.514.291.728.504.214.213.38.51.506.872.19.554.284.977.284 1.276v4.208z" />
            </svg>
          </a>
          <a
            href="https://m.me/kientaonhadep"
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.04.57.61.94 1.13.71l1.98-.87c.17-.06.36-.09.53-.06 1.28.31 2.63.48 4.04.48 5.52 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46l-2.93 4.67c-.47.75-1.47.96-2.21.47l-2.38-1.58a.6.6 0 00-.72 0l-3.21 2.43c-.41.31-.95-.17-.68-.62l2.93-4.67c.47-.75 1.47-.96 2.21-.47l2.38 1.58a.6.6 0 00.72 0l3.21-2.43c.41-.31.95.17.68.62z" />
            </svg>
          </a>
        </div>
      </div>
    </Suspense>
  );
}
