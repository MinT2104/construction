import Link from "next/link";
import React from "react";
import Image from "next/image";
import { BlogPost } from "@/lib/types/modules/blog.interface";
import { blogService } from "@/lib/services/blog.service";

interface ProjectListActiveSectionProps {
  project: BlogPost;
}

const ProjectListActiveSection: React.FC<ProjectListActiveSectionProps> = ({
  project,
}) => {
  return (
    <Link
      href={`/bai-viet/${project.slug}`}
      key={project._id}
      className="block h-full group hover:scale-[1.01] transition-all duration-300"
    >
      <div className="flex h-[110px] md:h-[120px] items-center space-x-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300">
        {/* Ảnh thumbnail với hiệu ứng */}
        <div className="relative w-28 h-full sm:w-32 flex-shrink-0">
          <Image
            src={project.featuredImage?.url || ""}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 112px, 128px"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Nội dung bài viết */}
        <div className="flex-grow min-w-0 p-3">
          <h4 className="text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
            {project.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-1 opacity-90 group-hover:opacity-100">
            {project.excerpt}
          </p>

          {/* Thông tin bổ sung */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary font-medium flex items-center group-hover:font-semibold">
              Xem chi tiết
              <svg
                className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>

            {/* Thời gian đọc */}
            <span className="text-xs text-gray-500 flex items-center">
              <svg
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {project.readingTime || "5 phút"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectListActiveSection;
