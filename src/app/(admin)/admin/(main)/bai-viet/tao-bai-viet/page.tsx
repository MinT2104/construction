import { Suspense } from "react";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/admin/blog/CreatePostView"),
  { ssr: false }
);

export default function CreatePostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicComponentWithNoSSR />
    </Suspense>
  );
}
