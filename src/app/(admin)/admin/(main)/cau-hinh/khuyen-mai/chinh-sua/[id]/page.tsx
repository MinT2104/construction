import { Suspense } from "react";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/admin/promotion/EditPromotionView"),
  { ssr: false }
);

export default function EditPromotionPage() {
  return (
    <Suspense fallback={<div></div>}>
      <DynamicComponentWithNoSSR />
    </Suspense>
  );
}
