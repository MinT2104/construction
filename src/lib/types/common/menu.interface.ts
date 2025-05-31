// Define types for menu items for better type safety (optional but recommended)
interface BaseMenuItem {
  label: string;
  path: string;
  type: "single" | "category" | "house-design";
  description?: string;
}

interface MenuItemType {
  label: string;
  path?: string;
  submenu?: BaseMenuItem[];
  isUseSidebar: boolean;
  type: "single" | "category" | "house-design";
  parentLabel?: string;
  parentPath?: string;
  description?: string;
}

export type { MenuItemType, BaseMenuItem };
