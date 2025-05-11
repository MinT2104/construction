import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getBreadcrumbItems } from "@/lib/utils/menu-utils";
import { MenuItemType } from "@/lib/types/common/menu.interface";

interface BreadcrumbProps {
  slug: string[];
  menuItems: MenuItemType[];
}

export default function Breadcrumb({ slug, menuItems }: BreadcrumbProps) {
  const breadcrumbItems = getBreadcrumbItems(menuItems, slug);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-500 mx-1" />
              )}

              {isLast ? (
                <span
                  className="text-sm font-medium text-gray-500"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
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
