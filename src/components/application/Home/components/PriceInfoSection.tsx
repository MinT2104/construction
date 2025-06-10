"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface InfoItemProps {
  number: string;
  title: string;
  subtitle: string;
  path: string;
}

const InfoItem: React.FC<InfoItemProps> = ({
  number,
  title,
  subtitle,
  path,
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(path)}
      className="cursor-pointer bg-primary text-white p-4 sm:p-6 flex items-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 h-full relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-all duration-300"></div>
      <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full bg-white/5 group-hover:scale-110 transition-all duration-300"></div>

      {/* Content */}
      <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white/60 mr-3 sm:mr-6 drop-shadow-md group-hover:text-white/80 transition-all duration-300">
        {number}
      </span>
      <div className="flex-1 z-10">
        <h3 className="font-bold text-sm sm:text-base uppercase tracking-wide drop-shadow-sm">
          {title}
        </h3>
        <hr className="my-1 sm:my-2 border-white/40 w-16 group-hover:w-full transition-all duration-500" />
        <p className="text-xs sm:text-sm font-medium text-white/90">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

const PriceInfoSection: React.FC = () => {
  const items: InfoItemProps[] = [
    {
      number: "1",
      title: "BÁO GIÁ XÂY NHÀ TRỌN GÓI",
      path: "/bao-gia/xay-nha-tron-goi",
      subtitle: "Miễn phí GPXD - Thiết kế kiến trúc",
    },
    {
      number: "2",
      title: "BÁO GIÁ XÂY DỰNG PHẦN THÔ",
      path: "/bao-gia/xay-nha-phan-tho",
      subtitle: "Miễn phí GPXD - Thiết kế kiến trúc",
    },
    {
      number: "3",
      title: "BÁO GIÁ SỬA CHỮA NHÀ",
      path: "/bao-gia/sua-nha-tron-goi",
      subtitle: "Miễn phí thiết kế kiến trúc",
    },
    {
      number: "4",
      title: "BÁO GIÁ THIẾT KẾ KIẾN TRÚC",
      path: "/bao-gia/thiet-ke-nha",
      subtitle: "Miễn phí khi thi công",
    },
  ];

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 shadow-lg rounded-lg overflow-hidden">
          {items.map((item) => (
            <InfoItem
              key={item.number}
              number={item.number}
              title={item.title}
              subtitle={item.subtitle}
              path={item.path}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceInfoSection;
