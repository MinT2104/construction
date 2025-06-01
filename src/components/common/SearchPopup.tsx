import React, { useState, useEffect, useRef } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/configs/axiosInstance"; // Import your axios instance
import Image from "next/image";
import { BookOpenIcon, Inbox } from "lucide-react";

interface PostPreview {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: {
    url: string;
    alt: string;
  };
  excerpt?: string;
  readingTime?: number;
  author?: {
    name: string;
    avatar: string;
  };
  createdAt: string;
}

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const searchPosts = async (query: string) => {
    if (!query.trim()) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `/blog/search?title=${encodeURIComponent(query)}`
      );
      const searchedPosts = response.data.data.map((post: any) => ({
        id: post._id || post.id,
        title: post.title,
        slug: post.slug,
        featuredImage: post.featuredImage,
        excerpt: post.excerpt || post.shortDescription,
        author: post.author,
        readingTime: post.readingTime,
        createdAt: post.createdAt,
      }));
      setPosts(searchedPosts);
    } catch (err: any) {
      console.error("Failed to search posts:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Không tìm thấy bài viết nào."
      );
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearchPosts = useRef(debounce(searchPosts, 711)).current;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      if (searchQuery) {
        debouncedSearchPosts(searchQuery);
      }
    } else {
      setSearchQuery(""); // Clear search query when popup closes
      setPosts([]); // Clear posts when popup closes
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Only run search if popup is open
      if (searchQuery) {
        debouncedSearchPosts(searchQuery);
      }
    }
  }, [searchQuery, isOpen]); // Rerun when searchQuery changes or popup opens

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSelectPost = (slug: string) => {
    router.push(`/bai-viet/${slug}`);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  // Determine what posts to display and the heading based on current `posts` state
  const isSuggestingFromLoadedData = searchQuery === "";
  const postsToRender = isSuggestingFromLoadedData ? posts.slice(0, 5) : posts; // Use `posts` directly as it's already filtered or suggestions

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
      <Command
        ref={commandRef}
        className="w-full max-w-3xl bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 min-h-[400px]"
      >
        <div className="flex items-center border-b border-gray-100 px-4">
          <svg
            className="w-5 h-5 text-gray-500 mr-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Command.Input
            ref={inputRef}
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Tìm kiếm bài viết..."
            className="w-full h-14 bg-transparent text-base text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <Command.List className="max-h-[calc(70vh-100px)] sm:max-h-[calc(60vh-80px)] overflow-y-auto p-2 h-full">
          {loading && (
            <div className="p-4 text-sm text-center text-gray-500">
              Đang tải...
            </div>
          )}

          {error && !loading && (
            <div className="p-4 text-sm text-center text-red-500">{error}</div>
          )}

          {!loading && !error && (
            <>
              {isSuggestingFromLoadedData && posts.length === 0 && (
                <div className="p-4 text-sm text-center text-gray-500 flex items-center justify-center gap-x-2 flex-col h-full mt-14">
                  <Inbox className="w-16 h-16 text-gray-400" />
                  <span className="text-base text-gray-500 font-bold mt-4">
                    Vui lòng nhập từ khóa để tìm kiếm
                  </span>
                </div>
              )}

              {!isSuggestingFromLoadedData && posts.length === 0 && (
                <Command.Empty className="p-6 text-sm text-center text-gray-500">
                  Không tìm thấy kết quả cho "{searchQuery}"
                </Command.Empty>
              )}
              {postsToRender.length > 0 && (
                <Command.Group className="text-xs font-medium text-gray-500 px-2 pt-3 pb-1 space-y-2">
                  {postsToRender.map((post) => (
                    <Command.Item
                      key={post._id}
                      value={post.title}
                      onSelect={() => handleSelectPost(post.slug)}
                      className="px-3 py-3 rounded-lg text-gray-700 text-sm cursor-pointer hover:bg-gray-50 transition-colors data-[selected]:bg-gray-100 data-[selected]:text-gray-900 gap-y-2 h-26 mb-2"
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className="h-20 w-20 relative shrink-0 overflow-hidden rounded-md">
                          {post.featuredImage ? (
                            <Image
                              src={post.featuredImage.url}
                              alt={post.featuredImage.alt || post.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base text-gray-900 line-clamp-1">
                            {post?.title || ""}
                          </h4>
                          {post.excerpt && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {post.excerpt.slice(0, 70) + "..."}
                            </p>
                          )}
                          <div className="flex items-center gap-x-2 h-10">
                            <span className="text-sm text-gray-500">
                              {post.author?.name || ""}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </>
          )}
        </Command.List>
      </Command>
    </div>
  );
};

export default SearchPopup;
