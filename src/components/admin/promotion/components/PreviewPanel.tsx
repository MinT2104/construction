"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming this might not be present

interface PreviewPanelProps {
  title: string;
  content: string;
  featuredImageUrl?: string;
}

export default function PreviewPanel({
  title,
  content,
  featuredImageUrl,
}: PreviewPanelProps) {
  return (
    <Card className="sticky top-24 h-[calc(100vh-12rem)] overflow-hidden">
      <CardHeader>
        <CardTitle>Xem trước bài viết</CardTitle>
      </CardHeader>
      <CardContent className="h-full pb-6">
        <div className="overflow-y-auto h-full pr-2.5">
          {featuredImageUrl && (
            <div className="mb-4 relative w-full aspect-video rounded-md overflow-hidden border">
              {/* Using img tag for simplicity, replace with Next/Image if optimizations are needed and domain is configured */}
              <img
                src={featuredImageUrl}
                alt={title || "Featured image preview"}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2 break-words">
            {title || "Tiêu đề bài viết"}
          </h1>
          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert break-words"
            dangerouslySetInnerHTML={{
              __html:
                content || "<p>Nội dung bài viết sẽ hiển thị ở đây...</p>",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
