import React from "react";

interface LoadingSkeletonProps {
  type?: "post" | "list" | "grid" | "video" | "page";
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = "post",
  count = 1,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "post":
        return (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        );

      case "list":
        return (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid gap-4">
              {[...Array(count)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        );

      case "grid":
        return (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        );

      case "video":
        return (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="aspect-video bg-gray-200 rounded"></div>
          </div>
        );

      case "page":
        return (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        );

      default:
        return <div className="animate-pulse bg-gray-200 min-h-screen"></div>;
    }
  };

  return <>{renderSkeleton()}</>;
};

export default LoadingSkeleton;
