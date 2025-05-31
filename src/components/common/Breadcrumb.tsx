import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { getBreadcrumbItems } from "@/lib/utils/menu-utils";
import { MenuItemType } from "@/lib/types/common/menu.interface";

interface BreadcrumbProps {
  menuItems: {
    label: string;
    path: string;
    parentLabel?: string;
    parentPath?: string;
  }[];
}

export default function Breadcrumb({ menuItems }: BreadcrumbProps) {
  return (
    <nav className="py-3" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-primary transition-colors flex items-center"
          >
            <Home className="h-5 w-5" />
          </Link>
        </li>

        {menuItems.map((item, index) => {
          const isLast = index === menuItems.length - 1;

          return (
            <li key={item.path} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />

              {isLast ? (
                <span className="text-primary font-bold" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
