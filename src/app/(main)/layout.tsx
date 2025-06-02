import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PageTransitionProvider from "@/components/common/PageTransition";
import NavigationProgress from "@/components/common/NProgress";
import ScrollToTop from "@/components/common/ScrollToTop";
import HomeNavigation from "@/components/common/HomeNavigation";
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
  title: "Kiến Tạo Nhà Đẹp",
  description:
    "Xây dựng nhà ở đẹp, chất lượng cao, đáp ứng nhu cầu sống của gia đình bạn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${roboto.variable} antialiased`}>
        <NavigationProgress />
        <PageTransitionProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </PageTransitionProvider>
        <ScrollToTop />
        <HomeNavigation />
      </body>
    </html>
  );
}
