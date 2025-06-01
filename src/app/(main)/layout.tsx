import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";

import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import PageTransitionProvider from "@/components/common/PageTransition";
import NavigationProgress from "@/components/common/NProgress";

// Tối ưu font loading
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto-condensed",
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
      <body className={`${robotoCondensed.variable} antialiased`}>
        <NavigationProgress />
        <PageTransitionProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
