"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type FastNavButton = {
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
};

interface FastNavigationBarProps {
  buttons: FastNavButton[];
}

const FastNavigationBar: React.FC<FastNavigationBarProps> = ({ buttons }) => {
  return (
    <div className="fixed bottom-2 right-20 z-50 w-full hidden md:flex gap-4 px-2 py-1 justify-end items-center bg-transparent text-sm">
      {buttons.map((btn, idx) =>
        btn.href ? (
          <Link
            key={idx}
            href={btn.href}
            className={cn(
              " text-nowrap text-center rounded-sm bg-primary border border-white shadow-lg text-white font-bold py-3 px-6 transition-transform duration-200 hover:scale-105 whitespace-pre-line",
              btn.className
            )}
            style={{ boxShadow: "0 4px 16px 0 rgba(0,64,0,0.15)" }}
          >
            {btn.label}
          </Link>
        ) : (
          <button
            key={idx}
            onClick={btn.onClick}
            className={cn(
              " text-nowrap text-center rounded-sm bg-primary border border-white shadow-lg text-white font-bold py-3 px-6 transition-transform duration-200 hover:scale-105 whitespace-pre-line",
              btn.className
            )}
            style={{ boxShadow: "0 4px 16px 0 rgba(0,64,0,0.15)" }}
          >
            {btn.label}
          </button>
        )
      )}
    </div>
  );
};

export default FastNavigationBar;
