import { MenuItemType } from "../types/common/menu.interface";

// Tìm menu item dựa vào path
export function findMenuItemByPath(
  menuItems: MenuItemType[],
  path: string
): MenuItemType | null {
  // Hàm đệ quy để tìm kiếm trong menu và submenu ở mọi cấp độ
  function findItem(
    items: MenuItemType[],
    currentPath: string,
    parentItem?: MenuItemType
  ): MenuItemType | null {
    for (const item of items) {
      // Kiểm tra item hiện tại
      if (item.path === currentPath) {
        return parentItem
          ? {
              label: item.label,
              path: item.path,
              isUseSidebar: parentItem.isUseSidebar,
              parentLabel: parentItem.label,
              parentPath: parentItem.path,
              type: item.type,
            }
          : item;
      }

      // Kiểm tra trong submenu nếu có
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (subItem.path === currentPath) {
            return {
              label: subItem.label,
              path: subItem.path,
              isUseSidebar: item.isUseSidebar,
              parentLabel: item.label,
              parentPath: item.path,
              type: subItem.type,
            };
          }
        }
      }
    }
    return null;
  }

  return findItem(menuItems, path);
}

// Tạo breadcrumb path từ slug
export function getBreadcrumbItems(
  menuItems: MenuItemType[],
  slug: string[]
): { label: string; path: string }[] {
  const path = `/${slug.join("/")}`;
  const breadcrumbs = [{ label: "Trang chủ", path: "/" }];

  // Tìm item trong menu
  const menuItem = findMenuItemByPath(menuItems, path);

  if (!menuItem) return breadcrumbs;

  // Nếu là submenu, thêm parent vào breadcrumb
  if ("parentLabel" in menuItem && "parentPath" in menuItem) {
    breadcrumbs.push({
      label: menuItem.parentLabel as string,
      path: (menuItem.parentPath as string) || "#",
    });
  }

  // Thêm item hiện tại
  breadcrumbs.push({
    label: menuItem.label,
    path,
  });

  return breadcrumbs;
}
