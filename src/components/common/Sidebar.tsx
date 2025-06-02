// Component cho phần sidebar bên phải
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeaturedVideo from "../application/Page/components/FeaturedVideo";
import SidePost from "../application/Page/components/SidePost";
import HotPromotion from "../application/Page/components/HotPromotion";
// Server component for formatting numbers
function formatViewCount(count: number): string {
  return new Intl.NumberFormat("vi-VN").format(count);
}

function Sidebar() {
  // Featured videos data

  return (
    <div className="space-y-6">
      {/* Khuyến mãi */}
      <HotPromotion />
      {/* Tiện ích */}
      <div className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-lg transition-all duration-300">
        <h3 className="text-base font-semibold mb-4 text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
            Tiện ích
          </span>
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
              label: "Dự toán",
              color: "from-blue-500 to-cyan-500",
              path: "/bao-gia",
            },
            {
              icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
              label: "Mẫu nhà",
              color: "from-purple-500 to-indigo-500",
              path: "/mau-nha-dep",
            },
            {
              icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
              label: "Liên hệ",
              color: "from-amber-500 to-orange-500",
              path: "/lien-he",
            },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className="relative p-4 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>
              <div className="text-center relative">
                <div
                  className={`h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white shadow-lg`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Video nổi bật */}
      <FeaturedVideo />

      {/* Bài viết tabs */}
      <SidePost />
      {/* Call to Action */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 shadow-lg text-white">
        <h3 className="text-lg font-semibold mb-3">Bạn cần tư vấn?</h3>
        <p className="text-sm text-blue-100 mb-4">
          Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn
        </p>
        <a
          href="https://zalo.me/0936267359"
          target="_blank"
          className="w-full bg-white text-blue-700 font-medium py-2.5 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Liên hệ ngay
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
