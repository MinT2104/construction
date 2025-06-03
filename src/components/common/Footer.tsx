"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import menuItems from "@/lib/constants/menu";
import { motion } from "framer-motion";
import TAGS from "@/lib/constants/tags";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItemPath, setHoveredItemPath] = useState<string | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const submenuVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.98,
      transition: { duration: 0.2, ease: "easeOut" },
      transitionEnd: { display: "none" },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      display: "block",
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <footer className="bg-green-800 text-gray-200">
      {/* Navigation Menu with enhanced design */}
      <div
        className={`w-full bg-gradient-to-r from-primary via-primary/95 to-primary-dark transition-all duration-500 ${
          scrolled ? "shadow-lg shadow-primary/20" : "shadow-md"
        }`}
      >
        <div className="container mx-auto">
          <nav className="hidden lg:flex justify-center">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path || index}
                className="relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onHoverStart={() => {
                  if (item.submenu)
                    setHoveredItemPath(item.path || `menu-${index}`);
                }}
                onMouseLeave={() => {
                  if (item.submenu) setHoveredItemPath(null);
                }}
              >
                {item.path ? (
                  <Link
                    href={item.path}
                    onClick={() => {
                      if (hoveredItemPath) setHoveredItemPath(null);
                    }}
                    className={`
                        uppercase px-3 py-2.5 text-white font-bold hover:bg-white/10 transition-all duration-300 text-sm inline-flex items-center relative
                        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300
                        hover:after:w-full
                      `}
                  >
                    {item.label}
                    {item.submenu && (
                      <svg
                        className={`w-3.5 h-3.5 ml-1 transition-transform duration-300 ${
                          hoveredItemPath === (item.path || `menu-${index}`)
                            ? "rotate-180"
                            : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </Link>
                ) : (
                  <div
                    className={`
                        uppercase px-3 py-2.5 text-white font-bold hover:bg-white/10 transition-all duration-300 text-sm inline-flex items-center relative cursor-pointer
                        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300
                        hover:after:w-full
                      `}
                  >
                    {item.label}
                    {item.submenu && (
                      <svg
                        className={`w-3.5 h-3.5 ml-1 transition-transform duration-300 ${
                          hoveredItemPath === `menu-${index}`
                            ? "rotate-180"
                            : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                )}

                {item.submenu && (
                  <motion.div
                    variants={submenuVariants}
                    initial="hidden"
                    animate={
                      hoveredItemPath === (item.path || `menu-${index}`)
                        ? "visible"
                        : "hidden"
                    }
                    className="absolute bg-white left-0 mt-0.5 w-72 shadow-xl z-50 rounded-lg overflow-hidden border border-gray-100"
                    onHoverStart={() => {
                      if (item.submenu)
                        setHoveredItemPath(item.path || `menu-${index}`);
                    }}
                  >
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          onClick={() => setHoveredItemPath(null)}
                          className="block uppercase px-4 py-2.5 font-bold text-[13px] text-gray-700 hover:text-primary hover:bg-primary/5 border-l-2 border-transparent hover:border-primary transition-all duration-200"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>
        </div>
      </div>
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

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-3 text-xs text-gray-300">
              <li>Địa chỉ: 51 Phạm Ngọc Thảo, Tây Thạnh, Tân Phú, TP HCM</li>
              <li>
                Điện thoại:{" "}
                <span className="text-yellow-400 font-semibold">
                  093 6267 359
                </span>
              </li>
              <li>Email: info@kientaonhadep.com</li>
              <li>Giờ làm việc: 8:00 - 17:30 (Thứ 2 - Thứ 7)</li>
            </ul>
          </div>

          {/* Social Media & Fanpage */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Kết nối với chúng tôi
            </h3>

            {/* Youtube Video */}
            <div className="mt-4 bg-white rounded-md overflow-hidden">
              <iframe
                width="100%"
                height="180"
                src="https://www.youtube.com/embed/9elmqfqbk5s?si=7ja9X7JNGWQxZ8av"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
              Bản đồ
            </h3>

            {/* Youtube Video */}
            <div className="mt-4 bg-white rounded-md overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.026384861831!2d106.62631797528763!3d10.809290989341513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752be201baceb5%3A0x9d958c16ab4f674f!2zNTFiIFBo4bqhbSBOZ-G7jWMgVGjhuqNvLCBUw6J5IFRo4bqhbmgsIFTDom4gUGjDuiwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1748938828820!5m2!1svi!2s"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
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
            {TAGS.map((link) => (
              <Link
                key={link.id}
                href={`/tags/${link.slug}`}
                className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-colors duration-200 shadow-sm"
              >
                <span className="bg-yellow-400 w-1.5 h-1.5 rounded-full"></span>
                {link.name}
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
