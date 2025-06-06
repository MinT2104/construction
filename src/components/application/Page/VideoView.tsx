import {
  VideoResponse,
  Video,
  getAllVideosResponse,
} from "@/lib/types/modules/video.interface";
import {
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  HeartIcon,
  MessageSquareIcon,
  SearchIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatDuration } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";
import VideoListRenderWithSearch from "./components/VideoListRenderWithSearch";

interface VideoViewProps {
  isList: boolean;
  videoResponse: getAllVideosResponse | VideoResponse;
}

export default function VideoView({ isList, videoResponse }: VideoViewProps) {
  if (!videoResponse || !videoResponse.success) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive font-semibold">
        Video không tồn tại hoặc đã bị xóa
      </div>
    );
  }

  // === LIST MODE ===
  if (isList && "data" in videoResponse && "videos" in videoResponse.data) {
    return (
      <VideoListRenderWithSearch
        videoResponse={videoResponse as getAllVideosResponse}
      />
    );
  }

  // === DETAIL MODE ===
  const video = videoResponse.data as Video;
  const publishedDate = new Date(video.publishedAt);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Video Player */}
        <div className="aspect-video w-full mb-6 bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Video Info */}
        <div className="bg-card rounded-xl shadow-md p-6 mb-10 space-y-6">
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <span>
                {formatDistanceToNow(publishedDate, {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4 text-primary" />
              <span>{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4 text-primary" />
              <span>{video.viewCount.toLocaleString()} lượt xem</span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="w-4 h-4 text-primary" />
              <span>{video.likeCount.toLocaleString()} lượt thích</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquareIcon className="w-4 h-4 text-primary" />
              <span>{video.commentCount.toLocaleString()} bình luận</span>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h2 className="text-xl font-semibold mb-3">📄 Mô tả</h2>
            <p className="text-foreground whitespace-pre-line leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>

        {/* Channel Info */}
        <div className="bg-card rounded-xl shadow-md p-6 flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816z"></path>
              <path d="M10 15l5.19-3L10 9v6z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {video.channelTitle}
            </h3>
            <Button variant="outline" size="sm" asChild className="mt-1">
              <Link
                href={`https://www.youtube.com/channel/${video.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem kênh YouTube
              </Link>
            </Button>
          </div>
        </div>

        {/* Back button */}
        <div className="text-center">
          <Button asChild>
            <Link href="/videos">⬅️ Quay lại danh sách video</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
