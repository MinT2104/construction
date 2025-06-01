"use client";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { getAllVideosResponse } from "@/lib/types/modules/video.interface";
import { debounce, formatDuration } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { vi } from "date-fns/locale";
import Link from "next/link";

interface VideoListRenderWithSearchProps {
  videoResponse: getAllVideosResponse;
}

export default function VideoListRenderWithSearch({
  videoResponse,
}: VideoListRenderWithSearchProps) {
  const { videos, channelName } = videoResponse.data;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVideos, setFilteredVideos] = useState(videos);

  // Hàm loại bỏ dấu tiếng Việt
  function removeVietnameseAccents(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }
  // Hàm tìm kiếm có xử lý dấu tiếng Việt
  const filterVideos = (term: string) => {
    if (!term.trim()) {
      setFilteredVideos(videos);
      return;
    }

    const normalizedTerm = removeVietnameseAccents(term.toLowerCase());

    const filtered = videos.filter((video) => {
      const normalizedTitle = removeVietnameseAccents(
        video.title.toLowerCase()
      );
      const normalizedDescription = removeVietnameseAccents(
        video.description.toLowerCase()
      );

      return (
        normalizedTitle.includes(normalizedTerm) ||
        normalizedDescription.includes(normalizedTerm)
      );
    });

    setFilteredVideos(filtered);
  };

  // Sử dụng debounce để tránh gọi hàm search quá nhiều lần
  const debouncedSearch = debounce((term: string) => {
    filterVideos(term);
  }, 300);

  // Xử lý khi searchTerm thay đổi
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-foreground">
        📺 Danh sách video từ kênh{" "}
        <span className="text-primary">{channelName}</span>
      </h1>

      {/* Search box */}
      <div className="mb-6 relative max-w-full">
        <Input
          type="text"
          placeholder="Tìm kiếm video..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {filteredVideos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Không tìm thấy video phù hợp với từ khóa "{searchTerm}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredVideos.map((video) => {
            const publishedDate = new Date(video.publishedAt);
            return (
              <div
                key={video.id}
                className="bg-card rounded-xl shadow-lg overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl"
              >
                <Link href={`/videos/${video.id}`} className="block group">
                  <div className="relative aspect-video">
                    <Image
                      src={
                        video.thumbnails.maxres?.url ||
                        video.thumbnails.high.url
                      }
                      alt={video.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-medium tracking-tight">
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(publishedDate, {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
