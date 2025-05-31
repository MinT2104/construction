import { Suspense } from "react";
import LoginPageView from "@/components/admin/auth/LoginPageView";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div></div>}>
      <LoginPageView />
    </Suspense>
  );
}
