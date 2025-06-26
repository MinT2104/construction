import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import NavigationProgress from "@/components/common/NProgress";
import CriticalCSS from "@/components/common/CriticalCSS";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Home } from "lucide-react";

// Dynamic imports cho các component không cần thiết ngay lập tức
const PageTransitionProvider = dynamic(
  () => import("@/components/common/PageTransition"),
  {
    ssr: false,
    loading: () => null,
  }
);

const FastNavigationBar = dynamic(
  () => import("@/components/common/FastNavigation"),
  {
    ssr: false,
    loading: () => null,
  }
);

const PromotionOverlay = dynamic(
  () =>
    import("@/components/common/PromotionOverlay").then((mod) => ({
      default: mod.PromotionOverlay,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

const FloatingContact = dynamic(
  () => import("@/components/common/FloatingContact"),
  {
    ssr: false,
    loading: () => null,
  }
);

// Tối ưu font loading với better fallbacks
const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false, // Tối ưu layout shift
});

export const metadata: Metadata = {
  title: "Kiến Tạo Nhà Đẹp - Thiết Kế & Thi Công Xây Dựng",
  description:
    "Dịch vụ thiết kế và thi công xây dựng nhà ở, biệt thự, nhà phố chuyên nghiệp. Tư vấn miễn phí, báo giá cạnh tranh, chất lượng cao.",
  keywords: "xây dựng, thiết kế nhà, thi công, kiến trúc, nội thất",
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
  other: {
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
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
    <html lang="vi" className={roboto.className}>
      <head>
        {/* Critical CSS inline */}
        <CriticalCSS />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/logo.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/fonts/roboto-vietnamese-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Prefetch important pages */}
        <link rel="prefetch" href="/mau-nha-dep" />
        <link rel="prefetch" href="/dich-vu-xay-dung" />
        <link rel="prefetch" href="/bang-gia" />

        {/* DNS prefetch cho external domains */}
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//i.ytimg.com" />

        {/* Resource hints */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Google Analytics với defer để không block render */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E7P1W5Q31J"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E7P1W5Q31J');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        {/* Add Schema.org JSON-LD structured data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Critical rendering path optimization */}
        <NavigationProgress />

        {/* Header được render ngay lập tức */}
        <Header />

        {/* Main content với transition */}
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <PageTransitionProvider>
            <main className="min-h-screen">{children}</main>
          </PageTransitionProvider>
        </Suspense>

        {/* Footer được render ngay lập tức */}
        <Footer />

        {/* Non-critical components loaded asynchronously */}
        <Suspense fallback={null}>
          <FloatingContact />
          <PromotionOverlay />
        </Suspense>

        {/* <HomeNavigation /> */}
        <div className="flex flex-col gap-2 justify-between items-center fixed bottom-16 sm:bottom-6 right-2 sm:right-6 z-50">
          <ScrollToTop />
          <a
            href="/"
            className=" rounded-full bg-primary hover:bg-primary/90 border border-white text-white p-2 sm:p-3 shadow-lg transition-all duration-300"
            aria-label="Về trang chủ"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>

        {/* Service Worker Registration */}
        <Script id="sw-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `}
        </Script>

        {/* Analytics và tracking scripts với defer */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  );
}
