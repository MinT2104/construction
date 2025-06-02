import React from "react";
import Image from "next/image";
const FloatingContact: React.FC = () => {
  return (
    <div className="fixed left-4 bottom-4 z-50 flex flex-col space-y-3">
      <a
        href="tel:0936267359"
        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </a>
      <a
        href="https://zalo.me/0936267359"
        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
      >
        <Image
          src="/images/chatzalo.png"
          alt="Zalo"
          width={24}
          height={24}
          className="w-12 h-12"
        />
      </a>
    </div>
  );
};

export default FloatingContact;
