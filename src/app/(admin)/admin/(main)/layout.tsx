import { ReactNode } from "react";
import { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "@/app/(main)/globals.css";

import { SidebarProvider } from "@/contexts/SidebarContext";
import AdminLayoutContent from "@/components/admin/AdminLayoutContent";

export const metadata: Metadata = {
  title: "Quản lý hệ thống",
  description: "Quản lý hệ thống Kiến Tạo Nhà Đẹp",
};

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"], // hoặc ['latin-ext'] nếu cần ký tự tiếng Việt
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // thêm các weight bạn cần
  variable: "--font-roboto-condensed", // tùy chọn nếu bạn dùng Tailwind CSS
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${robotoCondensed.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <SidebarProvider>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </SidebarProvider>
      </body>
    </html>
  );
}
