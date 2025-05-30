import React from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Sidebar from "@/components/common/Sidebar";
import PriceInfoSection from "@/components/application/Home/components/PriceInfoSection";
import { MapPin } from "lucide-react";
import { MenuItemType } from "@/lib/types/common/menu.interface";

interface PageLayoutProps {
  children: React.ReactNode;
  slug: string[];
  menuItems: MenuItemType[];
  parentMenuItem?: MenuItemType;
}

const PageLayout = ({
  children,
  slug,
  menuItems,
  parentMenuItem,
}: PageLayoutProps) => (
  <div>
    <PriceInfoSection />

    {/* Beautiful, simple and prominent breadcrumb section */}
    <div className="border-y border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="text-lg font-bold text-primary mr-8 hidden md:flex items-center">
            <MapPin className="h-5 w-5 font-bold" />
            <span className="ml-2">Bạn đang ở đây</span>
          </div>
          <Breadcrumb slug={slug} menuItems={menuItems} />
        </div>
      </div>
    </div>

    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow lg:w-[70%]">{children}</div>
        {parentMenuItem?.isUseSidebar && (
          <div className="lg:w-[30%]">
            <Sidebar />
          </div>
        )}
      </div>
    </div>
  </div>
);

export default PageLayout;
