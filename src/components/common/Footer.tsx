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

  // Animation variants for the desktop submenu
  const submenuVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scaleY: 0,
      scaleX: 0.95,
      originY: 0,
      originX: 0.5,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      scaleX: 1,
      originY: 0,
      originX: 0.5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      },
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
          <nav className="hidden lg:flex justify-center relative z-50  whitespace-nowrap">
            {menuItems.map(
              (item, index) =>
                item.isShowInHeader && (
                  <motion.div
                    key={item.path || index}
                    className={`relative flex items-center font-bold text-white uppercase text-xs border-r border-white ${
                      index === menuItems.length - 3 ? "border-r-0" : ""
                    } hover:brightness-110 transition-all duration-300`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onMouseEnter={() => {
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
                      uppercase px-3 sm:px-6 py-3 h-full text-white font-bold transition-all duration-300 text-[13px] sm:text-[15px] inline-flex items-center relative
                      after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-200 after:transition-all after:duration-300
                      hover:after:w-full whitespace-nowrap text-nowrap
                    `}
                      >
                        {item.label}
                        {item.submenu && (
                          <span className="ml-1 text-[15px] align-middle ">
                            &raquo;
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div
                        className={`
                      uppercase px-3 sm:px-6 py-3 text-white font-bold hover:bg-white/10 transition-all duration-300 text-[13px] sm:text-base inline-flex items-center relative
                      after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-200 after:transition-all after:duration-300
                      hover:after:w-full whitespace-nowrap text-nowrap
                    `}
                      >
                        {item.label}
                        {item.submenu && (
                          <span className="ml-1 text-base align-middle">
                            &raquo;
                          </span>
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
                        className="absolute bg-primary left-0 top-full min-w-[200px] shadow-lg z-[100] rounded-sm border-none mt-1 overflow-hidden backdrop-blur-sm bg-opacity-95 ring-1 ring-green-700/50"
                        onMouseEnter={() =>
                          setHoveredItemPath(item.path || `menu-${index}`)
                        }
                        onMouseLeave={() => setHoveredItemPath(null)}
                      >
                        {item.submenu.map((subItem, subIdx) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={() => setHoveredItemPath(null)}
                            className={`block uppercase px-5 py-3 font-bold text-[15px] text-white hover:text-yellow-200 hover:bg-green-900 transition-all duration-300 relative
                          before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-green-800 before:transition-all before:duration-300 before:opacity-0 hover:before:w-1 hover:before:opacity-100
                          ${
                            Array.isArray(item.submenu) &&
                            subIdx !== item.submenu.length - 1
                              ? " border-b border-white/20"
                              : ""
                          }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )
            )}
          </nav>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 sm:mb-5">
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
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 sm:mb-5 mt-4 sm:mt-0">
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
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 sm:mb-5 mt-4 sm:mt-0">
              Bản đồ
            </h3>

            {/* Google Map */}
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
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-green-700">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 sm:mb-6 text-center">
            TỪ KHÓA TÌM KIẾM
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {TAGS.map((link) => (
              <Link
                key={link.id}
                href={`/tags/${link.slug}`}
                className="bg-green-700 hover:bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs flex items-center gap-1.5 transition-colors duration-200 shadow-sm mb-2"
              >
                <span className="bg-yellow-400 w-1.5 h-1.5 rounded-full"></span>
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-700 mt-8 sm:mt-12 pt-6 sm:pt-10 text-center text-white">
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
