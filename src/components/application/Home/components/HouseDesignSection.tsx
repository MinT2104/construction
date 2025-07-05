import Link from "next/link";
import { Button } from "@/components/ui/button";
import { blogService } from "@/lib/services/blog.service";
import Image from "next/image";

async function HouseDesignSection() {
  let houseDesignPosts: any[] = [];

  try {
    const fetchedPost = await blogService.getBlogsByCategory("mau-nha-dep");
    houseDesignPosts = fetchedPost?.rows?.slice(0, 6) || [];
  } catch (error) {
    console.error("Error fetching house design data:", error);
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mẫu Nhà Đẹp</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những mẫu thiết kế nhà đẹp hiện đại và tiện nghi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {houseDesignPosts.map((post: any) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative aspect-video">
                <Image
                  src={post.featuredImage?.url || "/images/placeholder.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link href={`/bai-viet/${post.slug}`}>
                  <Button variant="outline" className="w-full">
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/mau-nha-dep">
            <Button size="lg">Xem Tất Cả Mẫu Nhà</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HouseDesignSection;
