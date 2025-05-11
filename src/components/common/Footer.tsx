"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-green-800 text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Kiến Tạo Nhà Đẹp
            </h3>
            <p className="text-xs leading-relaxed text-gray-300 mb-4">
              Chuyên thiết kế, thi công xây dựng và sửa chữa nhà ở tại TP.HCM và
              các tỉnh lân cận
            </p>
            {/* Thêm chứng nhận Bộ Công Thương */}
            <div className="mt-4">
              <a
                href="http://online.gov.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image
                  src="/images/bocongthuong.png"
                  alt="Đã thông báo Bộ Công Thương"
                  width={200}
                  height={100}
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Liên kết nhanh
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/gioi-thieu"
                  className="text-xs text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu"
                  className="text-xs text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/mau-nha-dep"
                  className="text-xs text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Mẫu nhà đẹp
                </Link>
              </li>
              <li>
                <Link
                  href="/cong-trinh-xay-dung"
                  className="text-xs text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Công trình xây dựng thực tế
                </Link>
              </li>
              <li>
                <Link
                  href="/bao-gia"
                  className="text-xs text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Báo giá
                </Link>
              </li>
              <li>
                <Link
                  href="/kinh-nghiem-va-blog"
                  className="text-xs text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Kinh nghiệm và Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="text-xs text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-3 text-xs text-gray-300">
              <li>Địa chỉ: 123 Nguyễn Văn Linh, Quận 7, TP.HCM</li>
              <li>
                Điện thoại:{" "}
                <span className="text-yellow-400 font-semibold">
                  0909 123 456
                </span>
              </li>
              <li>Email: info@kien-tao-nha-dep.com</li>
              <li>Giờ làm việc: 8:00 - 17:30 (Thứ 2 - Thứ 7)</li>
            </ul>
          </div>

          {/* Social Media & Fanpage */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Kết nối với chúng tôi
            </h3>
            <div className="flex space-x-5 mb-6">
              <a
                href="https://facebook.com/xaydungminhphat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://zalo.me/0909123456"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Zalo"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.49 10.2722C11.54 10.2722 10.77 11.0422 10.77 11.9922C10.77 12.9422 11.54 13.7122 12.49 13.7122C13.44 13.7122 14.21 12.9422 14.21 11.9922C14.21 11.0422 13.44 10.2722 12.49 10.2722ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.71 14.5422C16.58 14.7522 16.4 14.9322 16.2 15.0922C15.99 15.2622 15.76 15.4022 15.51 15.5222C14.86 15.8522 14.13 16.0422 13.35 16.0422C12.34 16.0422 11.42 15.7622 10.65 15.2422C10.22 14.9622 9.82 14.6222 9.47 14.2322C8.37 13.0322 7.79 11.5322 7.79 9.9322C7.79 8.9422 8 8.0022 8.39 7.1722C8.77 6.3622 9.34 5.6722 10.05 5.1322C10.89 4.5022 11.89 4.1422 12.99 4.1422C13.95 4.1422 14.85 4.4022 15.63 4.8922C16.1 5.1922 16.51 5.5622 16.87 5.9922C17.22 6.4222 17.49 6.9022 17.69 7.4122C17.91 7.9722 18.01 8.5722 18.01 9.1922C18.01 10.0922 17.83 10.8922 17.46 11.5722C17.09 12.2522 16.57 12.7922 15.91 13.1722C16.44 13.4322 16.87 13.8222 17.21 14.3222C17.39 14.5922 17.51 14.8922 17.51 15.2122C17.51 15.5322 17.38 15.8322 17.15 16.0522C16.92 16.2722 16.62 16.3922 16.3 16.3922C15.83 16.3922 15.45 16.1522 15.21 15.7722C15.08 15.5622 14.96 15.3522 14.81 15.1722C14.57 14.8722 14.19 14.7222 13.78 14.7222H13.76C13.35 14.7222 12.97 14.8722 12.73 15.1722C12.58 15.3522 12.46 15.5622 12.33 15.7722C12.09 16.1522 11.71 16.3922 11.24 16.3922C10.92 16.3922 10.62 16.2722 10.39 16.0522C10.16 15.8322 10.03 15.5322 10.03 15.2122C10.03 14.8922 10.15 14.5922 10.33 14.3222C10.67 13.8222 11.1 13.4322 11.63 13.1722C10.97 12.7922 10.45 12.2522 10.08 11.5722C9.71 10.8922 9.53 10.0922 9.53 9.1922C9.53 8.5722 9.63 7.9722 9.85 7.4122C10.05 6.9022 10.32 6.4222 10.67 5.9922C11.03 5.5622 11.44 5.1922 11.91 4.8922C12.69 4.4022 13.59 4.1422 14.55 4.1422C15.65 4.1422 16.65 4.5022 17.49 5.1322C18.2 5.6722 18.77 6.3622 19.15 7.1722C19.54 8.0022 19.75 8.9422 19.75 9.9322C19.75 11.5322 19.17 13.0322 18.07 14.2322C17.72 14.6222 17.32 14.9622 16.89 15.2422C16.83 15.2822 16.77 15.3122 16.71 15.3422V14.5422Z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/xaydungminhphat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="YouTube"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/xaydungminhphat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>

            {/* Facebook Fanpage Plugin */}
            <div className="mt-4 bg-white rounded-md overflow-hidden">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Flopchungminhpage&tabs=timeline&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="100%"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Từ khóa tìm kiếm */}
        <div className="mt-12 pt-10 border-t border-green-700">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 text-center">
            TỪ KHÓA TÌM KIẾM
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { href: "/xay-nha-tron-goi", text: "Xây nhà trọn gói" },
              { href: "/xay-nha-phan-tho", text: "Xây nhà phần thô" },
              { href: "/gia-hoan-thien-nha-o", text: "Giá hoàn thiện nhà ở" },
              { href: "/gia-sua-chua-nha", text: "Giá sửa chữa nhà" },
              { href: "/gia-thiet-ke-nha", text: "Giá thiết kế nhà" },
              { href: "/gia-xay-dung-nha-2024", text: "Giá xây dựng nhà 2024" },
              { href: "/don-gia-sua-nha-2024", text: "Đơn giá sửa nhà 2024" },
              {
                href: "/sua-chua-nha-tai-tp-hcm",
                text: "Sửa chữa nhà tại Tp HCM",
              },
              { href: "/mau-nha-biet-thu-dep", text: "Mẫu nhà biệt thự đẹp" },
              { href: "/mau-nha-pho-dep", text: "Mẫu nhà phố đẹp" },
              { href: "/xay-nha-cap-4", text: "Xây nhà cấp 4" },
              {
                href: "/sua-nha-cap-4-co-gac-lung",
                text: "Sửa nhà cấp 4 có gác lửng",
              },
              { href: "/sua-nha-nang-tang", text: "Sửa nhà nâng tầng" },
              { href: "/hop-dong-xay-nha", text: "Hợp đồng xây nhà" },
              {
                href: "/quy-trinh-xay-dung-nha-pho",
                text: "Quy trình xây dựng nhà phố từ A - Z",
              },
              {
                href: "/cach-tinh-chi-phi-xay-nha",
                text: "Cách tính chi phí xây nhà",
              },
              {
                href: "/chon-nha-thau-xay-dung",
                text: "Chọn nhà thầu xây dựng",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-colors duration-200 shadow-sm"
              >
                <span className="bg-yellow-400 w-1.5 h-1.5 rounded-full"></span>
                {link.text}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-700 mt-12 pt-10 text-center text-white">
          <p className="text-xs">
            &copy; {currentYear ? currentYear : new Date().getFullYear()} Kiến
            Tạo Nhà Đẹp. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
