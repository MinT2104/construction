"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Kích hoạt animation sau khi component được mount
    setIsAnimated(true);
  }, []);

  // Tạo mảng tĩnh thay vì dùng Array() trong JSX
  const tapeItems = ["NOT_FOUND", "ERROR", "NOT_FOUND", "ERROR", "NOT_FOUND"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Animated Construction Element */}
        <div className="flex justify-center mb-8 relative">
          <div
            className={`transition-all duration-1000 ${
              isAnimated ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* 404 dengan elemen konstruksi */}
            <div className="relative">
              {/* Số 404 */}
              <h1 className="text-[150px] font-black text-white leading-none tracking-tighter">
                <span className="inline-block relative">
                  4
                  <span className="absolute top-[40%] right-[-15px] w-6 h-6 bg-primary rounded-full"></span>
                </span>
                <span className="inline-block relative">
                  0
                  <span
                    className={`absolute top-[20%] left-[50%] transform -translate-x-1/2 w-[2px] h-[60%] bg-primary transition-transform duration-1000 ${
                      isAnimated ? "scale-y-100" : "scale-y-0"
                    }`}
                  ></span>
                  <span
                    className={`absolute top-[20%] left-[50%] transform -translate-x-1/2 rotate-90 w-[2px] h-[60%] bg-primary transition-transform duration-1000 ${
                      isAnimated ? "scale-y-100" : "scale-y-0"
                    }`}
                  ></span>
                </span>
                <span className="inline-block">4</span>
              </h1>

              {/* Construction tape effect */}
              <div
                className={`absolute left-0 right-0 top-[45%] h-8 bg-yellow-400 transition-all duration-1000 ${
                  isAnimated ? "transform -rotate-6 scale-x-100" : "scale-x-0"
                }`}
              >
                <div className="h-full w-full flex truncate">
                  {tapeItems.map((text, i) => (
                    <div
                      key={i}
                      className="flex-1 flex items-center justify-center"
                    >
                      <span className="font-mono text-black text-xs tracking-tighter">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div
          className={`text-center transform transition-all duration-700 delay-300 ${
            isAnimated ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-white text-2xl font-bold mb-2">
            Không tìm thấy trang
          </h2>
          <p className="text-gray-400 mb-8">
            Đường dẫn này đang được xây dựng hoặc không tồn tại
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Trang chủ
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-transparent text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
