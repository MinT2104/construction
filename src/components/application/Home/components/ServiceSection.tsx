import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { blogService } from "@/lib/services/blog.service";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import { videoService } from "@/lib/services/video.service";
import ProjectListServiceSection from "./ProjectListServiceSection";
import FeaturedBlogCard from "./FeaturedBlogCard";

const handleGetFeaturedPosts = async () => {
  const featuredPosts = await blogService.getBlogFeatured();
  return featuredPosts;
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

const handleGetFeaturedVideos = async () => {
  const featuredVideos = await videoService.getTrongHoaiXayDungVideos(2);
  return featuredVideos;
};

async function ServiceSection() {
  const [featuredPosts, featuredVideos, mostViewPosts] = await Promise.all([
    handleGetFeaturedPosts(),
    handleGetFeaturedVideos(),
    handleGetMostViewPosts(),
  ]);

  const listMostViewPosts = (mostViewPosts?.rows ??
    []) as unknown as BlogPost[];

  if (!featuredPosts || !featuredPosts.data || !mostViewPosts) return null;

  const featuredPostsData = featuredPosts.data as BlogPost;

  console.log("featuredPostsData", featuredPostsData);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary uppercase mb-2">
            Bài viết nổi bật
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-primary w-16"></div>
            <p className="mx-4 text-muted-foreground">
              Kinh nghiệm thực tế và các giải pháp tối ưu trong lĩnh vực kiến
              trúc và xây dựng.
            </p>
            <div className="h-0.5 bg-primary w-16"></div>
          </div>
        </div>

        {/* Blog Posts Grid & Project List */}
        <div className="grid grid-cols-1 md:grid-cols-5 items-start gap-4">
          {/* Left Section with Featured Blog and Videos */}
          <div className="md:col-span-3 mb-12 md:mb-0 space-y-6">
            {/* Featured Blog Card with Overlay Text */}
            <FeaturedBlogCard featuredPostsData={featuredPostsData} />
            {/* Featured Videos Header */}
            <div className="flex items-center pt-4 mb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                Video nổi bật
              </h3>
              <div className="ml-4 h-0.5 bg-primary/60 flex-grow"></div>
              <Link
                href="/videos"
                className="text-primary text-sm font-medium hover:underline ml-4 flex items-center"
              >
                Xem tất cả
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                </svg>
              </Link>
            </div>

            {/* Featured Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredVideos.data.videos.map((video) => (
                <Link
                  key={video.id}
                  href={`/videos/${video.id}`}
                  className="relative group rounded-lg overflow-hidden shadow-md border border-border/40 bg-card hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={video.thumbnails.high.url}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex-grow bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
                    <h4 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-primary/70"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                        </svg>
                        Thời lượng: {video.duration}
                      </span>
                      <span className="text-xs font-medium text-primary flex items-center">
                        Xem video
                        <svg
                          className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Project List Section (Right) */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {listMostViewPosts.map((project) => (
                <ProjectListServiceSection
                  key={project._id}
                  project={project}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="default"
            className="bg-primary text-white hover:bg-primary/90 px-6 py-4 h-auto text-base font-medium"
          >
            <Link href="/videos">Xem tất cả dịch vụ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ServiceSection;
