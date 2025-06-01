import { Suspense } from "react";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("@/components/admin/promotion/CreatePromotionView"),
  { ssr: false }
);

export default function CreatePromotionPage() {
  return (
    <Suspense fallback={<div></div>}>
      <DynamicComponentWithNoSSR />
    </Suspense>
  );
}
