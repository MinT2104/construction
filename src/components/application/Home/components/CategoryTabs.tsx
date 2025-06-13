"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Tab {
  label: string;
  path: string;
  slug: string;
}

interface CategoryTabsProps {
  tabs: Tab[];
  activeCategory: string;
  onTabChange: (slug: string) => void;
}

const CategoryTabs = ({
  tabs,
  activeCategory,
  onTabChange,
}: CategoryTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [localActiveTab, setLocalActiveTab] = useState(activeCategory);

  // Handle tab click - only update URL but don't trigger full reload
  const handleTabClick = (slug: string) => {
    // Update local state immediately
    setLocalActiveTab(slug);

    // Call parent callback to load content
    onTabChange(slug);

    // Update URL with query param without causing page reload
    const url = `${pathname}?category=${slug}`;
    router.push(url, { scroll: false });
  };

  return (
    <div className="container mt-12 mb-12 ">
      <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2 items-center">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(tab.slug)}
            className={`relative inline-block py-4 text-[15px] uppercase font-black tracking-wide transition-colors duration-200 text-nowrap ${
              localActiveTab === tab.slug
                ? "text-primary border-[2px] border-primary rounded-sm"
                : "text-gray-500 hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
