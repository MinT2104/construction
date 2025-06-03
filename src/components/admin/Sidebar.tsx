"use client";

import { FC, ElementType } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Newspaper,
  ImageIcon,
  Calculator,
  Gift,
  Settings,
  ChevronRight,
  LogOut,
  Home,
  Package,
  TrendingUp,
  DollarSign,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

interface SubMenuItem {
  href: string;
  label: string;
  icon: ElementType;
  isCollapsible?: boolean;
  children?: SubMenuItem[];
  defaultOpen?: boolean;
  onClick?: () => void;
}

interface MenuItem {
  href?: string;
  label: string;
  icon: ElementType;
  isCollapsible?: boolean;
  children?: SubMenuItem[];
  defaultOpen?: boolean;
  onClick?: () => void;
}

const Sidebar: FC = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin");
  };

  const menuItems: MenuItem[] = [
    { href: "/admin/trang-chu", label: "Trang chủ", icon: LayoutDashboard },
    { href: "/admin/bai-viet", label: "Quản lý bài viết", icon: Newspaper },
    {
      label: "Cấu hình",
      icon: Settings,
      isCollapsible: true,
      defaultOpen: false,
      children: [
        { href: "/admin/cau-hinh/banner", label: "Banner", icon: ImageIcon },
        { href: "/admin/cau-hinh/bao-gia", label: "Báo giá", icon: Calculator },
        { href: "/admin/cau-hinh/khuyen-mai", label: "Khuyến mãi", icon: Gift },
        { href: "/admin/cau-hinh/he-so", label: "Hệ số quy đổi", icon: Percent },
        { href: "/admin/cau-hinh/loai-cong-trinh", label: "Loại công trình", icon: Home },
        { href: "/admin/cau-hinh/goi-xay-dung", label: "Gói xây dựng", icon: Package },
        { href: "/admin/cau-hinh/muc-dau-tu", label: "Mức đầu tư", icon: TrendingUp },
        { href: "/admin/cau-hinh/don-gia", label: "Đơn giá", icon: DollarSign },
      ],
    },
    { label: "Đăng xuất", icon: LogOut, onClick: handleLogout },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background shadow-sm transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
        onMouseEnter={() => setIsSidebarCollapsed(false)}
        onMouseLeave={() => setIsSidebarCollapsed(true)}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b",
            isSidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          <Link
            href="/admin/trang-chu"
            className={cn(
              "flex items-center gap-2",
              isSidebarCollapsed && "justify-center"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            {!isSidebarCollapsed && (
              <h1 className="text-lg font-semibold whitespace-nowrap">
                Kiến Tạo Nhà Đẹp
              </h1>
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-auto p-3">
          {menuItems.map((item) => {
            if (item.isCollapsible && item.children) {
              return (
                <Collapsible key={item.label} defaultOpen={item.defaultOpen}>
                  <CollapsibleTrigger className="w-full">
                    <div
                      role="button"
                      className={cn(
                        "w-full flex items-center rounded-md transition-all duration-200",
                        isSidebarCollapsed
                          ? "justify-center p-2"
                          : "justify-between px-3 py-2",
                        "text-sm font-medium text-foreground/80 hover:text-foreground",
                        "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      )}
                      aria-label={item.label}
                    >
                      <div
                        className={cn(
                          "flex items-center",
                          isSidebarCollapsed ? "gap-0" : "gap-3"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5",
                            isSidebarCollapsed && "mx-auto"
                          )}
                        />
                        {!isSidebarCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>
                      {!isSidebarCollapsed && (
                        <ChevronRight className="h-4 w-4 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  {isSidebarCollapsed && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="sr-only">{item.label}</div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {!isSidebarCollapsed && (
                    <CollapsibleContent className="space-y-1 pt-1 pl-9 pr-2">
                      {item.children.map((subItem) => (
                        <div key={subItem.href}>
                          <Link href={subItem.href}>
                            <div
                              role="button"
                              className={cn(
                                "w-full py-1.5 px-2 flex items-center justify-start rounded-md",
                                "text-sm font-medium text-muted-foreground transition-colors",
                                "hover:text-foreground hover:bg-accent/40"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <subItem.icon className="h-4 w-4 opacity-70" />
                                <span className="truncate">
                                  {subItem.label}
                                </span>
                              </div>
                            </div>
                          </Link>
                          {isSidebarCollapsed && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="sr-only">{subItem.label}</div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className="font-medium"
                              >
                                {subItem.label}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              );
            } else if (item.href) {
              return (
                <div key={item.href}>
                  <Link href={item.href}>
                    <div
                      role="button"
                      className={cn(
                        "w-full flex items-center rounded-md transition-all duration-200",
                        isSidebarCollapsed
                          ? "justify-center p-2"
                          : "justify-start px-3 py-2",
                        "text-sm font-medium text-foreground/80 hover:text-foreground",
                        "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center",
                          isSidebarCollapsed ? "gap-0" : "gap-3"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5",
                            isSidebarCollapsed && "mx-auto"
                          )}
                        />
                        {!isSidebarCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  {isSidebarCollapsed && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="sr-only">{item.label}</div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              );
            } else if (item.onClick) {
              return (
                <div key={item.label} className="mt-auto">
                  <div
                    role="button"
                    onClick={item.onClick}
                    className={cn(
                      "w-full flex items-center rounded-md transition-all duration-200",
                      isSidebarCollapsed
                        ? "justify-center p-2"
                        : "justify-start px-3 py-2",
                      "text-sm font-medium text-foreground/80 hover:text-foreground",
                      "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      item.label === "Đăng xuất" &&
                        "text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 mt-2"
                    )}
                    aria-label={item.label}
                  >
                    <div
                      className={cn(
                        "flex items-center",
                        isSidebarCollapsed ? "gap-0" : "gap-3"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          isSidebarCollapsed && "mx-auto"
                        )}
                      />
                      {!isSidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>
                  </div>
                  {isSidebarCollapsed && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="sr-only">{item.label}</div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              );
            }
            return null;
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
