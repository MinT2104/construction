"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";

export default function AdminLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const { isSidebarCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Navbar />
      <div
        className={cn(
          "pt-16 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <main className="p-2">{children}</main>
      </div>
    </div>
  );
}
