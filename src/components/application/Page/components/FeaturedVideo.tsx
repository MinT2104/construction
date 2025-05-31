import { videoService } from "@/lib/services/video.service";
import Link from "next/link";
// Server component for formatting numbers
function formatViewCount(count: number): string {
  return new Intl.NumberFormat("vi-VN").format(count);
}

// Format video duration (converts YouTube format to readable format)
function formatDuration(duration: string): string {
  // Handle YouTube duration format (PT#M#S)
  if (duration.includes("PT")) {
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (matches) {
      const hours = matches[1] ? parseInt(matches[1]) : 0;
      const minutes = matches[2] ? parseInt(matches[2]) : 0;
      const seconds = matches[3] ? parseInt(matches[3]) : 0;

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      }
    }
  }

  // Return original if format not recognized
  return duration;
}

const handleGetFeaturedVideos = async () => {
  const res = await videoService.getTrongHoaiXayDungVideos(3);
  return res.data;
};

const FeaturedVideo = async () => {
  const featuredVideos = await handleGetFeaturedVideos();

  return (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-lg transition-all duration-300">
      <h3 className="text-base font-semibold mb-4 text-gray-800 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-red-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
        </svg>
        <span className="bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
          Video nổi bật
        </span>
      </h3>
      <div className="space-y-6">
        {featuredVideos.videos.map((video) => (
          <Link
            key={video.id}
            href={`/videos/${video.id}`}
            className="block group"
          >
            <div className="flex flex-col">
              <div className="relative rounded-xl overflow-hidden mb-3">
                <img
                  src={video.thumbnails.high.url}
                  alt={video.title}
                  width={video.thumbnails.high.width}
                  height={video.thumbnails.high.height}
                  className="w-full h-40 sm:h-40 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">
                  {formatDuration(video.duration)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-red-600/90 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 line-clamp-2 transition-colors duration-200">
                {video.title}
              </h4>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 flex items-center">
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {formatViewCount(video.viewCount)} lượt xem
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(video.publishedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </Link>
        ))}
        <Link
          href="/videos"
          className="inline-block text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200 mt-4"
        >
          Xem tất cả video →
        </Link>
      </div>
    </div>
  );
};

export default FeaturedVideo;
