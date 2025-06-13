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
    <div className="mb-12 overflow-x-auto no-scrollbar">
      <div className="flex space-x-1 md:space-x-2 min-w-max">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(tab.slug)}
            className={`relative inline-block px-4 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold tracking-wide transition-colors duration-200 border-2 ${
              localActiveTab === tab.slug
                ? "bg-[#2B5A27] text-white border-[#2B5A27] shadow-md"
                : "text-[#2B5A27] border-[#2B5A27] hover:bg-[#2B5A27] hover:text-white"
            }`}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
