import { Video } from "@/lib/types/modules/video.interface";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface VideoListProps {
  videos: Video[];
  title?: string;
}

export default function VideoList({
  videos,
  title = "Video nổi bật",
}: VideoListProps) {
  // Format duration from PT24M16S format to 24:16
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "00:00";

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Không có video nào
      </div>
    );
  }

  return (
    <div className="py-12">
      {title && (
        <div className="flex items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            {title}
          </h2>
          <div className="ml-4 h-0.5 bg-primary/20 flex-grow"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/videos/${video.id}`}
            className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-border/40"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={video.thumbnails.maxres?.url || video.thumbnails.high.url}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-7 h-7 text-white ml-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                {formatDuration(video.duration)}
              </div>
            </div>

            <div className="p-4 flex-grow flex flex-col">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {video.title}
              </h3>

              <div className="mt-auto pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-primary/70"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                  {formatDistanceToNow(new Date(video.publishedAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-primary/70"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  {video.viewCount.toLocaleString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
