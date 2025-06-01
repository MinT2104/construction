"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MenuItemType, BaseMenuItem } from "@/lib/types/common/menu.interface";
import menuItems from "@/lib/constants/menu";
import SearchPopup from "./SearchPopup";

const Header = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItemPath, setHoveredItemPath] = useState<string | null>(null);
  const [stickyNav, setStickyNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
      {/* Search Popup */}
      <SearchPopup isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Main Header - Modern design with glass effect */}
      <div
        ref={mainHeaderRef}
        className={`w-full backdrop-blur-md bg-white/95 border-b border-gray-100/50 transition-all duration-500 ${
          scrolled ? "shadow-lg shadow-primary/5" : "shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo and slogan section with enhanced animations */}
            <div className="flex items-center space-x-4 flex-1 w-full">
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
                  className="h-[60px] w-auto transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                  priority
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden md:block border-l border-gray-200/50 pl-4 w-full"
              >
                <p className="font-black text-xl tracking-wide bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  KIẾN TẠO NHÀ ĐẸP
                </p>
                <div className="mt-0.5">
                  <p className="font-bold text-secondary/90 leading-tight text-base">
                    XÂY NIỀM TIN - DỰNG TƯƠNG LAI
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Contact button with modern design */}
            <div className="select-none flex items-center space-x-4 max-w-[750px] w-full h-full relative">
              <div className="w-40 h-8 bg-[#07693F] absolute bottom-0 right-0 flex items-center justify-center">
                <span className="text-white font-bold text-xl select-none">
                  093 6267 359
                </span>
              </div>
              <Image
                src="https://kientrucvietquang.net/wp-content/uploads/2018/10/bg-header-viet-quang-group.png"
                alt="Hotline"
                width={0}
                height={0}
                sizes="100%"
                className="w-full h-full object-cover"
              />
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
                        hover:after:w-full whitespace-nowrap text-nowrap
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

        {/* HeaderValueBar */}
        <div className="w-full bg-gradient-to-r from-green-50 via-white to-green-50 border-b border-green-200 shadow-sm overflow-hidden">
          <div className="container mx-auto flex items-center justify-between px-4 py-1.5">
            {/* Logo and Sliding Slogan */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Image
                onClick={() => router.push("/")}
                src="/images/logo.png"
                alt="Logo"
                width={0}
                height={0}
                sizes="100%"
                className="h-8 w-auto flex-shrink-0 cursor-pointer"
              />
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
        className={`lg:hidden bg-white/95 backdrop-blur-md shadow-lg absolute w-full transition-all duration-500 ease-in-out z-50 ${
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

// Mobile Menu Item Component with enhanced design
const MobileMenuItem = ({ item }: { item: MenuItemType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

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
          <div className="pl-4 pb-2">
            {item.submenu.map((subItem: BaseMenuItem) => (
              <Link
                key={subItem.path}
                href={subItem.path}
                className="block py-2.5 pl-4 text-sm text-gray-600 hover:text-primary hover:translate-x-1 border-l-2 border-transparent hover:border-primary transition-all duration-200"
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
