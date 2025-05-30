import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { SectionHeader } from "./components";

interface HouseDesign {
  title: string;
  description: string;
  image: string;
  link: string;
  type: string;
}

interface HouseDesignViewProps {
  currentItem: BaseMenuItem;
}

const HouseDesignView: React.FC<HouseDesignViewProps> = ({ currentItem }) => {
  // Sample house design data
  const houseDesigns: HouseDesign[] = [
    {
      title: "Nhà Phố 3 Tầng Hiện Đại",
      description:
        "Thiết kế nhà phố 3 tầng với không gian mở, tối ưu ánh sáng tự nhiên",
      image: "/images/houses/house_1.avif",
      link: "/designs/modern-house-1",
      type: "Nhà phố",
    },
    {
      title: "Biệt Thự Vườn 2 Tầng",
      description:
        "Biệt thự vườn kết hợp kiến trúc hiện đại và không gian xanh",
      image: "/images/houses/house_2.avif",
      link: "/designs/garden-villa-1",
      type: "Biệt thự",
    },
    {
      title: "Nhà Phố Mặt Tiền 5m",
      description:
        "Thiết kế thông minh cho nhà phố mặt tiền hẹp tại khu đô thị",
      image: "/images/houses/house_3.avif",
      link: "/designs/narrow-house-1",
      type: "Nhà phố",
    },
    {
      title: "Biệt Thự Nghỉ Dưỡng",
      description: "Không gian nghỉ dưỡng sang trọng với hồ bơi và sân vườn",
      image: "/images/houses/house_4.avif",
      link: "/designs/resort-villa-1",
      type: "Biệt thự",
    },
    {
      title: "Nhà Phố 4 Tầng",
      description: "Thiết kế hiện đại với không gian kinh doanh tầng trệt",
      image: "/images/houses/house_5.avif",
      link: "/designs/commercial-house-1",
      type: "Nhà phố",
    },
    {
      title: "Biệt Thự Song Lập",
      description: "Thiết kế biệt thự song lập với kiến trúc đương đại",
      image: "/images/houses/house_6.avif",
      link: "/designs/duplex-villa-1",
      type: "Biệt thự",
    },
    {
      title: "Biệt Thự Vườn Hiện Đại",
      description:
        "Biệt thự vườn kết hợp kiến trúc hiện đại và không gian xanh",
      image: "/images/houses/house_7.avif",
      link: "/designs/modern-garden-villa",
      type: "Biệt thự",
    },
    {
      title: "Căn Hộ Cao Cấp",
      description:
        "Căn hộ cao cấp với không gian thoáng đãng và thiết kế hiện đại",
      image: "/images/houses/house_8.avif",
      link: "/designs/luxury-apartment",
      type: "Căn hộ",
    },
  ];

  return (
    <div>
      <SectionHeader
        title={currentItem.label}
        variant="centered"
        subtitle="Mẫu thiết kế nhà đẹp mới nhất với sự kết hợp hoàn hảo giữa công năng và thẩm mỹ"
      />

      {/* Pinterest-style masonry layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {houseDesigns.map((design, index) => (
          <HouseDesignCard
            key={`${design.title}-${index}`}
            design={design}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

interface HouseDesignCardProps {
  design: HouseDesign;
  index: number;
}

const HouseDesignCard: React.FC<HouseDesignCardProps> = ({ design, index }) => {
  return (
    <div className="break-inside-avoid mb-4">
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
  );
};

export default HouseDesignView;
