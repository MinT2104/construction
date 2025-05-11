// Component cho phần sidebar bên phải
import Link from "next/link";
function Sidebar() {
  return (
    <div className="space-y-8">
      {/* Khuyến mãi */}
      <div className="bg-white rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
          Khuyến mãi hot
        </h3>
        <Link href="#" className="block group">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="https://placehold.co/600x300"
              alt="Khuyến mãi"
              className="w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-white text-sm font-medium">
                Giảm 20% chi phí thiết kế
              </p>
              <p className="text-white text-sm opacity-80">
                Đến hết 30/04/2024
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Tiện ích */}
      <div className="bg-white rounded-xl p-4 border border-border shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center">
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
          Tiện ích
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
              label: "Dự toán",
            },
            {
              icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
              label: "Mẫu nhà",
            },
            {
              icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
              label: "Liên hệ",
            },
          ].map((item, i) => (
            <Link
              key={i}
              href="#"
              className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all group"
            >
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 mx-auto mb-2 text-blue-600 group-hover:text-blue-700"
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
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Video đánh giá */}
      <div className="bg-white rounded-xl p-4 border border-border shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
          Khách hàng đánh giá
        </h3>
        <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded"
            src="https://www.youtube.com/embed/VIDEO_ID_1"
            allowFullScreen
          />
        </div>
      </div>

      {/* Bài viết mới nhất */}
      <div className="bg-white rounded-xl p-4 border border-border shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
              clipRule="evenodd"
            />
          </svg>
          Bài viết mới nhất
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Link key={i} href="#" className="flex items-start group">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src="https://placehold.co/100x100"
                  alt="Thumbnail"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                  Tiêu đề bài viết mới {i}
                </h4>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date().toLocaleDateString("vi-VN")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bài viết xem nhiều */}
      <div className="bg-white rounded-xl p-4 border border-border shadow-sm">
        <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-yellow-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          Bài viết xem nhiều
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Link key={i} href="#" className="block group">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-100 group-hover:text-blue-200 w-10">
                  {String(i).padStart(2, "0")}
                </span>
                <h4 className="flex-1 text-sm text-gray-900 group-hover:text-blue-600 line-clamp-2">
                  Tiêu đề bài viết phổ biến {i}
                </h4>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-10">
                {Math.floor(Math.random() * 1000) + 100} lượt xem
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
