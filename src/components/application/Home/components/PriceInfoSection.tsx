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
      className="cursor-pointer bg-gradient-to-br from-white to-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 
                 border-l-4 border-primary flex h-full group relative"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-24 h-8 bg-primary/5 rounded-tr-full"></div>

      {/* Left section with number */}
      <div className="flex items-center justify-center p-4 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
        <span className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
          {number}
        </span>
      </div>

      {/* Content section */}
      <div className="flex flex-col p-5 flex-1 z-10">
        <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-base text-gray-600 leading-relaxed mb-4 flex-grow">
          {subtitle}
        </p>
        <div className="inline-flex items-center text-sm font-medium text-primary mt-auto bg-primary/10 px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300">
          Xem chi tiết
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const PriceInfoSection: React.FC = () => {
  const items: InfoItemProps[] = [
    {
      number: "01",
      title: "BÁO GIÁ XÂY NHÀ TRỌN GÓI",
      path: "/bao-gia/xay-nha-tron-goi",
      subtitle:
        "Miễn phí GPXD và Thiết kế kiến trúc. Cung cấp giải pháp toàn diện từ A-Z cho ngôi nhà mơ ước của bạn, đảm bảo chất lượng và tiến độ.",
    },
    {
      number: "02",
      title: "BÁO GIÁ XÂY DỰNG PHẦN THÔ",
      path: "/bao-gia/xay-nha-phan-tho",
      subtitle:
        "Bao gồm Miễn phí GPXD và Thiết kế kiến trúc. Xây dựng nền tảng vững chắc cho công trình với vật tư chất lượng và kỹ thuật thi công tiên tiến.",
    },
    {
      number: "03",
      title: "BÁO GIÁ SỬA CHỮA NHÀ",
      path: "/bao-gia/sua-nha-tron-goi",
      subtitle:
        "Miễn phí Thiết kế kiến trúc. Mang đến dịch vụ cải tạo, nâng cấp không gian sống, giúp ngôi nhà của bạn khang trang và tiện nghi hơn.",
    },
    {
      number: "04",
      title: "BÁO GIÁ THIẾT KẾ KIẾN TRÚC",
      path: "/bao-gia/thiet-ke-nha",
      subtitle:
        "Hoàn toàn Miễn phí khi chọn thi công. Đội ngũ kiến trúc sư giàu kinh nghiệm sẽ hiện thực hóa ý tưởng, tạo nên những công trình độc đáo.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-100 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-64 h-32 bg-primary/5 rounded-tl-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-primary text-white text-base font-semibold rounded-full shadow-md mb-4">
            BẢNG GIÁ DỊCH VỤ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Dịch Vụ Xây Dựng Chuyên Nghiệp
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp các giải pháp xây dựng và thiết kế toàn diện, đáp
            ứng mọi nhu cầu của bạn với chi phí tối ưu và chất lượng hàng đầu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
