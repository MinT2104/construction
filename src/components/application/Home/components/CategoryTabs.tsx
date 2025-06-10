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
    <div className="mb-12 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
      <div className="flex space-x-1 md:space-x-2 min-w-max">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(tab.slug)}
            className={`relative inline-block px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-200 ${
              localActiveTab === tab.slug
                ? "text-primary"
                : "text-gray-700 dark:text-gray-300 hover:text-primary"
            }`}
          >
            {tab.label}
            <span
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 ${
                localActiveTab === tab.slug
                  ? "scale-x-100"
                  : "scale-x-0 hover:scale-x-100"
              }`}
            ></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
