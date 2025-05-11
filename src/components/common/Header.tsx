"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MenuItemType, BaseMenuItem } from "@/lib/types/common/menu.interface";
import menuItems from "@/lib/constants/menu";

const Header = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItemPath, setHoveredItemPath] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants for the desktop submenu
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
    <header className="relative z-50">
      {/* Main Header - Compact design with integrated slogan */}
      <div
        className={`w-full bg-white border-b border-gray-100 transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo and slogan section */}
            <div className="flex items-center space-x-5 flex-1 w-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => router.push("/")}
                className="cursor-pointer flex items-center group"
              >
                <div className="overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Kiến Tạo Nhà Đẹp Logo"
                    width={160}
                    height={80}
                    className="h-[60px] w-auto transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:block border-l border-gray-200 pl-5 w-full"
              >
                <p className=" font-bold text-xl tracking-wide text-secondary">
                  KIẾN TẠO NHÀ ĐẸP
                </p>
                <div className="mt-1">
                  <p className="text-sm text-gray-600 leading-normal">
                    <span className="text-primary font-semibold">
                      THƯƠNG HIỆU 13 NĂM
                    </span>
                    <span className="text-gray-700"> KHẲNG ĐỊNH </span>
                    <span className="text-secondary font-bold">
                      UY TÍN TOP 1
                    </span>
                    <span className="text-gray-700"> - KHÔNG BÁN THẦU - </span>
                    <span className="text-accent font-semibold">
                      PHẠT 300 TRIỆU
                    </span>
                    <span className="text-gray-700">
                      {" "}
                      NẾU VẬT LIỆU KÉM CHẤT LƯỢNG
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Contact button and mobile menu toggle */}
            <div className="flex items-center space-x-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="hidden md:flex items-center space-x-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors duration-300 border border-primary/20 shadow-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-secondary to-primary rounded-full p-3 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </motion.div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Hotline 24/7
                  </p>
                  <a
                    href="tel:0961993915"
                    className="text-secondary font-bold text-xl transition-colors duration-200"
                  >
                    096 1993 915
                  </a>
                </div>
              </motion.div>

              {/* Mobile menu button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:hidden p-3 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div
        className={`w-full bg-gradient-to-r from-primary to-primary-dark sticky top-0 z-40 transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="container mx-auto">
          <nav className="hidden lg:flex">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path || index}
                className="relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
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
                      px-5 py-4 text-white font-medium hover:bg-primary-light transition-all duration-200 text-base inline-flex items-center relative
                    `}
                  >
                    {item.label}
                    {item.submenu && (
                      <svg
                        className={`w-5 h-5 ml-2 transition-transform duration-200 ${
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
                      px-5 py-4 text-white font-medium hover:bg-primary-light transition-all duration-200 text-base inline-flex items-center relative cursor-pointer
                    `}
                  >
                    {item.label}
                    {item.submenu && (
                      <svg
                        className={`w-5 h-5 ml-2 transition-transform duration-200 ${
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
                    className="absolute left-0 mt-1 w-72 bg-white shadow-2xl rounded-lg z-50 border border-gray-100 overflow-hidden"
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
                          className="block px-5 py-3 text-sm text-gray-700 hover:bg-primary hover:text-white font-medium transition-colors duration-150"
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

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden bg-white shadow-lg absolute w-full transition-all duration-300 ease-in-out z-50 ${
          mobileMenuOpen
            ? "max-h-[80vh] overflow-y-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          {/* Mobile slogan - only visible on mobile */}
          <div className="md:hidden border-b border-gray-100 py-3 mb-3">
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              THƯƠNG HIỆU 13 NĂM KHẲNG ĐỊNH UY TÍN TOP 1 - KHÔNG BÁN THẦU -
              <span className="text-accent font-semibold">
                {" "}
                PHẠT 300 TRIỆU{" "}
              </span>
              NẾU VẬT LIỆU KÉM CHẤT LƯỢNG
            </p>
          </div>

          {menuItems.map((item, index) => (
            <MobileMenuItem key={index} item={item} />
          ))}

          {/* Mobile Hotline */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-primary/10 border-2 border-primary/20 mt-4 shadow-md">
            <div className="bg-gradient-to-r from-secondary to-primary rounded-full p-3 shadow-sm">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-primary font-semibold text-sm">Hotline 24/7</p>
              <a
                href="tel:0961993915"
                className="font-bold text-lg text-secondary transition-colors duration-200"
              >
                096 1993 915
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Mobile Menu Item Component with accordion functionality
const MobileMenuItem = ({ item }: { item: MenuItemType }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between">
        {item.path ? (
          <Link
            href={item.path}
            className="py-4 block text-gray-700 font-medium text-lg w-full hover:text-primary transition-colors duration-200"
          >
            {item.label}
          </Link>
        ) : (
          <div
            className="py-4 block text-gray-700 font-medium text-lg w-full hover:text-primary transition-colors duration-200 cursor-pointer"
            onClick={() => item.submenu && setIsOpen(!isOpen)}
          >
            {item.label}
          </div>
        )}

        {item.submenu && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-full transition-colors duration-200 focus:outline-none"
            aria-label="Toggle submenu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
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
          </button>
        )}
      </div>

      {item.submenu && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pl-5 pb-3 border-l-3 border-primary ml-3">
            {item.submenu.map((subItem: BaseMenuItem) => (
              <Link
                key={subItem.path}
                href={subItem.path}
                className="block py-3 text-base text-gray-600 hover:text-primary transition-colors duration-200"
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
