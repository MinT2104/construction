import { Video } from "@/lib/types/modules/video.interface";
import VideoList from "./VideoList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface VideoListPageProps {
  videos: Video[];
  totalPages?: number;
  currentPage?: number;
}

export default function VideoListPage({
  videos,
  totalPages = 1,
  currentPage = 1,
}: VideoListPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // This would be handled by the API in a real implementation
  // Here we're just filtering the videos locally for demonstration
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Video thi công xây dựng
          </h1>

          <div className="relative max-w-md w-full">
            <Input
              type="text"
              placeholder="Tìm kiếm video..."
              className="pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="h-8 w-1 bg-primary rounded-full mr-3"></div>
            <h2 className="text-xl font-semibold">
              {searchTerm
                ? `Kết quả tìm kiếm: ${filteredVideos.length} video`
                : "Tất cả video"}
            </h2>
          </div>

          {filteredVideos.length > 0 ? (
            <VideoList videos={filteredVideos} title="" />
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              {searchTerm
                ? "Không tìm thấy video nào phù hợp với từ khóa tìm kiếm"
                : "Không có video nào"}
            </div>
          )}

          {totalPages > 1 && !searchTerm && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/videos?page=${currentPage - 1}`}
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/videos?page=${page}`}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`/videos?page=${currentPage + 1}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
