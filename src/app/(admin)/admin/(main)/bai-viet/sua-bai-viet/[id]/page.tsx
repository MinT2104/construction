import { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/admin/blog/EditPostView"),
  { ssr: false }
);

export default function EditPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicComponentWithNoSSR />
    </Suspense>
  );
}
