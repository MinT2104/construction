import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PageTransitionProvider from "@/components/common/PageTransition";
import NavigationProgress from "@/components/common/NProgress";
import ScrollToTop from "@/components/common/ScrollToTop";
import HomeNavigation from "@/components/common/HomeNavigation";
import FastNavigationBar from "@/components/common/FastNavigation";
import { PromotionOverlay } from "@/components/common/PromotionOverlay";
import FloatingContact from "@/components/common/FloatingContact";
// Tối ưu font loading
const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Kiến Tạo Nhà Đẹp | Dịch vụ thiết kế & xây dựng nhà ở chất lượng cao",
  description:
    "Công ty thiết kế và xây dựng nhà ở uy tín tại TP HCM với hơn 13 năm kinh nghiệm. Chuyên thiết kế biệt thự, nhà phố, nội thất và xây dựng trọn gói với cam kết chất lượng cao.",
  keywords:
    "thiết kế nhà, xây dựng nhà, nhà phố, biệt thự, thiết kế nội thất, xây dựng trọn gói, sửa chữa nhà, nhà đẹp, công ty xây dựng, TP HCM",
  robots: "index, follow",
  alternates: {
    canonical: "https://kientaonhadep.vn",
  },
  authors: [{ name: "Kiến Tạo Nhà Đẹp" }],
  publisher: "Kiến Tạo Nhà Đẹp",
  generator: "Next.js",
  applicationName: "Kiến Tạo Nhà Đẹp",
  referrer: "origin-when-cross-origin",
  creator: "Kiến Tạo Nhà Đẹp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kientaonhadep.vn"),
  openGraph: {
    title:
      "Kiến Tạo Nhà Đẹp | Dịch vụ thiết kế & xây dựng nhà ở chất lượng cao",
    description:
      "Công ty thiết kế và xây dựng nhà ở uy tín tại TP HCM với hơn 13 năm kinh nghiệm. Chuyên thiết kế biệt thự, nhà phố, nội thất và xây dựng trọn gói với cam kết chất lượng cao.",
    url: "https://kientaonhadep.vn",
    siteName: "Kiến Tạo Nhà Đẹp",
    images: [
      {
        url: "https://kientaonhadep.vn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kiến Tạo Nhà Đẹp - Thiết kế và xây dựng nhà ở chất lượng cao",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Kiến Tạo Nhà Đẹp | Dịch vụ thiết kế & xây dựng nhà ở chất lượng cao",
    description:
      "Công ty thiết kế và xây dựng nhà ở uy tín tại TP HCM với hơn 13 năm kinh nghiệm. Chuyên thiết kế biệt thự, nhà phố, nội thất và xây dựng trọn gói với cam kết chất lượng cao.",
    images: ["https://kientaonhadep.vn/og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Organization data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kiến Tạo Nhà Đẹp",
    url: "https://kientaonhadep.vn",
    logo: "https://kientaonhadep.vn/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-093-6267-359",
      contactType: "customer service",
      availableLanguage: "Vietnamese",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "51 Phạm Ngọc Thảo, Tây Thạnh, Tân Phú, TP HCM",
      addressLocality: "Tân Phú",
      addressRegion: "TP. Hồ Chí Minh",
      postalCode: "70000",
      addressCountry: "VN",
    },
    sameAs: [
      "https://www.facebook.com/kientaonhadep",
      "https://www.youtube.com/channel/tronghoaixaydung",
    ],
    description:
      "Công ty thiết kế và xây dựng nhà ở uy tín tại TP HCM với hơn 13 năm kinh nghiệm. Chuyên thiết kế biệt thự, nhà phố, nội thất và xây dựng trọn gói với cam kết chất lượng cao.",
  };

  return (
    <html lang="vi">
      <body className={`${roboto.variable} antialiased`}>
        {/* Add Schema.org JSON-LD structured data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <NavigationProgress />
        <Header />
        <PromotionOverlay />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <FastNavigationBar
          buttons={[
            {
              label: "Công trình đang thi công",
              href: "/cong-trinh-dang-thi-cong",
            },
            { label: "Công trình bảo hành", href: "/cong-trinh-bao-hanh" },
            {
              label:
                "Kiến Tạo Nhà Đẹp hơn 10 năm kinh \n nghiệm, hơn 1000+ căn nhà",
              href: "/gioi-thieu/ve-chung-toi",
            },
            {
              label: "093 6267 359",
              href: "tel:0936267359",
              className:
                "text-yellow-400 text-lg border-yellow-400 animate-bounce hover:scale-105 duration-300",
            },
          ]}
        />
        {/* Contact Section - Liên hệ */}
        <FloatingContact />
        <HomeNavigation />
      </body>
    </html>
  );
}
