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
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-xl flex flex-col h-full">
      {/* Visual Header: Icon Placeholder + Number */}
      <div className="p-6 flex items-center space-x-4">
        {/* Icon Placeholder - Replace with actual SVG/Icon component */}
        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold group-hover:bg-primary/80 transition-colors duration-300">
          {/* E.g., <YourIconComponent /> */}
          {number}{" "}
          {/* Displaying number here temporarily, can be an icon or separate */}
        </div>
        <h3
          onClick={() => router.push(path)}
          className="cursor-pointer text-xl font-semibold text-gray-700 group-hover:text-primary transition-colors duration-300"
        >
          {title}
        </h3>
      </div>

      {/* Content Area */}
      <div className="p-6 pt-0 flex-grow">
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      {/* Optional: Footer element for a CTA or link if needed in future */}
      {/* <div className="p-4 bg-gray-50 text-right">
        <a href="#" className="text-sm text-primary hover:underline">Learn More</a>
      </div> */}
    </div>
  );
};

const PriceInfoSection: React.FC = () => {
  const items: InfoItemProps[] = [
    {
      number: "01", // Using two digits for consistency if numbers go beyond 9
      title: "BÁO GIÁ XÂY NHÀ TRỌN GÓI",
      path: "/bao-gia/xay-nha-tron-goi",
      subtitle:
        "Miễn phí GPXD - Thiết kế kiến trúc. Giải pháp toàn diện từ A-Z cho ngôi nhà mơ ước của bạn.",
    },
    {
      number: "02",
      title: "BÁO GIÁ XÂY DỰNG PHẦN THÔ",
      path: "/bao-gia/xay-nha-phan-tho",
      subtitle:
        "Miễn phí GPXD - Thiết kế kiến trúc. Nền tảng vững chắc cho công trình với chất lượng đảm bảo.",
    },
    {
      number: "03",
      title: "BÁO GIÁ SỬA CHỮA NHÀ",
      path: "/bao-gia/sua-nha-tron-goi",
      subtitle:
        "Miễn phí thiết kế kiến trúc. Hồi sinh không gian sống, nâng tầm giá trị ngôi nhà.",
    },
    {
      number: "04",
      title: "BÁO GIÁ THIẾT KẾ KIẾN TRÚC",
      path: "/bao-gia/thiet-ke-nha",
      subtitle:
        "Miễn phí khi thi công. Hiện thực hóa ý tưởng, tạo nên những công trình độc đáo và ấn tượng.",
    },
  ];

  return (
    <section className=" py-8 md:py-16  bg-gradient-to-b from-primary/20 to-white">
      <div className="container mx-auto px-4 rounded-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
