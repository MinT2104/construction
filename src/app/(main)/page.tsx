import HeroBannerSection from "@/components/application/Home/components/HeroBannerSection";
import PriceInfoSection from "@/components/application/Home/components/PriceInfoSection";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import FloatingContact from "@/components/common/FloatingContact";
import { bannerService } from "@/lib/services/banner.service";
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

const handleGetBanner = async () => {
  const res = await bannerService.getAllBanner();
  return res;
};

export default async function Home() {
  const banner = await handleGetBanner();
  const heroBanner = banner?.heroBanner || [];

  return (
    <Suspense fallback={<div></div>}>
      <div>
        {/* Top Banner - Thương hiệu 13 năm */}

        {/* Hero Section - Banner giới thiệu with animation */}
        <HeroBannerSection heroBanner={heroBanner} />
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
        <FloatingContact />
      </div>
    </Suspense>
  );
}
