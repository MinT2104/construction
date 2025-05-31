import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { blogService } from "@/lib/services/blog.service";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import Link from "next/link";
import React from "react";

function formatViewCount(count: number): string {
  return new Intl.NumberFormat("vi-VN").format(count);
}

const handleGetNewPosts = async () => {
  try {
    const query = {
      page: 1,
      limit: 5,
      query: { status: "published" },
    };
    const newPosts = await blogService.getAllBlog(query);
    return newPosts;
  } catch (error) {
    console.error("Error fetching new posts:", error);
    return { rows: [], total: 0, page: 1, pageSize: 3, totalPages: 0 };
  }
};

const handleGetMostViewPosts = async () => {
  try {
    const query = {
      page: 1,
      limit: 35,
      query: { status: "published", sort: { viewCount: -1 } },
    };
    const mostViewPosts = await blogService.getAllBlog(query);
    return mostViewPosts;
  } catch (error) {
    console.error("Error fetching most viewed posts:", error);
    return { rows: [], total: 0, page: 1, pageSize: 3, totalPages: 0 };
  }
};

const SidePost = async () => {
  const [newPosts, mostViewPosts] = await Promise.all([
    handleGetNewPosts(),
    handleGetMostViewPosts(),
  ]);

  const listNewPosts = (newPosts?.rows ?? []) as unknown as BlogPost[];
  const listMostViewPosts = (mostViewPosts?.rows ??
    []) as unknown as BlogPost[];

  console.log(listNewPosts, "listNewPosts");
  console.log(listMostViewPosts, "listMostViewPosts");

  return (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-lg transition-all duration-300">
      <Tabs defaultValue="new-articles">
        <div className="border-b border-gray-100 mb-5">
          <TabsList className="p-0 bg-transparent h-auto space-x-4">
            <TabsTrigger
              value="new-articles"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 px-0 rounded-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-sm font-medium"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                    clipRule="evenodd"
                  />
                </svg>
                Bài viết mới
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="popular-articles"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 px-0 rounded-none data-[state=active]:text-yellow-600 data-[state=active]:border-b-2 data-[state=active]:border-yellow-600 text-sm font-medium"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Xem nhiều
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Bài viết mới nhất */}
        <TabsContent value="new-articles" className="space-y-4 m-0">
          {listNewPosts.map((article) => (
            <Link
              key={article._id}
              href={`/bai-viet/${article.slug}`}
              className="flex group"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden shadow-sm">
                <img
                  src={article.featuredImage?.url || ""}
                  alt="Thumbnail"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors duration-200">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </Link>
          ))}
          <Link
            href="#"
            className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 mt-2"
          >
            Xem tất cả bài viết →
          </Link>
        </TabsContent>

        {/* Bài viết xem nhiều */}
        <TabsContent value="popular-articles" className="space-y-4 m-0">
          {listMostViewPosts.map((article) => (
            <Link
              key={article._id}
              href={`/bai-viet/${article.slug}`}
              className="flex group"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden shadow-sm">
                <img
                  src={article.featuredImage?.url || ""}
                  alt="Thumbnail"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 transition-colors duration-200">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </Link>
          ))}
          <Link
            href="#"
            className="inline-block text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors duration-200 mt-2"
          >
            Xem tất cả bài viết phổ biến →
          </Link>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SidePost;
