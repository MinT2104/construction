import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";

import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"], // hoặc ['latin-ext'] nếu cần ký tự tiếng Việt
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // thêm các weight bạn cần
  variable: "--font-roboto-condensed", // tùy chọn nếu bạn dùng Tailwind CSS
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
    <html lang="en">
      <body className={`${robotoCondensed.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
