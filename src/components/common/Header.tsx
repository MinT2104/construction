"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MenuItemType, BaseMenuItem } from "@/lib/types/common/menu.interface";
import menuItems from "@/lib/constants/menu";
import SearchPopup from "./SearchPopup";
import { bannerService } from "@/lib/services/banner.service";

const Header = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItemPath, setHoveredItemPath] = useState<string | null>(null);
  const [stickyNav, setStickyNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerBanner, setHeaderBanner] = useState<string | null>(null);

  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const stickyNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (mainHeaderRef.current && stickyNavRef.current) {
        const mainHeaderHeight = mainHeaderRef.current.offsetHeight;
        if (window.scrollY > mainHeaderHeight) {
          setStickyNav(true);
          document.body.style.paddingTop = `${stickyNavRef.current.offsetHeight}px`;
          stickyNavRef.current.classList.add(
            "fixed",
            "top-0",
            "left-0",
            "right-0",
            "shadow-lg"
          );
        } else {
          setStickyNav(false);
          document.body.style.paddingTop = "0";
          stickyNavRef.current.classList.remove(
            "fixed",
            "top-0",
            "left-0",
            "right-0",
            "shadow-lg"
          );
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search on Ctrl+K or CMD+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuOpen && e.target instanceof HTMLElement) {
        const mobileMenu = document.getElementById("mobile-menu");
        const hamburgerButton = document.getElementById("hamburger-button");

        if (
          mobileMenu &&
          !mobileMenu.contains(e.target) &&
          hamburgerButton &&
          !hamburgerButton.contains(e.target)
        ) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

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

  const handleGetBanner = async () => {
    const res = await bannerService.getAllBanner();
    setHeaderBanner(res?.headerBanner || null);
  };

  useEffect(() => {
    handleGetBanner();
  }, []);

  return (
    <header className="relative z-50">
      {/* Search Popup */}
      <SearchPopup isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top Banner - Full Width */}
      <div className="w-full bg-white" ref={mainHeaderRef}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between py-2 sm:py-0">
            {/* Logo and Company Name */}
            <div
              onClick={() => router.push("/")}
              className="flex items-center justify-between w-full sm:justify-start select-none cursor-pointer my-2 sm:my-0"
            >
              <div className="flex items-center space-x-2 sm:space-x-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  onClick={() => router.push("/")}
                  className="cursor-pointer flex items-center group relative"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Kiến Tạo Nhà Đẹp Logo"
                    width={0}
                    height={0}
                    sizes="100%"
                    className="h-[40px] sm:h-[60px] w-auto transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                    priority
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="hidden sm:block border-l border-gray-200/50 pl-4 w-full"
                >
                  <p className="font-black text-lg sm:text-2xl tracking-wide bg-primary bg-clip-text text-transparent">
                    KIẾN TẠO NHÀ ĐẸP
                  </p>
                  <div className="mt-0.5">
                    <p className="font-black uppercase text-secondary/90 leading-tight text-sm sm:text-xl">
                      Kiến tạo không gian sống
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Hamburger button for mobile - moved inside the logo div */}
              <button
                id="hamburger-button"
                className="block lg:hidden p-1 rounded focus:outline-none border border-gray-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Contact button with modern design */}
            <div
              onClick={() => router.push("/")}
              className="select-none flex items-center space-x-4 max-w-[500px] sm:max-w-[750px] w-full h-full relative cursor-pointer order-2 sm:order-3 my-2 sm:my-0"
            >
              {headerBanner && (
                <Image
                  src={headerBanner || ""}
                  alt="Hotline"
                  width={0}
                  height={0}
                  sizes="100%"
                  className="hidden sm:block w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Group - will be controlled by JS for sticky behavior */}
      <div
        ref={stickyNavRef}
        className={`w-full z-40 transition-all duration-300 ${
          stickyNav ? "animate-slideDown" : ""
        }`}
      >
        {/* Navigation Menu with enhanced design */}
        <div
          className={`w-full bg-primary transition-all duration-500 ${
            scrolled ? "shadow-lg shadow-primary/20" : "shadow-md"
          }`}
        >
          <div className="container mx-auto">
            <nav className="hidden lg:flex justify-center relative z-50 overflow-x-auto whitespace-nowrap">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path || index}
                  className={`relative flex items-center font-bold text-white uppercase text-xs border-r border-white ${
                    index === menuItems.length - 1 ? "border-r-0" : ""
                  } hover:brightness-110 transition-all duration-300`}
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
                  style={{ position: "relative" }}
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
                      className="absolute bg-primary left-0 top-full w-fit shadow-lg z-[100] rounded-sm border-none truncate px-0 mt-1"
                      style={{ position: "absolute" }}
                      onHoverStart={() => {
                        if (item.submenu)
                          setHoveredItemPath(item.path || `menu-${index}`);
                      }}
                    >
                      <div>
                        {item.submenu.map((subItem, subIdx) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={() => setHoveredItemPath(null)}
                            className={`block uppercase px-5 py-3 font-bold text-[15px] text-white hover:text-yellow-200 hover:bg-green-900 transition-all duration-200${
                              Array.isArray(item.submenu) &&
                              subIdx !== item.submenu.length - 1
                                ? " border-b border-white/20"
                                : ""
                            }`}
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

        {/* Scrolling Text Bar */}
        <div className="relative z-0 w-full bg-gradient-to-r from-green-50 via-white to-green-50 border-b border-green-200 shadow-sm overflow-visible">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-1.5">
            {/* Logo and Sliding Slogan */}
            <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
              <div className="flex items-center gap-3 cursor-pointer">
                <Image
                  onClick={() => router.push("/")}
                  src="/images/logo.png"
                  alt="Logo"
                  width={0}
                  height={0}
                  sizes="100%"
                  className="h-6 sm:h-8 w-auto flex-shrink-0 cursor-pointer"
                />
              </div>
              <div className="relative overflow-hidden flex-1 w-full">
                <div className="animate-slide-left-infinite whitespace-nowrap flex items-center">
                  <span className="inline-block text-green-700 font-semibold text-xs md:text-sm mx-4">
                    KIẾN TẠO KHÔNG GIAN SỐNG HOÀN HẢO - XÂY DỰNG TƯƠNG LAI BỀN
                    VỮNG
                  </span>
                  <span className="inline-flex items-center text-primary mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                  <span className="inline-block text-green-700 font-semibold text-xs md:text-sm mx-4">
                    CHẤT LƯỢNG TẠO NIỀM TIN - UY TÍN DỰNG THƯƠNG HIỆU
                  </span>
                  <span className="inline-flex items-center text-primary mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                  <span className="inline-block text-green-700 font-semibold text-xs md:text-sm mx-4">
                    THIẾT KẾ ĐỘT PHÁ - THI CÔNG CHUYÊN NGHIỆP
                  </span>
                  <span className="inline-flex items-center text-primary mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Compact Search Bar */}
            <div className="w-full sm:w-[200px] md:w-[250px] sm:ml-4 mt-2 sm:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-full border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-200 outline-none transition-all duration-300 text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchOpen(true);
                  }}
                  readOnly
                />
                <div
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-600 cursor-pointer"
                  onClick={() => setSearchOpen(true)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Slide from left */}
      <div
        id="mobile-menu"
        className={`lg:hidden fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white shadow-xl z-[100] transition-transform duration-300 ease-in-out transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <Image
                src="/images/logo.png"
                alt="Kiến Tạo Nhà Đẹp Logo"
                width={0}
                height={0}
                sizes="100%"
                className="h-10 w-auto"
                priority
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-700 font-semibold leading-relaxed bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              XÂY NIỀM TIN - DỰNG TƯƠNG LAI
            </p>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <MobileMenuItem
                key={index}
                item={item}
                closeMenu={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>

          {/* Mobile Hotline with enhanced design */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 shadow-lg">
              <div className="bg-gradient-to-r from-primary to-secondary rounded-full p-2.5 shadow-md">
                <svg
                  className="w-5 h-5 text-white"
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
                <p className="text-primary font-semibold text-xs">
                  Hotline 24/7
                </p>
                <a
                  href="tel:0961993915"
                  className="font-bold text-base bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-300 hover:opacity-80"
                >
                  096 1993 915
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Add this to your global CSS or tailwind.config.js */}
      <style jsx global>{`
        @keyframes slide-left-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-slide-left-infinite {
          animation: slide-left-infinite 25s linear infinite;
          display: inline-block;
        }
        .animate-slide-left-infinite:hover {
          animation-play-state: paused;
        }
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-in-out forwards;
        }
      `}</style>
    </header>
  );
};

// Mobile Menu Item Component
const MobileMenuItem = ({
  item,
  closeMenu,
}: {
  item: MenuItemType;
  closeMenu: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleItemClick = () => {
    if (item.path) {
      closeMenu();
      router.push(item.path);
    } else if (item.submenu) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="border-b border-gray-100/50 last:border-0">
      <div className="flex items-center justify-between">
        <div
          className="py-3 block text-nowrap text-gray-700 font-semibold text-base w-full hover:text-primary transition-colors duration-300 cursor-pointer"
          onClick={handleItemClick}
        >
          {item.label}
        </div>
        {item.submenu && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition-all duration-300 focus:outline-none"
            aria-label="Toggle submenu"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
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
          <div className="pl-4 pb-2 bg-green-700">
            {item.submenu.map((subItem: BaseMenuItem) => (
              <Link
                key={subItem.path}
                href={subItem.path}
                className="block py-2.5 pl-4 text-sm text-white hover:text-yellow-300 hover:bg-green-800 border-l-2 border-transparent hover:border-yellow-300 transition-all duration-200"
                onClick={closeMenu}
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
