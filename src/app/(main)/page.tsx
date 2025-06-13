import HeroBannerSection from "@/components/application/Home/components/HeroBannerSection";
import PriceInfoSection from "@/components/application/Home/components/PriceInfoSection";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import FloatingContact from "@/components/common/FloatingContact";
import { bannerService } from "@/lib/services/banner.service";
import ActiveAspect from "@/components/application/Home/components/ActiveAspect";
import Script from "next/script";

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

interface HomeProps {
  searchParams?: { category?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const banner = await handleGetBanner();
  const heroBanner = banner?.heroBanner || [];

  // Schema.org structured data for Website
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kiến Tạo Nhà Đẹp",
    url: "https://kientaonhadep.vn",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://kientaonhadep.vn/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // Schema.org structured data for LocalBusiness
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://kientaonhadep.vn",
    name: "Kiến Tạo Nhà Đẹp",
    image: "https://kientaonhadep.vn/logo.png",
    priceRange: "$$",
    description:
      "Công ty thiết kế và xây dựng nhà ở uy tín tại TP HCM với hơn 13 năm kinh nghiệm. Chuyên thiết kế biệt thự, nhà phố, nội thất và xây dựng trọn gói với cam kết chất lượng cao.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "51 Phạm Ngọc Thảo, Tây Thạnh, Tân Phú, TP HCM",
      addressLocality: "Tân Phú",
      addressRegion: "TP. Hồ Chí Minh",
      postalCode: "70000",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.7769,
      longitude: 106.7009,
    },
    telephone: "+84-093-6267-359",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/kientaonhadep",
      "https://www.youtube.com/channel/kientaonhadep",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dịch vụ thiết kế và xây dựng",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Thiết kế biệt thự",
            description:
              "Dịch vụ thiết kế biệt thự sang trọng, đẳng cấp với kiến trúc độc đáo",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Thiết kế nhà phố",
            description: "Dịch vụ thiết kế nhà phố đẹp, tối ưu không gian sống",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Xây dựng nhà trọn gói",
            description:
              "Dịch vụ xây dựng nhà trọn gói chất lượng cao, tiết kiệm chi phí",
          },
        },
      ],
    },
  };

  // Schema.org structured data for BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "https://kientaonhadep.vn",
      },
    ],
  };

  return (
    <Suspense fallback={<div></div>}>
      {/* Schema.org structured data */}
      <Script id="website-schema" type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </Script>
      <Script id="local-business-schema" type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </Script>
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <div>
        {/* Top Banner - Thương hiệu 13 năm */}

        {/* Hero Section - Banner giới thiệu with animation */}
        <HeroBannerSection heroBanner={heroBanner} />

        {/* Price Info Section - Bảng giá dịch vụ */}
        <PriceInfoSection />

        {/* Active Aspect - Các tiêu chí hoạt động */}
        <ActiveAspect searchParams={searchParams} />
        {/* Projects Showcase - Công trình xây dựng tiêu biểu */}
        <ProjectShowCaseSection />

        {/* Services Section - Hạng mục dịch vụ kiến trúc và xây dựng */}
        <ServiceSection />

        {/* Latest House Designs - Mẫu nhà đẹp mới nhất */}
        <HouseDesignSection />
        {/* Cost Calculator Section - Standalone section with eye-catching design */}
        <CalculatorSection />
      </div>
    </Suspense>
  );
}
