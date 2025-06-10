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
      <div className="w-full bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-1 px-2">
            {/* Logo and Company Name */}
            <div className="flex items-center gap-2">
              <Image
                onClick={() => router.push("/")}
                src="/images/logo.png"
                alt="Logo"
                width={0}
                height={0}
                sizes="100%"
                className="h-12 w-auto cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-bold text-primary text-base leading-tight">KIẾN TẠO NHÀ ĐẸP</span>
                <span className="text-orange-400 text-xs leading-tight">KIẾN TẠO KHÔNG GIAN SỐNG</span>
              </div>
            </div>
            
            {/* Hamburger button for mobile */}
            <button
              className="block lg:hidden ml-auto p-1 rounded focus:outline-none border border-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Banner Area */}
            <div className="flex-1 px-2 hidden md:block">
              <div className="w-full text-center">
                <div className="text-red-600 font-bold text-base mb-0.5 leading-tight">CHẤT LƯỢNG LÀ DANH DỰ - UY TÍN LÀ CAM KẾT</div>
                <div className="text-green-700 font-bold text-sm leading-tight">KHÔNG BÁN THẦU - PHẠT 300 TRIỆU NẾU VẬT LIỆU KÉM CHẤT LƯỢNG</div>
              </div>
            </div>
            
            {/* Hotline */}
            <div className="bg-primary rounded-lg overflow-hidden flex flex-col items-center ml-2">
              <div className="bg-white py-0.5 px-2 w-full text-center">
                <span className="text-primary font-bold text-base leading-tight">Hotline</span>
                <span className="ml-1 inline-block">
                  <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </span>
              </div>
              <div className="bg-primary py-1 px-3 w-full text-center">
                <a href="tel:0961993915" className="text-white text-base font-bold leading-tight">096 1993 915</a>
              </div>
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
          className={`w-full bg-gradient-to-r from-primary via-primary/95 to-primary-dark transition-all duration-500 ${
            scrolled ? "shadow-lg shadow-primary/20" : "shadow-md"
          }`}
        >
          <div className="container mx-auto">
            <nav className="hidden lg:flex justify-center relative z-50">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path || index}
                  className={`relative bg-gradient-to-r from-primary via-primary/95 to-primary-dark px-3 py-1 flex items-center font-bold text-white uppercase text-xs border-r border-white ${index === menuItems.length - 1 ? 'border-r-0' : ''} hover:brightness-110 transition-all duration-300`}
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
                        uppercase px-3 py-1 text-white font-bold hover:bg-white/10 transition-all duration-300 text-xs inline-flex items-center relative
                        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300
                        hover:after:w-full whitespace-nowrap text-nowrap
                      `}
                    >
                      {item.label}
                      {item.submenu && (
                        <span className="ml-1 text-base align-middle">&raquo;</span>
                      )}
                    </Link>
                  ) : (
                    <div
                      className={`
                        uppercase px-3 py-1 text-white font-bold hover:bg-white/10 transition-all duration-300 text-xs inline-flex items-center relative cursor-pointer
                        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300
                        hover:after:w-full
                      `}
                    >
                      {item.label}
                      {item.submenu && (
                        <span className="ml-1 text-base align-middle">&raquo;</span>
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
                      className="absolute bg-green-800 left-0 top-full w-72 shadow-lg z-[100] rounded-lg border-none py-2 px-0"
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
                            className={`block uppercase px-5 py-2 font-bold text-[15px] text-white hover:text-yellow-300 hover:bg-green-900 transition-all duration-200${Array.isArray(item.submenu) && subIdx !== item.submenu.length - 1 ? ' border-b border-white/20' : ''}`}
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
          <div className="container mx-auto flex items-center justify-between px-4 py-1.5">
            {/* Logo and Sliding Slogan */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative overflow-hidden flex-1">
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
            <div className="w-[200px] md:w-[250px] ml-4">
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

      {/* Mobile Navigation Menu with enhanced design */}
      <div
        className={`lg:hidden bg-white/95 backdrop-blur-md shadow-lg absolute w-full transition-all duration-500 ease-in-out z-[60] ${
          mobileMenuOpen
            ? "max-h-[80vh] overflow-y-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          {/* Mobile slogan with enhanced design */}
          <div className="md:hidden border-b border-gray-100/50 py-3 mb-3">
            <p className="text-sm text-gray-700 font-semibold leading-relaxed bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              XÂY NIỀM TIN - DỰNG TƯƠNG LAI
            </p>
          </div>

          {menuItems.map((item, index) => (
            <MobileMenuItem key={index} item={item} />
          ))}

          {/* Mobile Hotline with enhanced design */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 mt-4 shadow-lg">
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
              <p className="text-primary font-semibold text-xs">Hotline 24/7</p>
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
const MobileMenuItem = ({ item }: { item: MenuItemType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="border-b border-gray-100/50 last:border-0">
      <div className="flex items-center justify-between">
        {item.path ? (
          <Link
            href={item.path}
            className="py-3 block text-nowrap text-gray-700 font-semibold text-base w-full hover:text-primary transition-colors duration-300"
          >
            {item.label}
          </Link>
        ) : (
          <div
            className="py-3 block text-nowrap text-gray-700 font-semibold text-base w-full hover:text-primary transition-colors duration-300 cursor-pointer"
            onClick={() => item.submenu && setIsOpen(!isOpen)}
          >
            {item.label}
          </div>
        )}
        {item.submenu && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition-all duration-300 focus:outline-none"
            aria-label="Toggle submenu"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="pl-4 pb-2 bg-green-700">
            {item.submenu.map((subItem: BaseMenuItem) => (
              <Link
                key={subItem.path}
                href={subItem.path}
                className="block py-2.5 pl-4 text-sm text-white hover:text-yellow-300 hover:bg-green-800 border-l-2 border-transparent hover:border-yellow-300 transition-all duration-200"
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