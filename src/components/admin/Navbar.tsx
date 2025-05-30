"use client"; // Navbar now uses context

import { FC } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

const Navbar: FC = () => {
  const { isSidebarCollapsed } = useSidebar();

  return (
    <nav
      className={cn(
        "bg-white shadow-sm fixed right-0 top-0 z-10 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "left-20" : "left-64"
      )}
    >
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Quản trị hệ thống
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
