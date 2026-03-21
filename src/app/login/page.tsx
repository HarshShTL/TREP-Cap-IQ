import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";

function LoginFallback() {
  return (
    <div className="h-48 w-full max-w-md animate-pulse rounded-[12px] border border-border bg-muted/40" aria-hidden />
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
