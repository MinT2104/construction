import { notFound } from "next/navigation";
import menuItems from "@/lib/constants/menu";
import { findMenuItemByPath } from "@/lib/utils/menu-utils";
import {
  fetchPostBySlug,
  fetchPostsByCategory,
} from "@/lib/services/post.service";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { Post } from "@/lib/types/modules/post.interface";
import {
  PageLayout,
  SinglePostView,
  CategoryView,
  HouseDesignView,
  DefaultView,
} from "@/components/application/Page";

// Sử dụng kiểu tham số chính xác cho Next.js 14
type Props = {
  params: Promise<{ slug: string[] }>;
};

async function Page({ params }: Props) {
  const { slug: slugParams } = await params;
  const path = `/${slugParams.join("/")}`;

  console.log("slug", slugParams);

  // Kiểm tra path có hợp lệ không
  // Đường dẫn không nên chứa các ký tự đặc biệt không mong muốn hoặc quá dài
  if (path.includes("//") || path.includes("..") || path.length > 100) {
    notFound();
  }

  const menuItem = findMenuItemByPath(menuItems, path);

  if (!menuItem && !slugParams.includes("bai-viet")) {
    notFound();
  }
  const slug = slugParams[slugParams.length - 1];
  // Render page content based on type
  let pageContent;

  if (slugParams.includes("bai-viet")) {
    const fetchedPost = await fetchPostBySlug(slug);
    console.log("fetchedPost", fetchedPost);
    if (!fetchedPost) return notFound();

    // Type assertion with spreading to ensure all required fields
    const post = {
      ...fetchedPost,
      category: menuItem?.label,
      status: "published",
    } as Post;
    return (
      <PageLayout
        slug={slugParams}
        menuItems={menuItems}
        parentMenuItem={{
          label: menuItem?.label || "",
          isUseSidebar: true,
          type: menuItem?.type || "single",
        }}
      >
        <SinglePostView post={post} />
      </PageLayout>
    );
  }

  // Find parent menu item
  const parentMenuItem = menuItems.find(
    (item) =>
      item.submenu?.some((subItem) => subItem.path === path) ||
      item.path === path
  );

  const currentItem = menuItem as BaseMenuItem;

  if (currentItem && currentItem.type === "single") {
    const fetchedPost = await fetchPostBySlug(slug);
    console.log("fetchedPost", fetchedPost);
    if (!fetchedPost) return notFound();

    // Type assertion with spreading to ensure all required fields
    const post = {
      ...fetchedPost,
      category: currentItem.label,
      status: "published",
    } as Post;

    pageContent = <SinglePostView post={post} />;
  } else if (currentItem && currentItem.type === "category") {
    const fetchedPosts = await fetchPostsByCategory(slug);

    // Transform and ensure correct typing for each post
    const posts = fetchedPosts.map((post) => ({
      ...post,
      category: currentItem.label,
      status: "published",
    })) as Post[];

    pageContent = <CategoryView posts={posts} currentItem={currentItem} />;
  } else if (
    currentItem &&
    (currentItem.type === "house-design" ||
      currentItem.path.includes("/mau-nha-dep"))
  ) {
    pageContent = <HouseDesignView currentItem={currentItem} />;
  } else if (currentItem) {
    // Default case
    pageContent = <DefaultView currentItem={currentItem} />;
  }

  return (
    <PageLayout
      slug={slugParams}
      menuItems={menuItems}
      parentMenuItem={parentMenuItem}
    >
      {pageContent}
    </PageLayout>
  );
}

export default Page;
