import React, { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/configs/axiosInstance'; // Import your axios instance

interface PostPreview {
  id: string;
  title: string;
  slug: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/blog/suggestions');
      const fetchedPosts = response.data.data.map((post: any) => ({
        id: post._id || post.id,
        title: post.title,
        slug: post.slug,
      }));
      setPosts(fetchedPosts);
    } catch (err: any) {
      console.error("Failed to fetch suggestions:", err);
      setError(err.response?.data?.message || err.message || "Không thể tải gợi ý bài viết.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async (query: string) => {
    if (!query.trim()) {
      fetchSuggestions();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/blog/search?title=${encodeURIComponent(query)}`);
      const searchedPosts = response.data.data.map((post: any) => ({
        id: post._id || post.id,
        title: post.title,
        slug: post.slug,
      }));
      setPosts(searchedPosts);
    } catch (err: any) {
      console.error("Failed to search posts:", err);
      setError(err.response?.data?.message || err.message || "Không tìm thấy bài viết nào.");
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
      } else {
        fetchSuggestions();
      }
    } else {
      setSearchQuery(''); // Clear search query when popup closes
      setPosts([]); // Clear posts when popup closes
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) { // Only run search if popup is open
      if (searchQuery) {
        debouncedSearchPosts(searchQuery);
      } else {
        // If search query is cleared, fetch suggestions again
        // This also handles the initial load via the isOpen effect if searchQuery is empty then
        fetchSuggestions(); 
      }
    }
  }, [searchQuery, isOpen]); // Rerun when searchQuery changes or popup opens


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSelectPost = (slug: string) => {
    router.push(slug);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  // Determine what posts to display and the heading based on current `posts` state
  const isSuggestingFromLoadedData = searchQuery === '';
  const postsToRender = isSuggestingFromLoadedData ? posts.slice(0, 5) : posts; // Use `posts` directly as it's already filtered or suggestions
  const listHeading = isSuggestingFromLoadedData ? 
    (posts.length > 0 ? "Bài viết gợi ý" : "") :
    (posts.length > 0 ? "Kết quả tìm kiếm" : "");

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
      <Command
        ref={commandRef}
        className="w-full max-w-xl bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="flex items-center border-b border-gray-100 px-4">
          <svg className="w-5 h-5 text-gray-500 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Command.Input
            ref={inputRef}
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Tìm kiếm bài viết..."
            className="w-full h-14 bg-transparent text-base text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>
        
        <Command.List className="max-h-[calc(70vh-100px)] sm:max-h-[calc(60vh-80px)] overflow-y-auto p-2">
          {loading && <div className="p-4 text-sm text-center text-gray-500">Đang tải...</div>}
          
          {error && !loading && <div className="p-4 text-sm text-center text-red-500">{error}</div>}
          
          {!loading && !error && (
            <>
              {isSuggestingFromLoadedData && posts.length === 0 && (
                <div className="p-4 text-sm text-center text-gray-500">Không có bài viết nào để gợi ý.</div>
              )}

              {!isSuggestingFromLoadedData && posts.length === 0 && (
                <Command.Empty className="p-6 text-sm text-center text-gray-500">
                  Không tìm thấy kết quả cho "{searchQuery}"
                </Command.Empty>
              )}
              
              {postsToRender.length > 0 && (
                <Command.Group 
                  heading={listHeading} 
                  className="text-xs font-medium text-gray-500 px-2 pt-3 pb-1"
                >
                  {postsToRender.map((post) => (
                    <Command.Item
                      key={post.id}
                      value={post.title}
                      onSelect={() => handleSelectPost(post.slug)}
                      className="px-3 py-3 rounded-lg text-gray-700 text-sm flex items-center cursor-pointer hover:bg-gray-50 transition-colors data-[selected]:bg-gray-100 data-[selected]:text-gray-900"
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        {post.title}
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