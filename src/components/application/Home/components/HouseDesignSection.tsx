import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array]; // Create a copy to avoid mutating the original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
  }
  return newArray;
};

const HouseDesignSection = () => {
  // Shuffle the houseDesigns array once on component mount
  const shuffledHouseDesigns = useMemo(() => shuffleArray(houseDesigns), []);

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary uppercase mb-2">
            Mẫu Thiết Kế Nhà Đẹp
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-primary w-16"></div>
            <p className="mx-4 text-muted-foreground">
              Mẫu thiết kế nhà đẹp mới nhất
            </p>
            <div className="h-0.5 bg-primary w-16"></div>
          </div>
        </div>

        {/* Pinterest-style masonry layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {shuffledHouseDesigns.map((design, index) => (
            <div
              key={`${design.title}-${index}`}
              className="break-inside-avoid mb-4"
            >
              <Link
                href={design.link}
                className={`group relative block overflow-hidden rounded-xl border border-border/40 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-md ${
                  // Alternate heights for visual interest
                  index % 3 === 0
                    ? "aspect-[3/4]"
                    : index % 3 === 1
                    ? "aspect-[4/5]"
                    : "aspect-[1/1]"
                }`}
              >
                <Image
                  src={design.image}
                  alt={design.title}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Permanent overlay gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Additional hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                <span className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-full text-xs backdrop-blur-sm">
                  {design.type}
                </span>

                {/* Content - Always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg mb-1 drop-shadow-md">
                    {design.title}
                  </h3>
                  <p className="text-white/90 text-sm line-clamp-2 drop-shadow-md">
                    {design.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Nút xem tất cả */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="default"
            className="bg-primary text-white hover:bg-primary/90 px-6 py-4 h-auto text-base font-medium"
          >
            <Link href="/projects">Xem tất cả mẫu thiết kế</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HouseDesignSection;

const houseDesigns = [
  {
    title: "Nhà Phố 3 Tầng Hiện Đại",
    description:
      "Thiết kế nhà phố 3 tầng với không gian mở, tối ưu ánh sáng tự nhiên",
    image: "/images/houses/house_1.avif",
    link: "/mau-nha-dep/biet-thu",
    type: "Nhà phố",
  },
  {
    title: "Biệt Thự Vườn 2 Tầng",
    description: "Biệt thự vườn kết hợp kiến trúc hiện đại và không gian xanh",
    image: "/images/houses/house_2.avif",
    link: "/mau-nha-dep/biet-thu",
    type: "Biệt thự",
  },
  {
    title: "Nhà Phố Mặt Tiền 5m",
    description: "Thiết kế thông minh cho nhà phố mặt tiền hẹp tại khu đô thị",
    image: "/images/houses/house_3.avif",
    link: "/mau-nha-dep/nha-pho",
    type: "Nhà phố",
  },
  {
    title: "Biệt Thự Nghỉ Dưỡng",
    description: "Không gian nghỉ dưỡng sang trọng với hồ bơi và sân vườn",
    image: "/images/houses/house_4.avif",
    link: "/mau-nha-dep/biet-thu",
    type: "Biệt thự",
  },
  {
    title: "Nhà Phố 4 Tầng",
    description: "Thiết kế hiện đại với không gian kinh doanh tầng trệt",
    image: "/images/houses/house_5.avif",
    link: "/mau-nha-dep/nha-pho",
    type: "Nhà phố",
  },
  {
    title: "Biệt Thự Song Lập",
    description: "Thiết kế biệt thự song lập với kiến trúc đương đại",
    image: "/images/houses/house_6.avif",
    link: "/mau-nha-dep/biet-thu",
    type: "Biệt thự",
  },
  {
    title: "Biệt Thự Vườn Hiện Đại",
    description: "Biệt thự vườn kết hợp kiến trúc hiện đại và không gian xanh",
    image: "/images/houses/house_7.avif",
    link: "/mau-nha-dep/biet-thu",
    type: "Biệt thự",
  },
  {
    title: "Căn Hộ Cao Cấp",
    description:
      "Căn hộ cao cấp với không gian thoáng đãng và thiết kế hiện đại",
    image: "/images/houses/house_8.avif",
    link: "/mau-nha-dep/biet-thu",
    type: "Biệt thự",
  },
];
